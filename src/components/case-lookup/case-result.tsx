import type { CaseWithHistory } from "@/types/case";

interface CaseResultProps {
  caseData: CaseWithHistory;
}

function getStatusColor(status: string) {
  if (status.includes("Approved") || status.includes("Delivered"))
    return { bg: "#34c759", text: "#34c759" };
  if (status.includes("Denied"))
    return { bg: "#ff3b30", text: "#ff3b30" };
  if (status.includes("Evidence") || status.includes("Transfer"))
    return { bg: "#ff9500", text: "#ff9500" };
  if (status.includes("Produced") || status.includes("Mailed"))
    return { bg: "#30d158", text: "#30d158" };
  return { bg: "#0071e3", text: "#0071e3" };
}

export function CaseResult({ caseData }: CaseResultProps) {
  const statusColor = getStatusColor(caseData.status);

  return (
    <div className="bg-[#f5f5f7] rounded-2xl overflow-hidden">
      {/* Status Header */}
      <div className="px-7 py-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <p className="text-[12px] text-[#86868b] font-medium uppercase tracking-wider">Receipt Number</p>
            <p className="text-[24px] font-semibold font-mono tracking-wide text-[#1d1d1f] mt-1">{caseData.receiptNumber}</p>
          </div>
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium"
            style={{
              backgroundColor: `${statusColor.bg}12`,
              color: statusColor.text,
            }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColor.bg }} />
            {caseData.status}
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="px-7 pb-6">
        <p className="text-[15px] text-[#424245] leading-relaxed">{caseData.description}</p>
      </div>

      {/* Details */}
      <div className="bg-white mx-4 mb-4 rounded-xl overflow-hidden">
        <div className="grid grid-cols-2">
          {[
            { label: "Form Type", value: caseData.formType },
            { label: "Service Center", value: caseData.serviceCenter },
            { label: "Receipt Date", value: caseData.receiptDate ?? "N/A" },
            {
              label: "Last Updated",
              value: caseData.modifiedDate
                ? new Date(caseData.modifiedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                : "N/A",
            },
          ].map((item, i) => (
            <div key={item.label} className={`px-5 py-4 ${i < 2 ? "border-b border-[#f5f5f7]" : ""} ${i % 2 === 0 ? "border-r border-[#f5f5f7]" : ""}`}>
              <p className="text-[11px] text-[#86868b] font-medium uppercase tracking-wider">{item.label}</p>
              <p className="text-[15px] font-semibold text-[#1d1d1f] mt-1">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
