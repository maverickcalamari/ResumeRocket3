import { pgTable, text, serial, integer, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const resumes = pgTable("resumes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  filename: text("filename").notNull(),
  originalContent: text("original_content").notNull(),
  industry: text("industry").notNull(),
  atsScore: integer("ats_score"),
  analysis: json("analysis").$type<ResumeAnalysis>(),
  suggestions: json("suggestions").$type<ResumeSuggestion[]>(),
  skillsGap: json("skills_gap").$type<SkillGap[]>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userStats = pgTable("user_stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  resumesAnalyzed: integer("resumes_analyzed").default(0),
  avgScore: integer("avg_score").default(0),
  interviews: integer("interviews").default(0),
});

// Types for analysis data
export interface ResumeAnalysis {
  score: number;
  strengths: string[];
  improvements: string[];
  keywordMatch: number;
  formatting: number;
  content: number;
  employmentGaps?: EmploymentGap[];
}

export interface ResumeSuggestion {
  id: number;
  type: 'keywords' | 'quantify' | 'section' | 'formatting' | 'employment_gap' | 'template';
  title: string;
  description: string;
  keywords?: string[];
  priority: 'high' | 'medium' | 'low';
}

export interface SkillGap {
  skill: string;
  currentLevel: number;
  targetLevel: number;
  importance: number;
}

export interface EmploymentGap {
  startDate: string;
  endDate: string;
  duration: number; // in months
  severity: 'minor' | 'moderate' | 'significant';
  recommendations: string[];
}

export interface ResumeTemplate {
  id: string;
  industry: string;
  name: string;
  description: string;
  sections: TemplateSection[];
  keywords: string[];
  formatting: TemplateFormatting;
}

export interface TemplateSection {
  name: string;
  required: boolean;
  order: number;
  content: string;
  tips: string[];
}

export interface TemplateFormatting {
  font: string;
  fontSize: string;
  margins: string;
  spacing: string;
  bulletStyle: string;
}

export const insertResumeSchema = createInsertSchema(resumes).omit({
  id: true,
  createdAt: true,
});

export const insertUserStatsSchema = createInsertSchema(userStats).omit({
  id: true,
});

export type InsertResume = z.infer<typeof insertResumeSchema>;
export type Resume = typeof resumes.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type UserStats = typeof userStats.$inferSelect;

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});
