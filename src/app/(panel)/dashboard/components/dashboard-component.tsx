"use client";

import React, { useEffect, useState } from "react";
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
// import { ChartAreaInteractive } from "./components/chart-area-interactive";
import { ChartLineInteractive } from "@/app/(panel)/dashboard/components/chart-line-interactive";
import { pusherClient } from "@/lib/pusher-client";
import { calcStats } from "@/lib/utils";

// export const metadata: Metadata = {
//   title: "Dashboard",
//   description: "An example dashboard to test the new components.",
// };

type Props = {
  initial: {
    series: any[];
    temperature: any;
    humidity: any;
    battery: any;
    lastUpdate: any;
  };
};

// Load from database.

export function DashboardComponent({ initial }: Props) {
  const [data, setData] = useState(initial.series);

  const [lastUpdate, setLastUpdate] = useState(initial.lastUpdate);

  const [temperature, setTemperature] = useState(initial.temperature);
  const [humidity, setHumidity] = useState(initial.humidity);
  const [battery, setBattery] = useState(initial.battery);

  useEffect(() => {
    const channel = pusherClient.subscribe("uplinks");
    channel.bind("new", (uplink: any) => {
      const dataRow = {
        temperature: uplink.temperature,
        humidity: uplink.humidity,
        battery: uplink.battery,
        time: uplink.receivedAt, // ❗ NO se usa en cálculos
      };
      const values = [...data, dataRow];

      setTemperature(calcStats(values, "temperature"));
      setHumidity(calcStats(values, "humidity"));
      setBattery(calcStats(values, "battery"));
      setLastUpdate(uplink.receivedAt);

      setData((prev) => [...prev, dataRow]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [data]);

  //console.log("Last update: ", lastUpdate);

  if (!data) return null;

  return (
    <div className="@container/page flex flex-1 flex-col gap-8 p-6">
      <Tabs defaultValue="overview" className="gap-6">
        <div
          data-slot="dashboard-header"
          className="flex items-center justify-between"
        >
          <TabsList className="w-full @3xl/page:w-fit">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="exports" disabled>
              Exports
            </TabsTrigger>
          </TabsList>
          <div className="hidden items-center gap-2 @3xl/page:flex">
            <AnalyticsDatePicker />
            <Button variant="outline">
              <FilterIcon />
              Filter
            </Button>
            <Button variant="outline">
              <DownloadIcon />
              Export
            </Button>
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
