import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const analyses = pgTable("analyses", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'keyword', 'content', 'seo-score', 'meta'
  title: text("title").notNull(),
  url: text("url"),
  content: text("content"),
  keywords: jsonb("keywords").$type<string[]>(),
  score: integer("score"),
  suggestions: jsonb("suggestions").$type<string[]>(),
  metaTags: jsonb("meta_tags").$type<{
    title: string;
    description: string;
    keywords: string;
  }>(),
  savedAt: timestamp("saved_at").defaultNow(),
});

export const insertAnalysisSchema = createInsertSchema(analyses).omit({
  id: true,
  savedAt: true,
});

export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;
export type Analysis = typeof analyses.$inferSelect;

export const keywordAnalysisSchema = insertAnalysisSchema.extend({
  type: z.literal("keyword"),
  url: z.string().url().optional(),
  content: z.string().optional(),
  keywords: z.array(z.string()).optional().default([]),
}).refine(data => data.url || data.content, {
  message: "Either URL or content must be provided"
});

export const contentAnalysisSchema = insertAnalysisSchema.extend({
  type: z.literal("content"),
  content: z.string().min(1),
  url: z.string().optional(),
});

export const seoScoreSchema = insertAnalysisSchema.extend({
  type: z.literal("seo-score"),
  url: z.string().url(),
});

export const metaGeneratorSchema = insertAnalysisSchema.extend({
  type: z.literal("meta"),
  content: z.string().min(1),
  metaTags: z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.string(),
  }),
});

export const competitorAnalysisSchema = insertAnalysisSchema.extend({
  type: z.literal("competitor"),
  competitorUrl: z.string().url(),
  metrics: z.object({
    traffic: z.number(),
    backlinks: z.number(),
    keywords: z.number(),
    domainAuthority: z.number(),
  }).optional(),
  topKeywords: z.array(z.string()).optional(),
});