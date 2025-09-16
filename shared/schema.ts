import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Core project entity
export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull().default("in_progress"), // in_progress, completed
  currentPhase: integer("current_phase").default(1), // 1-5 phases
  completionRate: real("completion_rate").default(0),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// Phase 1: Empathize - Empathy Maps
export const empathyMaps = pgTable("empathy_maps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id).notNull(),
  title: text("title").notNull(),
  says: jsonb("says").default([]), // Array of strings
  thinks: jsonb("thinks").default([]),
  does: jsonb("does").default([]),
  feels: jsonb("feels").default([]),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// Phase 1: Empathize - Personas
export const personas = pgTable("personas", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id).notNull(),
  name: text("name").notNull(),
  age: integer("age"),
  occupation: text("occupation"),
  bio: text("bio"),
  goals: jsonb("goals").default([]),
  frustrations: jsonb("frustrations").default([]),
  motivations: jsonb("motivations").default([]),
  techSavviness: text("tech_savviness"), // low, medium, high
  avatar: text("avatar"),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// Phase 1: Empathize - User Interviews
export const interviews = pgTable("interviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id).notNull(),
  participantName: text("participant_name").notNull(),
  date: timestamp("date").notNull(),
  duration: integer("duration"), // minutes
  questions: jsonb("questions").default([]),
  responses: jsonb("responses").default([]),
  insights: text("insights"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Phase 1: Empathize - Field Observations
export const observations = pgTable("observations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id).notNull(),
  location: text("location").notNull(),
  context: text("context").notNull(),
  behavior: text("behavior").notNull(),
  insights: text("insights"),
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Phase 2: Define - POV Statements
export const povStatements = pgTable("pov_statements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id).notNull(),
  user: text("user").notNull(), // user description
  need: text("need").notNull(), // user need
  insight: text("insight").notNull(), // surprising insight
  statement: text("statement").notNull(), // complete POV statement
  priority: text("priority").default("medium"), // low, medium, high
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Phase 2: Define - How Might We questions
export const hmwQuestions = pgTable("hmw_questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id).notNull(),
  question: text("question").notNull(),
  context: text("context"),
  challenge: text("challenge"),
  scope: text("scope").default("product"), // feature, product, service, experience, process
  priority: text("priority").default("medium"), // low, medium, high
  category: text("category"), // categorization
  votes: integer("votes").default(0),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Phase 3: Ideate - Ideas
export const ideas = pgTable("ideas", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category"),
  feasibility: integer("feasibility"), // 1-5 scale
  impact: integer("impact"), // 1-5 scale
  votes: integer("votes").default(0),
  status: text("status").default("idea"), // idea, selected, prototype, tested
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Phase 4: Prototype - Prototypes
export const prototypes = pgTable("prototypes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id).notNull(),
  ideaId: varchar("idea_id").references(() => ideas.id),
  name: text("name").notNull(),
  type: text("type").notNull(), // paper, digital, physical, storyboard
  description: text("description").notNull(),
  materials: jsonb("materials").default([]),
  images: jsonb("images").default([]),
  version: integer("version").default(1),
  feedback: text("feedback"),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// Phase 5: Test - Test Plans
export const testPlans = pgTable("test_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id).notNull(),
  prototypeId: varchar("prototype_id").references(() => prototypes.id),
  name: text("name").notNull(),
  objective: text("objective").notNull(),
  methodology: text("methodology").notNull(),
  participants: integer("participants").notNull(),
  duration: integer("duration"), // minutes
  tasks: jsonb("tasks").default([]),
  metrics: jsonb("metrics").default([]),
  status: text("status").default("planned"), // planned, running, completed
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Phase 5: Test - Test Results
export const testResults = pgTable("test_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  testPlanId: varchar("test_plan_id").references(() => testPlans.id).notNull(),
  participantId: text("participant_id").notNull(),
  taskResults: jsonb("task_results").default([]),
  feedback: text("feedback"),
  successRate: real("success_rate"),
  completionTime: integer("completion_time"), // minutes
  insights: text("insights"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// User Progress and Gamification
export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  projectId: varchar("project_id").references(() => projects.id).notNull(),
  phase: integer("phase").notNull(), // 1-5
  completedTools: jsonb("completed_tools").default([]),
  badges: jsonb("badges").default([]),
  points: integer("points").default(0),
  timeSpent: integer("time_spent").default(0), // minutes
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// Insert schemas
export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEmpathyMapSchema = createInsertSchema(empathyMaps).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPersonaSchema = createInsertSchema(personas).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInterviewSchema = createInsertSchema(interviews).omit({
  id: true,
  createdAt: true,
});

export const insertObservationSchema = createInsertSchema(observations).omit({
  id: true,
  createdAt: true,
});

export const insertPovStatementSchema = createInsertSchema(povStatements).omit({
  id: true,
  createdAt: true,
});

export const insertHmwQuestionSchema = createInsertSchema(hmwQuestions).omit({
  id: true,
  createdAt: true,
});

export const insertIdeaSchema = createInsertSchema(ideas).omit({
  id: true,
  createdAt: true,
});

export const insertPrototypeSchema = createInsertSchema(prototypes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTestPlanSchema = createInsertSchema(testPlans).omit({
  id: true,
  createdAt: true,
});

export const insertTestResultSchema = createInsertSchema(testResults).omit({
  id: true,
  createdAt: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  updatedAt: true,
});

// Types
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type EmpathyMap = typeof empathyMaps.$inferSelect;
export type InsertEmpathyMap = z.infer<typeof insertEmpathyMapSchema>;

export type Persona = typeof personas.$inferSelect;
export type InsertPersona = z.infer<typeof insertPersonaSchema>;

export type Interview = typeof interviews.$inferSelect;
export type InsertInterview = z.infer<typeof insertInterviewSchema>;

export type Observation = typeof observations.$inferSelect;
export type InsertObservation = z.infer<typeof insertObservationSchema>;

export type PovStatement = typeof povStatements.$inferSelect;
export type InsertPovStatement = z.infer<typeof insertPovStatementSchema>;

export type HmwQuestion = typeof hmwQuestions.$inferSelect;
export type InsertHmwQuestion = z.infer<typeof insertHmwQuestionSchema>;

export type Idea = typeof ideas.$inferSelect;
export type InsertIdea = z.infer<typeof insertIdeaSchema>;

export type Prototype = typeof prototypes.$inferSelect;
export type InsertPrototype = z.infer<typeof insertPrototypeSchema>;

export type TestPlan = typeof testPlans.$inferSelect;
export type InsertTestPlan = z.infer<typeof insertTestPlanSchema>;

export type TestResult = typeof testResults.$inferSelect;
export type InsertTestResult = z.infer<typeof insertTestResultSchema>;

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;