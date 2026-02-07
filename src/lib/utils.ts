import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

type MetricKey = "temperature" | "humidity" | "battery";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calcStats(values: any[], key: MetricKey) {
  if (values.length === 0) {
    return { min: 0, max: 0, avg: 0, current: 0, percentageRise: 0, percentageDrop: 0 };
  }

  let min = Infinity;
  let max = -Infinity;
  let sum = 0;
  let count = 0;
  let current = 0;

  for (let i = 0; i < values.length; i++) {
    const val = values[i][key];
    if (val !== null && val !== undefined) {
      if (val < min) min = val;
      if (val > max) max = val;
      sum += val;
      count++;
      current = val;
    }
  }

  if (count === 0) {
    return { min: 0, max: 0, avg: 0, current: 0, percentageRise: 0, percentageDrop: 0 };
  }

  const avg = sum / count;
  const percentageRise = min !== 0 ? ((current - min) / min) * 100 : 0;
  const percentageDrop = max !== 0 ? ((max - current) / max) * 100 : 0;

  return { min, max, avg, current, percentageRise, percentageDrop };
}
