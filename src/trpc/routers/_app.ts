import { z } from "zod";

import { baseProcedure, createTRPCRouter, protectedProcedure } from "../init";
import prisma from "@/lib/db";
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
        orderBy: { receivedAt: "desc" },
        select: {
          temperature: true,
          humidity: true,
          receivedAt: true,
        },
      });
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
