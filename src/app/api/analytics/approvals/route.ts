import { NextRequest, NextResponse } from "next/server";
import { mockApprovalData } from "@/lib/uscis/mock-data";
import { createServerClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
  const rl = rateLimit(`analytics:${ip}`, { limit: 60, windowMs: 60_000 });
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  const { searchParams } = request.nextUrl;
  const formType = searchParams.get("formType");
  const serviceCenter = searchParams.get("serviceCenter");

  if (!formType || !serviceCenter) {
    return NextResponse.json({ error: "formType and serviceCenter required" }, { status: 400 });
  }

  const groupBy = searchParams.get("groupBy") ?? "receipt_block";

  if (process.env.USE_MOCK_DATA === "true") {
    return NextResponse.json(mockApprovalData(formType, serviceCenter, groupBy));
  }

  const supabase = createServerClient();
  const groupColumn = groupBy === "receipt_month" ? "receipt_month" : "receipt_block";

  // Get the latest snapshot date
  const { data: latestRow } = await supabase
    .from("daily_snapshots")
    .select("snapshot_date")
    .eq("form_type", formType)
    .eq("service_center", serviceCenter)
    .order("snapshot_date", { ascending: false })
    .limit(1)
    .single();

  if (!latestRow) {
    return NextResponse.json([]);
  }

  const { data, error } = await supabase
    .from("daily_snapshots")
    .select(`${groupColumn}, status, case_count`)
    .eq("form_type", formType)
    .eq("service_center", serviceCenter)
    .eq("snapshot_date", latestRow.snapshot_date);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Aggregate into { label, approved, total }
  const grouped = new Map<string, { approved: number; total: number }>();
  for (const row of data ?? []) {
    const label = row[groupColumn] ?? "Unknown";
    if (!grouped.has(label)) {
      grouped.set(label, { approved: 0, total: 0 });
    }
    const point = grouped.get(label)!;
    point.total += row.case_count;
    if (row.status === "Case Was Approved") {
      point.approved += row.case_count;
    }
  }

  const result = Array.from(grouped.entries()).map(([label, counts]) => ({
    label,
    ...counts,
  }));

  return NextResponse.json(result);
}
