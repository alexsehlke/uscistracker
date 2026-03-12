"use client";

interface ReceiptBlockToggleProps {
  value: "receipt_block" | "receipt_month";
  onChange: (value: "receipt_block" | "receipt_month") => void;
  size?: "default" | "small";
}

export function ReceiptBlockToggle({ value, onChange, size = "default" }: ReceiptBlockToggleProps) {
  const isSmall = size === "small";
  return (
    <div className={`inline-flex rounded-lg border border-[#e8e8ed] bg-[#f5f5f7] ${isSmall ? "p-[2px]" : "p-[3px]"}`}>
      {[
        { key: "receipt_block" as const, label: "Receipt Block" },
        { key: "receipt_month" as const, label: "Receipt Date" },
      ].map((opt) => (
        <button
          key={opt.key}
          onClick={() => onChange(opt.key)}
          className={`${isSmall ? "px-2.5 py-1 text-[11px]" : "px-3.5 py-1.5 text-[12px]"} font-medium rounded-md transition-all ${
            value === opt.key
              ? "bg-white text-[#1d1d1f] shadow-sm"
              : "text-[#86868b] hover:text-[#1d1d1f]"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
