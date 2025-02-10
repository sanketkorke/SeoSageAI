import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface KeywordChartProps {
  keywords: string[];
}

export default function KeywordChart({ keywords }: KeywordChartProps) {
  const data = keywords.map((keyword) => ({
    keyword,
    frequency: Math.floor(Math.random() * 100), // In a real app, this would be actual frequency data
  }));

  return (
    <Card className="w-full h-[400px]">
      <CardHeader>
        <CardTitle>Keyword Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="keyword" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="frequency" fill="hsl(var(--primary))" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
