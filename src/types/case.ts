export interface CaseStatus {
  receiptNumber: string;
  formType: string;
  serviceCenter: string;
  status: string;
  description: string;
  receiptDate: string | null;
  modifiedDate: string | null;
}

export interface CaseHistoryEntry {
  status: string;
  description: string;
  checkedAt: string;
}

export interface CaseWithHistory extends CaseStatus {
  history: CaseHistoryEntry[];
}
