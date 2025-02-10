import { useQuery } from "@tanstack/react-query";
import { type Analysis } from "@shared/schema";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Search, FileText, BarChart2, Code2, ChevronRight } from "lucide-react";

const iconMap = {
  keyword: Search,
  content: FileText,
  "seo-score": BarChart2,
  meta: Code2,
};

export default function Dashboard() {
  const { data: analyses, isLoading } = useQuery<Analysis[]>({
    queryKey: ["/api/analyses"],
  });

  return (
    <div className="space-y-8">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-lg blur-3xl" />
        <div className="relative">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            View and manage your saved SEO analyses
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader>
                <Skeleton className="h-6 w-2/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : analyses?.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium mb-2">No analyses saved yet</p>
            <p className="text-muted-foreground">
              Start by analyzing your content or URLs for SEO insights
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {analyses?.map((analysis) => {
            const Icon = iconMap[analysis.type as keyof typeof iconMap];
            return (
              <Link key={analysis.id} href={`/${analysis.type}`}>
                <Card className="cursor-pointer group hover:shadow-lg transition-all duration-300 overflow-hidden border-muted/50">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {analysis.title}
                      </CardTitle>
                      <ChevronRight className="w-5 h-5 ml-auto text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analysis.url && (
                        <p className="text-sm text-muted-foreground truncate">
                          {analysis.url}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        Saved{" "}
                        {analysis.savedAt &&
                          format(new Date(analysis.savedAt), "PPp")}
                      </p>
                      {analysis.score && (
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${analysis.score}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">
                            {analysis.score}/100
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}