import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { keywordAnalysisSchema } from "@shared/schema";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import KeywordChart from "@/components/analysis/keyword-chart";
import { Loader2 } from "lucide-react";

type FormData = {
  title: string;
  url?: string;
  content?: string;
};

const defaultValues: FormData = {
  title: "",
  url: "",
  content: "",
};

export default function KeywordResearch() {
  const { toast } = useToast();
  const [results, setResults] = useState<{
    keywords: string[];
    suggestions: string[];
  }>();

  const form = useForm<FormData>({
    resolver: zodResolver(keywordAnalysisSchema.pick({ title: true, url: true, content: true })),
    defaultValues,
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (!data.url && !data.content) {
        throw new Error("Please provide either a URL or content to analyze");
      }

      const res = await apiRequest("POST", "/api/analyze/keywords", {
        ...data,
        type: "keyword",
        keywords: [],
      });
      return res.json();
    },
    onSuccess: (data) => {
      setResults({
        keywords: data.keywords || [],
        suggestions: data.suggestions || [],
      });
      toast({
        title: "Analysis Complete",
        description: "Your keyword analysis has been saved.",
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

  const onSubmit = (data: FormData) => {
    if (!data.url && !data.content) {
      toast({
        title: "Error",
        description: "Please provide either a URL or content to analyze",
        variant: "destructive",
      });
      return;
    }
    mutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Keyword Research</h1>
        <p className="text-muted-foreground mt-2">
          Analyze content or URLs for keyword optimization
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Analysis Input</CardTitle>
            <CardDescription>
              Enter a URL or paste content to analyze
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Analysis Title</FormLabel>
                      <FormControl>
                        <Input placeholder="My Analysis" {...field} />
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
                      <FormLabel>URL (optional)</FormLabel>
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
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content (optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Paste your content here..."
                          className="h-32"
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
          <div className="space-y-6">
            <KeywordChart keywords={results.keywords} />
            <Card>
              <CardHeader>
                <CardTitle>Optimization Suggestions</CardTitle>
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