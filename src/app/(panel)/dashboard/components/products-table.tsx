// import { EllipsisVerticalIcon } from "lucide-react";

import { useState } from "react";

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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface CleanUplink {
  device: string;
  temperature?: number;
  humidity?: number;
  time: string;
}

const ITEMS_PER_PAGE = 50;

export function ProductsTable({ dataTempHum }: { dataTempHum: CleanUplink[] }) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(dataTempHum.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = dataTempHum.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      const start = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
      const end = Math.min(
        totalPages - 1,
        currentPage + Math.floor(maxVisiblePages / 2),
      );

      if (start > 2) pages.push("ellipsis");

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) pages.push("ellipsis");

      if (totalPages > 1) pages.push(totalPages);
    }

    return pages;
  };
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
            {paginatedData.map((data) => (
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
      {totalPages > 1 && (
        <CardContent className="pt-0">
          <Pagination className="justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                />
              </PaginationItem>
              {getPageNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {page === "ellipsis" ? (
                    <span className="flex size-9 items-center justify-center text-sm">
                      ...
                    </span>
                  ) : (
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardContent>
      )}
    </Card>
  );
}
