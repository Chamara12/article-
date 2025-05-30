import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  date: text("date").notNull(),
  wordCount: integer("word_count").notNull(),
  primaryKeyword: text("primary_keyword").notNull(),
  secondaryKeywords: text("secondary_keywords"),
  tone: text("tone").notNull(),
  model: text("model").notNull(),
  pov: text("pov").notNull(),
  targetAudience: text("target_audience"),
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
});

// Define a type-safe schema for our MongoDB Article objects
export const articleSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  date: z.string(),
  wordCount: z.number(),
  primaryKeyword: z.string(),
  secondaryKeywords: z.string().nullable(),
  tone: z.string(),
  model: z.string(),
  pov: z.string(),
  targetAudience: z.string().nullable()
});

export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = z.infer<typeof articleSchema>;
