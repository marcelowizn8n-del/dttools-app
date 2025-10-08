var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/geminiService.ts
var geminiService_exports = {};
__export(geminiService_exports, {
  DesignThinkingGeminiAI: () => DesignThinkingGeminiAI,
  designThinkingGeminiAI: () => designThinkingGeminiAI
});
import { GoogleGenAI } from "@google/genai";
var ai, DesignThinkingGeminiAI, designThinkingGeminiAI;
var init_geminiService = __esm({
  "server/geminiService.ts"() {
    "use strict";
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
    DesignThinkingGeminiAI = class {
      model = "gemini-2.5-flash";
      async chat(message, context) {
        try {
          const systemPrompt = this.buildSystemPrompt(context);
          const prompt = `${systemPrompt}

User: ${message}

Assistant:`;
          const response = await ai.models.generateContent({
            model: this.model,
            contents: prompt
          });
          return response.text || "Desculpe, n\xE3o consegui processar sua mensagem no momento.";
        } catch (error) {
          console.error("Erro no chat da IA Gemini:", error);
          throw new Error("Erro ao processar sua mensagem. Verifique se a chave da API Gemini est\xE1 configurada corretamente.");
        }
      }
      async generateSuggestions(context) {
        try {
          const prompt = this.buildSuggestionsPrompt(context);
          const response = await ai.models.generateContent({
            model: this.model,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: "object",
                properties: {
                  suggestions: {
                    type: "array",
                    items: { type: "string" },
                    minItems: 3,
                    maxItems: 5
                  }
                },
                required: ["suggestions"]
              }
            },
            contents: prompt
          });
          const result = JSON.parse(response.text || "{}");
          return result.suggestions || [
            "Como podemos entender melhor nossos usu\xE1rios?",
            "Que problemas estamos tentando resolver?",
            "Quais s\xE3o as principais necessidades identificadas?"
          ];
        } catch (error) {
          console.error("Erro ao gerar sugest\xF5es:", error);
          return [
            "Como podemos entender melhor nossos usu\xE1rios?",
            "Que problemas estamos tentando resolver?",
            "Quais s\xE3o as principais necessidades identificadas?"
          ];
        }
      }
      buildSystemPrompt(context) {
        const phaseNames = {
          1: "Empatizar",
          2: "Definir",
          3: "Idear",
          4: "Prototipar",
          5: "Testar"
        };
        const currentPhase = phaseNames[context.currentPhase] || "Desconhecida";
        return `Voc\xEA \xE9 um especialista em Design Thinking e facilitador de inova\xE7\xE3o. 
Voc\xEA est\xE1 ajudando com um projeto chamado "${context.projectName}" na fase de ${currentPhase}.

Contexto do projeto:
- Fase atual: ${currentPhase} (${context.currentPhase}/5)
- Descri\xE7\xE3o: ${context.projectDescription}
- Personas criadas: ${context.personas?.length || 0}
- Mapas de empatia: ${context.empathyMaps?.length || 0}  
- Ideias geradas: ${context.ideas?.length || 0}
- Prot\xF3tipos: ${context.prototypes?.length || 0}

Diretrizes:
- Seja pr\xE1tico e focado na metodologia de Design Thinking
- Fa\xE7a perguntas que estimulem o pensamento criativo
- Sugira atividades espec\xEDficas para a fase atual
- Mantenha o foco no usu\xE1rio final
- Responda em portugu\xEAs brasileiro
- Use uma linguagem acess\xEDvel e motivadora
- Limite respostas a 150 palavras quando poss\xEDvel`;
      }
      buildSuggestionsPrompt(context) {
        const phasePrompts = {
          1: "Gere 4 sugest\xF5es de perguntas para a fase Empatizar, focando em entender o usu\xE1rio:",
          2: "Gere 4 sugest\xF5es de perguntas para a fase Definir, focando em sintetizar insights:",
          3: "Gere 4 sugest\xF5es de perguntas para a fase Idear, focando em gerar solu\xE7\xF5es criativas:",
          4: "Gere 4 sugest\xF5es de perguntas para a fase Prototipar, focando em materializar ideias:",
          5: "Gere 4 sugest\xF5es de perguntas para a fase Testar, focando em validar solu\xE7\xF5es:"
        };
        const phasePrompt = phasePrompts[context.currentPhase] || phasePrompts[1];
        return `${phasePrompt}

Projeto: ${context.projectName || "Projeto de Design Thinking"}
Descri\xE7\xE3o: ${context.projectDescription || "Desenvolvimento de solu\xE7\xF5es centradas no usu\xE1rio"}

Retorne apenas um JSON com o array "suggestions" contendo 4 perguntas curtas e pr\xE1ticas em portugu\xEAs brasileiro.
Exemplo: {"suggestions": ["Como podemos...", "O que aconteceria se...", "Quais s\xE3o...", "Por que nossos usu\xE1rios..."]}`;
      }
      async generateBenchmarkingRecommendations(data) {
        try {
          const prompt = this.buildBenchmarkingPrompt(data);
          const response = await ai.models.generateContent({
            model: this.model,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: "object",
                properties: {
                  overallAssessment: { type: "string" },
                  keyInsights: {
                    type: "array",
                    items: { type: "string" },
                    minItems: 3,
                    maxItems: 5
                  },
                  actionableRecommendations: {
                    type: "array",
                    items: { type: "string" },
                    minItems: 4,
                    maxItems: 6
                  },
                  competitiveAdvantages: {
                    type: "array",
                    items: { type: "string" },
                    minItems: 2,
                    maxItems: 4
                  },
                  improvementAreas: {
                    type: "array",
                    items: { type: "string" },
                    minItems: 2,
                    maxItems: 4
                  },
                  nextSteps: {
                    type: "array",
                    items: { type: "string" },
                    minItems: 3,
                    maxItems: 5
                  }
                },
                required: ["overallAssessment", "keyInsights", "actionableRecommendations", "competitiveAdvantages", "improvementAreas", "nextSteps"]
              }
            },
            contents: prompt
          });
          const result = JSON.parse(response.text || "{}");
          return result || this.getFallbackBenchmarkingRecommendations();
        } catch (error) {
          console.error("Erro ao gerar recomenda\xE7\xF5es de benchmarking:", error);
          return this.getFallbackBenchmarkingRecommendations();
        }
      }
      buildBenchmarkingPrompt(data) {
        const dvfAverage = data.dvfAssessments?.length ? data.dvfAssessments.reduce((acc, curr) => acc + curr.overallScore, 0) / data.dvfAssessments.length : 0;
        const lovabilityScore = data.lovabilityMetrics?.overallLovabilityScore || 0;
        const projectSuccess = data.projectAnalytics?.overallSuccess || 0;
        const competitivenessAverage = data.competitiveAnalysis?.length ? data.competitiveAnalysis.reduce((acc, curr) => acc + curr.competitivenessScore, 0) / data.competitiveAnalysis.length : 0;
        return `Voc\xEA \xE9 um consultor s\xEAnior especializado em Design Thinking e an\xE1lise competitiva. Analise os dados de benchmarking abaixo e forne\xE7a recomenda\xE7\xF5es estrat\xE9gicas personalizadas.

DADOS DO PROJETO:
Projeto: ${data.projectName}
Descri\xE7\xE3o: ${data.projectDescription || "N\xE3o informado"}
Ind\xFAstria: ${data.industry || "N\xE3o informado"}
Tamanho da empresa: ${data.companySize || "N\xE3o informado"}

AN\xC1LISE DVF (Desejabilidade, Viabilidade, Exequibilidade):
Score m\xE9dio: ${dvfAverage.toFixed(1)}/10
Avalia\xE7\xF5es realizadas: ${data.dvfAssessments?.length || 0}
${data.dvfAssessments?.map((a) => `- Score: ${a.overallScore}/10, Recomenda\xE7\xE3o: ${a.recommendation}`).join("\n") || "Nenhuma avalia\xE7\xE3o DVF"}

M\xC9TRICAS DE LOVABILITY:
Score geral: ${lovabilityScore.toFixed(1)}/10
NPS: ${data.lovabilityMetrics?.npsScore || 0}
Satisfa\xE7\xE3o: ${data.lovabilityMetrics?.satisfactionScore || 0}/10
Engajamento: ${data.lovabilityMetrics?.engagementRate || 0}%

ANALYTICS DO PROJETO:
Taxa de conclus\xE3o: ${data.projectAnalytics?.completionRate || 0}%
Tempo total investido: ${data.projectAnalytics?.totalTimeSpent || 0} horas
Tamanho da equipe: ${data.projectAnalytics?.teamSize || 1} pessoas
N\xEDvel de inova\xE7\xE3o: ${data.projectAnalytics?.innovationLevel || 0}/5
Success geral: ${projectSuccess}%
Ferramentas top: ${data.projectAnalytics?.topPerformingTools?.join(", ") || "Nenhuma"}
Gargalos de tempo: ${data.projectAnalytics?.timeBottlenecks?.join(", ") || "Nenhum"}

AN\xC1LISE COMPETITIVA:
Score m\xE9dio de competitividade: ${competitivenessAverage.toFixed(1)}/10
Concorrentes analisados: ${data.competitiveAnalysis?.length || 0}
${data.competitiveAnalysis?.map(
          (c) => `- ${c.competitorName} (${c.competitorType}, ${c.marketPosition}): Score ${c.competitivenessScore}/10`
        ).join("\n") || "Nenhuma an\xE1lise competitiva"}

INSTRU\xC7\xD5ES:
1. Fa\xE7a uma avalia\xE7\xE3o geral do estado do projeto considerando todos os aspectos
2. Identifique insights-chave baseados nos dados cruzados
3. Forne\xE7a recomenda\xE7\xF5es acion\xE1veis e espec\xEDficas
4. Liste vantagens competitivas identificadas
5. Destaque \xE1reas priorit\xE1rias de melhoria
6. Sugira pr\xF3ximos passos concretos

Foque em:
- Correla\xE7\xF5es entre m\xE9tricas
- Gaps de performance
- Oportunidades competitivas
- Recomenda\xE7\xF5es pr\xE1ticas e espec\xEDficas
- Pr\xF3ximos passos com timeframe

Responda em portugu\xEAs brasileiro, sendo direto e orientado a resultados.`;
      }
      getFallbackBenchmarkingRecommendations() {
        return {
          overallAssessment: "An\xE1lise de benchmarking em andamento. Dados insuficientes para avalia\xE7\xE3o completa.",
          keyInsights: [
            "Necess\xE1rio coletar mais dados de benchmarking",
            "Implementar avalia\xE7\xF5es DVF regulares",
            "Monitorar m\xE9tricas de lovability"
          ],
          actionableRecommendations: [
            "Conduzir avalia\xE7\xE3o DVF completa",
            "Implementar coleta sistem\xE1tica de feedback",
            "Realizar an\xE1lise competitiva detalhada",
            "Definir KPIs espec\xEDficos de projeto"
          ],
          competitiveAdvantages: [
            "Metodologia estruturada de Design Thinking",
            "Foco em dados e evid\xEAncias"
          ],
          improvementAreas: [
            "Coleta de dados mais robusta",
            "An\xE1lise competitiva regular"
          ],
          nextSteps: [
            "Completar avalia\xE7\xE3o DVF",
            "Implementar sistema de m\xE9tricas",
            "Agendar revis\xE3o mensal de benchmarks"
          ]
        };
      }
    };
    designThinkingGeminiAI = new DesignThinkingGeminiAI();
  }
});

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path2 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default;
var init_vite_config = __esm({
  async "vite.config.ts"() {
    "use strict";
    vite_config_default = defineConfig({
      plugins: [
        react(),
        runtimeErrorOverlay(),
        ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
          await import("@replit/vite-plugin-cartographer").then(
            (m) => m.cartographer()
          ),
          await import("@replit/vite-plugin-dev-banner").then(
            (m) => m.devBanner()
          )
        ] : []
      ],
      resolve: {
        alias: {
          "@": path2.resolve(import.meta.dirname, "client", "src"),
          "@shared": path2.resolve(import.meta.dirname, "shared"),
          "@assets": path2.resolve(import.meta.dirname, "attached_assets")
        }
      },
      root: path2.resolve(import.meta.dirname, "client"),
      build: {
        outDir: path2.resolve(import.meta.dirname, "client/dist"),
        emptyOutDir: true
      },
      server: {
        fs: {
          strict: true,
          deny: ["**/.*"]
        }
      }
    });
  }
});

// server/vite.ts
var vite_exports = {};
__export(vite_exports, {
  log: () => log,
  serveStatic: () => serveStatic,
  setupVite: () => setupVite
});
import express from "express";
import fs2 from "fs";
import path3 from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { nanoid } from "nanoid";
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}
var viteLogger;
var init_vite = __esm({
  async "server/vite.ts"() {
    "use strict";
    await init_vite_config();
    viteLogger = createLogger();
  }
});

// server/index.ts
import express2 from "express";
import session from "express-session";
import MemoryStore from "memorystore";
import ConnectPgSimple from "connect-pg-simple";

