"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  DownloadIcon,
  FilterIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AnalyticsDatePicker } from "@/app/(panel)/dashboard/components/analytics-date-picker";

import { ProductsTable } from "@/app/(panel)/dashboard/components/products-table";
import { ChartLineInteractive } from "@/app/(panel)/dashboard/components/chart-line-interactive";
import { pusherClient } from "@/lib/pusher-client";
import { calcStats } from "@/lib/utils";

type Props = {
  initial: {
    series: any[];
    temperature: any;
    humidity: any;
    battery: any;
    lastUpdate: any;
  };
};

export function DashboardComponent({ initial }: Props) {
  const [data, setData] = useState(initial.series);
  const [lastUpdate, setLastUpdate] = useState(initial.lastUpdate);

  useEffect(() => {
    const channel = pusherClient.subscribe("uplinks");
    channel.bind("new", (uplink: any) => {
      const dataRow = {
        temperature: uplink.temperature,
        humidity: uplink.humidity,
        battery: uplink.battery,
        time: uplink.receivedAt,
      };
      setData((prev) => [...prev, dataRow]);
      setLastUpdate(uplink.receivedAt);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  const temperature = useMemo(() => calcStats(data, "temperature"), [data]);
  const humidity = useMemo(() => calcStats(data, "humidity"), [data]);

  const formattedDate = useMemo(() => {
    return new Date(lastUpdate).toLocaleString("es-MX", {
      timeZone: "America/Mexico_City",
      dateStyle: "long",
      timeStyle: "medium",
    });
  }, [lastUpdate]);

  const handleExport = () => {
    const headers = ["Temperature", "Humidity", "Battery", "Time"];
    const csvRows = [headers.join(",")];

    data.forEach((row: any) => {
      const values = [
        row.temperature ?? "",
        row.humidity ?? "",
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
    link.download = `dashboard-data-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!data) return null;

  return (
    <div className="@container/page flex flex-1 flex-col gap-8 p-6">
      <Tabs defaultValue="overview" className="gap-6">
        <div
          data-slot="dashboard-header"
          className="flex flex-col gap-4 @3xl/page:flex-row @3xl/page:items-center @3xl/page:justify-between"
        >
          <TabsList className="w-full @3xl/page:w-fit">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="exports" disabled>
              Exports
            </TabsTrigger>
          </TabsList>
          <div className="flex flex-col gap-2 @3xl/page:flex-row @3xl/page:items-center">
            <p className="text-sm text-muted-foreground">
              Última actualización: {formattedDate}
            </p>
            <div className="hidden items-center gap-2 @3xl/page:flex">
              <AnalyticsDatePicker />
              <Button variant="outline">
                <FilterIcon />
                Filter
              </Button>
              <Button variant="outline" onClick={handleExport}>
                <DownloadIcon />
                Export
              </Button>
            </div>
          </div>
        </div>
        <TabsContent value="overview" className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle>Temperatura Maxima</CardTitle>
                <CardDescription>
                  {temperature.max.toFixed(2)} °C
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Badge variant="outline">
                  <TrendingUpIcon />+{temperature?.percentageRise.toFixed(1)}%
                </Badge>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Temperatura Minima</CardTitle>
                <CardDescription>
                  {temperature?.min.toFixed(2)} °C
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Badge variant="outline">
                  <TrendingDownIcon />-{temperature.percentageDrop.toFixed(1)}%
                </Badge>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Humedad Maxima</CardTitle>
                <CardDescription>{humidity?.max.toFixed(2)}%</CardDescription>
              </CardHeader>
              <CardFooter>
                <Badge variant="outline">
                  <TrendingUpIcon />+{humidity?.percentageRise.toFixed(1)}%
                </Badge>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Humedad Minima</CardTitle>
                <CardDescription>{humidity?.min.toFixed(2)}%</CardDescription>
              </CardHeader>
              <CardFooter>
                <Badge variant="outline">
                  <TrendingDownIcon />-{humidity?.percentageDrop.toFixed(1)}%
                </Badge>
              </CardFooter>
            </Card>
          </div>
          <div className="grid grid-cols-1">
            <ChartLineInteractive messages={data} />
          </div>
          <ProductsTable dataTempHum={data} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
