import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { fetchCaseFromUSCIS } from "@/lib/uscis/api";
import { getServiceCenterFromPrefix, getReceiptBlock } from "@/lib/uscis/receipt-numbers";
import { SERVICE_CENTERS, FORM_TYPES, FORM_CENTER_MAP } from "@/lib/constants";

// Sandbox: 5 TPS / 1,000 daily — Production: 10 TPS / 400,000 daily
const BATCH_SIZE = process.env.USCIS_API_ENV === "production" ? 200 : 5;
const DELAY_MS = process.env.USCIS_API_ENV === "production" ? 110 : 250;

// Starting sequence numbers per prefix
// Sandbox test cases use 9999xxxxxx sequences; production uses recent fiscal year ranges
const PREFIX_START_SEQUENCES: Record<string, number> = process.env.USCIS_API_ENV === "production"
  ? {
      IOE: 9230000000,
      MSC: 2390000000,
      LIN: 2390000000,
      SRC: 2390000000,
      EAC: 2390000000,
      WAC: 2390000000,
      YSC: 2390000000,
    }
  : {
      EAC: 9999103400,
      LIN: 9999106498,
      SRC: 9999102777,
      IOE: 9230000000,
      MSC: 2390000000,
      WAC: 2390000000,
      YSC: 2390000000,
    };

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildReceiptNumber(prefix: string, sequence: number): string {
  return `${prefix}${sequence.toString().padStart(10, "0")}`;
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  let totalScanned = 0;
  let totalUpserted = 0;
  const errors: string[] = [];

  // Pick the next (service_center, form_type) pair to scan using round-robin
  const pair = await getNextScanPair(supabase);
  if (!pair) {
    return NextResponse.json({ message: "No scannable pairs found", scanned: 0 });
  }

  const { prefix, centerId, formType } = pair;

  // Get where we left off
  const { data: progress } = await supabase
    .from("scan_progress")
    .select("last_receipt")
    .eq("service_center", centerId)
    .eq("form_type", formType)
    .single();

  const startSequence = progress
    ? parseInt(progress.last_receipt.slice(3), 10) + 1
    : PREFIX_START_SEQUENCES[prefix] ?? 2390000000;

  // Scan a batch of sequential receipt numbers
  let lastSuccessfulReceipt = "";

  for (let i = 0; i < BATCH_SIZE; i++) {
    const sequence = startSequence + i;
    const receiptNumber = buildReceiptNumber(prefix, sequence);

    try {
      const data = await fetchCaseFromUSCIS(receiptNumber);
      totalScanned++;

      const serviceCenter = getServiceCenterFromPrefix(prefix) ?? centerId;
      const receiptBlock = getReceiptBlock(receiptNumber);

      // Upsert into cases table
      const { error: caseError } = await supabase
        .from("cases")
        .upsert(
          {
            receipt_number: data.receiptNumber,
            form_type: data.formType ?? formType,
            service_center: serviceCenter,
            status: data.current_case_status_text_en,
            description: data.current_case_status_desc_en,
            receipt_date: data.submittedDate ?? null,
            modified_date: data.modifiedDate ?? null,
            last_checked: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "receipt_number" }
        );

      if (caseError) {
        errors.push(`Case upsert ${receiptNumber}: ${caseError.message}`);
        continue;
      }

      // Insert into case_history
      const { error: historyError } = await supabase
        .from("case_history")
        .insert({
          receipt_number: data.receiptNumber,
          status: data.current_case_status_text_en,
          description: data.current_case_status_desc_en,
        });

      if (historyError) {
        errors.push(`History insert ${receiptNumber}: ${historyError.message}`);
      }

      // Update daily snapshot
      const today = new Date().toISOString().slice(0, 10);
      const receiptMonth = data.submittedDate?.slice(0, 7) ?? null;

      const { error: snapshotError } = await supabase.rpc("increment_snapshot", {
        p_date: today,
        p_form_type: data.formType ?? formType,
        p_service_center: serviceCenter,
        p_receipt_block: receiptBlock,
        p_receipt_month: receiptMonth,
        p_status: data.current_case_status_text_en,
      });

      // If RPC doesn't exist yet, fall back to upsert
      if (snapshotError?.message?.includes("function") || snapshotError?.code === "42883") {
        await supabase
          .from("daily_snapshots")
          .upsert(
            {
              snapshot_date: today,
              form_type: data.formType ?? formType,
              service_center: serviceCenter,
              receipt_block: receiptBlock,
              receipt_month: receiptMonth,
              status: data.current_case_status_text_en,
              case_count: 1,
            },
            { onConflict: "snapshot_date,form_type,service_center,receipt_block,receipt_month,status" }
          );
      }

      lastSuccessfulReceipt = receiptNumber;
      totalUpserted++;
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      // 404 = receipt not found, skip silently
      if (msg.includes("404")) {
        totalScanned++;
        lastSuccessfulReceipt = receiptNumber;
        continue;
      }
      // 429 = rate limited, stop the batch
      if (msg.includes("429")) {
        errors.push(`Rate limited at ${receiptNumber}`);
        break;
      }
      errors.push(`${receiptNumber}: ${msg}`);
    }

    // Rate limit delay between requests
    if (i < BATCH_SIZE - 1) {
      await sleep(DELAY_MS);
    }
  }

  // Update scan_progress with where we stopped
  if (lastSuccessfulReceipt) {
    await supabase
      .from("scan_progress")
      .upsert(
        {
          service_center: centerId,
          form_type: formType,
          last_receipt: lastSuccessfulReceipt,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "service_center,form_type" }
      );
  }

  return NextResponse.json({
    pair: `${centerId}/${formType}`,
    scanned: totalScanned,
    upserted: totalUpserted,
    lastReceipt: lastSuccessfulReceipt || null,
    errors: errors.length > 0 ? errors : undefined,
  });
}

/**
 * Round-robin: pick the (center, form) pair that was least recently scanned.
 */
async function getNextScanPair(supabase: ReturnType<typeof createAdminClient>) {
  // Get all valid pairs
  const allPairs: { centerId: string; prefix: string; formType: string }[] = [];
  for (const form of FORM_TYPES) {
    const centers = FORM_CENTER_MAP[form.id] ?? [];
    for (const centerId of centers) {
      const center = SERVICE_CENTERS.find((c) => c.id === centerId);
      if (center) {
        allPairs.push({ centerId, prefix: center.prefix, formType: form.id });
      }
    }
  }

  // Find which pair was scanned least recently
  const { data: progressRows } = await supabase
    .from("scan_progress")
    .select("service_center, form_type, updated_at")
    .order("updated_at", { ascending: true });

  const scannedMap = new Map(
    (progressRows ?? []).map((r) => [`${r.service_center}/${r.form_type}`, r.updated_at])
  );

  // Prefer pairs never scanned, then oldest scanned
  const neverScanned = allPairs.filter((p) => !scannedMap.has(`${p.centerId}/${p.formType}`));
  if (neverScanned.length > 0) {
    return neverScanned[0];
  }

  // Sort by oldest updated_at
  allPairs.sort((a, b) => {
    const aTime = scannedMap.get(`${a.centerId}/${a.formType}`) ?? "";
    const bTime = scannedMap.get(`${b.centerId}/${b.formType}`) ?? "";
    return aTime.localeCompare(bTime);
  });

  return allPairs[0] ?? null;
}
