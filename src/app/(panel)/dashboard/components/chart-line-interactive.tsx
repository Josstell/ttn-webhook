"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

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
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export const description = "An interactive line chart";

const chartConfig = {
  views: {
    label: "Page Views",
  },
  temperature: {
    label: "Temperatura",
    color: "var(--chart-1)",
  },
  humidity: {
    label: "Humedad",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function ChartLineInteractive({
  messages,
}: {
  messages: CleanUplink[];
}) {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("temperature");

  // const total = React.useMemo(
  //   () => ({
  //     temperature: messages.reduce((acc, curr) => acc + curr.temperature, 0),
  //     mobile: messages.reduce((acc, curr) => acc + curr.mobile, 0),
  //   }),
  //   [],
  // );

  return (
    <Card className="py-4 sm:py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>Temperatura y Humedad</CardTitle>
          <CardDescription>
            Mostrando la temperatura y humedad para el último día
          </CardDescription>
        </div>
        <div className="flex">
          {["temperature", "humidity"].map((key) => {
            const chart = key as "temperature" | "humidity";
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-[10px]">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg leading-none font-bold sm:text-xl -ml-2">
                  {messages[messages.length - 1]?.[chart] ?? 0}{" "}
                  {chart === "temperature" ? "°C" : "%"}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={messages}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
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
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  //nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleString("es-MX", {
                      timeZone: "America/Mexico_City",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Line
              dataKey={activeChart}
              type="monotone"
              stroke={`var(--color-${activeChart})`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
