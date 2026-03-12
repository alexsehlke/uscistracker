export interface USCISApiResponse {
  case_status: USCISApiCaseStatus;
  message: string;
}

export interface USCISApiCaseStatus {
  receiptNumber: string;
  formType: string;
  submittedDate?: string;
  modifiedDate?: string;
  current_case_status_text_en: string;
  current_case_status_desc_en: string;
  current_case_status_text_es?: string;
  current_case_status_desc_es?: string;
  hist_case_status?: USCISApiHistoryEntry[];
}

export interface USCISApiHistoryEntry {
  date: string;
  completed_text_en: string;
  completed_text_es?: string;
}

export interface USCISTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}
