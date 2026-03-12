"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ReceiptBlockToggle } from "./receipt-block-toggle";
import type { ApprovalDataPoint } from "@/types/analytics";

interface ApprovalChartProps {
  data: ApprovalDataPoint[];
  groupBy: "receipt_block" | "receipt_month";
  onGroupByChange: (value: "receipt_block" | "receipt_month") => void;
}

export function ApprovalChart({ data, groupBy, onGroupByChange }: ApprovalChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white border border-[#e8e8ed] rounded-2xl p-8">
        <h3 className="text-[15px] font-semibold text-[#1d1d1f]">Approval Distribution</h3>
        <p className="text-[14px] text-[#86868b] mt-1">No data available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#e8e8ed] rounded-2xl overflow-hidden">
      <div className="px-6 pt-6 pb-1 flex items-center justify-between">
        <div>
          <h3 className="text-[15px] font-semibold text-[#1d1d1f] tracking-[-0.01em]">Approval Distribution</h3>
          <p className="text-[12px] text-[#86868b] mt-0.5">Which {groupBy === "receipt_block" ? "receipt blocks" : "receipt dates"} are being approved</p>
        </div>
        <ReceiptBlockToggle value={groupBy} onChange={onGroupByChange} size="small" />
      </div>
      <div className="px-2 pb-4">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 0 }} barGap={2}>
            <CartesianGrid stroke="#f0f0f2" strokeDasharray="none" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: "#86868b", fontFamily: "var(--font-sans)" }}
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
              }}
              labelStyle={{ fontWeight: 600, marginBottom: 4, color: "#1d1d1f" }}
            />
            <Legend
              wrapperStyle={{ fontSize: "11px", paddingTop: "12px", color: "#86868b" }}
              iconType="circle"
              iconSize={6}
            />
            <Bar dataKey="total" fill="#c7c7cc" name="Total Cases" radius={[3, 3, 0, 0]} />
            <Bar dataKey="approved" fill="#7BC67E" name="Approved" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
