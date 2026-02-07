"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

const chartConfig = {
  humidity: { label: "Humedad (%)", color: "oklch(0.6 0.118 184.704)" }
};

interface HumidityChartProps {
  messages: { humidity?: number; time: string }[];
}

export function HumidityChart({ messages }: HumidityChartProps) {
  const chartData = messages.map(m => ({
    humidity: m.humidity,
    time: m.time
  })).filter(m => m.humidity !== undefined);

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Humedad</CardTitle>
          <CardDescription>Sin datos disponibles</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">No hay datos de humedad en el rango seleccionado</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Humedad</CardTitle>
        <CardDescription>Evolución temporal</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="time"
                tickFormatter={(v) => new Date(v).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                domain={[0, 100]}
                className="text-xs"
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => `${v}%`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => [`${Number(value).toFixed(1)}%`, "Humedad"]}
                    labelFormatter={(label) => new Date(label).toLocaleString('es-MX', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                    indicator="line"
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="humidity"
                stroke="var(--color-humidity)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: "var(--color-humidity)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
