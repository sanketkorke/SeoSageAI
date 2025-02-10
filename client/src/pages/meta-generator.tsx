import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { metaGeneratorSchema } from "@shared/schema";
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
import MetaPreview from "@/components/tools/meta-preview";
import { Loader2 } from "lucide-react";

type FormData = {
  title: string;
  content: string;
};

export default function MetaGenerator() {
  const { toast } = useToast();
  const [results, setResults] = useState<{
    title: string;
    description: string;
    keywords: string;
  }>();

  const form = useForm<FormData>({
    resolver: zodResolver(metaGeneratorSchema.omit({ type: true, metaTags: true })),
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await apiRequest("POST", "/api/generate/meta", {
        ...data,
        type: "meta",
      });
      return res.json();
    },
    onSuccess: (data) => {
      setResults(data.metaTags);
      toast({
        title: "Generation Complete",
        description: "Your meta tags have been generated and saved.",
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
        <h1 className="text-3xl font-bold">Meta Generator</h1>
        <p className="text-muted-foreground mt-2">
          Generate optimized meta tags for your content
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Content Input</CardTitle>
            <CardDescription>
              Enter your content to generate meta tags
            </CardDescription>
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
                        <Input placeholder="My Meta Tags" {...field} />
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
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your content here..."
                          className="h-48"
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
                  Generate
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {results && <MetaPreview {...results} />}
      </div>
    </div>
  );
}
