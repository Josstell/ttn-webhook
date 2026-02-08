import { z } from "zod";
import { MetricStatsSchema } from "./metrics";

export const UplinkStatsItemSchema = z.object({
  temperature: z.number(),
  humidity: z.number(),
  battery: z.number(),
  time: z.date(),
});

export const UplinkStatsSchema = z.object({
  series: z.array(UplinkStatsItemSchema),

  temperature: MetricStatsSchema,
  humidity: MetricStatsSchema,  
  battery: MetricStatsSchema,

  lastUpdate: z.date(),
});

