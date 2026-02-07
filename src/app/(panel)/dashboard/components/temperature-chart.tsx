"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

const chartConfig = {
  temperature: { label: "Temperatura (°C)", color: "oklch(0.646 0.222 41.116)" }
};

interface TemperatureChartProps {
  messages: { temperature?: number; time: string }[];
}

export function TemperatureChart({ messages }: TemperatureChartProps) {
  const chartData = messages.map(m => ({
    temperature: m.temperature,
    time: m.time
  })).filter(m => m.temperature !== undefined);

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Temperatura</CardTitle>
          <CardDescription>Sin datos disponibles</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">No hay datos de temperatura en el rango seleccionado</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Temperatura</CardTitle>
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
                domain={['auto', 'auto']}
                className="text-xs"
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => `${v}°C`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => [`${Number(value).toFixed(1)}°C`, "Temperatura"]}
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
                dataKey="temperature"
                stroke="var(--color-temperature)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: "var(--color-temperature)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
