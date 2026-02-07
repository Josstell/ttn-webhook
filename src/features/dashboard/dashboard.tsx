"use client";

import { useEffect, useMemo, useState } from "react";

import { MetricCard } from "@/features/dashboard/metric-card";
import { SensorChart } from "@/features/dashboard/sensor-chart";
import { UplinkTable } from "@/features/dashboard/uplink-table";
import { pusherClient } from "@/lib/pusher-client";
import { calcStats } from "@/lib/utils";

type Props = {
  initial: {
    series: any[];
    temperature: any;
    humidity: any;
    battery: any;
    lastUpdate: Date;
  };
};

export const DashboardComponent = ({ initial }: Props) => {
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
  const battery = useMemo(() => calcStats(data, "battery"), [data]);

  const formattedDate = useMemo(() => {
    return new Date(lastUpdate).toLocaleString("es-MX", {
      timeZone: "America/Mexico_City",
      dateStyle: "long",
      timeStyle: "medium",
    });
  }, [lastUpdate]);

  if (!data) return null;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Sensor Ambiental</h1>

      <p className="text-sm text-muted-foreground">
        Última actualización: {formattedDate}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard title="Temperatura" unit="°C" stats={temperature} />
        <MetricCard title="Humedad" unit="%" stats={humidity} />
        <MetricCard title="Batería" unit="V" stats={battery} />
      </div>

      <SensorChart data={data} />

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Lecturas recientes</h2>
        <UplinkTable rows={data} />
      </section>
    </div>
  );
};
