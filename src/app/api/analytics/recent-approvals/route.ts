import { NextRequest, NextResponse } from "next/server";
import { mockRecentApprovals } from "@/lib/uscis/mock-data";
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

  if (process.env.USE_MOCK_DATA === "true") {
    return NextResponse.json(mockRecentApprovals(formType, serviceCenter));
  }

  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("cases")
    .select("receipt_number, status, receipt_date")
    .eq("form_type", formType)
    .eq("service_center", serviceCenter)
    .eq("status", "Case Was Approved")
    .order("modified_date", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const result = (data ?? []).map((row) => ({
    receiptNumber: row.receipt_number,
    status: row.status,
    receiptDate: row.receipt_date,
  }));

  return NextResponse.json(result);
}
