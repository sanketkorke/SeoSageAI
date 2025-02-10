import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import KeywordResearch from "@/pages/keyword-research";
import ContentAnalyzer from "@/pages/content-analyzer";
import SEOScore from "@/pages/seo-score";
import MetaGenerator from "@/pages/meta-generator";
import CompetitorAnalysis from "@/pages/competitor-analysis";
import Sidebar from "@/components/layout/sidebar";

function Router() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/keywords" component={KeywordResearch} />
          <Route path="/content" component={ContentAnalyzer} />
          <Route path="/seo-score" component={SEOScore} />
          <Route path="/meta" component={MetaGenerator} />
          <Route path="/competitor" component={CompetitorAnalysis} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;