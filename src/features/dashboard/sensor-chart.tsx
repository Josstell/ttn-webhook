"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export function SensorChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis
          dataKey="time"
          tickFormatter={t => new Date(t).toLocaleTimeString()}
        />
        <YAxis />
        <Tooltip
          labelFormatter={l =>
            new Date(l).toLocaleString()
          }
        />
        <Legend />

        <Line
          type="monotone"
          dataKey="temperature"
          name="Temperatura (°C)"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="humidity"
          name="Humedad (%)"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="battery"
          name="Batería (V)"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
