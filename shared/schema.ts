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

// Users for authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  password: text("password").notNull(), // hashed password
  role: text("role").notNull().default("user"), // admin, user
  company: text("company"),
  jobRole: text("job_role"),
  industry: text("industry"),
  experience: text("experience"),
  country: text("country"),
  state: text("state"),
  city: text("city"),
  zipCode: text("zip_code"),
  phone: text("phone"),
  bio: text("bio"),
  profilePicture: text("profile_picture"),
  interests: jsonb("interests").default([]),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  subscriptionPlanId: varchar("subscription_plan_id"),
  subscriptionStatus: text("subscription_status").default("active"), // active, canceled, expired, trialing
  subscriptionEndDate: timestamp("subscription_end_date"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Subscription Plans
export const subscriptionPlans = pgTable("subscription_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  displayName: text("display_name").notNull(),
  description: text("description"),
  priceMonthly: integer("price_monthly").notNull(), // in cents
  priceYearly: integer("price_yearly").notNull(), // in cents
  stripePriceIdMonthly: text("stripe_price_id_monthly"),
  stripePriceIdYearly: text("stripe_price_id_yearly"),
  maxProjects: integer("max_projects"), // null for unlimited
  maxPersonasPerProject: integer("max_personas_per_project"), // null for unlimited
  maxUsersPerTeam: integer("max_users_per_team"), // null for unlimited
  aiChatLimit: integer("ai_chat_limit"), // null for unlimited
  libraryArticlesCount: integer("library_articles_count"), // null for all articles
  features: jsonb("features").default([]), // Array of feature strings
  exportFormats: jsonb("export_formats").default([]), // Array of export formats (pdf, png, csv)
  hasCollaboration: boolean("has_collaboration").default(false),
  hasPermissionManagement: boolean("has_permission_management").default(false),
  hasSharedWorkspace: boolean("has_shared_workspace").default(false),
  hasCommentsAndFeedback: boolean("has_comments_and_feedback").default(false),
  hasSso: boolean("has_sso").default(false),
  hasCustomApi: boolean("has_custom_api").default(false),
  hasCustomIntegrations: boolean("has_custom_integrations").default(false),
  has24x7Support: boolean("has_24x7_support").default(false),
  order: integer("order").default(0), // for display ordering
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// User Subscriptions History
export const userSubscriptions = pgTable("user_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  planId: varchar("plan_id").references(() => subscriptionPlans.id).notNull(),
  stripeSubscriptionId: text("stripe_subscription_id"),
  status: text("status").notNull(), // active, canceled, expired, trialing, incomplete
  billingPeriod: text("billing_period").notNull(), // monthly, yearly
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// Articles for Design Thinking library
export const articles = pgTable("articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(), // empathize, define, ideate, prototype, test
  author: text("author").notNull(),
  description: text("description"),
  tags: jsonb("tags").default([]), // Array of tags
  published: boolean("published").default(true),
  createdAt: timestamp("created_at").default(sql`now()`),
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

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSubscriptionPlanSchema = createInsertSchema(subscriptionPlans).omit({
  id: true,
  createdAt: true,
});

export const insertUserSubscriptionSchema = createInsertSchema(userSubscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Profile update schema - excludes sensitive fields
export const updateProfileSchema = createInsertSchema(users).omit({
  id: true,
  username: true,
  password: true,
  role: true,
  stripeCustomerId: true,
  stripeSubscriptionId: true,
  subscriptionPlanId: true,
  subscriptionStatus: true,
  subscriptionEndDate: true,
  createdAt: true,
}).extend({
  profilePicture: z.string().optional(), // Add profile picture field
}).transform((data) => ({
  ...data,
  // Transform null values to empty strings for better form handling
  name: data.name || "",
  email: data.email || "",
  bio: data.bio || "",
  company: data.company || "",
  jobRole: data.jobRole || "",
  industry: data.industry || "",
  experience: data.experience || "",
  country: data.country || "",
  state: data.state || "",
  city: data.city || "",
  zipCode: data.zipCode || "",
  phone: data.phone || "",
  profilePicture: data.profilePicture || "",
}));

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

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Article = typeof articles.$inferSelect;
export type InsertArticle = z.infer<typeof insertArticleSchema>;

export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type InsertSubscriptionPlan = z.infer<typeof insertSubscriptionPlanSchema>;

export type UserSubscription = typeof userSubscriptions.$inferSelect;
export type InsertUserSubscription = z.infer<typeof insertUserSubscriptionSchema>;

export type UpdateProfile = z.infer<typeof updateProfileSchema>;

// AI Analysis Types
export interface ProjectAnalysisData {
  project: Project;
  empathyMaps: EmpathyMap[];
  personas: Persona[];
  interviews: Interview[];
  observations: Observation[];
  povStatements: PovStatement[];
  hmwQuestions: HmwQuestion[];
  ideas: Idea[];
  prototypes: Prototype[];
  testPlans: TestPlan[];
  testResults: TestResult[];
}

export interface PhaseAnalysis {
  phase: number;
  phaseName: string;
  completeness: number;
  quality: number;
  insights: string[];
  gaps: string[];
  recommendations: string[];
  strengths: string[];
}

export interface AIProjectAnalysis {
  executiveSummary: string;
  maturityScore: number;
  overallInsights: string[];
  attentionPoints: string[];
  priorityNextSteps: string[];
  phaseAnalyses: PhaseAnalysis[];
  consistency: {
    score: number;
    issues: string[];
    strengths: string[];
  };
  alignment: {
    problemSolutionAlignment: number;
    researchInsightsAlignment: number;
    comments: string[];
  };
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
}