// server/routes.ts
import { createServer } from "http";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  articles: () => articles,
  benchmarkAssessments: () => benchmarkAssessments,
  benchmarks: () => benchmarks,
  canvasDrawings: () => canvasDrawings,
  competitiveAnalysis: () => competitiveAnalysis,
  dvfAssessments: () => dvfAssessments,
  empathyMaps: () => empathyMaps,
  helpArticles: () => helpArticles,
  hmwQuestions: () => hmwQuestions,
  ideas: () => ideas,
  insertArticleSchema: () => insertArticleSchema,
  insertBenchmarkAssessmentSchema: () => insertBenchmarkAssessmentSchema,
  insertBenchmarkSchema: () => insertBenchmarkSchema,
  insertCanvasDrawingSchema: () => insertCanvasDrawingSchema,
  insertCompetitiveAnalysisSchema: () => insertCompetitiveAnalysisSchema,
  insertDvfAssessmentSchema: () => insertDvfAssessmentSchema,
  insertEmpathyMapSchema: () => insertEmpathyMapSchema,
  insertHelpArticleSchema: () => insertHelpArticleSchema,
  insertHmwQuestionSchema: () => insertHmwQuestionSchema,
  insertIdeaSchema: () => insertIdeaSchema,
  insertInterviewSchema: () => insertInterviewSchema,
  insertLovabilityMetricSchema: () => insertLovabilityMetricSchema,
  insertObservationSchema: () => insertObservationSchema,
  insertPersonaSchema: () => insertPersonaSchema,
  insertPhaseCardSchema: () => insertPhaseCardSchema,
  insertPovStatementSchema: () => insertPovStatementSchema,
  insertProjectAnalyticsSchema: () => insertProjectAnalyticsSchema,
  insertProjectBackupSchema: () => insertProjectBackupSchema,
  insertProjectSchema: () => insertProjectSchema,
  insertPrototypeSchema: () => insertPrototypeSchema,
  insertSubscriptionPlanSchema: () => insertSubscriptionPlanSchema,
  insertTestPlanSchema: () => insertTestPlanSchema,
  insertTestResultSchema: () => insertTestResultSchema,
  insertUserProgressSchema: () => insertUserProgressSchema,
  insertUserSchema: () => insertUserSchema,
  insertUserSubscriptionSchema: () => insertUserSubscriptionSchema,
  interviews: () => interviews,
  lovabilityMetrics: () => lovabilityMetrics,
  observations: () => observations,
  personas: () => personas,
  phaseCards: () => phaseCards,
  povStatements: () => povStatements,
  projectAnalytics: () => projectAnalytics,
  projectBackups: () => projectBackups,
  projects: () => projects,
  prototypes: () => prototypes,
  subscriptionPlans: () => subscriptionPlans,
  testPlans: () => testPlans,
  testResults: () => testResults,
  updateProfileSchema: () => updateProfileSchema,
  userProgress: () => userProgress,
  userSubscriptions: () => userSubscriptions,
  users: () => users
});
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull().default("in_progress"),
  // in_progress, completed
  currentPhase: integer("current_phase").default(1),
  // 1-5 phases
  completionRate: real("completion_rate").default(0),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`)
});
var empathyMaps = pgTable("empathy_maps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id).notNull(),
  title: text("title").notNull(),
  says: jsonb("says").default([]),
  // Array of strings
  thinks: jsonb("thinks").default([]),
  does: jsonb("does").default([]),
  feels: jsonb("feels").default([]),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`)
});
var personas = pgTable("personas", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id).notNull(),
  name: text("name").notNull(),
  age: integer("age"),
  occupation: text("occupation"),
  bio: text("bio"),
  goals: jsonb("goals").default([]),
  frustrations: jsonb("frustrations").default([]),
  motivations: jsonb("motivations").default([]),
  techSavviness: text("tech_savviness"),
  // low, medium, high
  avatar: text("avatar"),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`)
});
var interviews = pgTable("interviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id).notNull(),
  participantName: text("participant_name").notNull(),
  date: timestamp("date").notNull(),
  duration: integer("duration"),
  // minutes
  questions: jsonb("questions").default([]),
  responses: jsonb("responses").default([]),
  insights: text("insights"),
  createdAt: timestamp("created_at").default(sql`now()`)
});
var observations = pgTable("observations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id).notNull(),
  location: text("location").notNull(),
  context: text("context").notNull(),
  behavior: text("behavior").notNull(),
  insights: text("insights"),
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").default(sql`now()`)
});
var povStatements = pgTable("pov_statements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id).notNull(),
  user: text("user").notNull(),
  // user description
  need: text("need").notNull(),
  // user need
  insight: text("insight").notNull(),
  // surprising insight
  statement: text("statement").notNull(),
  // complete POV statement
  priority: text("priority").default("medium"),
  // low, medium, high
  createdAt: timestamp("created_at").default(sql`now()`)
});
var hmwQuestions = pgTable("hmw_questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id).notNull(),
  question: text("question").notNull(),
  context: text("context"),
  challenge: text("challenge"),
  scope: text("scope").default("product"),
  // feature, product, service, experience, process
  priority: text("priority").default("medium"),
  // low, medium, high
  category: text("category"),
  // categorization
  votes: integer("votes").default(0),
  createdAt: timestamp("created_at").default(sql`now()`)
});
var ideas = pgTable("ideas", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category"),
  // Legacy fields (kept for compatibility)
  feasibility: integer("feasibility"),
  // 1-5 scale - now maps to DVF Feasibility/Exequibilidade
  impact: integer("impact"),
  // 1-5 scale
  votes: integer("votes").default(0),
  // DVF (Desejabilidade, Viabilidade, Exequibilidade) System
  desirability: integer("desirability"),
  // 1-5 scale - user need satisfaction
  viability: integer("viability"),
  // 1-5 scale - business/profit potential  
  // feasibility already exists above - technical implementability
  confidenceLevel: integer("confidence_level"),
  // 1-5 scale - overall confidence
  dvfScore: real("dvf_score"),
  // Calculated: (desirability + viability + feasibility) / 3
  dvfAnalysis: text("dvf_analysis"),
  // Detailed justification for scores
  actionDecision: text("action_decision").default("evaluate"),
  // love_it, leave_it, change_it, evaluate
  // Priority and iteration fields
  priorityRank: integer("priority_rank"),
  // 1-n ranking based on DVF analysis
  iterationNotes: text("iteration_notes"),
  // Notes for "change_it" decisions
  status: text("status").default("idea"),
  // idea, selected, prototype, tested
  canvasData: jsonb("canvas_data"),
  // Fabric.js canvas data for drawings/sketches
  createdAt: timestamp("created_at").default(sql`now()`)
});
var prototypes = pgTable("prototypes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id).notNull(),
  ideaId: varchar("idea_id").references(() => ideas.id),
  name: text("name").notNull(),
  type: text("type").notNull(),
  // paper, digital, physical, storyboard, canvas
  description: text("description").notNull(),
  materials: jsonb("materials").default([]),
  images: jsonb("images").default([]),
  canvasData: jsonb("canvas_data"),
  // Konva.js canvas data for interactive prototypes
  version: integer("version").default(1),
  feedback: text("feedback"),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`)
});
var canvasDrawings = pgTable("canvas_drawings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  phase: integer("phase").notNull(),
  // 1-5 phases where this drawing is used
  canvasType: text("canvas_type").notNull(),
  // fabric, konva
  canvasData: jsonb("canvas_data").notNull(),
  // Canvas library data (Fabric.js or Konva.js)
  thumbnailData: text("thumbnail_data"),
  // Base64 encoded thumbnail for preview
  tags: jsonb("tags").default([]),
  // Tags for categorization
  isTemplate: boolean("is_template").default(false),
  // Can be used as a template
  parentId: varchar("parent_id"),
  // For drawing iterations - will be set to reference same table later
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`)
});
var testPlans = pgTable("test_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id).notNull(),
  prototypeId: varchar("prototype_id").references(() => prototypes.id),
  name: text("name").notNull(),
  objective: text("objective").notNull(),
  methodology: text("methodology").notNull(),
  participants: integer("participants").notNull(),
  duration: integer("duration"),
  // minutes
  tasks: jsonb("tasks").default([]),
  metrics: jsonb("metrics").default([]),
  status: text("status").default("planned"),
  // planned, running, completed
  createdAt: timestamp("created_at").default(sql`now()`)
});
var testResults = pgTable("test_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  testPlanId: varchar("test_plan_id").references(() => testPlans.id).notNull(),
  participantId: text("participant_id").notNull(),
  taskResults: jsonb("task_results").default([]),
  feedback: text("feedback"),
  successRate: real("success_rate"),
  completionTime: integer("completion_time"),
  // minutes
  insights: text("insights"),
  createdAt: timestamp("created_at").default(sql`now()`)
});
var userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  projectId: varchar("project_id").references(() => projects.id).notNull(),
  phase: integer("phase").notNull(),
  // 1-5
  completedTools: jsonb("completed_tools").default([]),
  badges: jsonb("badges").default([]),
  points: integer("points").default(0),
  timeSpent: integer("time_spent").default(0),
  // minutes
  updatedAt: timestamp("updated_at").default(sql`now()`)
});
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  password: text("password").notNull(),
  // hashed password
  role: text("role").notNull().default("user"),
  // admin, user
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
  subscriptionStatus: text("subscription_status").default("active"),
  // active, canceled, expired, trialing
  subscriptionEndDate: timestamp("subscription_end_date"),
  createdAt: timestamp("created_at").default(sql`now()`)
});
var subscriptionPlans = pgTable("subscription_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  displayName: text("display_name").notNull(),
  description: text("description"),
  priceMonthly: integer("price_monthly").notNull(),
  // in cents
  priceYearly: integer("price_yearly").notNull(),
  // in cents
  stripePriceIdMonthly: text("stripe_price_id_monthly"),
  stripePriceIdYearly: text("stripe_price_id_yearly"),
  maxProjects: integer("max_projects"),
  // null for unlimited
  maxPersonasPerProject: integer("max_personas_per_project"),
  // null for unlimited
  maxUsersPerTeam: integer("max_users_per_team"),
  // null for unlimited
  aiChatLimit: integer("ai_chat_limit"),
  // null for unlimited
  libraryArticlesCount: integer("library_articles_count"),
  // null for all articles
  features: jsonb("features").default([]),
  // Array of feature strings
  exportFormats: jsonb("export_formats").default([]),
  // Array of export formats (pdf, png, csv)
  hasCollaboration: boolean("has_collaboration").default(false),
  hasPermissionManagement: boolean("has_permission_management").default(false),
  hasSharedWorkspace: boolean("has_shared_workspace").default(false),
  hasCommentsAndFeedback: boolean("has_comments_and_feedback").default(false),
  hasSso: boolean("has_sso").default(false),
  hasCustomApi: boolean("has_custom_api").default(false),
  hasCustomIntegrations: boolean("has_custom_integrations").default(false),
  has24x7Support: boolean("has_24x7_support").default(false),
  order: integer("order").default(0),
  // for display ordering
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`now()`)
});
var userSubscriptions = pgTable("user_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  planId: varchar("plan_id").references(() => subscriptionPlans.id).notNull(),
  stripeSubscriptionId: text("stripe_subscription_id"),
  status: text("status").notNull(),
  // active, canceled, expired, trialing, incomplete
  billingPeriod: text("billing_period").notNull(),
  // monthly, yearly
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`)
});
var articles = pgTable("articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  // empathize, define, ideate, prototype, test
  author: text("author").notNull(),
  description: text("description"),
  tags: jsonb("tags").default([]),
  // Array of tags
  published: boolean("published").default(true),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`)
});
var insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true
});
var insertEmpathyMapSchema = createInsertSchema(empathyMaps).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertPersonaSchema = createInsertSchema(personas).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertInterviewSchema = createInsertSchema(interviews, {
  questions: z.array(z.string()).optional(),
  responses: z.array(z.string()).optional()
}).omit({
  id: true,
  createdAt: true
});
var insertObservationSchema = createInsertSchema(observations).omit({
  id: true,
  createdAt: true
});
var insertPovStatementSchema = createInsertSchema(povStatements).omit({
  id: true,
  createdAt: true
});
var insertHmwQuestionSchema = createInsertSchema(hmwQuestions).omit({
  id: true,
  createdAt: true
});
var insertIdeaSchema = createInsertSchema(ideas).omit({
  id: true,
  createdAt: true
});
var insertPrototypeSchema = createInsertSchema(prototypes).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertTestPlanSchema = createInsertSchema(testPlans).omit({
  id: true,
  createdAt: true
});
var insertTestResultSchema = createInsertSchema(testResults).omit({
  id: true,
  createdAt: true
});
var insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  updatedAt: true
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true
});
var insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertSubscriptionPlanSchema = createInsertSchema(subscriptionPlans).omit({
  id: true,
  createdAt: true
});
var insertUserSubscriptionSchema = createInsertSchema(userSubscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertCanvasDrawingSchema = createInsertSchema(canvasDrawings).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var updateProfileSchema = createInsertSchema(users).omit({
  id: true,
  username: true,
  password: true,
  role: true,
  stripeCustomerId: true,
  stripeSubscriptionId: true,
  subscriptionPlanId: true,
  subscriptionStatus: true,
  subscriptionEndDate: true,
  createdAt: true
}).partial();
var phaseCards = pgTable("phase_cards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  phase: integer("phase").notNull().default(1),
  // 1-5 phases (Empatizar, Definir, Idear, Prototipar, Testar)
  status: text("status").default("todo"),
  // todo, in_progress, done
  priority: text("priority").default("medium"),
  // low, medium, high
  assignee: text("assignee"),
  // Optional assignee
  tags: jsonb("tags").default([]),
  // Array of tags for categorization
  dueDate: timestamp("due_date"),
  position: integer("position").default(0),
  // Order within the phase column
  color: text("color").default("blue"),
  // Card color for visual organization
  attachments: jsonb("attachments").default([]),
  // File attachments metadata
  comments: jsonb("comments").default([]),
  // Comments/notes
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`)
});
var benchmarks = pgTable("benchmarks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  industry: text("industry").notNull(),
  // tech, healthcare, finance, retail, etc.
  companySize: text("company_size").notNull(),
  // startup, small, medium, large, enterprise
  maturityScores: jsonb("maturity_scores").default({}),
  // { empathize: 4, define: 3, ideate: 5, prototype: 2, test: 3 }
  benchmarkType: text("benchmark_type").notNull().default("industry"),
  // industry, internal, custom
  targetScores: jsonb("target_scores").default({}),
  // Goals for each phase
  improvementAreas: jsonb("improvement_areas").default([]),
  // Array of focus areas
  recommendations: jsonb("recommendations").default([]),
  // AI-generated suggestions
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`)
});
var benchmarkAssessments = pgTable("benchmark_assessments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  benchmarkId: varchar("benchmark_id").references(() => benchmarks.id).notNull(),
  phase: integer("phase").notNull(),
  // 1-5 for DT phases
  criteria: text("criteria").notNull(),
  // What is being assessed
  currentScore: real("current_score").notNull(),
  // 1-5 rating
  targetScore: real("target_score").notNull(),
  // Goal score
  industryAverage: real("industry_average"),
  // Benchmark comparison
  evidence: text("evidence"),
  // Supporting evidence for the score
  improvementPlan: text("improvement_plan"),
  // How to improve
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`)
});
var insertBenchmarkSchema = createInsertSchema(benchmarks).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertBenchmarkAssessmentSchema = createInsertSchema(benchmarkAssessments).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertPhaseCardSchema = createInsertSchema(phaseCards).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var dvfAssessments = pgTable("dvf_assessments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id).notNull(),
  itemType: text("item_type").notNull(),
  // idea, prototype, solution, etc.
  itemId: varchar("item_id").notNull(),
  // Reference to the evaluated item
  itemName: text("item_name").notNull(),
  // Desirability - User desirability
  desirabilityScore: real("desirability_score").notNull().default(0),
  // 1-5 scale
  desirabilityEvidence: text("desirability_evidence"),
  // Supporting evidence
  userFeedback: text("user_feedback"),
  // Direct user feedback
  marketDemand: real("market_demand").default(0),
  // Market demand indicator
  // Feasibility - Technical feasibility  
  feasibilityScore: real("feasibility_score").notNull().default(0),
  // 1-5 scale
  feasibilityEvidence: text("feasibility_evidence"),
  technicalComplexity: text("technical_complexity"),
  // low, medium, high
  resourceRequirements: jsonb("resource_requirements").default([]),
  // Required resources
  timeToImplement: integer("time_to_implement"),
  // Estimated time in days
  // Viability - Economic viability
  viabilityScore: real("viability_score").notNull().default(0),
  // 1-5 scale  
  viabilityEvidence: text("viability_evidence"),
  businessModel: text("business_model"),
  // How it generates value
  costEstimate: real("cost_estimate"),
  // Implementation cost
  revenueProjection: real("revenue_projection"),
  // Expected revenue
  // Overall DVF analysis
  overallScore: real("overall_score").default(0),
  // Average of the three pillars
  recommendation: text("recommendation"),
  // proceed, modify, stop
  nextSteps: jsonb("next_steps").default([]),
  // Recommended actions
  risksIdentified: jsonb("risks_identified").default([]),
  // Potential risks
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`)
});
var lovabilityMetrics = pgTable("lovability_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id).notNull(),
  itemType: text("item_type").notNull(),
  // idea, prototype, solution
  itemId: varchar("item_id").notNull(),
  // Reference to the item being evaluated
  itemName: text("item_name").notNull(),
  // Core Metrics
  npsScore: real("nps_score").default(0),
  // -100 to 100
  satisfactionScore: real("satisfaction_score").default(0),
  // 0-10
  retentionRate: real("retention_rate").default(0),
  // 0-100%
  engagementTime: real("engagement_time").default(0),
  // minutes
  // Emotional Distribution
  emotionalDistribution: jsonb("emotional_distribution").default({}),
  // delight, satisfaction, neutral, frustration percentages
  // Feedback Analysis
  positiveComments: jsonb("positive_comments").default([]),
  negativeComments: jsonb("negative_comments").default([]),
  improvementSuggestions: jsonb("improvement_suggestions").default([]),
  // User Behavior
  userTestingSessions: integer("user_testing_sessions").default(0),
  completionRate: real("completion_rate").default(0),
  // 0-100%
  errorRate: real("error_rate").default(0),
  // 0-100%
  supportTickets: integer("support_tickets").default(0),
  // Qualitative Insights
  emotionalStory: text("emotional_story"),
  userPersonas: jsonb("user_personas").default([]),
  keyMoments: jsonb("key_moments").default([]),
  painPoints: jsonb("pain_points").default([]),
  // Overall Assessment
  lovabilityScore: real("lovability_score").default(0),
  // 0-10 calculated score
  recommendations: jsonb("recommendations").default([]),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`)
});
var projectAnalytics = pgTable("project_analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id).notNull(),
  // Usage metrics
  totalTimeSpent: integer("total_time_spent").default(0),
  // minutes
  timePerPhase: jsonb("time_per_phase").default({}),
  // { phase1: 120, phase2: 90, ... }
  toolsUsed: jsonb("tools_used").default([]),
  // List of tools/features used
  toolUsageCount: jsonb("tool_usage_count").default({}),
  // Usage frequency per tool
  // Progress metrics
  completionRate: real("completion_rate").default(0),
  // 0-100%
  phasesCompleted: jsonb("phases_completed").default([]),
  // Which phases are done
  stageProgressions: integer("stage_progressions").default(0),
  // Times moved between phases
  iterationsCount: integer("iterations_count").default(0),
  // Number of iterations
  // Success indicators
  prototypesCreated: integer("prototypes_created").default(0),
  testsCompleted: integer("tests_completed").default(0),
  userFeedbackCollected: integer("user_feedback_collected").default(0),
  ideasGenerated: integer("ideas_generated").default(0),
  ideasImplemented: integer("ideas_implemented").default(0),
  // Team collaboration metrics
  teamSize: integer("team_size").default(1),
  collaborationEvents: integer("collaboration_events").default(0),
  meetingsHeld: integer("meetings_held").default(0),
  decisionsMade: integer("decisions_made").default(0),
  // Innovation metrics
  originalityScore: real("originality_score").default(0),
  // 1-10
  feasibilityScore: real("feasibility_score").default(0),
  // 1-10
  impactPotential: real("impact_potential").default(0),
  // 1-10
  marketFit: real("market_fit").default(0),
  // 1-10
  // Success metrics
  overallSuccess: real("overall_success").default(0),
  // 0-100%
  userSatisfaction: real("user_satisfaction").default(0),
  // 0-10
  goalAchievement: real("goal_achievement").default(0),
  // 0-100%
  innovationLevel: real("innovation_level").default(0),
  // 1-5
  // Key insights
  topPerformingTools: jsonb("top_performing_tools").default([]),
  timeBottlenecks: jsonb("time_bottlenecks").default([]),
  successFactors: jsonb("success_factors").default([]),
  improvementAreas: jsonb("improvement_areas").default([]),
  lastUpdated: timestamp("last_updated").default(sql`now()`),
  createdAt: timestamp("created_at").default(sql`now()`)
});
var competitiveAnalysis = pgTable("competitive_analysis", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id).notNull(),
  // Competitor info
  competitorName: text("competitor_name").notNull(),
  // Miro, Figma, Notion, etc.
  competitorType: text("competitor_type").notNull(),
  // direct, indirect, substitute
  marketPosition: text("market_position"),
  // leader, challenger, niche
  // Feature comparison
  features: jsonb("features").default({}),
  // Feature matrix comparison
  functionalGaps: jsonb("functional_gaps").default([]),
  // What they lack
  functionalOverages: jsonb("functional_overages").default([]),
  // What they overdo
  // Pricing comparison
  pricingModel: text("pricing_model"),
  // freemium, subscription, one-time
  pricePoints: jsonb("price_points").default([]),
  // Their pricing tiers
  valueProposition: text("value_proposition"),
  // Their main value prop
  // Market gaps
  underservedOutcomes: jsonb("underserved_outcomes").default([]),
  // Market gaps
  overservedOutcomes: jsonb("overserved_outcomes").default([]),
  // Overcomplicated areas
  // Our positioning
  ourAdvantages: jsonb("our_advantages").default([]),
  // Where we're better
  ourDisadvantages: jsonb("our_disadvantages").default([]),
  // Where we lack
  recommendations: jsonb("recommendations").default([]),
  // Strategic recommendations
  analysisDate: timestamp("analysis_date").default(sql`now()`),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`)
});
var projectBackups = pgTable("project_backups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id).notNull(),
  // Backup metadata
  backupType: text("backup_type").notNull(),
  // auto, manual
  description: text("description"),
  // Project snapshot at backup time
  projectSnapshot: jsonb("project_snapshot").notNull(),
  // Complete project data
  // Statistics at backup time
  phaseSnapshot: integer("phase_snapshot"),
  // Current phase at backup
  completionSnapshot: real("completion_snapshot"),
  // Completion rate at backup
  itemCount: integer("item_count"),
  // Total items in backup
  createdAt: timestamp("created_at").default(sql`now()`)
});
var helpArticles = pgTable("help_articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  // URL-friendly identifier
  content: text("content").notNull(),
  // Markdown content
  category: text("category").notNull(),
  // inicio-rapido, fases, exportacao, etc
  subcategory: text("subcategory"),
  // Optional subcategory
  phase: integer("phase"),
  // 1-5 if related to specific DT phase
  tags: jsonb("tags").default([]),
  // Array of searchable tags
  searchKeywords: jsonb("search_keywords").default([]),
  // Keywords for search
  featured: boolean("featured").default(false),
  // Show in main help
  author: text("author").notNull().default("DTTools Team"),
  // Article author
  viewCount: integer("view_count").default(0),
  helpful: integer("helpful").default(0),
  // Helpful votes
  order: integer("order").default(0),
  // Display order within category
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`)
});
var insertDvfAssessmentSchema = createInsertSchema(dvfAssessments).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertLovabilityMetricSchema = createInsertSchema(lovabilityMetrics).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertProjectAnalyticsSchema = createInsertSchema(projectAnalytics).omit({
  id: true,
  createdAt: true,
  lastUpdated: true
});
var insertCompetitiveAnalysisSchema = createInsertSchema(competitiveAnalysis).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  analysisDate: true
});
var insertProjectBackupSchema = createInsertSchema(projectBackups).omit({
  id: true,
  createdAt: true
});
var insertHelpArticleSchema = createInsertSchema(helpArticles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  viewCount: true,
  helpful: true
});

// server/storage.ts
import bcrypt from "bcrypt";

// server/db.ts
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});
var db = drizzle(pool, { schema: schema_exports });

