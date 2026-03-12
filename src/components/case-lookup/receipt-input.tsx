"use client";

import { useState } from "react";
import { isValidReceiptNumber } from "@/lib/uscis/receipt-numbers";

interface ReceiptInputProps {
  onSubmit: (receiptNumber: string) => void;
  loading?: boolean;
}

export function ReceiptInput({ onSubmit, loading }: ReceiptInputProps) {
  const [value, setValue] = useState("");
  const upper = value.toUpperCase();
  const isValid = isValidReceiptNumber(upper);
  const showError = value.length > 0 && value.length >= 5 && !isValid;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isValid) onSubmit(upper);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center gap-3">
        <input
          id="receipt"
          placeholder="Receipt number (e.g., MSC1234567890)"
          value={value}
          onChange={(e) => setValue(e.target.value.replace(/\s/g, ""))}
          maxLength={13}
          className="flex-1 h-[48px] px-5 bg-[#f5f5f7] rounded-xl text-[17px] font-mono tracking-wide uppercase placeholder:normal-case placeholder:font-sans placeholder:tracking-normal placeholder:text-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 transition-all"
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={!isValid || loading}
          className="h-[48px] px-6 rounded-xl bg-[#0071e3] text-white text-[15px] font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#0077ed] active:scale-[0.97] transition-all shrink-0"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Searching
            </span>
          ) : (
            "Search"
          )}
        </button>
      </div>

      {showError && (
        <p className="mt-3 text-[13px] text-[#ff3b30]">
          Format: 3 letters + 10 digits (e.g., MSC1234567890)
        </p>
      )}

      {!showError && (
        <p className="mt-3 text-[13px] text-[#86868b]">
          Your 13-character USCIS receipt number can be found on your notice of action.
        </p>
      )}
    </form>
  );
}
