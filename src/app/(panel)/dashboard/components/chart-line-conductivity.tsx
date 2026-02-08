interface StarDotProps {
  cx?: number;
  cy?: number;
  payload?: Record<string, unknown>;
}

function StarDot({ cx, cy }: StarDotProps) {
  if (cx == null || cy == null) return null;
  return (
    <svg x={cx - 6} y={cy - 6} width={12} height={12} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { SoilSeriesItem } from "../../../../../types";

const chartConfig = {
  conductivity: {
    label: "Conductividad (S/m) *",
    color: "#ef4444",
  },
  soilMoisture: {
    label: "Humedad del suelo (%) *",
    color: "#22c55e",
  },
  temperatureAir: {
    label: "Temperatura aire (°C) *",
    color: "#ef4444",
  },
  temperatureSoil: {
    label: "Temperatura suelo (°C) *",
    color: "#22c55e",
  },
} satisfies ChartConfig;

export function ChartLineConductivity({
  messages,
}: {
  messages: SoilSeriesItem[];
}) {
  const [showBoth, setShowBoth] = React.useState(true);

  console.log("Data:", messages);

  return (
    <Card className="py-4 sm:py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>Conductividad, humedad del suelo, temperatura aire y suelo</CardTitle>
          <CardDescription>Tendencia en tiempo real</CardDescription>
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
            <YAxis
              yAxisId="temperature"
              orientation="left"
              stroke="#22c55e"
              tickFormatter={(v) => `${v}°C`}
            />
            <YAxis
              yAxisId="humidity"
              orientation="right"
              stroke="#ef4444"
              tickFormatter={(v) => `${v}%`}
            />
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
                  formatter={(value, name) => {
                    const unit = name === "temperature" ? "°C" : "%";
                    const label = name === "temperature" ? "Temperatura" : "Humedad";
                    return [`${value}${unit}`, label];
                  }}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            {showBoth && (
              <>
                <Line
                  yAxisId="temperature"
                  dataKey="temperature"
                  type="monotone"
                  stroke="#22c55e"
                  strokeWidth={4}
                  strokeOpacity={0.3}
                  dot={false}
                  activeDot={false}
                />
                <Line
                  yAxisId="temperature"
                  dataKey="temperature"
                  type="monotone"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={<StarDot />}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
                <Line
                  yAxisId="humidity"
                  dataKey="humidity"
                  type="monotone"
                  stroke="#ef4444"
                  strokeWidth={4}
                  strokeOpacity={0.3}
                  dot={false}
                  activeDot={false}
                />
                <Line
                  yAxisId="humidity"
                  dataKey="humidity"
                  type="monotone"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={<StarDot />}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
              </>
            )}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
