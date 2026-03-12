import { NextRequest, NextResponse } from "next/server";
import { mockUpdateData } from "@/lib/uscis/mock-data";
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
    return NextResponse.json(mockUpdateData(formType, serviceCenter, groupBy));
  }

  const supabase = createServerClient();
  const groupColumn = groupBy === "receipt_month" ? "receipt_month" : "receipt_block";

  // Count cases updated in the last 7 days, grouped by block/month
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data, error } = await supabase
    .from("cases")
    .select(`receipt_number, ${groupBy === "receipt_month" ? "receipt_date" : "receipt_number"}`)
    .eq("form_type", formType)
    .eq("service_center", serviceCenter)
    .gte("modified_date", sevenDaysAgo.toISOString());

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Group and count
  const grouped = new Map<string, number>();
  for (const row of data ?? []) {
    let label: string;
    if (groupColumn === "receipt_month") {
      label = row.receipt_date?.slice(0, 7) ?? "Unknown";
    } else {
      label = row.receipt_number.slice(0, 7);
    }
    grouped.set(label, (grouped.get(label) ?? 0) + 1);
  }

  const result = Array.from(grouped.entries()).map(([label, updates]) => ({
    label,
    updates,
  }));

  return NextResponse.json(result);
}
