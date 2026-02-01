"use client";

import { useEffect, useState } from "react";

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

  const [temperature, setTemperature] = useState(initial.temperature);
  const [humidity, setHumidity] = useState(initial.humidity);
  const [battery, setBattery] = useState(initial.battery);

  useEffect(() => {
    const channel = pusherClient.subscribe("uplinks");
    channel.bind("new", (uplink: any) => {
      const values = [...data, uplink];

      setTemperature(calcStats(values, "temperature"));
      setHumidity(calcStats(values, "humidity"));
      setBattery(calcStats(values, "battery"));
      setData((prev) => [...prev, uplink].slice(0, 50));
      setLastUpdate(new Date(uplink.receivedAt));
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  //console.log("Last update: ", lastUpdate);

  if (!data) return null;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Sensor Ambiental</h1>

      <p className="text-sm text-muted-foreground">
        Última actualización: {new Date(lastUpdate).toLocaleString()}
      </p>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard title="Temperatura" unit="°C" stats={temperature} />
        <MetricCard title="Humedad" unit="%" stats={humidity} />
        <MetricCard title="Batería" unit="V" stats={battery} />
      </div>

      {/* Chart */}
      <SensorChart data={data} />

      {/* Table */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Lecturas recientes</h2>
        <UplinkTable rows={data} />
      </section>
    </div>
  );
};
