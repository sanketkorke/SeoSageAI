import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { competitorAnalysisSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Globe } from "lucide-react";

type FormData = {
  title: string;
  competitorUrl: string;
};

const defaultValues: FormData = {
  title: "",
  competitorUrl: "",
};

export default function CompetitorAnalysis() {
  const { toast } = useToast();
  const [results, setResults] = useState<{
    metrics: {
      traffic: number;
      backlinks: number;
      keywords: number;
      domainAuthority: number;
    };
    topKeywords: string[];
    suggestions: string[];
  }>();

  const form = useForm<FormData>({
    resolver: zodResolver(competitorAnalysisSchema.pick({ title: true, competitorUrl: true })),
    defaultValues,
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await apiRequest("POST", "/api/analyze/competitor", {
        ...data,
        type: "competitor",
      });
      return res.json();
    },
    onSuccess: (data) => {
      setResults(data);
      toast({
        title: "Analysis Complete",
        description: "Your competitor analysis has been saved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Competitor Analysis</h1>
        <p className="text-muted-foreground mt-2">
          Analyze your competitors' websites for SEO insights
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Competitor URL</CardTitle>
            <CardDescription>Enter your competitor's website URL</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Analysis Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Competitor Analysis" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="competitorUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Competitor URL</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="url"
                            className="pl-9"
                            placeholder="https://competitor.com"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Analyze
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {results && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SEO Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Traffic Score</p>
                    <p className="text-2xl font-bold">{results.metrics.traffic}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Backlinks</p>
                    <p className="text-2xl font-bold">{results.metrics.backlinks}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Keywords</p>
                    <p className="text-2xl font-bold">{results.metrics.keywords}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Domain Authority</p>
                    <p className="text-2xl font-bold">{results.metrics.domainAuthority}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Keywords</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {results.topKeywords.map((keyword, i) => (
                    <div
                      key={i}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {keyword}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2">
                  {results.suggestions.map((suggestion, i) => (
                    <li key={i} className="text-sm text-muted-foreground">
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
