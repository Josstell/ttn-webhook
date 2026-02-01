import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

type MetricKey = "temperature" | "humidity" | "battery";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calcStats(values: any[], key: MetricKey) {
  const raw = values.map((v) => v[key]);
  const nums = raw.filter((n): n is number => n !== null);

  return {
    min: nums.length ? Math.min(...nums) : 0,
    max: nums.length ? Math.max(...nums) : 0,
    avg: nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0,
    current: raw.at(-1),
  };
}
