"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CleanUplink {
  device: string;
  temperature?: number;
  humidity?: number;
  time: string;
}

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  temperature: {
    label: "Temperatura (°C)",
    color: "var(--chart-1)",
  },
  humidity: {
    label: "Humedad (%)",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function ChartLineInteractive({
  messages,
}: {
  messages: CleanUplink[];
}) {
  const [showBoth, setShowBoth] = React.useState(true);

  return (
    <Card className="py-4 sm:py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>Temperatura y Humedad</CardTitle>
          <CardDescription>
            Tendencia en tiempo real
          </CardDescription>
        </div>
        <div className="flex items-center gap-4 px-6 py-3 sm:py-0">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={showBoth}
              onChange={(e) => setShowBoth(e.target.checked)}
              className="rounded border-gray-300"
            />
            Mostrar ambas métricas
          </label>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={messages}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} className="stroke-muted" />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("es-MX", {
                  timeZone: "America/Mexico_City",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                });
              }}
            />
            <YAxis yAxisId="temp" orientation="left" stroke="var(--chart-1)" tickFormatter={(v) => `${v}°C`} />
            <YAxis yAxisId="humid" orientation="right" stroke="var(--chart-2)" tickFormatter={(v) => `${v}%`} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleString("es-MX", {
                      timeZone: "America/Mexico_City",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            {(showBoth || true) && (
              <>
                <Line
                  yAxisId="temp"
                  dataKey="temperature"
                  type="monotone"
                  stroke="var(--color-temperature)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Line
                  yAxisId="humid"
                  dataKey="humidity"
                  type="monotone"
                  stroke="var(--color-humidity)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </>
            )}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
