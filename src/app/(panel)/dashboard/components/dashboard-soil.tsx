"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangleIcon,
  BatteryIcon,
  DownloadIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AnalyticsDatePicker } from "@/app/(panel)/dashboard/components/analytics-date-picker";

import { ProductsTable } from "@/app/(panel)/dashboard/components/products-table";
import { ChartLineInteractive } from "@/app/(panel)/dashboard/components/chart-line-interactive";
import { pusherClient } from "@/lib/pusher-client";
import { calcStats } from "@/lib/utils";
import { ChartLineMultiple } from "./chart-line-tooltip";
import { SoilSeriesItem, SoilStatsResponse } from "../../../../../types";
import { TableSoil } from "./table-soil";
import { ChartLineConductivity } from "./chart-line-tooltip-conductivity";

interface UplinkData {
  temperature: number;
  humidity: number;
  battery: number;
  receivedAt: string;
}

interface CleanUplink {
  device: string;
  temperature?: number;
  humidity?: number;
  battery?: number;
  time: string;
}

interface Alert {
  type: "error" | "warning";
  message: string;
}

const SOIL_CONDUCTIVITY_THRESHOLD = 100;
const SOIL_TEMPERATURE_THRESHOLD = 35;
const AIR_TEMPERATURE_THRESHOLD = 350;
const SOIL_MOISTURE_THRESHOLD = 80;
const BATTERY_THRESHOLD = 4.1;

interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  trend: number;
  threshold?: number;
  icon: React.ReactNode;
}