// server/storage.ts
import { eq, and, desc } from "drizzle-orm";
var DatabaseStorage = class {
  // Projects
  async getProjects(userId) {
    return await db.select().from(projects).where(eq(projects.userId, userId)).orderBy(desc(projects.createdAt));
  }
  async getAllProjects() {
    return await db.select().from(projects).orderBy(desc(projects.createdAt));
  }
  async getProject(id, userId) {
    const [project] = await db.select().from(projects).where(and(eq(projects.id, id), eq(projects.userId, userId)));
    return project;
  }
  async createProject(project) {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }
  async updateProject(id, userId, project) {
    const [updatedProject] = await db.update(projects).set({ ...project, updatedAt: /* @__PURE__ */ new Date() }).where(and(eq(projects.id, id), eq(projects.userId, userId))).returning();
    return updatedProject;
  }
  async deleteProject(id, userId) {
    const result = await db.delete(projects).where(and(eq(projects.id, id), eq(projects.userId, userId)));
    return (result.rowCount || 0) > 0;
  }
  // Users
  async getUsers() {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  async createUser(user) {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }
  async updateUser(id, user) {
    const [updatedUser] = await db.update(users).set(user).where(eq(users.id, id)).returning();
    return updatedUser;
  }
  async deleteUser(id) {
    const result = await db.delete(users).where(eq(users.id, id));
    return (result.rowCount || 0) > 0;
  }
  // Articles
  async getArticles() {
    return await db.select().from(articles).orderBy(desc(articles.createdAt));
  }
  async getArticlesByCategory(category) {
    return await db.select().from(articles).where(eq(articles.category, category)).orderBy(desc(articles.createdAt));
  }
  async getArticle(id) {
    const [article] = await db.select().from(articles).where(eq(articles.id, id));
    return article;
  }
  async createArticle(article) {
    const [newArticle] = await db.insert(articles).values(article).returning();
    return newArticle;
  }
  async updateArticle(id, article) {
    const [updatedArticle] = await db.update(articles).set({ ...article, updatedAt: /* @__PURE__ */ new Date() }).where(eq(articles.id, id)).returning();
    return updatedArticle;
  }
  async deleteArticle(id) {
    const result = await db.delete(articles).where(eq(articles.id, id));
    return (result.rowCount || 0) > 0;
  }
  // Phase 1: Empathize
  async getEmpathyMaps(projectId) {
    return await db.select().from(empathyMaps).where(eq(empathyMaps.projectId, projectId)).orderBy(desc(empathyMaps.createdAt));
  }
  async createEmpathyMap(empathyMap) {
    const [newMap] = await db.insert(empathyMaps).values(empathyMap).returning();
    return newMap;
  }
  async updateEmpathyMap(id, empathyMap) {
    const [updatedMap] = await db.update(empathyMaps).set({ ...empathyMap, updatedAt: /* @__PURE__ */ new Date() }).where(eq(empathyMaps.id, id)).returning();
    return updatedMap;
  }
  async deleteEmpathyMap(id) {
    const result = await db.delete(empathyMaps).where(eq(empathyMaps.id, id));
    return (result.rowCount || 0) > 0;
  }
  async getPersonas(projectId) {
    return await db.select().from(personas).where(eq(personas.projectId, projectId)).orderBy(desc(personas.createdAt));
  }
  async createPersona(persona) {
    const [newPersona] = await db.insert(personas).values(persona).returning();
    return newPersona;
  }
  async updatePersona(id, persona) {
    const [updatedPersona] = await db.update(personas).set({ ...persona, updatedAt: /* @__PURE__ */ new Date() }).where(eq(personas.id, id)).returning();
    return updatedPersona;
  }
  async deletePersona(id) {
    const result = await db.delete(personas).where(eq(personas.id, id));
    return (result.rowCount || 0) > 0;
  }
  async getInterviews(projectId) {
    return await db.select().from(interviews).where(eq(interviews.projectId, projectId)).orderBy(desc(interviews.createdAt));
  }
  async createInterview(interview) {
    const [newInterview] = await db.insert(interviews).values(interview).returning();
    return newInterview;
  }
  async updateInterview(id, interview) {
    const [updatedInterview] = await db.update(interviews).set(interview).where(eq(interviews.id, id)).returning();
    return updatedInterview;
  }
  async deleteInterview(id) {
    const result = await db.delete(interviews).where(eq(interviews.id, id));
    return (result.rowCount || 0) > 0;
  }
  async getObservations(projectId) {
    return await db.select().from(observations).where(eq(observations.projectId, projectId)).orderBy(desc(observations.createdAt));
  }
  async createObservation(observation) {
    const [newObservation] = await db.insert(observations).values(observation).returning();
    return newObservation;
  }
  async updateObservation(id, observation) {
    const [updatedObservation] = await db.update(observations).set(observation).where(eq(observations.id, id)).returning();
    return updatedObservation;
  }
  async deleteObservation(id) {
    const result = await db.delete(observations).where(eq(observations.id, id));
    return (result.rowCount || 0) > 0;
  }
  // Phase 2: Define
  async getPovStatements(projectId) {
    return await db.select().from(povStatements).where(eq(povStatements.projectId, projectId)).orderBy(desc(povStatements.createdAt));
  }
  async getPovStatement(id) {
    const [statement] = await db.select().from(povStatements).where(eq(povStatements.id, id));
    return statement;
  }
  async createPovStatement(pov) {
    const [newStatement] = await db.insert(povStatements).values(pov).returning();
    return newStatement;
  }
  async updatePovStatement(id, pov) {
    const [updatedStatement] = await db.update(povStatements).set(pov).where(eq(povStatements.id, id)).returning();
    return updatedStatement;
  }
  async deletePovStatement(id) {
    const result = await db.delete(povStatements).where(eq(povStatements.id, id));
    return (result.rowCount || 0) > 0;
  }
  async getHmwQuestions(projectId) {
    return await db.select().from(hmwQuestions).where(eq(hmwQuestions.projectId, projectId)).orderBy(desc(hmwQuestions.createdAt));
  }
  async getHmwQuestion(id) {
    const [question] = await db.select().from(hmwQuestions).where(eq(hmwQuestions.id, id));
    return question;
  }
  async createHmwQuestion(hmw) {
    const [newQuestion] = await db.insert(hmwQuestions).values(hmw).returning();
    return newQuestion;
  }
  async updateHmwQuestion(id, hmw) {
    const [updatedQuestion] = await db.update(hmwQuestions).set(hmw).where(eq(hmwQuestions.id, id)).returning();
    return updatedQuestion;
  }
  async deleteHmwQuestion(id) {
    const result = await db.delete(hmwQuestions).where(eq(hmwQuestions.id, id));
    return (result.rowCount || 0) > 0;
  }
  // Phase 3: Ideate
  async getIdeas(projectId) {
    return await db.select().from(ideas).where(eq(ideas.projectId, projectId)).orderBy(desc(ideas.createdAt));
  }
  async createIdea(idea) {
    const [newIdea] = await db.insert(ideas).values(idea).returning();
    return newIdea;
  }
  async updateIdea(id, idea) {
    const [updatedIdea] = await db.update(ideas).set(idea).where(eq(ideas.id, id)).returning();
    return updatedIdea;
  }
  async deleteIdea(id) {
    const result = await db.delete(ideas).where(eq(ideas.id, id));
    return (result.rowCount || 0) > 0;
  }
  // Phase 4: Prototype
  async getPrototypes(projectId) {
    return await db.select().from(prototypes).where(eq(prototypes.projectId, projectId)).orderBy(desc(prototypes.createdAt));
  }
  async createPrototype(prototype) {
    const [newPrototype] = await db.insert(prototypes).values(prototype).returning();
    return newPrototype;
  }
  async updatePrototype(id, prototype) {
    const [updatedPrototype] = await db.update(prototypes).set(prototype).where(eq(prototypes.id, id)).returning();
    return updatedPrototype;
  }
  async deletePrototype(id) {
    const result = await db.delete(prototypes).where(eq(prototypes.id, id));
    return (result.rowCount || 0) > 0;
  }
  // Phase 5: Test
  async getTestPlans(projectId) {
    return await db.select().from(testPlans).where(eq(testPlans.projectId, projectId)).orderBy(desc(testPlans.createdAt));
  }
  async createTestPlan(testPlan) {
    const [newPlan] = await db.insert(testPlans).values(testPlan).returning();
    return newPlan;
  }
  async updateTestPlan(id, testPlan) {
    const [updatedPlan] = await db.update(testPlans).set(testPlan).where(eq(testPlans.id, id)).returning();
    return updatedPlan;
  }
  async getTestResults(testPlanId) {
    return await db.select().from(testResults).where(eq(testResults.testPlanId, testPlanId)).orderBy(desc(testResults.createdAt));
  }
  async createTestResult(testResult) {
    const [newResult] = await db.insert(testResults).values(testResult).returning();
    return newResult;
  }
  // User Progress
  async getUserProgress(userId, projectId) {
    const [progress] = await db.select().from(userProgress).where(and(eq(userProgress.userId, userId), eq(userProgress.projectId, projectId)));
    return progress;
  }
  async updateUserProgress(progress) {
    const existing = await this.getUserProgress(progress.userId, progress.projectId);
    if (existing) {
      const [updated] = await db.update(userProgress).set({ ...progress, updatedAt: /* @__PURE__ */ new Date() }).where(and(eq(userProgress.userId, progress.userId), eq(userProgress.projectId, progress.projectId))).returning();
      return updated;
    } else {
      const [created] = await db.insert(userProgress).values(progress).returning();
      return created;
    }
  }
  // Analytics
  async getProjectStats(projectId, userId) {
    const project = await this.getProject(projectId, userId);
    return {
      totalTools: 15,
      // Total tools across all 5 phases
      completedTools: 0,
      // Would count actual completed tools
      currentPhase: project?.currentPhase || 1,
      completionRate: project?.completionRate || 0
    };
  }
  // Canvas Drawings
  async getCanvasDrawings(projectId) {
    return await db.select().from(canvasDrawings).where(eq(canvasDrawings.projectId, projectId)).orderBy(desc(canvasDrawings.createdAt));
  }
  async getCanvasDrawing(id) {
    const [drawing] = await db.select().from(canvasDrawings).where(eq(canvasDrawings.id, id));
    return drawing;
  }
  async createCanvasDrawing(drawing) {
    const [newDrawing] = await db.insert(canvasDrawings).values(drawing).returning();
    return newDrawing;
  }
  async updateCanvasDrawing(id, drawing) {
    const [updatedDrawing] = await db.update(canvasDrawings).set({ ...drawing, updatedAt: /* @__PURE__ */ new Date() }).where(eq(canvasDrawings.id, id)).returning();
    return updatedDrawing;
  }
  async deleteCanvasDrawing(id) {
    const result = await db.delete(canvasDrawings).where(eq(canvasDrawings.id, id));
    return (result.rowCount || 0) > 0;
  }
  // Phase Cards (Kanban)
  async getPhaseCards(projectId) {
    return await db.select().from(phaseCards).where(eq(phaseCards.projectId, projectId)).orderBy(desc(phaseCards.createdAt));
  }
  async getPhaseCard(id) {
    const [card] = await db.select().from(phaseCards).where(eq(phaseCards.id, id));
    return card;
  }
  async createPhaseCard(card) {
    const [newCard] = await db.insert(phaseCards).values(card).returning();
    return newCard;
  }
  async updatePhaseCard(id, card) {
    const [updatedCard] = await db.update(phaseCards).set({ ...card, updatedAt: /* @__PURE__ */ new Date() }).where(eq(phaseCards.id, id)).returning();
    return updatedCard;
  }
  async deletePhaseCard(id) {
    const result = await db.delete(phaseCards).where(eq(phaseCards.id, id));
    return (result.rowCount || 0) > 0;
  }
  // Subscription Plans
  async getSubscriptionPlans() {
    return await db.select().from(subscriptionPlans).orderBy(desc(subscriptionPlans.createdAt));
  }
  async getSubscriptionPlan(id) {
    const [plan] = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, id));
    return plan;
  }
  async getSubscriptionPlanByName(name) {
    const [plan] = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.name, name));
    return plan;
  }
  async createSubscriptionPlan(plan) {
    const [newPlan] = await db.insert(subscriptionPlans).values(plan).returning();
    return newPlan;
  }
  async updateSubscriptionPlan(id, plan) {
    const [updatedPlan] = await db.update(subscriptionPlans).set(plan).where(eq(subscriptionPlans.id, id)).returning();
    return updatedPlan;
  }
  async deleteSubscriptionPlan(id) {
    const result = await db.delete(subscriptionPlans).where(eq(subscriptionPlans.id, id));
    return (result.rowCount || 0) > 0;
  }
  // User Subscriptions
  async getUserSubscriptions(userId) {
    return await db.select().from(userSubscriptions).where(eq(userSubscriptions.userId, userId)).orderBy(desc(userSubscriptions.createdAt));
  }
  async getUserActiveSubscription(userId) {
    const [subscription] = await db.select().from(userSubscriptions).where(and(
      eq(userSubscriptions.userId, userId),
      eq(userSubscriptions.status, "active")
    ));
    return subscription;
  }
  async createUserSubscription(subscription) {
    const [newSubscription] = await db.insert(userSubscriptions).values(subscription).returning();
    return newSubscription;
  }
  async updateUserSubscription(id, subscription) {
    const [updatedSubscription] = await db.update(userSubscriptions).set(subscription).where(eq(userSubscriptions.id, id)).returning();
    return updatedSubscription;
  }
  async cancelUserSubscription(id) {
    const result = await db.update(userSubscriptions).set({ status: "cancelled" }).where(eq(userSubscriptions.id, id));
    return (result.rowCount || 0) > 0;
  }
  // Benchmarking
  async getBenchmarks(projectId) {
    return await db.select().from(benchmarks).where(eq(benchmarks.projectId, projectId)).orderBy(desc(benchmarks.createdAt));
  }
  async getBenchmark(id) {
    const [benchmark] = await db.select().from(benchmarks).where(eq(benchmarks.id, id));
    return benchmark;
  }
  async createBenchmark(benchmark) {
    const [newBenchmark] = await db.insert(benchmarks).values(benchmark).returning();
    return newBenchmark;
  }
  async updateBenchmark(id, benchmark) {
    const [updatedBenchmark] = await db.update(benchmarks).set(benchmark).where(eq(benchmarks.id, id)).returning();
    return updatedBenchmark;
  }
  async deleteBenchmark(id) {
    const result = await db.delete(benchmarks).where(eq(benchmarks.id, id));
    return (result.rowCount || 0) > 0;
  }
  async getBenchmarkAssessments(benchmarkId) {
    return await db.select().from(benchmarkAssessments).where(eq(benchmarkAssessments.benchmarkId, benchmarkId)).orderBy(desc(benchmarkAssessments.createdAt));
  }
  async createBenchmarkAssessment(assessment) {
    const [newAssessment] = await db.insert(benchmarkAssessments).values(assessment).returning();
    return newAssessment;
  }
  async updateBenchmarkAssessment(id, assessment) {
    const [updatedAssessment] = await db.update(benchmarkAssessments).set(assessment).where(eq(benchmarkAssessments.id, id)).returning();
    return updatedAssessment;
  }
  async deleteBenchmarkAssessment(id) {
    const result = await db.delete(benchmarkAssessments).where(eq(benchmarkAssessments.id, id));
    return (result.rowCount || 0) > 0;
  }
  // DVF Assessment - Desirability, Feasibility, Viability
  async getDvfAssessments(projectId) {
    return await db.select().from(dvfAssessments).where(eq(dvfAssessments.projectId, projectId)).orderBy(desc(dvfAssessments.createdAt));
  }
  async getDvfAssessment(id) {
    const [assessment] = await db.select().from(dvfAssessments).where(eq(dvfAssessments.id, id));
    return assessment;
  }
  async createDvfAssessment(assessment) {
    const [newAssessment] = await db.insert(dvfAssessments).values(assessment).returning();
    return newAssessment;
  }
  async updateDvfAssessment(id, assessment) {
    const [updatedAssessment] = await db.update(dvfAssessments).set({ ...assessment, updatedAt: /* @__PURE__ */ new Date() }).where(eq(dvfAssessments.id, id)).returning();
    return updatedAssessment;
  }
  async deleteDvfAssessment(id) {
    const result = await db.delete(dvfAssessments).where(eq(dvfAssessments.id, id));
    return (result.rowCount || 0) > 0;
  }
  // Lovability Metrics
  async getLovabilityMetrics(projectId) {
    return await db.select().from(lovabilityMetrics).where(eq(lovabilityMetrics.projectId, projectId)).orderBy(desc(lovabilityMetrics.createdAt));
  }
  async getLovabilityMetric(id) {
    const [metric] = await db.select().from(lovabilityMetrics).where(eq(lovabilityMetrics.id, id));
    return metric;
  }
  async createLovabilityMetric(metric) {
    const [newMetric] = await db.insert(lovabilityMetrics).values(metric).returning();
    return newMetric;
  }
  async updateLovabilityMetric(id, metric) {
    const [updatedMetric] = await db.update(lovabilityMetrics).set({ ...metric, updatedAt: /* @__PURE__ */ new Date() }).where(eq(lovabilityMetrics.id, id)).returning();
    return updatedMetric;
  }
  async deleteLovabilityMetric(id) {
    const result = await db.delete(lovabilityMetrics).where(eq(lovabilityMetrics.id, id));
    return (result.rowCount || 0) > 0;
  }
  // Project Analytics
  async getProjectAnalytics(projectId) {
    const [analytics] = await db.select().from(projectAnalytics).where(eq(projectAnalytics.projectId, projectId));
    return analytics;
  }
  async createProjectAnalytics(analytics) {
    const [newAnalytics] = await db.insert(projectAnalytics).values(analytics).returning();
    return newAnalytics;
  }
  async updateProjectAnalytics(id, analytics) {
    const [updatedAnalytics] = await db.update(projectAnalytics).set({ ...analytics, lastUpdated: /* @__PURE__ */ new Date() }).where(eq(projectAnalytics.id, id)).returning();
    return updatedAnalytics;
  }
  // Competitive Analysis
  async getCompetitiveAnalyses(projectId) {
    return await db.select().from(competitiveAnalysis).where(eq(competitiveAnalysis.projectId, projectId)).orderBy(desc(competitiveAnalysis.createdAt));
  }
  async getCompetitiveAnalysis(id) {
    const [analysis] = await db.select().from(competitiveAnalysis).where(eq(competitiveAnalysis.id, id));
    return analysis;
  }
  async createCompetitiveAnalysis(analysis) {
    const [newAnalysis] = await db.insert(competitiveAnalysis).values(analysis).returning();
    return newAnalysis;
  }
  async updateCompetitiveAnalysis(id, analysis) {
    const [updatedAnalysis] = await db.update(competitiveAnalysis).set({ ...analysis, updatedAt: /* @__PURE__ */ new Date() }).where(eq(competitiveAnalysis.id, id)).returning();
    return updatedAnalysis;
  }
  async deleteCompetitiveAnalysis(id) {
    const result = await db.delete(competitiveAnalysis).where(eq(competitiveAnalysis.id, id));
    return (result.rowCount || 0) > 0;
  }
  // Project Backups
  async createProjectBackup(projectId, userId, backupType, description) {
    const project = await this.getProject(projectId, userId);
    if (!project) {
      throw new Error("Project not found");
    }
    const [
      empathyMapsData,
      personasData,
      interviewsData,
      observationsData,
      povStatementsData,
      hmwQuestionsData,
      ideasData,
      prototypesData,
      testPlansData
    ] = await Promise.all([
      this.getEmpathyMaps(projectId),
      this.getPersonas(projectId),
      this.getInterviews(projectId),
      this.getObservations(projectId),
      this.getPovStatements(projectId),
      this.getHmwQuestions(projectId),
      this.getIdeas(projectId),
      this.getPrototypes(projectId),
      this.getTestPlans(projectId)
    ]);
    const projectSnapshot = {
      project,
      empathyMaps: empathyMapsData,
      personas: personasData,
      interviews: interviewsData,
      observations: observationsData,
      povStatements: povStatementsData,
      hmwQuestions: hmwQuestionsData,
      ideas: ideasData,
      prototypes: prototypesData,
      testPlans: testPlansData
    };
    const totalItems = empathyMapsData.length + personasData.length + interviewsData.length + observationsData.length + povStatementsData.length + hmwQuestionsData.length + ideasData.length + prototypesData.length + testPlansData.length;
    const [backup] = await db.insert(projectBackups).values({
      projectId,
      backupType,
      description,
      projectSnapshot,
      phaseSnapshot: project.currentPhase,
      completionSnapshot: project.completionRate,
      itemCount: totalItems
    }).returning();
    return backup;
  }
  async getProjectBackups(projectId) {
    return await db.select().from(projectBackups).where(eq(projectBackups.projectId, projectId)).orderBy(desc(projectBackups.createdAt));
  }
  async getProjectBackup(id) {
    const [backup] = await db.select().from(projectBackups).where(eq(projectBackups.id, id));
    return backup;
  }
  async restoreProjectBackup(backupId) {
    const backup = await this.getProjectBackup(backupId);
    if (!backup || !backup.projectSnapshot) {
      return false;
    }
    const snapshot = backup.projectSnapshot;
    const projectId = backup.projectId;
    await Promise.all([
      db.delete(empathyMaps).where(eq(empathyMaps.projectId, projectId)),
      db.delete(personas).where(eq(personas.projectId, projectId)),
      db.delete(interviews).where(eq(interviews.projectId, projectId)),
      db.delete(observations).where(eq(observations.projectId, projectId)),
      db.delete(povStatements).where(eq(povStatements.projectId, projectId)),
      db.delete(hmwQuestions).where(eq(hmwQuestions.projectId, projectId)),
      db.delete(ideas).where(eq(ideas.projectId, projectId)),
      db.delete(prototypes).where(eq(prototypes.projectId, projectId)),
      db.delete(testPlans).where(eq(testPlans.projectId, projectId))
    ]);
    const userId = snapshot.project.userId;
    await this.updateProject(projectId, userId, {
      name: snapshot.project.name,
      description: snapshot.project.description,
      status: snapshot.project.status,
      currentPhase: snapshot.project.currentPhase,
      completionRate: snapshot.project.completionRate
    });
    if (snapshot.empathyMaps?.length > 0) {
      await db.insert(empathyMaps).values(
        snapshot.empathyMaps.map((em) => {
          const { id, createdAt, updatedAt, ...rest } = em;
          return rest;
        })
      );
    }
    if (snapshot.personas?.length > 0) {
      await db.insert(personas).values(
        snapshot.personas.map((p) => {
          const { id, createdAt, updatedAt, ...rest } = p;
          return rest;
        })
      );
    }
    if (snapshot.interviews?.length > 0) {
      await db.insert(interviews).values(
        snapshot.interviews.map((i) => {
          const { id, createdAt, ...rest } = i;
          return rest;
        })
      );
    }
    if (snapshot.observations?.length > 0) {
      await db.insert(observations).values(
        snapshot.observations.map((o) => {
          const { id, createdAt, ...rest } = o;
          return rest;
        })
      );
    }
    if (snapshot.povStatements?.length > 0) {
      await db.insert(povStatements).values(
        snapshot.povStatements.map((p) => {
          const { id, createdAt, ...rest } = p;
          return rest;
        })
      );
    }
    if (snapshot.hmwQuestions?.length > 0) {
      await db.insert(hmwQuestions).values(
        snapshot.hmwQuestions.map((h) => {
          const { id, createdAt, ...rest } = h;
          return rest;
        })
      );
    }
    if (snapshot.ideas?.length > 0) {
      await db.insert(ideas).values(
        snapshot.ideas.map((idea) => {
          const { id, createdAt, ...rest } = idea;
          return rest;
        })
      );
    }
    if (snapshot.prototypes?.length > 0) {
      await db.insert(prototypes).values(
        snapshot.prototypes.map((p) => {
          const { id, createdAt, ...rest } = p;
          return rest;
        })
      );
    }
    if (snapshot.testPlans?.length > 0) {
      await db.insert(testPlans).values(
        snapshot.testPlans.map((t) => {
          const { id, createdAt, ...rest } = t;
          return rest;
        })
      );
    }
    return true;
  }
  async deleteProjectBackup(id) {
    const result = await db.delete(projectBackups).where(eq(projectBackups.id, id));
    return (result.rowCount || 0) > 0;
  }
  // Help Articles
  async getHelpArticles() {
    return await db.select().from(helpArticles).orderBy(desc(helpArticles.order), desc(helpArticles.createdAt));
  }
  async getHelpArticleBySlug(slug) {
    const [article] = await db.select().from(helpArticles).where(eq(helpArticles.slug, slug));
    return article;
  }
  async searchHelpArticles(searchTerm) {
    const lowerSearch = searchTerm.toLowerCase();
    const allArticles = await db.select().from(helpArticles);
    return allArticles.filter((article) => {
      const titleMatch = article.title.toLowerCase().includes(lowerSearch);
      const contentMatch = article.content.toLowerCase().includes(lowerSearch);
      const tagsMatch = article.tags && JSON.stringify(article.tags).toLowerCase().includes(lowerSearch);
      const keywordsMatch = article.searchKeywords && JSON.stringify(article.searchKeywords).toLowerCase().includes(lowerSearch);
      return titleMatch || contentMatch || tagsMatch || keywordsMatch;
    });
  }
  async incrementHelpArticleViews(id) {
    const [article] = await db.select().from(helpArticles).where(eq(helpArticles.id, id));
    if (!article) return void 0;
    const [updated] = await db.update(helpArticles).set({ viewCount: (article.viewCount || 0) + 1 }).where(eq(helpArticles.id, id)).returning();
    return updated;
  }
  async incrementHelpArticleHelpful(id) {
    const [article] = await db.select().from(helpArticles).where(eq(helpArticles.id, id));
    if (!article) return void 0;
    const [updated] = await db.update(helpArticles).set({ helpful: (article.helpful || 0) + 1 }).where(eq(helpArticles.id, id)).returning();
    return updated;
  }
  async createHelpArticle(article) {
    const [newArticle] = await db.insert(helpArticles).values(article).returning();
    return newArticle;
  }
  async updateHelpArticle(id, article) {
    const [updated] = await db.update(helpArticles).set({ ...article, updatedAt: /* @__PURE__ */ new Date() }).where(eq(helpArticles.id, id)).returning();
    return updated;
  }
  async deleteHelpArticle(id) {
    const result = await db.delete(helpArticles).where(eq(helpArticles.id, id));
    return (result.rowCount || 0) > 0;
  }
};
var storage = new DatabaseStorage();
async function initializeDefaultData() {
  try {
    const adminUser = await storage.getUserByUsername("dttools.app@gmail.com");
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash("Gulex0519!@", 10);
      await storage.createUser({
        username: "dttools.app@gmail.com",
        email: "dttools.app@gmail.com",
        name: "DTTools Admin",
        password: hashedPassword,
        role: "admin",
        company: "DTTools",
        jobRole: "Administrator",
        industry: "Design Thinking",
        experience: "expert",
        country: "Brasil",
        state: "SP",
        city: "S\xE3o Paulo"
      });
      console.log("\u2705 Admin user created successfully");
    }
    const existingPlans = await storage.getSubscriptionPlans();
    if (existingPlans.length === 0) {
      await storage.createSubscriptionPlan({
        name: "Free",
        displayName: "Plano Gratuito",
        description: "Plan gratuito com recursos b\xE1sicos",
        priceMonthly: 0,
        priceYearly: 0,
        features: ["3 projetos", "Ferramentas b\xE1sicas", "Suporte por email"],
        maxProjects: 3,
        isActive: true
      });
      await storage.createSubscriptionPlan({
        name: "Pro",
        displayName: "Plano Pro",
        description: "Plan profissional com recursos avan\xE7ados",
        priceMonthly: 2990,
        // in cents
        priceYearly: 29900,
        // in cents
        features: ["Projetos ilimitados", "Todas as ferramentas", "An\xE1lise AI", "Suporte priorit\xE1rio"],
        maxProjects: -1,
        // unlimited
        isActive: true
      });
      await storage.createSubscriptionPlan({
        name: "Enterprise",
        displayName: "Plano Enterprise",
        description: "Plan empresarial com recursos completos",
        priceMonthly: 9990,
        // in cents
        priceYearly: 99900,
        // in cents
        features: ["Tudo do Pro", "Time ilimitado", "Suporte dedicado", "Treinamentos"],
        maxProjects: -1,
        // unlimited
        isActive: true
      });
      console.log("\u2705 Subscription plans created");
    }
  } catch (error) {
    console.error("\u274C Error initializing default data:", error);
  }
}

