import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid} from "recharts";
import React from 'react';

export interface ChartDataPoint {
  time: string;
  [key: string]: number | string | null;
}

export interface ChartSerie {
  key: string;
  color: string;
  label?: string;
  filterKey?: string;
  dashed?: boolean;
}
interface TooltipProps {
  active?: boolean;
  payload?: { value: number; name: string; color: string }[];
  label?: string;
}

interface ReportsChartProps {
  data: ChartDataPoint[];
  series: ChartSerie[];
  activeFilters: Record<string, boolean>;
}

function OverInGraph({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length)
    return null;
  return (
    <div
      style={{
        background: "#1F2937",
        borderRadius: "12px",
        padding: "10px 14px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        minWidth: 140,
      }}
    >
      <p style={{ color: "#9CA3AF", fontSize: "11px", marginBottom: "6px" }}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color, fontWeight: 600, fontSize: "13px", margin: "2px 0" }}>
          {p.name} : {p.value?.toLocaleString("fr-FR")} €
        </p>
      ))}
    </div>
  );
}

export default function ReportsChart({data, series, activeFilters}: ReportsChartProps) {
  const activeSeries = series.filter((s) => activeFilters[s.filterKey ?? s.key]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm h-full">
      {/* Title */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-semibold text-gray-900 tracking-tight">
          Dépenses réelles vs prévisionnelles
        </span>
      </div>

      {/* Graph Display */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#E5E7EB"
            vertical={false}
          />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 11, fill: "#6B7280" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, "auto"]}
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}k€`}
            tick={{ fontSize: 11, fill: "#6B7280" }}
            axisLine={false}
            tickLine={false}
            width={45}
          />
          <Tooltip content={<OverInGraph />} cursor={{ stroke: "#E5E7EB", strokeDasharray: "4 4" }} />

          {activeSeries.map((serie) => (
            <Line
              key={serie.key}
              type="monotone"
              dataKey={serie.key}
              name={serie.label ?? serie.key}
              stroke={serie.color}
              strokeWidth={serie.dashed ? 1.5 : 2.5}
              strokeDasharray={serie.dashed ? "6 3" : undefined}
              dot={serie.dashed ? false : { r: 3, fill: serie.color, strokeWidth: 0 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
              connectNulls={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}