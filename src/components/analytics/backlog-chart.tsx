"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { STATUS_COLORS } from "@/lib/constants";
import { ReceiptBlockToggle } from "./receipt-block-toggle";
import type { BacklogDataPoint } from "@/types/analytics";

// Thematic grouping for the legend
const LEGEND_GROUPS: { label: string; statuses: string[] }[] = [
  {
    label: "Positive",
    statuses: [
      "Case Was Approved",
      "New Card Is Being Produced",
      "Card Was Mailed To Me",
      "Card Was Delivered",
    ],
  },
  {
    label: "Processing",
    statuses: [
      "Case Was Received",
      "Case Was Transferred",
      "Case Is Ready To Be Scheduled For An Interview",
      "Interview Was Scheduled",
    ],
  },
  {
    label: "Action Required",
    statuses: [
      "Case Was Denied",
      "Request for Evidence Was Sent",
      "Response To Request For Evidence Was Received",
      "Expedite Request Received",
    ],
  },
  {
    label: "Biometrics & Other",
    statuses: [
      "Biometrics Appointment Was Scheduled",
      "Fingerprint Fee Was Received",
      "Case Was Updated To Show Fingerprints Were Taken",
      "Name Was Updated",
    ],
  },
];

interface BacklogChartProps {
  data: BacklogDataPoint[];
  title?: string;
  groupBy: "receipt_block" | "receipt_month";
  onGroupByChange: (value: "receipt_block" | "receipt_month") => void;
}

export function BacklogChart({ data, title = "Current Backlog", groupBy, onGroupByChange }: BacklogChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white border border-[#e8e8ed] rounded-2xl p-8">
        <h3 className="text-[17px] font-semibold text-[#1d1d1f]">{title}</h3>
        <p className="text-[14px] text-[#86868b] mt-1">No data available.</p>
      </div>
    );
  }

  const statusKeys = Object.keys(data[0]).filter((k) => k !== "label");

  // Filter legend groups to only include statuses present in data
  const activeLegendGroups = LEGEND_GROUPS
    .map((group) => ({
      ...group,
      statuses: group.statuses.filter((s) => statusKeys.includes(s)),
    }))
    .filter((group) => group.statuses.length > 0);

  return (
    <div className="bg-white border border-[#e8e8ed] rounded-2xl overflow-hidden">
      <div className="px-6 pt-6 pb-1 flex items-center justify-between">
        <div>
          <h3 className="text-[15px] font-semibold text-[#1d1d1f] tracking-[-0.01em]">{title}</h3>
          <p className="text-[12px] text-[#86868b] mt-0.5">Cases by status across {groupBy === "receipt_block" ? "receipt blocks" : "receipt dates"}</p>
        </div>
        <ReceiptBlockToggle value={groupBy} onChange={onGroupByChange} size="small" />
      </div>
      <div className="px-2 pb-2">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#f0f0f2" strokeDasharray="none" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#86868b", fontFamily: "var(--font-sans)" }}
              interval="preserveStartEnd"
              angle={-45}
              textAnchor="end"
              height={55}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#86868b", fontFamily: "var(--font-sans)" }}
              tickLine={false}
              axisLine={false}
              width={48}
            />
            <Tooltip
              contentStyle={{
                background: "#fff",
                border: "1px solid #e8e8ed",
                borderRadius: "10px",
                fontSize: "12px",
                padding: "10px 14px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                fontFamily: "var(--font-sans)",
              }}
              itemStyle={{ padding: "1px 0", color: "#1d1d1f", fontSize: "12px" }}
              labelStyle={{ fontWeight: 600, marginBottom: 6, color: "#1d1d1f", fontSize: "13px" }}
            />
            {statusKeys.map((status) => (
              <Bar
                key={status}
                dataKey={status}
                stackId="1"
                fill={STATUS_COLORS[status] ?? "#a8a8ad"}
                radius={0}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Custom thematic legend */}
      <div className="px-6 pb-5 pt-2 border-t border-[#f0f0f2] flex justify-center">
        <div className="inline-grid grid-cols-2 lg:grid-cols-4 gap-4">
          {activeLegendGroups.map((group) => (
            <div key={group.label}>
              <p className="text-[10px] font-semibold text-[#86868b] uppercase tracking-wider mb-1.5">{group.label}</p>
              <div className="space-y-1">
                {group.statuses.map((status) => (
                  <div key={status} className="flex items-center gap-1.5">
                    <span
                      className="w-[8px] h-[8px] rounded-full shrink-0"
                      style={{ backgroundColor: STATUS_COLORS[status] ?? "#a8a8ad" }}
                    />
                    <span className="text-[11px] text-[#424245] leading-tight">{status}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
