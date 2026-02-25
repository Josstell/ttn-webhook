"use client";

import { useEffect, useMemo, useState } from "react";
import { pusherClient } from "@/lib/pusher-client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type UplinkData = {
  id?: string;
  deviceId?: string;
  temperature?: number;
  humidity?: number;
  battery?: number;
  soilMoisture?: number;
  conductivity?: number;
  soilTemperature?: number;
  airTemperature?: number;
  rssi?: number;
  time?: Date;
  receivedAt?: Date;
};

export function RealtimeUplinkTable({ initial }: { initial: UplinkData[] }) {
  const [data, setData] = useState(initial);

  useEffect(() => {
    const channel = pusherClient.subscribe("uplinks");

    channel.bind("new", (uplink: UplinkData) => {
      setData(prev => [uplink, ...prev].slice(0, 50));
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  const formattedData = useMemo(() => {
    return data.map(u => ({
      ...u,
      formattedTime: u.receivedAt ? new Date(u.receivedAt).toLocaleTimeString() : ""
    }));
  }, [data]);

  return (<Table>
      <TableHeader>
        <TableRow>
          <TableHead>Dispositivo</TableHead>
          <TableHead>Humedad</TableHead>
          <TableHead>Temp</TableHead>
          <TableHead>RSSI</TableHead>
          <TableHead>Hora</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {formattedData.map(u => (
          <TableRow key={u.id}>
            <TableCell>{u.deviceId}</TableCell>
            <TableCell>
              <Badge>{u.humidity}%</Badge>
            </TableCell>
            <TableCell>{u.temperature}°</TableCell>
            <TableCell>{u.rssi}</TableCell>
            <TableCell>
              {u.formattedTime}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
