"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useEffect, useMemo, useState } from "react";
import { SoilSeriesItem } from "../../../../../types";

export const description = "A multiple line chart";

// const chartData = [
//   { month: "January", desktop: 186, mobile: 80 },
//   { month: "February", desktop: 305, mobile: 200 },
//   { month: "March", desktop: 237, mobile: 120 },
//   { month: "April", desktop: 73, mobile: 190 },
//   { month: "May", desktop: 209, mobile: 130 },
//   { month: "June", desktop: 214, mobile: 140 },
// ];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function ChartLineConductivity({
  messages,
}: {
  messages: SoilSeriesItem[];
}) {
  const formattedDateTo = useMemo(() => {
    if (!messages || messages.length === 0) return "";
    return new Date(messages[0].time).toLocaleString("es-MX", {
      timeZone: "America/Mexico_City",
      dateStyle: "long",
      timeStyle: "medium",
    });
  }, [messages]);

  const formattedDateLast = useMemo(() => {
    if (!messages || messages.length === 0) return "";
    return new Date(messages[messages.length - 1].time).toLocaleString(
      "es-MX",
      {
        timeZone: "America/Mexico_City",
        dateStyle: "long",
        timeStyle: "medium",
      },
    );
  }, [messages]);

  return (
    <Card>
      <CardHeader>
        {/* <CardTitle>Grafica de conductividad, humedad del suelo, temperatura aire y temperatura del suelo</CardTitle> */}
        <CardDescription>
          {formattedDateTo && formattedDateLast
            ? `De ${formattedDateTo} a ${formattedDateLast}`
            : "Sin datos disponibles"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
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
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                });
              }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="conductivity"
              type="monotone"
              stroke="var(--chart-1)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="soilMoisture"
              type="monotone"
              stroke="var(--chart-2)"
              strokeWidth={2}
              dot={false}
            />
            {/* <Line
              dataKey="airTemperature"
              type="monotone"
              stroke="var(--chart-3)"
              strokeWidth={2}
              dot={false}
            /> */}
            <Line
              dataKey="soilTemperature"
              type="monotone"
              stroke="var(--chart-4)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              Showing total visitors for the last 6 months
            </div>
          </div>
        </div>
      </CardFooter> */}
    </Card>
  );
}
