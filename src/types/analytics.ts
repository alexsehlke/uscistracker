export interface BacklogDataPoint {
  label: string; // receipt block or month
  [status: string]: string | number; // dynamic status keys with count values
}

export interface ApprovalDataPoint {
  label: string;
  approved: number;
  total: number;
}

export interface RecentApproval {
  receiptNumber: string;
  status: string;
  receiptDate: string | null;
}

export interface UpdateDataPoint {
  label: string;
  updates: number;
}

export interface AnalyticsParams {
  formType: string;
  serviceCenter: string;
  date?: string;
  groupBy?: "receipt_block" | "receipt_month";
  page?: number;
  pageSize?: number;
}
