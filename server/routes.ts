import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeKeywords, analyzeSEOScore, generateMetaTags, analyzeCompetitor } from "./openai";
import {
  keywordAnalysisSchema,
  contentAnalysisSchema,
  seoScoreSchema,
  metaGeneratorSchema,
  competitorAnalysisSchema,
} from "@shared/schema";
import { ZodError } from "zod";

export function registerRoutes(app: Express): Server {
  app.post("/api/analyze/keywords", async (req, res) => {
    try {
      const data = keywordAnalysisSchema.parse(req.body);
      const analysis = await analyzeKeywords(data.content || data.url || "");
      const saved = await storage.saveAnalysis({
        ...data,
        ...analysis,
      });
      res.json(saved);
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unknown error occurred";
      res.status(400).json({ error: message });
    }
  });

  app.post("/api/analyze/content", async (req, res) => {
    try {
      const data = contentAnalysisSchema.parse(req.body);
      const analysis = await analyzeSEOScore(data.content);
      const saved = await storage.saveAnalysis({
        ...data,
        ...analysis,
      });
      res.json(saved);
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unknown error occurred";
      res.status(400).json({ error: message });
    }
  });

  app.post("/api/analyze/seo-score", async (req, res) => {
    try {
      const data = seoScoreSchema.parse(req.body);
      const analysis = await analyzeSEOScore(data.url);
      const saved = await storage.saveAnalysis({
        ...data,
        ...analysis,
      });
      res.json(saved);
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unknown error occurred";
      res.status(400).json({ error: message });
    }
  });

  app.post("/api/generate/meta", async (req, res) => {
    try {
      const data = metaGeneratorSchema.parse(req.body);
      const metaTags = await generateMetaTags(data.content);
      const saved = await storage.saveAnalysis({
        ...data,
        metaTags,
      });
      res.json(saved);
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unknown error occurred";
      res.status(400).json({ error: message });
    }
  });

  app.get("/api/analyses", async (_req, res) => {
    try {
      const analyses = await storage.listAnalyses();
      res.json(analyses);
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unknown error occurred";
      res.status(500).json({ error: message });
    }
  });

  app.get("/api/analyses/:id", async (req, res) => {
    try {
      const analysis = await storage.getAnalysis(Number(req.params.id));
      if (!analysis) {
        res.status(404).json({ error: "Analysis not found" });
        return;
      }
      res.json(analysis);
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unknown error occurred";
      res.status(500).json({ error: message });
    }
  });

  app.delete("/api/analyses/:id", async (req, res) => {
    try {
      await storage.deleteAnalysis(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unknown error occurred";
      res.status(500).json({ error: message });
    }
  });

  app.post("/api/analyze/competitor", async (req, res) => {
    try {
      const data = competitorAnalysisSchema.parse(req.body);
      const analysis = await analyzeCompetitor(data.competitorUrl);
      const saved = await storage.saveAnalysis({
        ...data,
        ...analysis,
      });
      res.json(saved);
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unknown error occurred";
      res.status(400).json({ error: message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}