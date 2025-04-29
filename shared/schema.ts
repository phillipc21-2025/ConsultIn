import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  title: text("title"),
  company: text("company"),
  profileImage: text("profile_image"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  title: true,
  company: true,
  profileImage: true,
});

// Business Problem schema
export const businessProblems = pgTable("business_problems", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  problem: text("problem").notNull(),
  solution: jsonb("solution"),
  createdAt: text("created_at").notNull(),
});

export const insertBusinessProblemSchema = createInsertSchema(businessProblems).pick({
  userId: true,
  problem: true,
  solution: true,
  createdAt: true,
});

// Expert schema
export const experts = pgTable("experts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  company: text("company"),
  profileImage: text("profile_image"),
  connections: integer("connections"),
  experience: text("experience"),
});

export const insertExpertSchema = createInsertSchema(experts).pick({
  name: true,
  title: true,
  company: true,
  profileImage: true,
  connections: true,
  experience: true,
});

// Conversation schema
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  authorName: text("author_name").notNull(),
  authorTitle: text("author_title").notNull(),
  authorImage: text("author_image"),
  content: text("content").notNull(),
  postedTime: text("posted_time").notNull(),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
});

export const insertConversationSchema = createInsertSchema(conversations).pick({
  authorName: true,
  authorTitle: true,
  authorImage: true,
  content: true,
  postedTime: true,
  likes: true,
  comments: true,
});

// Talent schema
export const talents = pgTable("talents", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  profileImage: text("profile_image"),
  location: text("location"),
  availability: text("availability"),
});

export const insertTalentSchema = createInsertSchema(talents).pick({
  name: true,
  title: true,
  profileImage: true,
  location: true,
  availability: true,
});

// Training schema
export const trainings = pgTable("trainings", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  provider: text("provider").notNull(),
  duration: text("duration"),
  thumbnail: text("thumbnail"),
  description: text("description"),
  rating: text("rating"),
  reviewCount: integer("review_count"),
});

export const insertTrainingSchema = createInsertSchema(trainings).pick({
  title: true,
  provider: true,
  duration: true,
  thumbnail: true,
  description: true,
  rating: true,
  reviewCount: true,
});

// Service schema
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon"),
  usageStats: text("usage_stats"),
  pricing: text("pricing"),
});

export const insertServiceSchema = createInsertSchema(services).pick({
  name: true,
  description: true,
  icon: true,
  usageStats: true,
  pricing: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertBusinessProblem = z.infer<typeof insertBusinessProblemSchema>;
export type BusinessProblem = typeof businessProblems.$inferSelect;

export type InsertExpert = z.infer<typeof insertExpertSchema>;
export type Expert = typeof experts.$inferSelect;

export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;

export type InsertTalent = z.infer<typeof insertTalentSchema>;
export type Talent = typeof talents.$inferSelect;

export type InsertTraining = z.infer<typeof insertTrainingSchema>;
export type Training = typeof trainings.$inferSelect;

export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

// Step response type for the process breakdown
export interface ProcessStep {
  id: number;
  title: string;
  description: string;
  solution: string;
  resources?: {
    experts?: Expert[];
    conversations?: Conversation[];
    talents?: Talent[];
    trainings?: Training[];
    services?: Service[];
  };
}

// Solution response type from OpenAI
export interface SolutionResponse {
  analysis: string;
  experts: Expert[];
  conversations: Conversation[];
  talents: Talent[];
  trainings: Training[];
  services: Service[];
  processSteps: ProcessStep[];
}
