"use client";
// import { EllipsisVerticalIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SoilSeriesItem } from "../../../../../types";

export function TableSoil({ dataSoil }: { dataSoil: SoilSeriesItem[] }) {
  return (
    <Card className="flex w-full flex-col gap-4">
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Conductividad</TableHead>
              <TableHead>Humedad del suelo</TableHead>
              <TableHead>Temperatura aire</TableHead>
              <TableHead>Temperatura suelo</TableHead>

              <TableHead>Fecha y hora</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="**:data-[slot=table-cell]:py-2.5">
            {dataSoil
              .slice(-20)
              .reverse()
              .map((data, index) => (
                <TableRow key={index}>
                  <TableCell>{data.conductivity?.toFixed(1)}S/m</TableCell>
                  <TableCell>{data.soilMoisture?.toFixed(1)}%</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        data.airTemperature && data.airTemperature > 35
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {data.airTemperature?.toFixed(1) ?? "N/A"}°C
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        data.soilTemperature && data.soilTemperature > 35
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {data.soilTemperature?.toFixed(1) ?? "N/A"}°C
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {data.time
                      ? new Date(data.time).toLocaleString("es-MX", {
                          timeZone: "America/Mexico_City",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })
                      : "N/A"}
                  </TableCell>
                  {/* <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-6">
                          <EllipsisVerticalIcon />
                        </Button>
                      </DropdownMenuTrigger>
                       <DropdownMenuContent align="end">
                      <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                      <DropdownMenuItem>Eliminar</DropdownMenuItem>
                    </DropdownMenuContent> 
                    </DropdownMenu>
                  </TableCell> */}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
