import { analyses, type Analysis, type InsertAnalysis } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  saveAnalysis(analysis: InsertAnalysis): Promise<Analysis>;
  getAnalysis(id: number): Promise<Analysis | undefined>;
  listAnalyses(): Promise<Analysis[]>;
  deleteAnalysis(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async saveAnalysis(analysis: InsertAnalysis): Promise<Analysis> {
    const [saved] = await db.insert(analyses).values(analysis).returning();
    return saved;
  }

  async getAnalysis(id: number): Promise<Analysis | undefined> {
    const [analysis] = await db.select().from(analyses).where(eq(analyses.id, id));
    return analysis;
  }

  async listAnalyses(): Promise<Analysis[]> {
    return await db.select().from(analyses);
  }

  async deleteAnalysis(id: number): Promise<void> {
    await db.delete(analyses).where(eq(analyses.id, id));
  }
}

export const storage = new DatabaseStorage();