"use client";

import type { RecentApproval } from "@/types/analytics";

interface RecentApprovalsTableProps {
  data: RecentApproval[];
}

export function RecentApprovalsTable({ data }: RecentApprovalsTableProps) {
  return (
    <div className="bg-white border border-[#e8e8ed] rounded-2xl overflow-hidden">
      <div className="px-6 pt-6 pb-4 flex items-start justify-between">
        <div>
          <h3 className="text-[15px] font-semibold text-[#1d1d1f] tracking-[-0.01em]">Recently Approved</h3>
          <p className="text-[12px] text-[#86868b] mt-0.5">Latest approved cases for this form and service center</p>
        </div>
        {data.length > 0 && (
          <span className="text-[12px] text-[#86868b] bg-[#f5f5f7] px-2.5 py-1 rounded-md font-medium">
            {data.length} cases
          </span>
        )}
      </div>
      {data.length === 0 ? (
        <div className="px-6 pb-6">
          <p className="text-[14px] text-[#86868b]">No recent approvals found.</p>
        </div>
      ) : (
        <>
          <table className="w-full">
            <thead>
              <tr className="border-t border-b border-[#f0f0f2]">
                <th className="px-6 py-2.5 text-left text-[11px] font-medium text-[#86868b] uppercase tracking-wider">Receipt ID</th>
                <th className="px-6 py-2.5 text-left text-[11px] font-medium text-[#86868b] uppercase tracking-wider">Status</th>
                <th className="px-6 py-2.5 text-left text-[11px] font-medium text-[#86868b] uppercase tracking-wider">Receipt Date</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 15).map((row, i) => (
                <tr
                  key={row.receiptNumber}
                  className={`${i % 2 === 0 ? "bg-white" : "bg-[#fafafa]"} ${i < Math.min(data.length, 15) - 1 ? "border-b border-[#f0f0f2]" : ""}`}
                >
                  <td className="px-6 py-3 text-[13px] font-mono tracking-wide text-[#1d1d1f]">{row.receiptNumber}</td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#7BC67E]">
                      <span className="w-[6px] h-[6px] rounded-full bg-[#7BC67E]" />
                      Approved
                    </span>
                  </td>
                  <td className="px-6 py-3 text-[13px] text-[#86868b]">
                    {row.receiptDate ?? "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.length > 15 && (
            <div className="px-6 py-3 border-t border-[#f0f0f2]">
              <p className="text-[12px] text-[#86868b]">Showing 15 of {data.length} approved cases</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