function MetricCard({
  title,
  value,
  unit,
  trend,
  threshold,
  icon,
}: MetricCardProps) {
  const isAlert = threshold ? value > threshold : false;
  const trendColor = trend >= 0 ? "text-green-500" : "text-red-500";
  const trendIcon =
    trend >= 0 ? (
      <TrendingUpIcon className="h-4 w-4" />
    ) : (
      <TrendingDownIcon className="h-4 w-4" />
    );

  return (
    <Card className={isAlert ? "border-red-500/50" : ""}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value.toFixed(1)}
          {unit}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className={`flex items-center text-xs ${trendColor}`}>
            {trendIcon}
            {Math.abs(trend).toFixed(1)}%
          </span>
          {threshold && (
            <Badge
              variant={isAlert ? "destructive" : "secondary"}
              className="text-xs"
            >
              {isAlert ? (
                <>
                  <AlertTriangleIcon className="h-3 w-3 mr-1" />
                  Above {threshold}
                </>
              ) : (
                "Normal"
              )}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

type Props = {
  initialSoil: SoilStatsResponse;
};

export function DashboardSoil({ initialSoil }: Props) {
  const [data, setData] = useState<SoilSeriesItem[]>(initialSoil.series);
  const [lastUpdate, setLastUpdate] = useState<Date | undefined>(
    initialSoil.lastUpdate ?? new Date().toISOString(),
  );
  // const [daysToGet, setdaysToGet] = useState();

  useEffect(() => {
    const channel = pusherClient.subscribe("soil-uplinks");
    channel.bind("new", (soilUplink: SoilSeriesItem) => {
      const dataRow: SoilSeriesItem = {
        battery: soilUplink.battery,
        conductivity: soilUplink.conductivity,
        soilTemperature: soilUplink.soilTemperature,
        airTemperature: soilUplink.airTemperature,
        soilMoisture: soilUplink.soilMoisture,
        time: soilUplink.time,
      };

      const values =[...data, dataRow]
      setData((prev) => [...prev, dataRow]);
      setLastUpdate(soilUplink.time);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  // useEffect(() => {}, daysToGet);

  // console.log("SET DAYS: ", daysToGet);

  const soilConductivity = useMemo(
    () => calcStats(data, "conductivity"),
    [data],
  );
  const soilTemperature = useMemo(
    () => calcStats(data, "soilTemperature"),
    [data],
  );
  const airTemperature = useMemo(
    () => calcStats(data, "airTemperature"),
    [data],
  );
  const soilMoisture = useMemo(() => calcStats(data, "soilMoisture"), [data]);
  const battery = useMemo(() => calcStats(data, "battery"), [data]);

  const formattedDate = useMemo(() => {
    const date = lastUpdate ? new Date(lastUpdate) : new Date();
    return date.toLocaleString("es-MX", {
      timeZone: "America/Mexico_City",
      dateStyle: "long",
      timeStyle: "medium",
    });
  }, [lastUpdate]);

  const alerts = useMemo<Alert[]>(() => {
    const result: Alert[] = [];
    if (soilTemperature.current > SOIL_TEMPERATURE_THRESHOLD) {
      result.push({
        type: "error",
        message: `Temperatura del suelo (${soilTemperature.current.toFixed(1)}°C) excede el umbral de ${SOIL_TEMPERATURE_THRESHOLD}°C`,
      });
    }
    if (airTemperature.current > AIR_TEMPERATURE_THRESHOLD) {
      result.push({
        type: "error",
        message: `Temperatura del aire (${airTemperature.current.toFixed(1)}°C) excede el umbral de ${AIR_TEMPERATURE_THRESHOLD}°C`,
      });
    }
    if (soilMoisture.current > SOIL_MOISTURE_THRESHOLD) {
      result.push({
        type: "warning",
        message: `Humedad del suelo (${soilMoisture.current.toFixed(1)}%) excede el umbral de ${SOIL_MOISTURE_THRESHOLD}% `,
      });
    }
    if (battery.current < BATTERY_THRESHOLD) {
      result.push({
        type: "warning",
        message: `Batería (${battery.current.toFixed(2)}V) por debajo del nivel óptimo`,
      });
    }
    if (soilConductivity.current > SOIL_CONDUCTIVITY_THRESHOLD) {
      result.push({
        type: "warning",
        message: `Conductividad del suelo (${soilConductivity.current.toFixed(2)} S/m) excede el umbral de ${SOIL_CONDUCTIVITY_THRESHOLD} S/m`,
      });
    }
    return result;
  }, [
    soilTemperature.current,
    airTemperature.current,
    soilMoisture.current,
    battery.current,
    soilConductivity.current,
  ]);

  const handleExport = () => {
    const headers = [
      "Conductivity",
      "Soil Temperature",
      "Air Temperature",
      "Soil Moisture",
      "Battery",
      "Time",
    ];
    const csvRows = [headers.join(",")];

    data.forEach((row) => {
      const values = [
        row.conductivity ?? "",
        row.soilTemperature ?? "",
        row.airTemperature ?? "",
        row.soilMoisture ?? "",
        row.battery ?? "",
        row.time ?? "",
      ];
      csvRows.push(values.join(","));
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `dashboard-soil-data-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!data) return null;

  return (
    <div className="@container/page flex flex-1 flex-col gap-8 p-6">
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 rounded-lg border p-3 text-sm ${
                alert.type === "error"
                  ? "border-red-500/50 bg-red-50 text-red-700"
                  : "border-yellow-500/50 bg-yellow-50 text-yellow-700"
              }`}
            >
              <AlertTriangleIcon className="h-4 w-4" />
              {alert.message}
            </div>
          ))}
        </div>
      )}

      <Tabs defaultValue="overview" className="gap-6">
        <div
          data-slot="dashboard-header"
          className="flex flex-col gap-4 @3xl/page:flex-row @3xl/page:items-center @3xl/page:justify-between"
        >
          <TabsList className="w-full @3xl/page:w-fit">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="analytics">Analíticas</TabsTrigger>
            <TabsTrigger value="reports">Reportes</TabsTrigger>
            <TabsTrigger value="exports" disabled>
              Exportar a archivo CSV
            </TabsTrigger>
          </TabsList>
          <div className="flex flex-col gap-2 @3xl/page:flex-row @3xl/page:items-center">
            <p className="text-sm text-muted-foreground">
              Última actualización: {formattedDate}
            </p>
            <div className="hidden items-center gap-2 @3xl/page:flex">
              <AnalyticsDatePicker />
              <Button variant="outline" onClick={handleExport}>
                <DownloadIcon />
                Export
              </Button>
            </div>
          </div>
        </div>

        <TabsContent value="overview" className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Conductividad"
              value={soilConductivity.current}
              unit=" S/m"
              trend={soilConductivity.percentageRise}
              threshold={SOIL_CONDUCTIVITY_THRESHOLD}
              icon={
                <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
              }
            />
            <MetricCard
              title="Humedad del suelo"
              value={soilMoisture.current}
              unit="%"
              trend={soilMoisture.percentageRise}
              threshold={SOIL_MOISTURE_THRESHOLD}
              icon={
                <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
              }
            />
            <MetricCard
              title="Temperatura del suelo"
              value={soilTemperature.current}
              unit="°C"
              trend={soilTemperature.percentageRise}
              threshold={SOIL_MOISTURE_THRESHOLD}
              icon={
                <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
              }
            />
            {/* <MetricCard
              title="Air Temperature"
              value={airTemperature.current}
              unit="°C"
              trend={airTemperature.percentageRise}
              threshold={AIR_TEMPERATURE_THRESHOLD}
              icon={
                <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
              }
            /> */}
            <MetricCard
              title="Batería"
              value={battery.current}
              unit="V"
              trend={battery.percentageDrop}
              threshold={BATTERY_THRESHOLD}
              icon={<BatteryIcon className="h-4 w-4 text-muted-foreground" />}
            />
            <MetricCard
              title="Lecturas"
              value={data.length}
              unit=""
              trend={0}
              icon={
                <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
              }
            />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Tendencia Temporal</CardTitle>
                <CardDescription>
                  Conductividad, humedad del suelo, temperatura aire y suelo en
                  tiempo real
                </CardDescription>
              </CardHeader>
              <CardContent>
                {data && (
                  <>
                    {" "}
                    <ChartLineConductivity messages={data as any} />{" "}
                  </>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Resumen Estadístico</CardTitle>
                <CardDescription>Últimas 24 horas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Conductividad</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Max:</div>
                    <div className="font-medium">
                      {soilConductivity.max.toFixed(1)} S/m
                    </div>
                    <div className="text-muted-foreground">Min:</div>
                    <div className="font-medium">
                      {soilConductivity.min.toFixed(1)} S/m
                    </div>
                    <div className="text-muted-foreground">Promedio:</div>
                    <div className="font-medium">
                      {soilConductivity.avg.toFixed(1)} S/m
                    </div>
                  </div>
                </div>
                {/* <div className="space-y-2">
                  <div className="text-sm font-medium">Temperatura de aire</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Max:</div>
                    <div className="font-medium">
                      {airTemperature.max.toFixed(1)}°C
                    </div>
                    <div className="text-muted-foreground">Min:</div>
                    <div className="font-medium">
                      {airTemperature.min.toFixed(1)}°C
                    </div>
                    <div className="text-muted-foreground">Promedio:</div>
                    <div className="font-medium">
                      {airTemperature.avg.toFixed(1)}°C
                    </div>
                  </div>
                </div> */}
                <div className="space-y-2">
                  <div className="text-sm font-medium">Humedad del suelo</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Max:</div>
                    <div className="font-medium">
                      {soilMoisture.max.toFixed(1)}%
                    </div>
                    <div className="text-muted-foreground">Min:</div>
                    <div className="font-medium">
                      {soilMoisture.min.toFixed(1)}%
                    </div>
                    <div className="text-muted-foreground">Promedio:</div>
                    <div className="font-medium">
                      {soilMoisture.avg.toFixed(1)}%
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">
                    Temperatura de suelo
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Max:</div>
                    <div className="font-medium">
                      {soilTemperature.max.toFixed(1)}°C
                    </div>
                    <div className="text-muted-foreground">Min:</div>
                    <div className="font-medium">
                      {soilTemperature.min.toFixed(1)}°C
                    </div>
                    <div className="text-muted-foreground">Promedio:</div>
                    <div className="font-medium">
                      {soilTemperature.avg.toFixed(1)}°C
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Batería</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Actual:</div>
                    <div className="font-medium">
                      {battery.current.toFixed(2)}V
                    </div>
                    <div className="text-muted-foreground">Mín:</div>
                    <div className="font-medium">{battery.min.toFixed(2)}V</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <TableSoil dataSoil={data} />
        </TabsContent>

        <TabsContent value="analytics" className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Datos</CardTitle>
              <CardDescription>
                Vista detallada de métricas y tendencias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Contenido de análisis detalladoComing soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Reportes</CardTitle>
              <CardDescription>Generar y exportar reportes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Funcionalidad de reportesComing soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
