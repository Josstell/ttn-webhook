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

interface CleanUplink {
  device: string;
  temperature?: number;
  humidity?: number;
  time: string;
}

export function ProductsTable({ dataTempHum }: { dataTempHum: CleanUplink[] }) {
  return (
    <Card className="flex w-full flex-col gap-4">
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Temperatura</TableHead>
              <TableHead>Humedad</TableHead>
              <TableHead>Fecha y hora</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody className="**:data-[slot=table-cell]:py-2.5">
            {dataTempHum
              .slice(-20)
              .reverse()
              .map((data) => (
                <TableRow key={data.time}>
                  <TableCell>
                    <Badge
                      variant={
                        data.temperature && data.temperature > 35
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {data.temperature?.toFixed(1) ?? "N/A"}°C
                    </Badge>
                  </TableCell>
                  <TableCell>{data.humidity?.toFixed(1)}%</TableCell>
                  <TableCell>
                    {new Date(data.time).toLocaleString("es-MX", {
                      timeZone: "America/Mexico_City",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
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
