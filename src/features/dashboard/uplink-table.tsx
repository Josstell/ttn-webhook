"use client";

import { useState } from "react";   

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Row = {
  time: Date;
  temperature: number;
  humidity: number;
  battery: number;
};

export function UplinkTable({ rows }: { rows: Row[] }) {

  
  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead className="text-right">Temp (°C)</TableHead>
            <TableHead className="text-right">Hum (%)</TableHead>
            <TableHead className="text-right">Bat (V)</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.slice(-20).reverse().map((r, i) => (
            <TableRow key={i}>
              <TableCell>
                {new Date(r.time).toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                {r.temperature.toFixed(1)}
              </TableCell>
              <TableCell className="text-right">
                {r.humidity.toFixed(1)}
              </TableCell>
              <TableCell className="text-right">
                {r.battery.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
