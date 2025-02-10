import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ScoreCardProps {
  score: number;
  title: string;
  suggestions?: string[];
}

export default function ScoreCard({ score, title, suggestions }: ScoreCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Progress value={score} className="flex-1" />
            <span className="text-lg font-semibold">{score}/100</span>
          </div>
          {suggestions && suggestions.length > 0 && (
            <ul className="list-disc pl-6 space-y-2">
              {suggestions.map((suggestion, i) => (
                <li key={i} className="text-sm text-muted-foreground">
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
