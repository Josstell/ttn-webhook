import { z } from "zod";

export const MetricStatsSchema = z.object({
  min: z.number(),
  max: z.number(),
  avg: z.number(),
  current: z.number(),
});