// server/routes.ts
import bcrypt2 from "bcrypt";
import Stripe from "stripe";

// server/subscriptionMiddleware.ts
async function checkProjectLimit(req, res, next) {
  if (!req.user?.id || !req.subscription?.limits) {
    return next();
  }
  const maxProjects = req.subscription.limits.maxProjects;
  if (maxProjects === null) {
    return next();
  }
  try {
    const userProjects = await storage.getProjects(req.user.id);
    if (userProjects.length >= maxProjects) {
      return res.status(403).json({
        error: "Project limit reached",
        message: `Your plan allows up to ${maxProjects} projects. Upgrade to create more projects.`,
        upgrade_required: true
      });
    }
    next();
  } catch (error) {
    console.error("Error checking project limit:", error);
    next(error);
  }
}
async function checkPersonaLimit(req, res, next) {
  if (!req.user?.id || !req.subscription?.limits) {
    return next();
  }
  const maxPersonas = req.subscription.limits.maxPersonasPerProject;
  if (maxPersonas === null) {
    return next();
  }
  const projectId = req.params.projectId;
  if (!projectId) {
    return next();
  }
  try {
    const personas2 = await storage.getPersonas(projectId);
    if (personas2.length >= maxPersonas) {
      return res.status(403).json({
        error: "Persona limit reached",
        message: `Your plan allows up to ${maxPersonas} personas per project. Upgrade to create more personas.`,
        upgrade_required: true
      });
    }
    next();
  } catch (error) {
    console.error("Error checking persona limit:", error);
    next(error);
  }
}
async function getSubscriptionInfo(req, res) {
  if (!req.user?.id) {
    const freePlan = await storage.getSubscriptionPlanByName("free");
    return res.json({
      plan: freePlan,
      limits: freePlan ? {
        maxProjects: freePlan.maxProjects,
        maxPersonasPerProject: freePlan.maxPersonasPerProject,
        maxUsersPerTeam: freePlan.maxUsersPerTeam,
        aiChatLimit: freePlan.aiChatLimit,
        libraryArticlesCount: freePlan.libraryArticlesCount,
        canCollaborate: freePlan.hasCollaboration ?? false,
        canExportPDF: Array.isArray(freePlan.exportFormats) ? freePlan.exportFormats.includes("pdf") : false,
        canExportPNG: Array.isArray(freePlan.exportFormats) ? freePlan.exportFormats.includes("png") : false,
        canExportCSV: Array.isArray(freePlan.exportFormats) ? freePlan.exportFormats.includes("csv") : false,
        hasPermissionManagement: freePlan.hasPermissionManagement ?? false,
        hasSharedWorkspace: freePlan.hasSharedWorkspace ?? false,
        hasCommentsAndFeedback: freePlan.hasCommentsAndFeedback ?? false
      } : null,
      usage: {
        projects: 0,
        aiChatThisMonth: 0
      }
    });
  }
  try {
    const userSubscription = await storage.getUserActiveSubscription(req.user.id);
    let plan;
    if (userSubscription) {
      plan = await storage.getSubscriptionPlan(userSubscription.planId);
    } else {
      plan = await storage.getSubscriptionPlanByName("free");
    }
    const userProjects = await storage.getProjects(req.user.id);
    res.json({
      plan,
      subscription: userSubscription,
      limits: plan ? {
        maxProjects: plan.maxProjects,
        maxPersonasPerProject: plan.maxPersonasPerProject,
        maxUsersPerTeam: plan.maxUsersPerTeam,
        aiChatLimit: plan.aiChatLimit,
        libraryArticlesCount: plan.libraryArticlesCount,
        canCollaborate: plan.hasCollaboration ?? false,
        canExportPDF: Array.isArray(plan.exportFormats) ? plan.exportFormats.includes("pdf") : false,
        canExportPNG: Array.isArray(plan.exportFormats) ? plan.exportFormats.includes("png") : false,
        canExportCSV: Array.isArray(plan.exportFormats) ? plan.exportFormats.includes("csv") : false,
        hasPermissionManagement: plan.hasPermissionManagement ?? false,
        hasSharedWorkspace: plan.hasSharedWorkspace ?? false,
        hasCommentsAndFeedback: plan.hasCommentsAndFeedback ?? false
      } : null,
      usage: {
        projects: userProjects.length,
        aiChatThisMonth: 0
        // Placeholder
      }
    });
  } catch (error) {
    console.error("Error getting subscription info:", error);
    res.status(500).json({ error: "Failed to get subscription info" });
  }
}

