export interface USCISApiCaseStatus {
  receiptNumber: string;
  caseStatus: string;
  caseStatusDescription: string;
  formType: string;
  submittedDate?: string;
  modifiedDate?: string;
  hist_case_status?: USCISApiHistoryEntry[];
}

export interface USCISApiHistoryEntry {
  date: string;
  status: string;
  description: string;
}

export interface USCISTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}
