import type { USCISApiResponse, USCISApiCaseStatus, USCISTokenResponse } from "./types";
import type { CaseWithHistory } from "@/types/case";
import { mockCaseLookup } from "./mock-data";

const USCIS_API_BASE = process.env.USCIS_API_ENV === "production"
  ? "https://api.uscis.gov"
  : "https://api-int.uscis.gov";

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const clientId = process.env.USCIS_CLIENT_ID;
  const clientSecret = process.env.USCIS_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("USCIS API credentials not configured");
  }

  const res = await fetch(`${USCIS_API_BASE}/oauth/accesstoken`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!res.ok) {
    throw new Error(`USCIS OAuth failed: ${res.status}`);
  }

  const data: USCISTokenResponse = await res.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };

  return cachedToken.token;
}

export async function fetchCaseFromUSCIS(receiptNumber: string): Promise<USCISApiCaseStatus> {
  const token = await getAccessToken();
  const res = await fetch(`${USCIS_API_BASE}/case-status/${receiptNumber}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`USCIS API error: ${res.status}`);
  }

  const json: USCISApiResponse = await res.json();
  return json.case_status;
}

function mapApiResponse(data: USCISApiCaseStatus): CaseWithHistory {
  return {
    receiptNumber: data.receiptNumber,
    formType: data.formType ?? "Unknown",
    serviceCenter: data.receiptNumber.slice(0, 3),
    status: data.current_case_status_text_en,
    description: data.current_case_status_desc_en,
    receiptDate: data.submittedDate ?? null,
    modifiedDate: data.modifiedDate ?? null,
    history: (data.hist_case_status ?? []).map((h) => ({
      status: h.completed_text_en,
      description: h.completed_text_en,
      checkedAt: h.date,
    })),
  };
}

export async function lookupCase(receiptNumber: string): Promise<CaseWithHistory> {
  if (process.env.USE_MOCK_DATA === "true") {
    return mockCaseLookup(receiptNumber);
  }

  const data = await fetchCaseFromUSCIS(receiptNumber);
  return mapApiResponse(data);
}