// server/aiService.ts
import OpenAI from "openai";
var openai = null;
function initializeOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn("WARNING: OPENAI_API_KEY not found in environment variables. AI features will be disabled.");
    console.warn("To enable AI features: Add OPENAI_API_KEY to Secrets panel and restart the application.");
    return null;
  }
  try {
    return new OpenAI({ apiKey });
  } catch (error) {
    console.error("ERROR: Failed to initialize OpenAI client:", error);
    return null;
  }
}
openai = initializeOpenAI();
var DesignThinkingAI = class {
  getSystemPrompt(context) {
    const phaseGuides = {
      1: {
        name: "Empatizar",
        description: "compreender profundamente as necessidades dos usu\xE1rios",
        tools: "mapas de empatia, personas, entrevistas, observa\xE7\xF5es",
        questions: "Quem s\xE3o seus usu\xE1rios? Quais suas necessidades, desejos e frustra\xE7\xF5es?"
      },
      2: {
        name: "Definir",
        description: "sintetizar insights para definir o problema principal",
        tools: "declara\xE7\xF5es de ponto de vista (POV), perguntas 'Como Podemos' (HMW)",
        questions: "Qual \xE9 o problema real que precisamos resolver? Como podemos reformular este desafio?"
      },
      3: {
        name: "Idear",
        description: "gerar solu\xE7\xF5es criativas e inovadoras",
        tools: "brainstorming, brainwriting, m\xE9todo das piores ideias",
        questions: "Que solu\xE7\xF5es podemos imaginar? Como podemos pensar fora da caixa?"
      },
      4: {
        name: "Prototipar",
        description: "construir representa\xE7\xF5es r\xE1pidas e simples das ideias",
        tools: "prot\xF3tipos de papel, wireframes, mockups, modelos 3D",
        questions: "Como podemos tornar nossa ideia tang\xEDvel? Que vers\xE3o m\xEDnima podemos testar?"
      },
      5: {
        name: "Testar",
        description: "validar prot\xF3tipos com usu\xE1rios reais",
        tools: "planos de teste, testes de usabilidade, entrevistas de feedback",
        questions: "O que os usu\xE1rios pensam da nossa solu\xE7\xE3o? Que melhorias precisamos fazer?"
      }
    };
    const currentPhaseInfo = phaseGuides[context.currentPhase] || phaseGuides[1];
    return `Voc\xEA \xE9 um mentor experiente em Design Thinking, especializado em guiar equipes atrav\xE9s do processo de inova\xE7\xE3o centrada no usu\xE1rio.

CONTEXTO ATUAL:
- Fase atual: ${currentPhaseInfo.name} (Fase ${context.currentPhase}/5)
- Objetivo da fase: ${currentPhaseInfo.description}
- Ferramentas principais: ${currentPhaseInfo.tools}
- Perguntas-chave: ${currentPhaseInfo.questions}
- N\xEDvel do usu\xE1rio: ${context.userLevel === "beginner" ? "Iniciante" : context.userLevel === "intermediate" ? "Intermedi\xE1rio" : "Avan\xE7ado"}

SUAS RESPONSABILIDADES:
1. Fornecer orienta\xE7\xF5es pr\xE1ticas e espec\xEDficas para a fase atual
2. Sugerir m\xE9todos, ferramentas e exerc\xEDcios apropriados
3. Fazer perguntas instigantes que guiem o pensamento criativo
4. Oferecer exemplos concretos e aplic\xE1veis
5. Adaptar a linguagem ao n\xEDvel de experi\xEAncia do usu\xE1rio
6. Motivar e encorajar a experimenta\xE7\xE3o

ESTILO DE COMUNICA\xC7\xC3O:
- Use um tom amig\xE1vel, encorajador e profissional
- Seja conciso mas informativo
- Fa\xE7a perguntas abertas que estimulem a reflex\xE3o
- Ofere\xE7a sugest\xF5es pr\xE1ticas e acion\xE1veis
- Use exemplos do mundo real quando relevante

FOCO ESPECIAL: ${context.focusArea ? `Concentre-se especialmente em ${context.focusArea}` : "Mantenha foco na fase atual"}.

Responda sempre em portugu\xEAs brasileiro de forma clara e did\xE1tica.`;
  }
  async chat(messages, context) {
    if (!openai) {
      const phaseGuides = {
        1: {
          name: "Empatizar",
          guidance: "foque em entender profundamente seus usu\xE1rios atrav\xE9s de mapas de empatia, personas, entrevistas e observa\xE7\xF5es. Procure descobrir suas necessidades, desejos e frustra\xE7\xF5es."
        },
        2: {
          name: "Definir",
          guidance: "sintetize os insights coletados para definir claramente o problema principal. Use declara\xE7\xF5es de ponto de vista (POV) e perguntas 'Como Podemos' (HMW)."
        },
        3: {
          name: "Idear",
          guidance: "gere o m\xE1ximo de solu\xE7\xF5es criativas poss\xEDvel. Use brainstorming, brainwriting e outras t\xE9cnicas para explorar diferentes abordagens."
        },
        4: {
          name: "Prototipar",
          guidance: "construa vers\xF5es simples e r\xE1pidas das suas melhores ideias. Podem ser prot\xF3tipos de papel, wireframes ou mockups b\xE1sicos."
        },
        5: {
          name: "Testar",
          guidance: "valide seus prot\xF3tipos com usu\xE1rios reais. Colete feedback, observe comportamentos e identifique melhorias necess\xE1rias."
        }
      };
      const currentPhase = phaseGuides[context.currentPhase] || phaseGuides[1];
      return `Ol\xE1! Sou seu mentor de Design Thinking. No momento, as funcionalidades avan\xE7adas de IA est\xE3o indispon\xEDveis, mas posso te orientar com base na metodologia.

Voc\xEA est\xE1 na Fase ${context.currentPhase} - ${currentPhase.name}. Nesta etapa, ${currentPhase.guidance}

Algumas dicas pr\xE1ticas:
\u2022 Use as ferramentas dispon\xEDveis na plataforma para documentar seu progresso
\u2022 Mantenha sempre o foco no usu\xE1rio e suas necessidades
\u2022 N\xE3o tenha pressa - cada fase tem sua import\xE2ncia no processo
\u2022 Colabore com sua equipe e compartilhe insights

Para funcionalidades avan\xE7adas de IA, configure a chave da API OpenAI nos Secrets do Replit. Posso te ajudar com mais alguma orienta\xE7\xE3o sobre Design Thinking?`;
    }
    try {
      const systemPrompt = this.getSystemPrompt(context);
      const openaiMessages = [
        { role: "system", content: systemPrompt },
        ...messages.map((msg) => ({
          role: msg.role,
          content: msg.content
        }))
      ];
      const response = await openai.chat.completions.create({
        model: "gpt-5",
        // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
        messages: openaiMessages,
        max_tokens: 1e3
        // Note: gpt-5 doesn't support temperature parameter, removed as per blueprint
      });
      return response.choices[0].message.content || "Desculpe, n\xE3o consegui gerar uma resposta. Tente novamente.";
    } catch (error) {
      console.error("Erro no chat da IA:", error);
      throw new Error("Erro ao processar sua mensagem. Verifique se a chave da API OpenAI est\xE1 configurada corretamente.");
    }
  }
  async generateSuggestions(context, currentTopic) {
    if (!openai) {
      return [
        "Como podemos entender melhor nossos usu\xE1rios?",
        "Que ferramentas seriam mais \xFAteis nesta fase?",
        "Qual seria o pr\xF3ximo passo mais importante?"
      ];
    }
    try {
      const prompt = `Baseado no contexto de Design Thinking na fase ${context.currentPhase} e no t\xF3pico "${currentTopic}", gere 3 sugest\xF5es pr\xE1ticas e espec\xEDficas de pr\xF3ximos passos ou perguntas relevantes. Responda em formato JSON com um array de strings chamado "suggestions".`;
      const response = await openai.chat.completions.create({
        model: "gpt-5",
        // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
        messages: [
          { role: "system", content: this.getSystemPrompt(context) },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        max_tokens: 500
        // Note: gpt-5 doesn't support temperature parameter, removed as per blueprint
      });
      const result = JSON.parse(response.choices[0].message.content || '{"suggestions": []}');
      return result.suggestions || [];
    } catch (error) {
      console.error("Erro ao gerar sugest\xF5es:", error);
      return [
        "Como podemos entender melhor nossos usu\xE1rios?",
        "Que ferramentas seriam mais \xFAteis nesta fase?",
        "Qual seria o pr\xF3ximo passo mais importante?"
      ];
    }
  }
  async analyzeProjectPhase(projectData, currentPhase) {
    try {
      const prompt = `Analise os dados do projeto de Design Thinking e forne\xE7a insights sobre a fase ${currentPhase}. 

      Dados do projeto: ${JSON.stringify(projectData, null, 2)}

      Forne\xE7a sua an\xE1lise em formato JSON com:
      - "insights": array de strings com insights sobre o progresso
      - "nextSteps": array de strings com pr\xF3ximos passos recomendados  
      - "completeness": n\xFAmero de 0 a 100 indicando o percentual de completude da fase`;
      if (!openai) {
        return {
          insights: ["An\xE1lise n\xE3o dispon\xEDvel no momento"],
          nextSteps: ["Continue trabalhando nas ferramentas da fase atual"],
          completeness: 0
        };
      }
      const response = await openai.chat.completions.create({
        model: "gpt-5",
        // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
        messages: [
          { role: "system", content: this.getSystemPrompt({ currentPhase, userLevel: "intermediate" }) },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        max_tokens: 800
        // Note: gpt-5 doesn't support temperature parameter, removed as per blueprint
      });
      const result = JSON.parse(response.choices[0].message.content || '{"insights": [], "nextSteps": [], "completeness": 0}');
      return {
        insights: result.insights || [],
        nextSteps: result.nextSteps || [],
        completeness: Math.max(0, Math.min(100, result.completeness || 0))
      };
    } catch (error) {
      console.error("Erro ao analisar fase do projeto:", error);
      return {
        insights: ["An\xE1lise n\xE3o dispon\xEDvel no momento"],
        nextSteps: ["Continue trabalhando nas ferramentas da fase atual"],
        completeness: 0
      };
    }
  }
  async analyzeCompleteProject(analysisData) {
    if (!openai) {
      return this.generateMockAnalysis(analysisData);
    }
    try {
      const prompt = `Como especialista em Design Thinking, analise este projeto completo e forne\xE7a uma an\xE1lise abrangente.

DADOS DO PROJETO:
${JSON.stringify(analysisData, null, 2)}

Forne\xE7a uma an\xE1lise completa em formato JSON com a seguinte estrutura:

{
  "executiveSummary": "Resumo executivo do projeto (2-3 frases)",
  "maturityScore": numero de 1-10 indicando maturidade geral do projeto,
  "overallInsights": ["insight geral 1", "insight geral 2", "..."],
  "attentionPoints": ["ponto que precisa aten\xE7\xE3o 1", "ponto que precisa aten\xE7\xE3o 2", "..."],
  "priorityNextSteps": ["pr\xF3ximo passo priorit\xE1rio 1", "pr\xF3ximo passo priorit\xE1rio 2", "..."],
  "phaseAnalyses": [
    {
      "phase": 1,
      "phaseName": "Empatizar",
      "completeness": numero 0-100,
      "quality": numero 0-100,
      "insights": ["insight espec\xEDfico da fase"],
      "gaps": ["gap ou oportunidade perdida"],
      "recommendations": ["recomenda\xE7\xE3o espec\xEDfica"],
      "strengths": ["ponto forte da fase"]
    },
    // ... para cada uma das 5 fases
  ],
  "consistency": {
    "score": numero 0-100,
    "issues": ["problema de consist\xEAncia"],
    "strengths": ["ponto forte de consist\xEAncia"]
  },
  "alignment": {
    "problemSolutionAlignment": numero 0-100,
    "researchInsightsAlignment": numero 0-100,
    "comments": ["coment\xE1rio sobre alinhamento"]
  },
  "recommendations": {
    "immediate": ["a\xE7\xE3o imediata"],
    "shortTerm": ["a\xE7\xE3o de curto prazo"],
    "longTerm": ["a\xE7\xE3o de longo prazo"]
  }
}

CRIT\xC9RIOS DE AN\xC1LISE:
1. Completeness: Verifique se cada fase tem ferramentas suficientes e bem desenvolvidas
2. Quality: Avalie a profundidade e relev\xE2ncia dos insights e dados coletados
3. Consistency: Analise se h\xE1 fluxo l\xF3gico e consist\xEAncia entre as fases
4. Alignment: Verifique se as solu\xE7\xF5es propostas realmente abordam os problemas identificados
5. Research Quality: Avalie se a pesquisa de usu\xE1rio foi robusta o suficiente
6. Innovation: Considere o n\xEDvel de criatividade e inova\xE7\xE3o das solu\xE7\xF5es
7. Feasibility: Analise a viabilidade das solu\xE7\xF5es propostas
8. User-Centricity: Verifique se o foco no usu\xE1rio \xE9 mantido consistentemente

Seja espec\xEDfico, construtivo e ofere\xE7a insights acion\xE1veis. Responda em portugu\xEAs brasileiro.`;
      const response = await openai.chat.completions.create({
        model: "gpt-5",
        // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: `Voc\xEA \xE9 um especialista s\xEAnior em Design Thinking com 15+ anos de experi\xEAncia, conhecido por an\xE1lises profundas e insights transformadores. Analise projetos com rigor acad\xEAmico mas linguagem acess\xEDvel.`
          },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        max_tokens: 3e3
        // Note: gpt-5 doesn't support temperature parameter, removed as per blueprint
      });
      const result = JSON.parse(response.choices[0].message.content || "{}");
      return {
        executiveSummary: result.executiveSummary || "An\xE1lise do projeto n\xE3o p\xF4de ser completada.",
        maturityScore: Math.max(1, Math.min(10, result.maturityScore || 5)),
        overallInsights: result.overallInsights || ["An\xE1lise detalhada n\xE3o dispon\xEDvel no momento."],
        attentionPoints: result.attentionPoints || ["Verificar dados do projeto."],
        priorityNextSteps: result.priorityNextSteps || ["Continuar desenvolvimento do projeto."],
        phaseAnalyses: result.phaseAnalyses || this.getDefaultPhaseAnalyses(),
        consistency: {
          score: Math.max(0, Math.min(100, result.consistency?.score || 50)),
          issues: result.consistency?.issues || ["Dados insuficientes para an\xE1lise de consist\xEAncia."],
          strengths: result.consistency?.strengths || ["Projeto em desenvolvimento."]
        },
        alignment: {
          problemSolutionAlignment: Math.max(0, Math.min(100, result.alignment?.problemSolutionAlignment || 50)),
          researchInsightsAlignment: Math.max(0, Math.min(100, result.alignment?.researchInsightsAlignment || 50)),
          comments: result.alignment?.comments || ["Necess\xE1rio mais dados para avaliar alinhamento."]
        },
        recommendations: {
          immediate: result.recommendations?.immediate || ["Continuar coletando dados de usu\xE1rio."],
          shortTerm: result.recommendations?.shortTerm || ["Desenvolver ferramentas das fases atuais."],
          longTerm: result.recommendations?.longTerm || ["Planejar testes com usu\xE1rios reais."]
        }
      };
    } catch (error) {
      console.error("Erro ao analisar projeto completo:", error);
      return {
        executiveSummary: "N\xE3o foi poss\xEDvel gerar an\xE1lise completa neste momento. Verifique a configura\xE7\xE3o da API OpenAI.",
        maturityScore: 5,
        overallInsights: ["An\xE1lise autom\xE1tica indispon\xEDvel. Continue desenvolvendo o projeto seguindo as melhores pr\xE1ticas de Design Thinking."],
        attentionPoints: ["Servi\xE7o de an\xE1lise IA temporariamente indispon\xEDvel."],
        priorityNextSteps: ["Revisar dados do projeto e tentar an\xE1lise novamente."],
        phaseAnalyses: this.getDefaultPhaseAnalyses(),
        consistency: {
          score: 50,
          issues: ["An\xE1lise de consist\xEAncia indispon\xEDvel."],
          strengths: ["Continue seguindo a metodologia Design Thinking."]
        },
        alignment: {
          problemSolutionAlignment: 50,
          researchInsightsAlignment: 50,
          comments: ["An\xE1lise de alinhamento indispon\xEDvel no momento."]
        },
        recommendations: {
          immediate: ["Verificar configura\xE7\xF5es do sistema."],
          shortTerm: ["Continuar desenvolvimento seguindo metodologia."],
          longTerm: ["Considerar an\xE1lise manual com especialista."]
        }
      };
    }
  }
  generateMockAnalysis(analysisData) {
    const empathyDataCount = (analysisData.empathyMaps?.length || 0) + (analysisData.personas?.length || 0) + (analysisData.interviews?.length || 0) + (analysisData.observations?.length || 0);
    const defineDataCount = analysisData.povStatements?.length || 0;
    const ideateDataCount = analysisData.ideas?.length || 0;
    const prototypeDataCount = analysisData.prototypes?.length || 0;
    const testDataCount = (analysisData.testPlans?.length || 0) + (analysisData.testResults?.length || 0);
    const maturityScore = Math.min(
      10,
      Math.round(2 + empathyDataCount * 0.5 + defineDataCount * 0.8 + ideateDataCount * 0.3 + prototypeDataCount * 1.2 + testDataCount * 1.5)
    );
    return {
      executiveSummary: `Projeto ${analysisData.project?.name || "DTTools"} est\xE1 na fase ${analysisData.project?.currentPhase || 1} do Design Thinking. ${empathyDataCount > 0 ? "Demonstra boa base de pesquisa emp\xE1tica." : "Recomenda-se ampliar pesquisa com usu\xE1rios."} An\xE1lise baseada em dados demonstrativos.`,
      maturityScore,
      overallInsights: [
        empathyDataCount > 2 ? "Excelente trabalho na fase de Empatia" : "Ampliar pesquisa emp\xE1tica trar\xE1 mais insights",
        "Continue seguindo a metodologia estruturada do Design Thinking",
        "Dados coletados demonstram potencial para solu\xE7\xF5es inovadoras"
      ],
      attentionPoints: [
        empathyDataCount === 0 ? "Necess\xE1rio coletar mais dados de usu\xE1rios" : "Considerar diversificar m\xE9todos de pesquisa",
        defineDataCount === 0 ? "Definir claramente o problema central" : "Refinar defini\xE7\xE3o do problema",
        "Para an\xE1lise completa, configure a chave da API OpenAI"
      ],
      priorityNextSteps: [
        analysisData.project?.currentPhase === 1 ? "Finalizar ferramentas da fase Empatizar" : "Avan\xE7ar para pr\xF3xima fase",
        "Documentar todos os insights coletados",
        "Revisar progresso com equipe regularmente"
      ],
      phaseAnalyses: this.generateSmartPhaseAnalyses(empathyDataCount, defineDataCount, ideateDataCount, prototypeDataCount, testDataCount),
      consistency: {
        score: Math.min(100, 40 + empathyDataCount * 10 + defineDataCount * 15),
        issues: empathyDataCount < 2 ? ["Necess\xE1rio mais dados de empatia"] : ["Continuar coletando feedback"],
        strengths: ["Seguindo metodologia Design Thinking", "Estrutura de projeto bem organizada"]
      },
      alignment: {
        problemSolutionAlignment: empathyDataCount > 0 ? 75 : 45,
        researchInsightsAlignment: defineDataCount > 0 ? 80 : 50,
        comments: ["Projeto demonstra entendimento da metodologia", "Continue aprofundando pesquisa com usu\xE1rios"]
      },
      recommendations: {
        immediate: [
          empathyDataCount === 0 ? "Criar mapas de empatia e personas" : "Analisar dados coletados",
          "Documentar insights principais"
        ],
        shortTerm: [
          "Avan\xE7ar para pr\xF3xima fase do Design Thinking",
          "Validar hip\xF3teses com mais usu\xE1rios"
        ],
        longTerm: [
          "Implementar processo cont\xEDnuo de feedback",
          "Considerar consultoria especializada para an\xE1lises avan\xE7adas"
        ]
      }
    };
  }
  generateSmartPhaseAnalyses(empathy, define, ideate, prototype, test) {
    return [
      {
        phase: 1,
        phaseName: "Empatizar",
        completeness: Math.min(100, empathy * 25),
        quality: empathy > 2 ? 85 : empathy > 0 ? 65 : 30,
        insights: empathy > 0 ? [`${empathy} ferramentas de empatia criadas`, "Base s\xF3lida para entender usu\xE1rios"] : ["Fase iniciada, continuar coletando dados"],
        gaps: empathy < 2 ? ["Ampliar m\xE9todos de pesquisa emp\xE1tica"] : ["Considerar entrevistas adicionais"],
        recommendations: empathy === 0 ? ["Come\xE7ar com mapas de empatia"] : ["Analisar padr\xF5es nos dados coletados"],
        strengths: empathy > 0 ? ["Dados emp\xE1ticos coletados"] : ["Estrutura preparada para pesquisa"]
      },
      {
        phase: 2,
        phaseName: "Definir",
        completeness: Math.min(100, define * 30),
        quality: define > 0 ? 70 : 25,
        insights: define > 0 ? ["Problema come\xE7ando a ser definido"] : ["Aguardando defini\xE7\xE3o do problema"],
        gaps: define === 0 ? ["Criar declara\xE7\xF5es POV"] : ["Expandir defini\xE7\xE3o do problema"],
        recommendations: ["Sintetizar insights da fase anterior"],
        strengths: define > 0 ? ["Processo de defini\xE7\xE3o iniciado"] : ["Preparado para definir problema"]
      },
      {
        phase: 3,
        phaseName: "Idear",
        completeness: Math.min(100, ideate * 20),
        quality: ideate > 0 ? 60 : 20,
        insights: ideate > 0 ? ["Processo criativo iniciado"] : ["Aguardando idea\xE7\xE3o"],
        gaps: ["Gerar mais diversidade de ideias"],
        recommendations: ["Usar t\xE9cnicas de brainstorming"],
        strengths: ideate > 0 ? ["Criatividade aplicada"] : ["Potencial criativo"]
      },
      {
        phase: 4,
        phaseName: "Prototipar",
        completeness: Math.min(100, prototype * 25),
        quality: prototype > 0 ? 65 : 15,
        insights: prototype > 0 ? ["Ideias sendo materializadas"] : ["Aguardando prototipagem"],
        gaps: ["Criar prot\xF3tipos test\xE1veis"],
        recommendations: ["Focar em prot\xF3tipos r\xE1pidos"],
        strengths: prototype > 0 ? ["Pensamento tang\xEDvel"] : ["Preparado para prototipar"]
      },
      {
        phase: 5,
        phaseName: "Testar",
        completeness: Math.min(100, test * 30),
        quality: test > 0 ? 70 : 10,
        insights: test > 0 ? ["Valida\xE7\xE3o com usu\xE1rios iniciada"] : ["Aguardando testes"],
        gaps: ["Testar com usu\xE1rios reais"],
        recommendations: ["Planejar sess\xF5es de teste"],
        strengths: test > 0 ? ["Foco na valida\xE7\xE3o"] : ["Estrutura para testes"]
      }
    ];
  }
  getDefaultPhaseAnalyses() {
    const phases = [
      { phase: 1, name: "Empatizar" },
      { phase: 2, name: "Definir" },
      { phase: 3, name: "Idear" },
      { phase: 4, name: "Prototipar" },
      { phase: 5, name: "Testar" }
    ];
    return phases.map((p) => ({
      phase: p.phase,
      phaseName: p.name,
      completeness: 50,
      quality: 50,
      insights: [`Fase ${p.name} em desenvolvimento.`],
      gaps: ["Dados insuficientes para an\xE1lise detalhada."],
      recommendations: [`Continue trabalhando nas ferramentas da fase ${p.name}.`],
      strengths: ["Seguindo metodologia correta."]
    }));
  }
};
var designThinkingAI = new DesignThinkingAI();

// server/routes.ts
init_geminiService();
var stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil"
}) : null;
if (!stripe) {
  console.warn("\u26A0\uFE0F  STRIPE_SECRET_KEY not set - payment features will be disabled");
}
function requireAuth(req, res, next) {
  if (!req.session?.userId) {
    return res.status(401).json({ error: "Authentication required" });
  }
  if (req.session.user) {
    req.user = req.session.user;
  }
  next();
}
function requireAdmin(req, res, next) {
  if (!req.session?.userId || !req.session?.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  if (req.session.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  req.user = req.session.user;
  next();
}
var storage_config = multer.memoryStorage();
var upload = multer({
  storage: storage_config,
  limits: {
    fileSize: 50 * 1024 * 1024
    // 50MB limit - increased to match express.json
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Apenas arquivos de imagem s\xE3o permitidos"));
    }
  }
});
function ensureUploadDirectory() {
  const uploadDir = path.join(process.cwd(), "public", "uploads", "avatars");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  return uploadDir;
}
var recentProjectCreations = /* @__PURE__ */ new Map();
var DUPLICATE_PREVENTION_WINDOW_MS = 3e3;
setInterval(() => {
  const now = Date.now();
  const entries = Array.from(recentProjectCreations.entries());
  for (const [key, record] of entries) {
    if (now - record.timestamp > DUPLICATE_PREVENTION_WINDOW_MS) {
      recentProjectCreations.delete(key);
    }
  }
}, 5e3);
function isDuplicateProjectCreation(userId, projectName) {
  const key = `${userId}:${projectName.trim().toLowerCase()}`;
  const existing = recentProjectCreations.get(key);
  if (!existing) {
    return false;
  }
  const now = Date.now();
  const timeSinceCreation = now - existing.timestamp;
  return timeSinceCreation < DUPLICATE_PREVENTION_WINDOW_MS;
}
function recordProjectCreation(userId, projectName) {
  const key = `${userId}:${projectName.trim().toLowerCase()}`;
  recentProjectCreations.set(key, {
    name: projectName,
    userId,
    timestamp: Date.now()
  });
}
async function registerRoutes(app2) {
  app2.get("/api/subscription-info", requireAuth, getSubscriptionInfo);
  app2.get("/api/projects", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const projects2 = await storage.getProjects(userId);
      res.json(projects2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });
  app2.get("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const project = await storage.getProject(req.params.id, userId);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });
  app2.post("/api/projects", requireAuth, checkProjectLimit, async (req, res) => {
    try {
      console.log("Creating project - Request body:", req.body);
      console.log("User session:", req.session?.userId ? "authenticated" : "not authenticated");
      const validatedData = insertProjectSchema.parse(req.body);
      console.log("Data validated successfully:", validatedData);
      const userId = req.session.userId;
      if (isDuplicateProjectCreation(userId, validatedData.name)) {
        console.log(`Duplicate project creation attempt blocked for user ${userId}:`, validatedData.name);
        return res.status(409).json({
          error: "Projeto duplicado detectado",
          message: "Voc\xEA j\xE1 criou um projeto com este nome recentemente. Por favor, aguarde alguns segundos antes de tentar novamente."
        });
      }
      recordProjectCreation(userId, validatedData.name);
      const project = await storage.createProject({ ...validatedData, userId });
      console.log("Project created successfully:", project.id);
      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      if (error && typeof error === "object" && "issues" in error) {
        const validationError = error;
        return res.status(400).json({
          error: "Dados do projeto inv\xE1lidos",
          details: validationError.issues?.map((issue) => ({
            field: issue.path?.join("."),
            message: issue.message
          }))
        });
      }
      res.status(500).json({ error: "Erro interno do servidor. Tente novamente." });
    }
  });
  app2.put("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const validatedData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(req.params.id, userId, validatedData);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      try {
        const existingBackups = await storage.getProjectBackups(req.params.id);
        const lastBackup = existingBackups[0];
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1e3);
        if (!lastBackup || lastBackup.createdAt && new Date(lastBackup.createdAt) < oneHourAgo) {
          await storage.createProjectBackup(req.params.id, userId, "auto", "Backup autom\xE1tico ap\xF3s atualiza\xE7\xE3o");
        }
      } catch (backupError) {
        console.error("Error creating automatic backup:", backupError);
      }
      res.json(project);
    } catch (error) {
      res.status(400).json({ error: "Invalid project data" });
    }
  });
  app2.delete("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const success = await storage.deleteProject(req.params.id, userId);
      if (!success) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete project" });
    }
  });
  app2.get("/api/projects/:projectId/empathy-maps", requireAuth, async (req, res) => {
    try {
      const empathyMaps2 = await storage.getEmpathyMaps(req.params.projectId);
      res.json(empathyMaps2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch empathy maps" });
    }
  });
  app2.post("/api/projects/:projectId/empathy-maps", requireAuth, async (req, res) => {
    try {
      const validatedData = insertEmpathyMapSchema.parse({
        ...req.body,
        projectId: req.params.projectId
      });
      const empathyMap = await storage.createEmpathyMap(validatedData);
      res.status(201).json(empathyMap);
    } catch (error) {
      res.status(400).json({ error: "Invalid empathy map data" });
    }
  });
  app2.put("/api/empathy-maps/:id", requireAuth, async (req, res) => {
    try {
      const validatedData = insertEmpathyMapSchema.omit({ projectId: true }).partial().parse(req.body);
      const empathyMap = await storage.updateEmpathyMap(req.params.id, validatedData);
      if (!empathyMap) {
        return res.status(404).json({ error: "Empathy map not found" });
      }
      res.json(empathyMap);
    } catch (error) {
      res.status(400).json({ error: "Invalid empathy map data" });
    }
  });
  app2.delete("/api/empathy-maps/:id", requireAuth, async (req, res) => {
    try {
      const success = await storage.deleteEmpathyMap(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Empathy map not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete empathy map" });
    }
  });
  app2.post("/api/upload/avatar", requireAuth, upload.single("avatar"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Nenhum arquivo enviado" });
      }
      const uploadDir = ensureUploadDirectory();
      const fileName = `avatar-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
      const filePath = path.join(uploadDir, fileName);
      await sharp(req.file.buffer).resize(200, 200, {
        fit: "cover",
        position: "center"
      }).jpeg({
        quality: 85,
        progressive: true
      }).toFile(filePath);
      const avatarUrl = `/uploads/avatars/${fileName}`;
      res.json({ url: avatarUrl });
    } catch (error) {
      console.error("Erro no upload:", error);
      res.status(500).json({ error: "Erro ao processar upload" });
    }
  });
  app2.get("/api/projects/:projectId/personas", requireAuth, async (req, res) => {
    try {
      const personas2 = await storage.getPersonas(req.params.projectId);
      res.json(personas2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch personas" });
    }
  });
  app2.post("/api/projects/:projectId/personas", requireAuth, checkPersonaLimit, async (req, res) => {
    try {
      const validatedData = insertPersonaSchema.parse({
        ...req.body,
        projectId: req.params.projectId
      });
      const persona = await storage.createPersona(validatedData);
      res.status(201).json(persona);
    } catch (error) {
      res.status(400).json({ error: "Invalid persona data" });
    }
  });
  app2.put("/api/personas/:id", requireAuth, async (req, res) => {
    try {
      const validatedData = insertPersonaSchema.omit({ projectId: true }).partial().parse(req.body);
      const persona = await storage.updatePersona(req.params.id, validatedData);
      if (!persona) {
        return res.status(404).json({ error: "Persona not found" });
      }
      res.json(persona);
    } catch (error) {
      res.status(400).json({ error: "Invalid persona data" });
    }
  });
  app2.delete("/api/personas/:id", requireAuth, async (req, res) => {
    try {
      const success = await storage.deletePersona(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Persona not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete persona" });
    }
  });
  app2.get("/api/projects/:projectId/interviews", requireAuth, async (req, res) => {
    try {
      const interviews2 = await storage.getInterviews(req.params.projectId);
      res.json(interviews2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch interviews" });
    }
  });
  app2.post("/api/projects/:projectId/interviews", requireAuth, async (req, res) => {
    try {
      console.log("Interview creation request:", {
        projectId: req.params.projectId,
        body: req.body
      });
      const questions = Array.isArray(req.body.questions) ? req.body.questions : [];
      const responses = Array.isArray(req.body.responses) ? req.body.responses : [];
      console.log("Questions/Responses:", { questions, responses });
      const validPairs = questions.map((q, i) => ({
        question: String(q || "").trim(),
        response: String(responses[i] || "").trim()
      })).filter((pair) => pair.question !== "");
      console.log("Valid pairs:", validPairs);
      const dataToValidate = {
        ...req.body,
        projectId: req.params.projectId,
        date: typeof req.body.date === "string" ? new Date(req.body.date) : req.body.date,
        questions: validPairs.map((p) => p.question),
        responses: validPairs.map((p) => p.response)
      };
      console.log("Data to validate:", dataToValidate);
      const validatedData = insertInterviewSchema.parse(dataToValidate);
      console.log("Data validated successfully");
      const interview = await storage.createInterview(validatedData);
      console.log("Interview created:", interview.id);
      res.status(201).json(interview);
    } catch (error) {
      console.error("Interview creation error:", error);
      res.status(400).json({
        error: "Invalid interview data",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.put("/api/interviews/:id", requireAuth, async (req, res) => {
    try {
      const validatedData = insertInterviewSchema.omit({ projectId: true }).partial().parse(req.body);
      const interview = await storage.updateInterview(req.params.id, validatedData);
      if (!interview) {
        return res.status(404).json({ error: "Interview not found" });
      }
      res.json(interview);
    } catch (error) {
      res.status(400).json({ error: "Invalid interview data" });
    }
  });
  app2.delete("/api/interviews/:id", requireAuth, async (req, res) => {
    try {
      const success = await storage.deleteInterview(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Interview not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete interview" });
    }
  });
  app2.get("/api/projects/:projectId/observations", requireAuth, async (req, res) => {
    try {
      const observations2 = await storage.getObservations(req.params.projectId);
      res.json(observations2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch observations" });
    }
  });
  app2.post("/api/projects/:projectId/observations", requireAuth, async (req, res) => {
    try {
      console.log("Creating observation - Request body:", JSON.stringify(req.body, null, 2));
      console.log("Project ID:", req.params.projectId);
      const dataToValidate = {
        ...req.body,
        projectId: req.params.projectId,
        // Converter string de data para Date object se necessário
        date: req.body.date ? new Date(req.body.date) : /* @__PURE__ */ new Date()
      };
      console.log("Data to validate:", JSON.stringify(dataToValidate, null, 2));
      const validatedData = insertObservationSchema.parse(dataToValidate);
      console.log("Data validated successfully:", JSON.stringify(validatedData, null, 2));
      const observation = await storage.createObservation(validatedData);
      res.status(201).json(observation);
    } catch (error) {
      console.error("Observation validation error:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        res.status(400).json({ error: "Invalid observation data", details: error.message });
      } else {
        res.status(400).json({ error: "Invalid observation data" });
      }
    }
  });
  app2.put("/api/observations/:id", requireAuth, async (req, res) => {
    try {
      const validatedData = insertObservationSchema.omit({ projectId: true }).partial().parse(req.body);
      const observation = await storage.updateObservation(req.params.id, validatedData);
      if (!observation) {
        return res.status(404).json({ error: "Observation not found" });
      }
      res.json(observation);
    } catch (error) {
      res.status(400).json({ error: "Invalid observation data" });
    }
  });
  app2.delete("/api/observations/:id", requireAuth, async (req, res) => {
    try {
      const success = await storage.deleteObservation(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Observation not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete observation" });
    }
  });
  app2.get("/api/projects/:projectId/pov-statements", requireAuth, async (req, res) => {
    try {
      const povStatements2 = await storage.getPovStatements(req.params.projectId);
      res.json(povStatements2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch POV statements" });
    }
  });
  app2.post("/api/projects/:projectId/pov-statements", requireAuth, async (req, res) => {
    try {
      const validatedData = insertPovStatementSchema.parse({
        ...req.body,
        projectId: req.params.projectId
      });
      const povStatement = await storage.createPovStatement(validatedData);
      res.status(201).json(povStatement);
    } catch (error) {
      res.status(400).json({ error: "Invalid POV statement data" });
    }
  });
  app2.put("/api/pov-statements/:id", requireAuth, async (req, res) => {
    try {
      const existingPovStatement = await storage.getPovStatement(req.params.id);
      if (!existingPovStatement) {
        return res.status(404).json({ error: "POV statement not found" });
      }
      const validatedData = insertPovStatementSchema.omit({ projectId: true }).partial().parse(req.body);
      const povStatement = await storage.updatePovStatement(req.params.id, validatedData);
      if (!povStatement) {
        return res.status(404).json({ error: "POV statement not found" });
      }
      res.json(povStatement);
    } catch (error) {
      res.status(400).json({ error: "Invalid POV statement data" });
    }
  });
  app2.delete("/api/pov-statements/:id", requireAuth, async (req, res) => {
    try {
      const existingPovStatement = await storage.getPovStatement(req.params.id);
      if (!existingPovStatement) {
        return res.status(404).json({ error: "POV statement not found" });
      }
      const success = await storage.deletePovStatement(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "POV statement not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete POV statement" });
    }
  });
  app2.get("/api/projects/:projectId/hmw-questions", requireAuth, async (req, res) => {
    try {
      const hmwQuestions2 = await storage.getHmwQuestions(req.params.projectId);
      res.json(hmwQuestions2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch HMW questions" });
    }
  });
  app2.post("/api/projects/:projectId/hmw-questions", requireAuth, async (req, res) => {
    try {
      const validatedData = insertHmwQuestionSchema.parse({
        ...req.body,
        projectId: req.params.projectId
      });
      const hmwQuestion = await storage.createHmwQuestion(validatedData);
      res.status(201).json(hmwQuestion);
    } catch (error) {
      res.status(400).json({ error: "Invalid HMW question data" });
    }
  });
  app2.put("/api/hmw-questions/:id", requireAuth, async (req, res) => {
    try {
      const existingHmwQuestion = await storage.getHmwQuestion(req.params.id);
      if (!existingHmwQuestion) {
        return res.status(404).json({ error: "HMW question not found" });
      }
      const validatedData = insertHmwQuestionSchema.omit({ projectId: true }).partial().parse(req.body);
      const hmwQuestion = await storage.updateHmwQuestion(req.params.id, validatedData);
      if (!hmwQuestion) {
        return res.status(404).json({ error: "HMW question not found" });
      }
      res.json(hmwQuestion);
    } catch (error) {
      res.status(400).json({ error: "Invalid HMW question data" });
    }
  });
  app2.delete("/api/hmw-questions/:id", requireAuth, async (req, res) => {
    try {
      const existingHmwQuestion = await storage.getHmwQuestion(req.params.id);
      if (!existingHmwQuestion) {
        return res.status(404).json({ error: "HMW question not found" });
      }
      const success = await storage.deleteHmwQuestion(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "HMW question not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete HMW question" });
    }
  });
  app2.get("/api/projects/:projectId/ideas", requireAuth, async (req, res) => {
    try {
      const ideas2 = await storage.getIdeas(req.params.projectId);
      res.json(ideas2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ideas" });
    }
  });
  app2.post("/api/projects/:projectId/ideas", requireAuth, async (req, res) => {
    try {
      const validatedData = insertIdeaSchema.parse({
        ...req.body,
        projectId: req.params.projectId
      });
      const idea = await storage.createIdea(validatedData);
      res.status(201).json(idea);
    } catch (error) {
      res.status(400).json({ error: "Invalid idea data" });
    }
  });
  app2.put("/api/ideas/:id", requireAuth, async (req, res) => {
    try {
      const validatedData = insertIdeaSchema.omit({ projectId: true }).partial().parse(req.body);
      const idea = await storage.updateIdea(req.params.id, validatedData);
      if (!idea) {
        return res.status(404).json({ error: "Idea not found" });
      }
      res.json(idea);
    } catch (error) {
      res.status(400).json({ error: "Invalid idea data" });
    }
  });
  app2.delete("/api/ideas/:id", requireAuth, async (req, res) => {
    try {
      const success = await storage.deleteIdea(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Idea not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete idea" });
    }
  });
  app2.get("/api/projects/:projectId/prototypes", requireAuth, async (req, res) => {
    try {
      const prototypes2 = await storage.getPrototypes(req.params.projectId);
      res.json(prototypes2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch prototypes" });
    }
  });
  app2.post("/api/projects/:projectId/prototypes", requireAuth, async (req, res) => {
    try {
      const validatedData = insertPrototypeSchema.parse({
        ...req.body,
        projectId: req.params.projectId
      });
      const prototype = await storage.createPrototype(validatedData);
      res.status(201).json(prototype);
    } catch (error) {
      res.status(400).json({ error: "Invalid prototype data" });
    }
  });
  app2.get("/api/projects/:projectId/test-plans", requireAuth, async (req, res) => {
    try {
      const testPlans2 = await storage.getTestPlans(req.params.projectId);
      res.json(testPlans2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch test plans" });
    }
  });
  app2.post("/api/projects/:projectId/test-plans", requireAuth, async (req, res) => {
    try {
      const validatedData = insertTestPlanSchema.parse({
        ...req.body,
        projectId: req.params.projectId
      });
      const testPlan = await storage.createTestPlan(validatedData);
      res.status(201).json(testPlan);
    } catch (error) {
      res.status(400).json({ error: "Invalid test plan data" });
    }
  });
  app2.get("/api/test-plans/:testPlanId/results", requireAuth, async (req, res) => {
    try {
      const testResults2 = await storage.getTestResults(req.params.testPlanId);
      res.json(testResults2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch test results" });
    }
  });
  app2.post("/api/test-plans/:testPlanId/results", requireAuth, async (req, res) => {
    try {
      const validatedData = insertTestResultSchema.parse({
        ...req.body,
        testPlanId: req.params.testPlanId
      });
      const testResult = await storage.createTestResult(validatedData);
      res.status(201).json(testResult);
    } catch (error) {
      res.status(400).json({ error: "Invalid test result data" });
    }
  });
  app2.get("/api/users/:userId/projects/:projectId/progress", requireAuth, async (req, res) => {
    try {
      const progress = await storage.getUserProgress(req.params.userId, req.params.projectId);
      if (!progress) {
        return res.status(404).json({ error: "Progress not found" });
      }
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user progress" });
    }
  });
  app2.put("/api/users/:userId/projects/:projectId/progress", requireAuth, async (req, res) => {
    try {
      const validatedData = insertUserProgressSchema.parse({
        ...req.body,
        userId: req.params.userId,
        projectId: req.params.projectId
      });
      const progress = await storage.updateUserProgress(validatedData);
      res.json(progress);
    } catch (error) {
      res.status(400).json({ error: "Invalid progress data" });
    }
  });
  app2.get("/api/projects/:projectId/stats", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const stats = await storage.getProjectStats(req.params.projectId, userId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project stats" });
    }
  });
  app2.get("/api/dashboard", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const projects2 = await storage.getProjects(userId);
      const totalProjects = projects2.length;
      const activeProjects = projects2.filter((p) => p.status === "in_progress").length;
      const completedProjects = projects2.filter((p) => p.status === "completed").length;
      const avgCompletion = projects2.length > 0 ? projects2.reduce((sum, p) => sum + (p.completionRate || 0), 0) / projects2.length : 0;
      res.json({
        totalProjects,
        activeProjects,
        completedProjects,
        avgCompletion: Math.round(avgCompletion),
        recentProjects: projects2.slice(-3).reverse()
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard data" });
    }
  });
  app2.get("/api/articles", async (_req, res) => {
    try {
      const articles2 = await storage.getArticles();
      res.json(articles2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  });
  app2.get("/api/articles/category/:category", async (req, res) => {
    try {
      const articles2 = await storage.getArticlesByCategory(req.params.category);
      res.json(articles2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch articles by category" });
    }
  });
  app2.get("/api/articles/:id", async (req, res) => {
    try {
      const article = await storage.getArticle(req.params.id);
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch article" });
    }
  });
  app2.post("/api/articles", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertArticleSchema.parse(req.body);
      const article = await storage.createArticle(validatedData);
      res.status(201).json(article);
    } catch (error) {
      res.status(400).json({ error: "Invalid article data" });
    }
  });
  app2.put("/api/articles/:id", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertArticleSchema.partial().parse(req.body);
      const article = await storage.updateArticle(req.params.id, validatedData);
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      res.status(400).json({ error: "Invalid article data" });
    }
  });
  app2.delete("/api/articles/:id", requireAdmin, async (req, res) => {
    try {
      const success = await storage.deleteArticle(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Article not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete article" });
    }
  });
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      console.log("Login attempt:", { username, passwordLength: password?.length });
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }
      const allUsers = await storage.getUsers();
      console.log("Total users in system:", allUsers.length);
      console.log("All usernames:", allUsers.map((u) => u.username));
      console.log("Searching for username:", username);
      const user = await storage.getUserByUsername(username);
      console.log("User found:", user ? "Yes" : "No");
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const isValidPassword = await bcrypt2.compare(password, user.password);
      console.log("Password valid:", isValidPassword);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const { password: _, ...userWithoutPassword } = user;
      req.session.userId = user.id;
      req.session.user = {
        id: userWithoutPassword.id,
        username: userWithoutPassword.username,
        role: userWithoutPassword.role,
        createdAt: userWithoutPassword.createdAt || /* @__PURE__ */ new Date()
      };
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });
  app2.post("/api/auth/signup", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: "Nome de usu\xE1rio e senha s\xE3o obrigat\xF3rios" });
      }
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: "Este nome de usu\xE1rio j\xE1 est\xE1 em uso" });
      }
      const userData = {
        username,
        email: `${username}@temp.local`,
        // Temporary email
        name: username,
        // Use username as display name initially
        password,
        role: "user"
      };
      const user = await storage.createUser(userData);
      console.log("User created successfully:", user.username);
      const allUsers = await storage.getUsers();
      console.log("Total users in system:", allUsers.length);
      console.log("All usernames:", allUsers.map((u) => u.username));
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({ user: userWithoutPassword, message: "Conta criada com sucesso!" });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ error: "Erro ao criar conta. Tente novamente." });
    }
  });
  app2.post("/api/auth/logout", async (req, res) => {
    try {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ error: "Logout failed" });
        }
        res.clearCookie("dttools.session");
        res.json({ message: "Logged out successfully" });
      });
    } catch (error) {
      res.status(500).json({ error: "Logout failed" });
    }
  });
  app2.get("/api/auth/me", async (req, res) => {
    try {
      if (!req.session?.userId || !req.session?.user) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const freshUser = await storage.getUser(req.session.userId);
      if (!freshUser) {
        return res.status(401).json({ error: "User not found" });
      }
      if (freshUser.role !== req.session.user.role) {
        req.session.user = {
          id: freshUser.id,
          username: freshUser.username,
          role: freshUser.role,
          createdAt: freshUser.createdAt || /* @__PURE__ */ new Date()
        };
      }
      const { password: _, ...userWithoutPassword } = freshUser;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Auth check error:", error);
      res.status(500).json({ error: "Failed to check authentication" });
    }
  });
  app2.get("/api/users/profile", requireAuth, async (req, res) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const { password: _, ...userProfile } = user;
      res.json(userProfile);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user profile" });
    }
  });
  app2.put("/api/users/profile", requireAuth, async (req, res) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      console.log("[Profile Update] User ID:", req.user.id);
      console.log("[Profile Update] Received fields:", Object.keys(req.body));
      console.log("[Profile Update] Has profile_picture:", !!req.body.profile_picture);
      if (req.body.profile_picture) {
        console.log("[Profile Update] profile_picture size:", req.body.profile_picture.length, "chars");
      }
      const validatedData = updateProfileSchema.parse(req.body);
      console.log("[Profile Update] Validated fields:", Object.keys(validatedData));
      console.log("[Profile Update] Has profilePicture after validation:", !!validatedData.profilePicture);
      const user = await storage.updateUser(req.user.id, validatedData);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      console.log("[Profile Update] User updated. Has profilePicture:", !!user.profilePicture);
      if (user.profilePicture) {
        console.log("[Profile Update] Saved profilePicture size:", user.profilePicture.length, "chars");
      }
      if (req.session?.user) {
        req.session.user = {
          ...req.session.user,
          username: user.email
          // Use email as username
        };
      }
      const { password: _, ...userProfile } = user;
      res.json(userProfile);
    } catch (error) {
      console.error("[Profile Update] Error:", error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to update user profile" });
      }
    }
  });
  app2.get("/api/users", requireAdmin, async (_req, res) => {
    try {
      const users2 = await storage.getUsers();
      const usersWithoutPasswords = users2.map(({ password: _, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });
  app2.post("/api/users", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validatedData);
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });
  app2.put("/api/users/:id", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(req.params.id, validatedData);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });
  app2.delete("/api/users/:id", requireAdmin, async (req, res) => {
    try {
      const success = await storage.deleteUser(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete user" });
    }
  });
  app2.get("/api/admin/stats", requireAdmin, async (_req, res) => {
    try {
      const users2 = await storage.getUsers();
      const projects2 = await storage.getAllProjects();
      const articles2 = await storage.getArticles();
      const stats = {
        totalUsers: users2.length,
        totalProjects: projects2.length,
        totalArticles: articles2.length,
        projectsByStatus: {
          in_progress: projects2.filter((p) => p.status === "in_progress").length,
          completed: projects2.filter((p) => p.status === "completed").length
        },
        projectsByPhase: {
          phase1: projects2.filter((p) => p.currentPhase === 1).length,
          phase2: projects2.filter((p) => p.currentPhase === 2).length,
          phase3: projects2.filter((p) => p.currentPhase === 3).length,
          phase4: projects2.filter((p) => p.currentPhase === 4).length,
          phase5: projects2.filter((p) => p.currentPhase === 5).length
        },
        usersByRole: {
          admin: users2.filter((u) => u.role === "admin").length,
          user: users2.filter((u) => u.role === "user").length
        },
        articlesByCategory: {
          empathize: articles2.filter((a) => a.category === "empathize").length,
          define: articles2.filter((a) => a.category === "define").length,
          ideate: articles2.filter((a) => a.category === "ideate").length,
          prototype: articles2.filter((a) => a.category === "prototype").length,
          test: articles2.filter((a) => a.category === "test").length
        }
      };
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch admin stats" });
    }
  });
  app2.get("/api/subscription-plans", async (_req, res) => {
    try {
      const plans = await storage.getSubscriptionPlans();
      res.json(plans);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subscription plans" });
    }
  });
  app2.get("/api/subscription-plans/:id", async (req, res) => {
    try {
      const plan = await storage.getSubscriptionPlan(req.params.id);
      if (!plan) {
        return res.status(404).json({ error: "Subscription plan not found" });
      }
      res.json(plan);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subscription plan" });
    }
  });
  app2.post("/api/subscription-plans", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertSubscriptionPlanSchema.parse(req.body);
      const plan = await storage.createSubscriptionPlan(validatedData);
      res.status(201).json(plan);
    } catch (error) {
      res.status(400).json({ error: "Invalid subscription plan data" });
    }
  });
  app2.put("/api/subscription-plans/:id", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertSubscriptionPlanSchema.partial().parse(req.body);
      const plan = await storage.updateSubscriptionPlan(req.params.id, validatedData);
      if (!plan) {
        return res.status(404).json({ error: "Subscription plan not found" });
      }
      res.json(plan);
    } catch (error) {
      res.status(400).json({ error: "Invalid subscription plan data" });
    }
  });
  app2.get("/api/user/subscription", requireAuth, async (req, res) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      const subscription = await storage.getUserActiveSubscription(req.user.id);
      res.json(subscription);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user subscription" });
    }
  });
  app2.post("/api/create-checkout-session", requireAuth, async (req, res) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      const { planId, billingPeriod } = req.body;
      if (!planId || !billingPeriod) {
        return res.status(400).json({ error: "Plan ID and billing period are required" });
      }
      const plan = await storage.getSubscriptionPlan(planId);
      if (!plan) {
        return res.status(404).json({ error: "Subscription plan not found" });
      }
      if (plan.name === "free") {
        const subscription = await storage.createUserSubscription({
          userId: req.user.id,
          planId: plan.id,
          status: "active",
          billingPeriod: "monthly"
        });
        return res.json({ subscription });
      }
      if (!stripe) {
        return res.status(503).json({ error: "Payment system not configured. Please contact support." });
      }
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      let stripeCustomerId = user.stripeCustomerId;
      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: user.username,
          metadata: {
            userId: user.id
          }
        });
        stripeCustomerId = customer.id;
        await storage.updateUser(user.id, { stripeCustomerId });
      }
      const price = billingPeriod === "yearly" ? plan.priceYearly : plan.priceMonthly;
      const session2 = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "brl",
              product_data: {
                name: plan.displayName,
                description: plan.description || void 0
              },
              unit_amount: price,
              recurring: {
                interval: billingPeriod === "yearly" ? "year" : "month"
              }
            },
            quantity: 1
          }
        ],
        mode: "subscription",
        success_url: `${req.headers.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/pricing`,
        metadata: {
          userId: req.user.id,
          planId: plan.id,
          billingPeriod
        }
      });
      res.json({ url: session2.url });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });
  app2.post("/api/stripe-webhook", async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || "");
    } catch (err) {
      console.log(`Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    try {
      switch (event.type) {
        case "checkout.session.completed":
          const session2 = event.data.object;
          if (session2.metadata) {
            const { userId, planId, billingPeriod } = session2.metadata;
            await storage.createUserSubscription({
              userId,
              planId,
              stripeSubscriptionId: session2.subscription,
              status: "active",
              billingPeriod,
              currentPeriodStart: /* @__PURE__ */ new Date(),
              currentPeriodEnd: new Date(Date.now() + (billingPeriod === "yearly" ? 365 : 30) * 24 * 60 * 60 * 1e3)
            });
            await storage.updateUser(userId, {
              stripeSubscriptionId: session2.subscription,
              subscriptionPlanId: planId,
              subscriptionStatus: "active"
            });
          }
          break;
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          const subscription = event.data.object;
          const customer = await stripe.customers.retrieve(subscription.customer);
          if (customer.metadata?.userId) {
            const status = subscription.status === "active" ? "active" : subscription.status === "canceled" ? "canceled" : "expired";
            await storage.updateUser(customer.metadata.userId, {
              subscriptionStatus: status,
              subscriptionEndDate: subscription.current_period_end ? new Date(subscription.current_period_end * 1e3) : null
            });
            const userSub = await storage.getUserActiveSubscription(customer.metadata.userId);
            if (userSub) {
              await storage.updateUserSubscription(userSub.id, {
                status,
                currentPeriodEnd: subscription.current_period_end ? new Date(subscription.current_period_end * 1e3) : null,
                cancelAtPeriodEnd: subscription.cancel_at_period_end
              });
            }
          }
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
      res.json({ received: true });
    } catch (error) {
      console.error("Error processing webhook:", error);
      res.status(500).json({ error: "Webhook processing failed" });
    }
  });
  app2.post("/api/cancel-subscription", requireAuth, async (req, res) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      const user = await storage.getUser(req.user.id);
      if (!user?.stripeSubscriptionId) {
        return res.status(400).json({ error: "No active subscription found" });
      }
      await stripe.subscriptions.update(user.stripeSubscriptionId, {
        cancel_at_period_end: true
      });
      const userSub = await storage.getUserActiveSubscription(req.user.id);
      if (userSub) {
        await storage.cancelUserSubscription(userSub.id);
      }
      res.json({ success: true, message: "Subscription will be canceled at the end of the billing period" });
    } catch (error) {
      console.error("Error canceling subscription:", error);
      res.status(500).json({ error: "Failed to cancel subscription" });
    }
  });
  app2.post("/api/chat", requireAuth, async (req, res) => {
    try {
      const { messages, context } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required" });
      }
      if (!context || typeof context.currentPhase !== "number") {
        return res.status(400).json({ error: "Valid context with currentPhase is required" });
      }
      const lastMessage = messages[messages.length - 1];
      const response = await designThinkingGeminiAI.chat(lastMessage.content, context);
      res.json({ message: response });
    } catch (error) {
      console.error("Error in AI chat:", error);
      res.json({ message: "Desculpe, houve um problema tempor\xE1rio. Tente novamente ou continue usando as ferramentas de Design Thinking dispon\xEDveis na plataforma." });
    }
  });
  app2.post("/api/chat/suggestions", requireAuth, async (req, res) => {
    try {
      const { context, topic } = req.body;
      if (!context || typeof context.currentPhase !== "number") {
        return res.status(400).json({ error: "Valid context with currentPhase is required" });
      }
      if (!topic || typeof topic !== "string") {
        return res.status(400).json({ error: "Topic is required" });
      }
      const suggestions = await designThinkingGeminiAI.generateSuggestions(context);
      res.json({ suggestions });
    } catch (error) {
      console.error("Error generating suggestions:", error);
      res.status(500).json({ error: "Failed to generate suggestions" });
    }
  });
  app2.post("/api/projects/:projectId/analyze", requireAuth, async (req, res) => {
    try {
      const { projectId } = req.params;
      const { currentPhase } = req.body;
      const userId = req.session.userId;
      const project = await storage.getProject(projectId, userId);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      const empathyMaps2 = await storage.getEmpathyMaps(projectId);
      const personas2 = await storage.getPersonas(projectId);
      const interviews2 = await storage.getInterviews(projectId);
      const observations2 = await storage.getObservations(projectId);
      const povStatements2 = await storage.getPovStatements(projectId);
      const hmwQuestions2 = await storage.getHmwQuestions(projectId);
      const ideas2 = await storage.getIdeas(projectId);
      const prototypes2 = await storage.getPrototypes(projectId);
      const testPlans2 = await storage.getTestPlans(projectId);
      const projectData = {
        project,
        empathyMaps: empathyMaps2,
        personas: personas2,
        interviews: interviews2,
        observations: observations2,
        povStatements: povStatements2,
        hmwQuestions: hmwQuestions2,
        ideas: ideas2,
        prototypes: prototypes2,
        testPlans: testPlans2
      };
      const analysis = await designThinkingAI.analyzeProjectPhase(projectData, currentPhase || project.currentPhase);
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing project:", error);
      res.status(500).json({ error: "Failed to analyze project" });
    }
  });
  app2.post("/api/projects/:projectId/ai-analysis", requireAuth, async (req, res) => {
    try {
      const { projectId } = req.params;
      const userId = req.session.userId;
      const project = await storage.getProject(projectId, userId);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      const empathyMaps2 = await storage.getEmpathyMaps(projectId);
      const personas2 = await storage.getPersonas(projectId);
      const interviews2 = await storage.getInterviews(projectId);
      const observations2 = await storage.getObservations(projectId);
      const povStatements2 = await storage.getPovStatements(projectId);
      const hmwQuestions2 = await storage.getHmwQuestions(projectId);
      const ideas2 = await storage.getIdeas(projectId);
      const prototypes2 = await storage.getPrototypes(projectId);
      const testPlans2 = await storage.getTestPlans(projectId);
      const testResults2 = [];
      for (const testPlan of testPlans2) {
        const results = await storage.getTestResults(testPlan.id);
        testResults2.push(...results);
      }
      const analysisData = {
        project,
        empathyMaps: empathyMaps2,
        personas: personas2,
        interviews: interviews2,
        observations: observations2,
        povStatements: povStatements2,
        hmwQuestions: hmwQuestions2,
        ideas: ideas2,
        prototypes: prototypes2,
        testPlans: testPlans2,
        testResults: testResults2
      };
      const analysis = await designThinkingAI.analyzeCompleteProject(analysisData);
      res.json(analysis);
    } catch (error) {
      console.error("Error generating AI analysis:", error);
      if (error instanceof Error && error.message.includes("OpenAI")) {
        res.status(503).json({ error: "AI service temporarily unavailable. Please check API configuration." });
      } else {
        res.status(500).json({ error: "Failed to generate AI analysis" });
      }
    }
  });
  app2.get("/api/canvas-drawings/:projectId", requireAuth, async (req, res) => {
    try {
      const { projectId } = req.params;
      const drawings = await storage.getCanvasDrawings(projectId);
      res.json(drawings);
    } catch (error) {
      console.error("Error fetching canvas drawings:", error);
      res.status(500).json({ error: "Failed to fetch canvas drawings" });
    }
  });
  app2.post("/api/canvas-drawings", requireAuth, async (req, res) => {
    try {
      const parsed = insertCanvasDrawingSchema.parse(req.body);
      const drawing = await storage.createCanvasDrawing(parsed);
      res.status(201).json(drawing);
    } catch (error) {
      console.error("Error creating canvas drawing:", error);
      res.status(500).json({ error: "Failed to create canvas drawing" });
    }
  });
  app2.put("/api/canvas-drawings/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const parsed = insertCanvasDrawingSchema.partial().parse(req.body);
      const drawing = await storage.updateCanvasDrawing(id, parsed);
      if (!drawing) {
        return res.status(404).json({ error: "Canvas drawing not found" });
      }
      res.json(drawing);
    } catch (error) {
      console.error("Error updating canvas drawing:", error);
      res.status(500).json({ error: "Failed to update canvas drawing" });
    }
  });
  app2.delete("/api/canvas-drawings/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteCanvasDrawing(id);
      if (!success) {
        return res.status(404).json({ error: "Canvas drawing not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting canvas drawing:", error);
      res.status(500).json({ error: "Failed to delete canvas drawing" });
    }
  });
  app2.get("/api/phase-cards/:projectId", requireAuth, async (req, res) => {
    try {
      const { projectId } = req.params;
      const cards = await storage.getPhaseCards(projectId);
      res.json(cards);
    } catch (error) {
      console.error("Error fetching phase cards:", error);
      res.status(500).json({ error: "Failed to fetch phase cards" });
    }
  });
  app2.post("/api/phase-cards", requireAuth, async (req, res) => {
    try {
      const parsed = insertPhaseCardSchema.parse(req.body);
      const card = await storage.createPhaseCard(parsed);
      res.status(201).json(card);
    } catch (error) {
      console.error("Error creating phase card:", error);
      res.status(500).json({ error: "Failed to create phase card" });
    }
  });
  app2.put("/api/phase-cards/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const parsed = insertPhaseCardSchema.partial().parse(req.body);
      const card = await storage.updatePhaseCard(id, parsed);
      if (!card) {
        return res.status(404).json({ error: "Phase card not found" });
      }
      res.json(card);
    } catch (error) {
      console.error("Error updating phase card:", error);
      res.status(500).json({ error: "Failed to update phase card" });
    }
  });
  app2.delete("/api/phase-cards/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deletePhaseCard(id);
      if (!success) {
        return res.status(404).json({ error: "Phase card not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting phase card:", error);
      res.status(500).json({ error: "Failed to delete phase card" });
    }
  });
  app2.post("/api/projects/:projectId/backups", requireAuth, async (req, res) => {
    try {
      const { projectId } = req.params;
      const { description } = req.body;
      const backup = await storage.createProjectBackup(projectId, "manual", description);
      res.status(201).json(backup);
    } catch (error) {
      console.error("Error creating backup:", error);
      res.status(500).json({ error: "Failed to create backup" });
    }
  });
  app2.get("/api/projects/:projectId/backups", requireAuth, async (req, res) => {
    try {
      const { projectId } = req.params;
      const backups = await storage.getProjectBackups(projectId);
      res.json(backups);
    } catch (error) {
      console.error("Error fetching backups:", error);
      res.status(500).json({ error: "Failed to fetch backups" });
    }
  });
  app2.get("/api/backups/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const backup = await storage.getProjectBackup(id);
      if (!backup) {
        return res.status(404).json({ error: "Backup not found" });
      }
      res.json(backup);
    } catch (error) {
      console.error("Error fetching backup:", error);
      res.status(500).json({ error: "Failed to fetch backup" });
    }
  });
  app2.post("/api/backups/:id/restore", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.restoreProjectBackup(id);
      if (!success) {
        return res.status(404).json({ error: "Backup not found or restore failed" });
      }
      res.json({ success: true, message: "Project restored successfully" });
    } catch (error) {
      console.error("Error restoring backup:", error);
      res.status(500).json({ error: "Failed to restore backup" });
    }
  });
  app2.delete("/api/backups/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteProjectBackup(id);
      if (!success) {
        return res.status(404).json({ error: "Backup not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting backup:", error);
      res.status(500).json({ error: "Failed to delete backup" });
    }
  });
  app2.get("/api/benchmarks/:projectId", requireAuth, async (req, res) => {
    try {
      const { projectId } = req.params;
      const benchmarks2 = await storage.getBenchmarks(projectId);
      res.json(benchmarks2);
    } catch (error) {
      console.error("Error fetching benchmarks:", error);
      res.status(500).json({ error: "Failed to fetch benchmarks" });
    }
  });
  app2.get("/api/benchmarks/detail/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const benchmark = await storage.getBenchmark(id);
      if (!benchmark) {
        return res.status(404).json({ error: "Benchmark not found" });
      }
      res.json(benchmark);
    } catch (error) {
      console.error("Error fetching benchmark:", error);
      res.status(500).json({ error: "Failed to fetch benchmark" });
    }
  });
  app2.post("/api/benchmarks", requireAuth, async (req, res) => {
    try {
      const parsed = insertBenchmarkSchema.parse(req.body);
      const benchmark = await storage.createBenchmark(parsed);
      res.status(201).json(benchmark);
    } catch (error) {
      console.error("Error creating benchmark:", error);
      res.status(500).json({ error: "Failed to create benchmark" });
    }
  });
  app2.put("/api/benchmarks/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const parsed = insertBenchmarkSchema.partial().parse(req.body);
      const benchmark = await storage.updateBenchmark(id, parsed);
      if (!benchmark) {
        return res.status(404).json({ error: "Benchmark not found" });
      }
      res.json(benchmark);
    } catch (error) {
      console.error("Error updating benchmark:", error);
      res.status(500).json({ error: "Failed to update benchmark" });
    }
  });
  app2.delete("/api/benchmarks/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteBenchmark(id);
      if (!success) {
        return res.status(404).json({ error: "Benchmark not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting benchmark:", error);
      res.status(500).json({ error: "Failed to delete benchmark" });
    }
  });
  app2.get("/api/benchmark-assessments/:benchmarkId", requireAuth, async (req, res) => {
    try {
      const { benchmarkId } = req.params;
      const assessments = await storage.getBenchmarkAssessments(benchmarkId);
      res.json(assessments);
    } catch (error) {
      console.error("Error fetching benchmark assessments:", error);
      res.status(500).json({ error: "Failed to fetch benchmark assessments" });
    }
  });
  app2.post("/api/benchmark-assessments", requireAuth, async (req, res) => {
    try {
      const parsed = insertBenchmarkAssessmentSchema.parse(req.body);
      const assessment = await storage.createBenchmarkAssessment(parsed);
      res.status(201).json(assessment);
    } catch (error) {
      console.error("Error creating benchmark assessment:", error);
      res.status(500).json({ error: "Failed to create benchmark assessment" });
    }
  });
  app2.put("/api/benchmark-assessments/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const parsed = insertBenchmarkAssessmentSchema.partial().parse(req.body);
      const assessment = await storage.updateBenchmarkAssessment(id, parsed);
      if (!assessment) {
        return res.status(404).json({ error: "Benchmark assessment not found" });
      }
      res.json(assessment);
    } catch (error) {
      console.error("Error updating benchmark assessment:", error);
      res.status(500).json({ error: "Failed to update benchmark assessment" });
    }
  });
  app2.delete("/api/benchmark-assessments/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteBenchmarkAssessment(id);
      if (!success) {
        return res.status(404).json({ error: "Benchmark assessment not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting benchmark assessment:", error);
      res.status(500).json({ error: "Failed to delete benchmark assessment" });
    }
  });
  app2.get("/api/dvf-assessments/:projectId", requireAuth, async (req, res) => {
    try {
      const { projectId } = req.params;
      const assessments = await storage.getDvfAssessments(projectId);
      res.json(assessments);
    } catch (error) {
      console.error("Error fetching DVF assessments:", error);
      res.status(500).json({ error: "Failed to fetch DVF assessments" });
    }
  });
  app2.post("/api/dvf-assessments", requireAuth, async (req, res) => {
    try {
      const parsed = insertDvfAssessmentSchema.parse(req.body);
      const assessment = await storage.createDvfAssessment(parsed);
      res.status(201).json(assessment);
    } catch (error) {
      console.error("Error creating DVF assessment:", error);
      res.status(500).json({ error: "Failed to create DVF assessment" });
    }
  });
  app2.put("/api/dvf-assessments/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const parsed = insertDvfAssessmentSchema.partial().parse(req.body);
      const assessment = await storage.updateDvfAssessment(id, parsed);
      if (!assessment) {
        return res.status(404).json({ error: "DVF assessment not found" });
      }
      res.json(assessment);
    } catch (error) {
      console.error("Error updating DVF assessment:", error);
      res.status(500).json({ error: "Failed to update DVF assessment" });
    }
  });
  app2.delete("/api/dvf-assessments/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteDvfAssessment(id);
      if (!success) {
        return res.status(404).json({ error: "DVF assessment not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting DVF assessment:", error);
      res.status(500).json({ error: "Failed to delete DVF assessment" });
    }
  });
  app2.get("/api/lovability-metrics/:projectId", requireAuth, async (req, res) => {
    try {
      const { projectId } = req.params;
      const metrics = await storage.getLovabilityMetrics(projectId);
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching lovability metrics:", error);
      res.status(500).json({ error: "Failed to fetch lovability metrics" });
    }
  });
  app2.post("/api/lovability-metrics", requireAuth, async (req, res) => {
    try {
      const parsed = insertLovabilityMetricSchema.parse(req.body);
      const metric = await storage.createLovabilityMetric(parsed);
      res.status(201).json(metric);
    } catch (error) {
      console.error("Error creating lovability metric:", error);
      res.status(500).json({ error: "Failed to create lovability metric" });
    }
  });
  app2.put("/api/lovability-metrics/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const parsed = insertLovabilityMetricSchema.partial().parse(req.body);
      const metric = await storage.updateLovabilityMetric(id, parsed);
      if (!metric) {
        return res.status(404).json({ error: "Lovability metric not found" });
      }
      res.json(metric);
    } catch (error) {
      console.error("Error updating lovability metric:", error);
      res.status(500).json({ error: "Failed to update lovability metric" });
    }
  });
  app2.delete("/api/lovability-metrics/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteLovabilityMetric(id);
      if (!success) {
        return res.status(404).json({ error: "Lovability metric not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting lovability metric:", error);
      res.status(500).json({ error: "Failed to delete lovability metric" });
    }
  });
  app2.get("/api/project-analytics/:projectId", requireAuth, async (req, res) => {
    try {
      const { projectId } = req.params;
      const analytics = await storage.getProjectAnalytics(projectId);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching project analytics:", error);
      res.status(500).json({ error: "Failed to fetch project analytics" });
    }
  });
  app2.post("/api/project-analytics", requireAuth, async (req, res) => {
    try {
      const parsed = insertProjectAnalyticsSchema.parse(req.body);
      const analytics = await storage.createProjectAnalytics(parsed);
      res.status(201).json(analytics);
    } catch (error) {
      console.error("Error creating project analytics:", error);
      res.status(500).json({ error: "Failed to create project analytics" });
    }
  });
  app2.put("/api/project-analytics/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const parsed = insertProjectAnalyticsSchema.partial().parse(req.body);
      const analytics = await storage.updateProjectAnalytics(id, parsed);
      if (!analytics) {
        return res.status(404).json({ error: "Project analytics not found" });
      }
      res.json(analytics);
    } catch (error) {
      console.error("Error updating project analytics:", error);
      res.status(500).json({ error: "Failed to update project analytics" });
    }
  });
  app2.get("/api/competitive-analysis/:projectId", requireAuth, async (req, res) => {
    try {
      const { projectId } = req.params;
      const analyses = await storage.getCompetitiveAnalyses(projectId);
      res.json(analyses);
    } catch (error) {
      console.error("Error fetching competitive analyses:", error);
      res.status(500).json({ error: "Failed to fetch competitive analyses" });
    }
  });
  app2.post("/api/competitive-analysis", requireAuth, async (req, res) => {
    try {
      const parsed = insertCompetitiveAnalysisSchema.parse(req.body);
      const analysis = await storage.createCompetitiveAnalysis(parsed);
      res.status(201).json(analysis);
    } catch (error) {
      console.error("Error creating competitive analysis:", error);
      res.status(500).json({ error: "Failed to create competitive analysis" });
    }
  });
  app2.put("/api/competitive-analysis/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const parsed = insertCompetitiveAnalysisSchema.partial().parse(req.body);
      const analysis = await storage.updateCompetitiveAnalysis(id, parsed);
      if (!analysis) {
        return res.status(404).json({ error: "Competitive analysis not found" });
      }
      res.json(analysis);
    } catch (error) {
      console.error("Error updating competitive analysis:", error);
      res.status(500).json({ error: "Failed to update competitive analysis" });
    }
  });
  app2.delete("/api/competitive-analysis/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteCompetitiveAnalysis(id);
      if (!success) {
        return res.status(404).json({ error: "Competitive analysis not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting competitive analysis:", error);
      res.status(500).json({ error: "Failed to delete competitive analysis" });
    }
  });
  app2.post("/api/benchmarking/ai-recommendations/:projectId", requireAuth, async (req, res) => {
    try {
      const { projectId } = req.params;
      const userId = req.session.userId;
      const project = await storage.getProject(projectId, userId);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      const [dvfAssessments2, lovabilityMetrics2, projectAnalytics2, competitiveAnalyses] = await Promise.all([
        storage.getDvfAssessments(projectId),
        storage.getLovabilityMetrics(projectId),
        storage.getProjectAnalytics(projectId),
        storage.getCompetitiveAnalyses(projectId)
      ]);
      const benchmarkingData = {
        projectId: project.id,
        projectName: project.name,
        projectDescription: project.description || void 0,
        // DVF data with calculated scores
        dvfAssessments: dvfAssessments2.map((assessment) => ({
          desirabilityScore: assessment.desirabilityScore || 0,
          feasibilityScore: assessment.feasibilityScore || 0,
          viabilityScore: assessment.viabilityScore || 0,
          recommendation: assessment.recommendation || "modify",
          overallScore: Math.round(((assessment.desirabilityScore || 0) + (assessment.feasibilityScore || 0) + (assessment.viabilityScore || 0)) / 3 * 10) / 10
        })),
        // Lovability metrics
        lovabilityMetrics: lovabilityMetrics2.length > 0 ? {
          npsScore: lovabilityMetrics2[0]?.npsScore || 0,
          satisfactionScore: lovabilityMetrics2[0]?.satisfactionScore || 0,
          engagementRate: lovabilityMetrics2[0]?.engagementTime || 0,
          emotionalDistribution: lovabilityMetrics2[0]?.emotionalDistribution || {},
          overallLovabilityScore: lovabilityMetrics2[0]?.lovabilityScore || 0
        } : void 0,
        // Project analytics
        projectAnalytics: projectAnalytics2 ? {
          completionRate: projectAnalytics2.completionRate || 0,
          totalTimeSpent: projectAnalytics2.totalTimeSpent || 0,
          teamSize: projectAnalytics2.teamSize || 1,
          innovationLevel: projectAnalytics2.innovationLevel || 0,
          overallSuccess: projectAnalytics2.overallSuccess || 0,
          topPerformingTools: projectAnalytics2.topPerformingTools || [],
          timeBottlenecks: projectAnalytics2.timeBottlenecks || []
        } : void 0,
        // Competitive analysis
        competitiveAnalysis: competitiveAnalyses.map((analysis) => {
          const advantagesCount = Array.isArray(analysis.ourAdvantages) ? analysis.ourAdvantages.length : 0;
          const gapsCount = Array.isArray(analysis.functionalGaps) ? analysis.functionalGaps.length : 0;
          return {
            competitorName: analysis.competitorName || "",
            competitorType: analysis.competitorType || "direct",
            marketPosition: analysis.marketPosition || "challenger",
            ourAdvantages: analysis.ourAdvantages || [],
            functionalGaps: analysis.functionalGaps || [],
            competitivenessScore: Math.max(0, Math.min(10, advantagesCount * 2 - gapsCount * 0.5))
          };
        })
      };
      const { designThinkingGeminiAI: designThinkingGeminiAI2 } = await Promise.resolve().then(() => (init_geminiService(), geminiService_exports));
      const recommendations = await designThinkingGeminiAI2.generateBenchmarkingRecommendations(benchmarkingData);
      res.json({
        success: true,
        data: {
          projectInfo: {
            name: project.name,
            description: project.description
          },
          dataCollected: {
            dvfAssessments: dvfAssessments2.length,
            lovabilityMetrics: lovabilityMetrics2.length,
            projectAnalytics: projectAnalytics2 ? 1 : 0,
            competitiveAnalyses: competitiveAnalyses.length
          },
          recommendations
        }
      });
    } catch (error) {
      console.error("Error generating AI benchmarking recommendations:", error);
      res.status(500).json({
        error: "Failed to generate AI recommendations",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.get("/api/help", async (req, res) => {
    try {
      const { category, phase, featured } = req.query;
      let articles2 = await storage.getHelpArticles();
      if (category && typeof category === "string") {
        articles2 = articles2.filter((a) => a.category === category);
      }
      if (phase) {
        const phaseNum = parseInt(phase);
        articles2 = articles2.filter((a) => a.phase === phaseNum);
      }
      if (featured === "true") {
        articles2 = articles2.filter((a) => a.featured);
      }
      articles2.sort((a, b) => (a.order || 0) - (b.order || 0));
      res.json(articles2);
    } catch (error) {
      console.error("Error fetching help articles:", error);
      res.status(500).json({ error: "Failed to fetch help articles" });
    }
  });
  app2.get("/api/help/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== "string") {
        return res.status(400).json({ error: "Search query required" });
      }
      const searchTerm = q.toLowerCase();
      const articles2 = await storage.searchHelpArticles(searchTerm);
      res.json(articles2);
    } catch (error) {
      console.error("Error searching help articles:", error);
      res.status(500).json({ error: "Failed to search help articles" });
    }
  });
  app2.get("/api/help/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const article = await storage.getHelpArticleBySlug(slug);
      if (!article) {
        return res.status(404).json({ error: "Help article not found" });
      }
      const updatedArticle = await storage.incrementHelpArticleViews(article.id);
      res.json(updatedArticle || article);
    } catch (error) {
      console.error("Error fetching help article:", error);
      res.status(500).json({ error: "Failed to fetch help article" });
    }
  });
  app2.post("/api/help/:id/helpful", async (req, res) => {
    try {
      const { id } = req.params;
      const article = await storage.incrementHelpArticleHelpful(id);
      if (!article) {
        return res.status(404).json({ error: "Help article not found" });
      }
      res.json(article);
    } catch (error) {
      console.error("Error marking article helpful:", error);
      res.status(500).json({ error: "Failed to mark article as helpful" });
    }
  });
  app2.get("/api/help/categories/list", async (req, res) => {
    try {
      const articles2 = await storage.getHelpArticles();
      const categorySet = /* @__PURE__ */ new Set();
      articles2.forEach((a) => categorySet.add(a.category));
      const categories = Array.from(categorySet);
      res.json(categories);
    } catch (error) {
      console.error("Error fetching help categories:", error);
      res.status(500).json({ error: "Failed to fetch help categories" });
    }
  });
  app2.post("/api/help", requireAdmin, async (req, res) => {
    try {
      const articleData = req.body;
      const newArticle = await storage.createHelpArticle(articleData);
      res.json(newArticle);
    } catch (error) {
      console.error("Error creating help article:", error);
      res.status(500).json({ error: "Failed to create help article" });
    }
  });
  app2.put("/api/help/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const articleData = req.body;
      const updatedArticle = await storage.updateHelpArticle(id, articleData);
      if (!updatedArticle) {
        return res.status(404).json({ error: "Help article not found" });
      }
      res.json(updatedArticle);
    } catch (error) {
      console.error("Error updating help article:", error);
      res.status(500).json({ error: "Failed to update help article" });
    }
  });
  app2.delete("/api/help/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteHelpArticle(id);
      if (!deleted) {
        return res.status(404).json({ error: "Help article not found" });
      }
      res.json({ success: true, message: "Article deleted successfully" });
    } catch (error) {
      console.error("Error deleting help article:", error);
      res.status(500).json({ error: "Failed to delete help article" });
    }
  });
  app2.get("/clear-cache.html", (_req, res) => {
    const clearCachePath = path.join(process.cwd(), "server", "public", "clear-cache.html");
    if (fs.existsSync(clearCachePath)) {
      res.sendFile(clearCachePath);
    } else {
      res.status(404).send("Clear cache page not found");
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/index.ts
import { execSync } from "child_process";
import fsSync from "fs";
import path4 from "path";
var log2 = (...args) => {
  console.log(`[${(/* @__PURE__ */ new Date()).toISOString()}]`, ...args);
};
var MemStore = MemoryStore(session);
var PgStore = ConnectPgSimple(session);
var app = express2();
app.set("trust proxy", 1);
var parseFrontendUrls = (envVar) => {
  if (!envVar) return [];
  return envVar.split(",").map((url) => url.trim()).filter((url) => {
    const isHttps = url.startsWith("https://");
    const isLocalhost = url.startsWith("http://localhost");
    const hasWildcard = url.includes("*");
    if (hasWildcard) {
      console.error(`[CORS] Invalid FRONTEND_URL - wildcards not allowed: ${url}`);
      return false;
    }
    if (!isHttps && !isLocalhost) {
      console.error(`[CORS] Invalid FRONTEND_URL - must use HTTPS: ${url}`);
      return false;
    }
    return true;
  }).map((url) => url.replace(/\/$/, ""));
};
var configuredFrontendUrls = parseFrontendUrls(process.env.FRONTEND_URL);
if (configuredFrontendUrls.length > 0) {
  console.log(`[CORS] Configured frontend URLs: ${configuredFrontendUrls.join(", ")}`);
}
app.use((req, res, next) => {
  const origin = req.headers.origin?.replace(/\/$/, "");
  const allowedOrigins = [
    "https://dttools.app",
    "https://www.dttools.app",
    "http://localhost:5000",
    "http://localhost:5173",
    ...configuredFrontendUrls
  ];
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});
app.use(express2.json({ limit: "50mb" }));
app.use(express2.urlencoded({ extended: false, limit: "50mb" }));
if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET environment variable is required");
}
var isProduction = process.env.NODE_ENV === "production";
var sessionStore = isProduction && process.env.DATABASE_URL ? new PgStore({
  conString: process.env.DATABASE_URL,
  createTableIfMissing: true,
  tableName: "user_sessions"
}) : new MemStore({
  checkPeriod: 864e5
  // prune expired entries every 24h
});
app.use(session({
  name: "dttools.session",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    secure: "auto",
    // Use secure cookies in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1e3,
    // 24 hours
    sameSite: isProduction ? "lax" : "none"
    // Lax for production, none for development
  }
}));
app.use("/uploads", express2.static("public/uploads"));
app.use(express2.static("server/public"));
app.use((req, res, next) => {
  const start = Date.now();
  const path5 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path5.startsWith("/api")) {
      let logLine = `${req.method} ${path5} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log2(logLine);
    }
  });
  next();
});
(async () => {
  const __dirname = process.cwd();
  const isProductionBuild = fsSync.existsSync(path4.resolve(__dirname, "dist", "index.js"));
  const server = await registerRoutes(app);
  if (isProductionBuild && process.env.DATABASE_URL) {
    setImmediate(async () => {
      try {
        log2("\u{1F527} Running database setup in background...");
        execSync("npm run db:push", { stdio: "pipe", timeout: 2e4 });
        log2("\u2705 Database migration completed");
        await initializeDefaultData();
        log2("\u2705 Default data initialized");
      } catch (error) {
        log2("\u26A0\uFE0F  Database setup error (may already be initialized):", String(error).substring(0, 100));
      }
    });
  } else {
    await initializeDefaultData();
  }
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  const isDevelopment = process.env.NODE_ENV !== "production" && !isProductionBuild;
  log2(`Environment check: NODE_ENV=${process.env.NODE_ENV}, isDevelopment=${isDevelopment}, isProductionBuild=${isProductionBuild}`);
  if (isDevelopment) {
    log2("Setting up Vite development server");
    const { setupVite: setupVite2 } = await init_vite().then(() => vite_exports);
    await setupVite2(app, server);
  } else {
    log2("Setting up static file serving for production");
    const distPath = path4.resolve(__dirname, "public");
    log2(`Serving static files from: ${distPath}`);
    if (!fsSync.existsSync(distPath)) {
      throw new Error(`Could not find the build directory: ${distPath}`);
    }
    app.use(express2.static(distPath));
    app.use("*", (_req, res) => {
      res.sendFile(path4.resolve(distPath, "index.html"));
    });
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log2(`serving on port ${port}`);
  });
})();
