import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { seoScoreSchema } from "@shared/schema";
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
import ScoreCard from "@/components/analysis/score-card";
import { Loader2 } from "lucide-react";

type FormData = {
  title: string;
  url: string;
};

export default function SEOScore() {
  const { toast } = useToast();
  const [results, setResults] = useState<{
    score: number;
    suggestions: string[];
  }>();

  const form = useForm<FormData>({
    resolver: zodResolver(seoScoreSchema.omit({ type: true })),
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await apiRequest("POST", "/api/analyze/seo-score", {
        ...data,
        type: "seo-score",
      });
      return res.json();
    },
    onSuccess: (data) => {
      setResults({
        score: data.score,
        suggestions: data.suggestions,
      });
      toast({
        title: "Analysis Complete",
        description: "Your SEO score analysis has been saved.",
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
        <h1 className="text-3xl font-bold">SEO Score</h1>
        <p className="text-muted-foreground mt-2">
          Get an overall SEO score for any URL
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>URL Input</CardTitle>
            <CardDescription>Enter a URL to analyze</CardDescription>
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
                        <Input placeholder="My URL Analysis" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://example.com"
                          {...field}
                        />
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
          <ScoreCard
            title="SEO Score"
            score={results.score}
            suggestions={results.suggestions}
          />
        )}
      </div>
    </div>
  );
}
