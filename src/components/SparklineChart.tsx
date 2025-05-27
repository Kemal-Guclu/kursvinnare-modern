// components/SparklineChart.tsx
"use client";

import { LineChart, Line, ResponsiveContainer } from "recharts";

type Props = {
  data: number[];
};

export function SparklineChart({ data }: Props) {
  if (!data || data.length === 0) return null;

  const chartData = data.map((value, index) => ({
    index,
    value,
  }));

  return (
    <div className="w-full h-[40px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
