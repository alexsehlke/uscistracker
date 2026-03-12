import { STATUS_CATEGORIES, FORM_TYPES, SERVICE_CENTERS } from "@/lib/constants";
import type { CaseStatus, CaseHistoryEntry, CaseWithHistory } from "@/types/case";
import type { BacklogDataPoint, ApprovalDataPoint, RecentApproval, UpdateDataPoint } from "@/types/analytics";

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function mockCaseLookup(receiptNumber: string): CaseWithHistory {
  const rng = seededRandom(hashString(receiptNumber));
  const prefix = receiptNumber.slice(0, 3);
  const statusIdx = Math.floor(rng() * STATUS_CATEGORIES.length);
  const formIdx = Math.floor(rng() * FORM_TYPES.length);

  const center = SERVICE_CENTERS.find((c) => c.prefix === prefix);

  const baseDate = new Date(2024, 0, 1);
  baseDate.setDate(baseDate.getDate() + Math.floor(rng() * 365));

  const history: CaseHistoryEntry[] = [];
  const numEntries = 2 + Math.floor(rng() * 5);
  const histDate = new Date(baseDate);
  for (let i = 0; i < numEntries; i++) {
    histDate.setDate(histDate.getDate() + Math.floor(rng() * 30) + 1);
    const hStatusIdx = Math.floor(rng() * STATUS_CATEGORIES.length);
    history.push({
      status: STATUS_CATEGORIES[hStatusIdx],
      description: `Your case ${STATUS_CATEGORIES[hStatusIdx].toLowerCase()}.`,
      checkedAt: histDate.toISOString(),
    });
  }

  return {
    receiptNumber: receiptNumber.toUpperCase(),
    formType: FORM_TYPES[formIdx].id,
    serviceCenter: center?.id ?? "IOE-LB",
    status: STATUS_CATEGORIES[statusIdx],
    description: `On ${baseDate.toLocaleDateString()}, your case ${STATUS_CATEGORIES[statusIdx].toLowerCase()}.`,
    receiptDate: baseDate.toISOString().split("T")[0],
    modifiedDate: history.length > 0 ? history[history.length - 1].checkedAt : baseDate.toISOString(),
    history,
  };
}

export function mockBacklogData(formType: string, serviceCenter: string, groupBy = "receipt_block"): BacklogDataPoint[] {
  const rng = seededRandom(hashString(`${formType}-${serviceCenter}-backlog-${groupBy}`));
  const blocks: BacklogDataPoint[] = [];
  const statuses = STATUS_CATEGORIES.slice(0, 8);

  for (let i = 0; i < 20; i++) {
    let label: string;
    if (groupBy === "receipt_month") {
      const date = new Date(2024, i, 1);
      label = date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    } else {
      const prefix = serviceCenter.split("-")[0];
      const blockNum = String(2300 + i).padStart(4, "0");
      label = `${prefix}${blockNum}`;
    }
    const point: BacklogDataPoint = { label };
    for (const status of statuses) {
      point[status] = Math.floor(rng() * 500) + 10;
    }
    blocks.push(point);
  }
  return blocks;
}

export function mockApprovalData(formType: string, serviceCenter: string, groupBy = "receipt_block"): ApprovalDataPoint[] {
  const rng = seededRandom(hashString(`${formType}-${serviceCenter}-approvals-${groupBy}`));
  const data: ApprovalDataPoint[] = [];
  const prefix = serviceCenter.split("-")[0];

  for (let i = 0; i < 20; i++) {
    let label: string;
    if (groupBy === "receipt_month") {
      const date = new Date(2024, i, 1);
      label = date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    } else {
      const blockNum = String(2300 + i).padStart(4, "0");
      label = `${prefix}${blockNum}`;
    }
    const total = Math.floor(rng() * 1000) + 100;
    data.push({
      label,
      approved: Math.floor(rng() * total * 0.6),
      total,
    });
  }
  return data;
}

export function mockRecentApprovals(formType: string, serviceCenter: string): RecentApproval[] {
  const rng = seededRandom(hashString(`${formType}-${serviceCenter}-recent`));
  const prefix = serviceCenter.split("-")[0];
  const approvals: RecentApproval[] = [];

  for (let i = 0; i < 25; i++) {
    const seq = String(Math.floor(rng() * 9000000000) + 1000000000);
    const date = new Date(2024, 6, 1);
    date.setDate(date.getDate() + Math.floor(rng() * 200));
    approvals.push({
      receiptNumber: `${prefix}${seq}`,
      status: "Case Was Approved",
      receiptDate: date.toISOString().split("T")[0],
    });
  }
  return approvals;
}

export function mockUpdateData(formType: string, serviceCenter: string, groupBy = "receipt_block"): UpdateDataPoint[] {
  const rng = seededRandom(hashString(`${formType}-${serviceCenter}-updates-${groupBy}`));
  const data: UpdateDataPoint[] = [];
  const prefix = serviceCenter.split("-")[0];

  for (let i = 0; i < 20; i++) {
    let label: string;
    if (groupBy === "receipt_month") {
      const date = new Date(2024, i, 1);
      label = date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    } else {
      const blockNum = String(2300 + i).padStart(4, "0");
      label = `${prefix}${blockNum}`;
    }
    data.push({
      label,
      updates: Math.floor(rng() * 300) + 5,
    });
  }
  return data;
}
