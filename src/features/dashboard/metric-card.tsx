import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  title: string;
  unit: string;
  stats: {
    min: number;
    max: number;
    avg: number;
    current: number;
  };
}

export function MetricCard({ title, unit, stats }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 text-sm">
        <p>Actual: <strong>{stats.current}{unit}</strong></p>
        <p>Máx: {stats.max}{unit}</p>
        <p>Mín: {stats.min}{unit}</p>
        <p>Media: {stats.avg.toFixed(2)}{unit}</p>
      </CardContent>
    </Card>
  );
}
