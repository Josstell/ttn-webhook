export type MetricStats = {
  min: number;
  max: number;
  avg: number;
  current: number;
};


export type SoilSeriesItem = {
  soilTemperature: number;
  airTemperature: number;
  soilMoisture: number;
  conductivity: number;
  battery: number;
  time: Date;
};

export type SoilStatsResponse = {
  series: SoilSeriesItem[];

  soilTemperature: MetricStats;
  airTemperature: MetricStats;
  soilMoisture: MetricStats;
  conductivity: MetricStats;
  battery: MetricStats;

  lastUpdate: Date;
};
