import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull().default("planning"), // planning, active, completed, cancelled
  completionRate: real("completion_rate").default(0),
  budget: real("budget"),
  budgetUsed: real("budget_used").default(0),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

export const teamMembers = pgTable("team_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull(),
  avatar: text("avatar"),
  efficiency: real("efficiency").default(0),
  tasksCompleted: integer("tasks_completed").default(0),
  tasksAssigned: integer("tasks_assigned").default(0),
});

export const reports = pgTable("reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").references(() => events.id),
  title: text("title").notNull(),
  weekNumber: integer("week_number").notNull(),
  year: integer("year").notNull(),
  completionRate: real("completion_rate").notNull(),
  teamEfficiency: real("team_efficiency").notNull(),
  budgetUsage: real("budget_usage").notNull(),
  insights: jsonb("insights"),
  generatedAt: timestamp("generated_at").default(sql`now()`),
  pdfUrl: text("pdf_url"),
});

export const integrations = pgTable("integrations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // asana, trello, monday, slack
  status: text("status").notNull().default("disconnected"), // connected, disconnected, syncing, error
  apiKey: text("api_key"),
  webhook: text("webhook"),
  lastSync: timestamp("last_sync"),
  settings: jsonb("settings"),
});

export const aiInsights = pgTable("ai_insights", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // pattern, trend, risk, recommendation
  title: text("title").notNull(),
  description: text("description").notNull(),
  confidence: real("confidence").notNull(),
  priority: text("priority").notNull().default("medium"), // low, medium, high
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").default(sql`now()`),
  relatedEventId: varchar("related_event_id").references(() => events.id),
});

export const userBehavior = pgTable("user_behavior", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  action: text("action").notNull(),
  context: jsonb("context"),
  timestamp: timestamp("timestamp").default(sql`now()`),
  userId: text("user_id").notNull(),
});

// Insert schemas
export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({
  id: true,
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  generatedAt: true,
});

export const insertIntegrationSchema = createInsertSchema(integrations).omit({
  id: true,
  lastSync: true,
});

export const insertAIInsightSchema = createInsertSchema(aiInsights).omit({
  id: true,
  createdAt: true,
});

export const insertUserBehaviorSchema = createInsertSchema(userBehavior).omit({
  id: true,
  timestamp: true,
});

// Types
export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;

export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;

export type Integration = typeof integrations.$inferSelect;
export type InsertIntegration = z.infer<typeof insertIntegrationSchema>;

export type AIInsight = typeof aiInsights.$inferSelect;
export type InsertAIInsight = z.infer<typeof insertAIInsightSchema>;

export type UserBehavior = typeof userBehavior.$inferSelect;
export type InsertUserBehavior = z.infer<typeof insertUserBehaviorSchema>;
