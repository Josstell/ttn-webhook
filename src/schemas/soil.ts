import { z } from "zod";
import { MetricStatsSchema } from "./metrics";

export const SoilSeriesItemSchema = z.object({
  soilTemperature: z.number().min(-20).max(80),
  airTemperature: z.number().min(-40).max(85),
  soilMoisture: z.number().min(0).max(100),
  conductivity: z.number().min(0).max(5000),
  battery: z.number().min(2.5).max(5.0),
  time: z.date(),
});

export const SoilStatsSchema = z.object({
  series: z.array(SoilSeriesItemSchema),

  soilTemperature: MetricStatsSchema,
  airTemperature: MetricStatsSchema,
  soilMoisture: MetricStatsSchema,
  conductivity: MetricStatsSchema,
  battery: MetricStatsSchema,

  lastUpdate: z.date(),
});
