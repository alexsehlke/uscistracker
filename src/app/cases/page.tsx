"use client";

import { useState } from "react";
import { ReceiptInput } from "@/components/case-lookup/receipt-input";
import { CaseResult } from "@/components/case-lookup/case-result";
import { StatusTimeline } from "@/components/case-lookup/status-timeline";
import type { CaseWithHistory } from "@/types/case";

export default function CasesPage() {
  const [caseData, setCaseData] = useState<CaseWithHistory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(receiptNumber: string) {
    setLoading(true);
    setError(null);
    setCaseData(null);

    try {
      const res = await fetch(`/api/case-status/${receiptNumber}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCaseData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to look up case");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-black text-white">
        <div className="mx-auto max-w-[980px] px-5 pt-16 pb-14 sm:pt-24 sm:pb-20 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-[48px] sm:text-[64px] font-semibold tracking-[-0.04em] leading-[1.05]">
              Case Status Lookup
            </h1>
            <p className="text-[19px] text-[#86868b] mt-4 max-w-[500px] mx-auto leading-[1.4]">
              Enter your USCIS receipt number to check your case status and view the full processing history.
            </p>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="bg-white">
        <div className="mx-auto max-w-[680px] px-5 py-12">
          <div className="animate-fade-in-up delay-1">
            <ReceiptInput onSubmit={handleSearch} loading={loading} />
          </div>

          {error && (
            <div className="mt-8 p-4 bg-[#ff3b30]/5 border border-[#ff3b30]/15 text-[#ff3b30] rounded-2xl text-[14px] animate-fade-in flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" />
              </svg>
              {error}
            </div>
          )}

          {caseData && (
            <div className="mt-10 space-y-6 animate-fade-in-up">
              <CaseResult caseData={caseData} />
              <StatusTimeline history={caseData.history} />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
