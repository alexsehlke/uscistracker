"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { ServiceCenterSelector } from "@/components/analytics/service-center-selector";
import { BacklogChart } from "@/components/analytics/backlog-chart";
import { ApprovalChart } from "@/components/analytics/approval-chart";
import { RecentApprovalsTable } from "@/components/analytics/recent-approvals-table";
import { UpdateDistributionChart } from "@/components/analytics/update-distribution-chart";
import { FORM_TYPES, FORM_CENTER_MAP } from "@/lib/constants";
import type { BacklogDataPoint, ApprovalDataPoint, RecentApproval, UpdateDataPoint } from "@/types/analytics";

export default function FormAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const formType = (params.formType as string) ?? "";
  const formInfo = FORM_TYPES.find((f) => f.id === formType);
  const centers = FORM_CENTER_MAP[formType] ?? [];
  const selectedCenter = searchParams.get("center") ?? centers[0] ?? "IOE-LB";

  const [groupBy, setGroupBy] = useState<"receipt_block" | "receipt_month">("receipt_block");
  const [backlogData, setBacklogData] = useState<BacklogDataPoint[]>([]);
  const [approvalData, setApprovalData] = useState<ApprovalDataPoint[]>([]);
  const [recentApprovals, setRecentApprovals] = useState<RecentApproval[]>([]);
  const [updateData, setUpdateData] = useState<UpdateDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const qs = `formType=${formType}&serviceCenter=${selectedCenter}&groupBy=${groupBy}`;
    try {
      const [b, a, r, u] = await Promise.all([
        fetch(`/api/analytics/backlog?${qs}`).then((r) => r.json()),
        fetch(`/api/analytics/approvals?${qs}`).then((r) => r.json()),
        fetch(`/api/analytics/recent-approvals?${qs}`).then((r) => r.json()),
        fetch(`/api/analytics/updates?${qs}`).then((r) => r.json()),
      ]);
      setBacklogData(b);
      setApprovalData(a);
      setRecentApprovals(r);
      setUpdateData(u);
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  }, [formType, selectedCenter, groupBy]);

  useEffect(() => {
    if (formType && selectedCenter) fetchData();
  }, [fetchData, formType, selectedCenter, groupBy]);

  function handleCenterChange(center: string) {
    router.push(`/forms/${formType}?center=${center}`);
  }

  if (!formInfo) {
    return (
      <div className="mx-auto max-w-[980px] px-5 py-20 text-center">
        <h1 className="text-[32px] font-semibold text-[#1d1d1f]">Form not found</h1>
        <p className="text-[17px] text-[#86868b] mt-2">The form type &quot;{formType}&quot; is not recognized.</p>
      </div>
    );
  }

  // Compute summary metrics from data
  const totalBacklog = backlogData.reduce((sum, d) => {
    const vals = Object.entries(d).filter(([k]) => k !== "label");
    return sum + vals.reduce((s, [, v]) => s + (typeof v === "number" ? v : 0), 0);
  }, 0);
  const totalApproved = approvalData.reduce((sum, d) => sum + (d.approved ?? 0), 0);
  const totalUpdates = updateData.reduce((sum, d) => sum + (d.updates ?? 0), 0);

  return (
    <div>
      {/* Hero */}
      <section className="bg-black text-white">
        <div className="mx-auto max-w-[980px] px-5 pt-14 pb-12 sm:pt-20 sm:pb-16 text-center animate-fade-in-up">
          <p className="text-[#86868b] text-[20px] font-medium uppercase tracking-wider mb-3">{formInfo.label}</p>
          <h1 className="text-[40px] sm:text-[56px] font-semibold tracking-[-0.03em] leading-[1.08]">
            Processing Timeline
          </h1>
          <p className="text-[24px] text-[#86868b] mt-3">{formInfo.fullName}</p>
        </div>
      </section>

      {/* Controls */}
      <section className="bg-[#f5f5f7] border-b border-[#e8e8ed]">
        <div className="mx-auto max-w-[980px] px-5 py-4">
          <ServiceCenterSelector
            centers={centers}
            selected={selectedCenter}
            onChange={handleCenterChange}
          />
        </div>
      </section>

      {/* Dashboard */}
      <section className="bg-[#f5f5f7]">
        <div className="mx-auto max-w-[980px] px-5 py-8">
          {loading ? (
            <div className="space-y-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl overflow-hidden">
                  <div className="h-[400px] skeleton-shimmer rounded-2xl" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-5">
              {/* Summary Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-in-up">
                {[
                  { label: "Total Backlog", value: totalBacklog.toLocaleString(), color: "#7EB6E6" },
                  { label: "Approved Cases", value: totalApproved.toLocaleString(), color: "#7BC67E" },
                  { label: "Status Updates", value: totalUpdates.toLocaleString(), color: "#C49BE6" },
                  { label: "Receipt Blocks", value: backlogData.length.toString(), color: "#E6A86E" },
                ].map((metric) => (
                  <div key={metric.label} className="bg-white border border-[#e8e8ed] rounded-2xl px-5 py-4">
                    <p className="text-[11px] font-medium text-[#86868b] uppercase tracking-wider">{metric.label}</p>
                    <p className="text-[28px] font-semibold text-[#1d1d1f] tracking-tight mt-1">{metric.value}</p>
                    <div className="w-8 h-[3px] rounded-full mt-2" style={{ backgroundColor: metric.color }} />
                  </div>
                ))}
              </div>

              {/* Backlog Chart */}
              <div className="animate-fade-in-up delay-1">
                <BacklogChart data={backlogData} groupBy={groupBy} onGroupByChange={setGroupBy} />
              </div>

              {/* Side by side charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="animate-fade-in-up delay-2">
                  <ApprovalChart data={approvalData} groupBy={groupBy} onGroupByChange={setGroupBy} />
                </div>
                <div className="animate-fade-in-up delay-3">
                  <UpdateDistributionChart data={updateData} groupBy={groupBy} onGroupByChange={setGroupBy} />
                </div>
              </div>

              {/* Table */}
              <div className="animate-fade-in-up delay-4">
                <RecentApprovalsTable data={recentApprovals} />
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
