import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid} from "recharts";
import React from 'react';

export interface ChartDataPoint {
  time: string;
  [key: string]: number | string;
}

export interface ChartSerie {
  key: string;
  color: string;
  label: string;
}

interface ReportsChartProps {
  data: ChartDataPoint[];
  series: ChartSerie[];
  activeFilters: Record<string, boolean>;
}

function OverInGraph({ active, payload, label }: any) {
  if (!active || !payload?.length)
    return null;
  return (
    <div
      style={{
        background: "#1F2937",
        borderRadius: "12px",
        padding: "8px 14px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
      }}
    >
      <p style={{ color: "#9CA3AF", fontSize: "11px", marginBottom: "4px" }}>
        Dépenses
      </p>
      <p style={{ color: "#fff", fontWeight: 700, fontSize: "15px", margin: 0 }}>
        {payload[0].value.toLocaleString("fr-FR")}
      </p>
    </div>
  );
}

export default function ReportsChart({data, series, activeFilters}: ReportsChartProps) {
  const activeSeries = series.filter((s) => activeFilters[s.key]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm h-full">
      {/* Titile */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-semibold text-gray-900 tracking-tight">
          Reports
        </span>
      </div>

      {/* Graph Display */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#F3F4F6"
            vertical={false}
          />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 11, fill: "#9CA3AF" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: "#9CA3AF" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<OverInGraph />} cursor={{ stroke: "#E5E7EB", strokeDasharray: "4 4" }} />

          {activeSeries.map((serie) => (
            <Line
              key={serie.key}
              type="monotone"
              dataKey={serie.key}
              stroke={serie.color}
              strokeWidth={2.5}
              dot={{ r: 3, fill: serie.color, strokeWidth: 0 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}