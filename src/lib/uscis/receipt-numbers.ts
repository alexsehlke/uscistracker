const RECEIPT_REGEX = /^[A-Z]{3}\d{10}$/;

export function isValidReceiptNumber(value: string): boolean {
  return RECEIPT_REGEX.test(value.toUpperCase());
}

export function parseReceiptNumber(receiptNumber: string) {
  const upper = receiptNumber.toUpperCase();
  if (!isValidReceiptNumber(upper)) return null;

  const prefix = upper.slice(0, 3);
  const sequence = upper.slice(3);

  return { prefix, sequence, full: upper };
}

export function getServiceCenterFromPrefix(prefix: string): string | null {
  const map: Record<string, string> = {
    IOE: "IOE-LB",
    MSC: "MSC-LB",
    LIN: "LIN-SC",
    SRC: "SRC-SC",
    EAC: "EAC-SC",
    WAC: "WAC-LB",
    YSC: "YSC-LB",
  };
  return map[prefix] ?? null;
}

export function getReceiptBlock(receiptNumber: string): string {
  // First 7 characters identify the block (e.g., IOE0922)
  return receiptNumber.slice(0, 7);
}
