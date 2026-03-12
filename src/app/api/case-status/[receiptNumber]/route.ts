import { NextResponse } from "next/server";
import { lookupCase } from "@/lib/uscis/api";
import { isValidReceiptNumber } from "@/lib/uscis/receipt-numbers";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ receiptNumber: string }> }
) {
  const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
  const rl = rateLimit(`case-status:${ip}`, { limit: 10, windowMs: 60_000 });
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  const { receiptNumber } = await params;
  const upper = receiptNumber.toUpperCase();

  if (!isValidReceiptNumber(upper)) {
    return NextResponse.json(
      { error: "Invalid receipt number format. Expected 3 letters + 10 digits." },
      { status: 400 }
    );
  }

  try {
    const result = await lookupCase(upper);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
