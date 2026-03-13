import { NextRequest, NextResponse } from "next/server";
import { fetchCaseFromUSCIS } from "@/lib/uscis/api";

const SANDBOX_CASES = [
  // With history
  "EAC9999103403", "EAC9999103404", "EAC9999103405", "EAC9999103410",
  "EAC9999103411", "EAC9999103416", "EAC9999103419",
  "LIN9999106498", "LIN9999106499", "LIN9999106504", "LIN9999106505", "LIN9999106506",
  "SRC9999102777", "SRC9999102778", "SRC9999102779", "SRC9999102780",
  "SRC9999102781", "SRC9999102782", "SRC9999102783", "SRC9999102784",
  // Without history
  "EAC9999103400", "EAC9999103402", "EAC9999103406",
  "LIN9999106501", "LIN9999106507",
  "SRC9999132694", "SRC9999132695",
];

// Invalid receipt numbers to generate 4xx responses
const INVALID_CASES = [
  "ABC1234567890", // invalid prefix → 422 or 404
  "XYZ0000000000", // nonexistent → 404
  "INVALID",       // bad format → 422
];

const DELAY_MS = 250;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = { success: 0, errors_4xx: 0, errors_other: 0, total: 0 };

  // Look up valid sandbox cases (expect 200s)
  for (const receipt of SANDBOX_CASES) {
    try {
      await fetchCaseFromUSCIS(receipt);
      results.success++;
    } catch (error) {
      const msg = error instanceof Error ? error.message : "";
      if (msg.includes("429")) {
        // Rate limited — stop early
        results.total = results.success + results.errors_4xx + results.errors_other;
        return NextResponse.json({ ...results, stoppedEarly: "rate_limited" });
      }
      results.errors_other++;
    }
    results.total++;
    await sleep(DELAY_MS);
  }

  // Look up invalid cases (expect 4xx responses)
  for (const receipt of INVALID_CASES) {
    try {
      await fetchCaseFromUSCIS(receipt);
      results.success++;
    } catch (error) {
      const msg = error instanceof Error ? error.message : "";
      if (msg.includes("429")) {
        results.total = results.success + results.errors_4xx + results.errors_other;
        return NextResponse.json({ ...results, stoppedEarly: "rate_limited" });
      }
      if (msg.includes("404") || msg.includes("422")) {
        results.errors_4xx++;
      } else {
        results.errors_other++;
      }
    }
    results.total++;
    await sleep(DELAY_MS);
  }

  return NextResponse.json(results);
}
