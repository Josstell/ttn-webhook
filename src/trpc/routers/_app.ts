import { z } from "zod";

import { baseProcedure, createTRPCRouter, protectedProcedure } from "../init";
import prisma from "@/lib/db";
import { calcStats } from "@/lib/utils";
import { SoilSeriesItemSchema, SoilStatsSchema } from "@/schemas/soil";
import { UplinkStatsItemSchema, UplinkStatsSchema } from "@/schemas/temp-hum";

export const appRouter = createTRPCRouter({
  getUsers: protectedProcedure.query(() => {
    return {
      data: prisma.user.findMany(),
    };
  }),
  ttnTemHum: baseProcedure
    .input(
      z.object({
        hours: z.number().default(12),
      }),
    )
    .query(async ({ ctx, input }) => {
      const since = new Date(Date.now() - input.hours * 60 * 60 * 1000);

      return prisma.uplink.findMany({
        where: {
          receivedAt: { gte: since },
        },
        orderBy: { receivedAt: "asc" },
        select: {
          temperature: true,
          humidity: true,
          battery: true,
          receivedAt: true,
        },
      });
    }),
  stats: baseProcedure
    .input(z.object({ hours: z.number().default(12) }))
    .query(async ({ ctx, input }) => {
      const since = new Date(Date.now() - input.hours * 3600_000);

      const rows = await prisma.uplink.findMany({
        where: { receivedAt: { gte: since } },
        orderBy: { receivedAt: "asc" },
      });

      const values = rows.map((r) => ({
        temperature: r.temperature,
        humidity: r.humidity,
        battery: r.battery,
        time: r.receivedAt,
      }));

      const validatedValues = {
        series: values,
        temperature: calcStats(values, "temperature"),
        humidity: calcStats(values, "humidity"),
        battery: calcStats(values, "battery"),
        lastUpdate: values.at(-1)?.time,
      };

      return validatedValues;
    }),
  statsSoil: baseProcedure
    .input(z.object({ hours: z.number().default(12) }))
    .query(async ({ ctx, input }) => {
      const since = new Date(Date.now() - input.hours * 3600_000);

      const rows = await prisma.soilUplink.findMany({
        where: { receivedAt: { gte: since } },
        orderBy: { receivedAt: "asc" },
      });

      const values = rows.map((r) => ({
        soilTemperature: r.soilTemperature,
        airTemperature: r.airTemperature,
        soilMoisture: r.soilMoisture,
        conductivity: r.conductivity,
        battery: r.battery,
        time: r.receivedAt,
      }));

      const validatedValues = {
        series: values,
        soilTemperature: calcStats(values, "soilTemperature"),
        airTemperature: calcStats(values, "airTemperature"),
        soilMoisture: calcStats(values, "soilMoisture"),
        conductivity: calcStats(values, "conductivity"),
        battery: calcStats(values, "battery"),
        lastUpdate: values.at(-1)?.time,
      };

      return validatedValues;
    }),
});
export type AppRouter = typeof appRouter;
