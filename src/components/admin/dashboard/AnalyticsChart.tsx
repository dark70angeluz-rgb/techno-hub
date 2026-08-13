import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { month: "Jan", members: 41200 },
  { month: "Feb", members: 43800 },
  { month: "Mar", members: 44500 },
  { month: "Apr", members: 46100 },
  { month: "May", members: 47800 },
  { month: "Jun", members: 49200 },
  { month: "Jul", members: 50600 },
  { month: "Aug", members: 52840 },
];

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[12px] border border-line bg-navy px-4 py-3 shadow-lift">
      <p className="mb-1 text-[12px] text-white/50">{label}</p>
      <p className="text-[14px] font-bold text-white">{Number(payload[0].value).toLocaleString()}</p>
    </div>
  );
}

export function AnalyticsChart() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div style={{ height: 260 }}>
      {mounted && (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.08)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "rgba(15,23,42,0.4)" }} axisLine={false} tickLine={false} />
            <YAxis
              width={46}
              domain={["dataMin - 2000", "dataMax + 2000"]}
              tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
              tick={{ fontSize: 12, fill: "rgba(15,23,42,0.4)" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone"
              dataKey="members"
              stroke="#2563EB"
              strokeWidth={2}
              fill="#2563EB"
              fillOpacity={0.08}
              isAnimationActive={false}
              dot={false}
              activeDot={{ r: 4, fill: "#2563EB" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default AnalyticsChart;
