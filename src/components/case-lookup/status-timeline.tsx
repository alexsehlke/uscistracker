import type { CaseHistoryEntry } from "@/types/case";

interface StatusTimelineProps {
  history: CaseHistoryEntry[];
}

export function StatusTimeline({ history }: StatusTimelineProps) {
  if (history.length === 0) return null;

  const sorted = [...history].sort(
    (a, b) => new Date(b.checkedAt).getTime() - new Date(a.checkedAt).getTime()
  );

  return (
    <div className="bg-[#f5f5f7] rounded-2xl overflow-hidden">
      <div className="px-7 py-5">
        <h3 className="text-[17px] font-semibold text-[#1d1d1f]">Case History</h3>
        <p className="text-[13px] text-[#86868b] mt-0.5">{sorted.length} status update{sorted.length !== 1 ? "s" : ""} recorded</p>
      </div>
      <div className="mx-4 mb-4 bg-white rounded-xl overflow-hidden">
        {sorted.map((entry, i) => (
          <div key={i} className={`flex items-start gap-4 px-5 py-4 ${i < sorted.length - 1 ? "border-b border-[#f5f5f7]" : ""}`}>
            <div className="mt-1.5 shrink-0">
              <div
                className={`w-[10px] h-[10px] rounded-full ${
                  i === 0 ? "bg-[#0071e3]" : "bg-[#d2d2d7]"
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-[15px] font-medium ${i === 0 ? "text-[#1d1d1f]" : "text-[#86868b]"}`}>
                {entry.status}
              </p>
              <p className="text-[13px] text-[#86868b] mt-0.5">
                {new Date(entry.checkedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
