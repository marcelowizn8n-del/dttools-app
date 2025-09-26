import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { 
  insertProjectSchema,
  insertEmpathyMapSchema,
  insertPersonaSchema,
  insertInterviewSchema,
  insertObservationSchema,
  insertPovStatementSchema,
  insertHmwQuestionSchema,
  insertIdeaSchema,
  insertPrototypeSchema,
  insertTestPlanSchema,
  insertTestResultSchema,
  insertUserProgressSchema,
  insertUserSchema,
  insertArticleSchema,
  insertSubscriptionPlanSchema,
  insertUserSubscriptionSchema,
  insertCanvasDrawingSchema,
  insertPhaseCardSchema,
  insertBenchmarkSchema,
  insertBenchmarkAssessmentSchema,
  updateProfileSchema
} from "@shared/schema";
import bcrypt from "bcrypt";
import Stripe from "stripe";
import { 
  loadUserSubscription, 
  checkProjectLimit, 
  checkPersonaLimit, 
  getSubscriptionInfo 
} from "./subscriptionMiddleware";
import { designThinkingAI, type ChatMessage, type DesignThinkingContext } from "./aiService";
import { PPTXService } from "./pptxService";

// Initialize Stripe with secret key - validate environment variable
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY environment variable is required');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
});

// Extend Request interface to include session user
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      username: string;
      role: string;
      createdAt: Date;
    };
  }
}

// Authentication middleware
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.userId) {
    return res.status(401).json({ error: "Authentication required" });
  }
  
  // Set user data on request for easy access
  if (req.session.user) {
    req.user = req.session.user;
  }
  
  next();
}

// Admin authorization middleware  
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.userId || !req.session?.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  
  if (req.session.user.role !== 'admin') {
    return res.status(403).json({ error: "Admin access required" });
  }
  
  // Set user data on request
  req.user = req.session.user;
  next();
}

// Configuração do multer para upload de arquivos
const storage_config = multer.memoryStorage();
const upload = multer({
  storage: storage_config,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit - increased to match express.json
  },
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos de imagem são permitidos'));
    }
  },
});

// Função para garantir que o diretório de uploads existe
function ensureUploadDirectory() {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'avatars');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  return uploadDir;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Subscription info endpoint
  app.get("/api/subscription-info", requireAuth, getSubscriptionInfo);

  // Projects routes
  app.get("/api/projects", requireAuth, async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", requireAuth, checkProjectLimit, async (req, res) => {
    try {
      console.log("Creating project - Request body:", req.body);
      console.log("User session:", req.session?.userId ? "authenticated" : "not authenticated");
      
      const validatedData = insertProjectSchema.parse(req.body);
      console.log("Data validated successfully:", validatedData);
      
      const project = await storage.createProject(validatedData);
      console.log("Project created successfully:", project.id);
      
      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      
      // Handle validation errors specifically
      if (error && typeof error === 'object' && 'issues' in error) {
        const validationError = error as any;
        return res.status(400).json({ 
          error: "Dados do projeto inválidos", 
          details: validationError.issues?.map((issue: any) => ({
            field: issue.path?.join('.'),
            message: issue.message
          }))
        });
      }
      
      // Handle other errors
      res.status(500).json({ error: "Erro interno do servidor. Tente novamente." });
    }
  });

  app.put("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const validatedData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(req.params.id, validatedData);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(400).json({ error: "Invalid project data" });
    }
  });

  app.delete("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const success = await storage.deleteProject(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  // Phase 1: Empathize - Empathy Maps
  app.get("/api/projects/:projectId/empathy-maps", requireAuth, async (req, res) => {
    try {
      const empathyMaps = await storage.getEmpathyMaps(req.params.projectId);
      res.json(empathyMaps);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch empathy maps" });
    }
  });

  app.post("/api/projects/:projectId/empathy-maps", requireAuth, async (req, res) => {
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

  app.put("/api/empathy-maps/:id", requireAuth, async (req, res) => {
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

  app.delete("/api/empathy-maps/:id", requireAuth, async (req, res) => {
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

  // Endpoint para upload de imagens
  app.post("/api/upload/avatar", requireAuth, upload.single('avatar'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Nenhum arquivo enviado" });
      }

      const uploadDir = ensureUploadDirectory();
      const fileName = `avatar-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
      const filePath = path.join(uploadDir, fileName);

      // Redimensionar e otimizar a imagem usando Sharp
      await sharp(req.file.buffer)
        .resize(200, 200, { 
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ 
          quality: 85,
          progressive: true
        })
        .toFile(filePath);

      // Retornar a URL relativa do arquivo
      const avatarUrl = `/uploads/avatars/${fileName}`;
      res.json({ url: avatarUrl });

    } catch (error: any) {
      console.error("Erro no upload:", error);
      res.status(500).json({ error: "Erro ao processar upload" });
    }
  });

  // Phase 1: Empathize - Personas
  app.get("/api/projects/:projectId/personas", requireAuth, async (req, res) => {
    try {
      const personas = await storage.getPersonas(req.params.projectId);
      res.json(personas);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch personas" });
    }
  });

  app.post("/api/projects/:projectId/personas", requireAuth, checkPersonaLimit, async (req, res) => {
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

  app.put("/api/personas/:id", requireAuth, async (req, res) => {
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

  app.delete("/api/personas/:id", requireAuth, async (req, res) => {
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

  // Phase 1: Empathize - Interviews
  app.get("/api/projects/:projectId/interviews", requireAuth, async (req, res) => {
    try {
      const interviews = await storage.getInterviews(req.params.projectId);
      res.json(interviews);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch interviews" });
    }
  });

  app.post("/api/projects/:projectId/interviews", requireAuth, async (req, res) => {
    try {
      const validatedData = insertInterviewSchema.parse({
        ...req.body,
        projectId: req.params.projectId
      });
      const interview = await storage.createInterview(validatedData);
      res.status(201).json(interview);
    } catch (error) {
      res.status(400).json({ error: "Invalid interview data" });
    }
  });

  app.put("/api/interviews/:id", requireAuth, async (req, res) => {
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

  app.delete("/api/interviews/:id", requireAuth, async (req, res) => {
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

  // Phase 1: Empathize - Observations
  app.get("/api/projects/:projectId/observations", requireAuth, async (req, res) => {
    try {
      const observations = await storage.getObservations(req.params.projectId);
      res.json(observations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch observations" });
    }
  });

  app.post("/api/projects/:projectId/observations", requireAuth, async (req, res) => {
    try {
      console.log("Creating observation - Request body:", JSON.stringify(req.body, null, 2));
      console.log("Project ID:", req.params.projectId);
      
      const dataToValidate = {
        ...req.body,
        projectId: req.params.projectId,
        // Converter string de data para Date object se necessário
        date: req.body.date ? new Date(req.body.date) : new Date(),
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

  app.put("/api/observations/:id", requireAuth, async (req, res) => {
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

  app.delete("/api/observations/:id", requireAuth, async (req, res) => {
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

  // Phase 2: Define - POV Statements
  app.get("/api/projects/:projectId/pov-statements", requireAuth, async (req, res) => {
    try {
      const povStatements = await storage.getPovStatements(req.params.projectId);
      res.json(povStatements);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch POV statements" });
    }
  });

  app.post("/api/projects/:projectId/pov-statements", requireAuth, async (req, res) => {
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

  app.put("/api/pov-statements/:id", requireAuth, async (req, res) => {
    try {
      // First, check if the POV statement exists
      const existingPovStatement = await storage.getPovStatement(req.params.id);
      if (!existingPovStatement) {
        return res.status(404).json({ error: "POV statement not found" });
      }

      // Validate the update data
      const validatedData = insertPovStatementSchema.omit({ projectId: true }).partial().parse(req.body);
      
      // Perform the update
      const povStatement = await storage.updatePovStatement(req.params.id, validatedData);
      if (!povStatement) {
        return res.status(404).json({ error: "POV statement not found" });
      }
      res.json(povStatement);
    } catch (error) {
      res.status(400).json({ error: "Invalid POV statement data" });
    }
  });

  app.delete("/api/pov-statements/:id", requireAuth, async (req, res) => {
    try {
      // First, check if the POV statement exists
      const existingPovStatement = await storage.getPovStatement(req.params.id);
      if (!existingPovStatement) {
        return res.status(404).json({ error: "POV statement not found" });
      }

      // Perform the deletion
      const success = await storage.deletePovStatement(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "POV statement not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete POV statement" });
    }
  });

  // Phase 2: Define - HMW Questions
  app.get("/api/projects/:projectId/hmw-questions", requireAuth, async (req, res) => {
    try {
      const hmwQuestions = await storage.getHmwQuestions(req.params.projectId);
      res.json(hmwQuestions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch HMW questions" });
    }
  });

  app.post("/api/projects/:projectId/hmw-questions", requireAuth, async (req, res) => {
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

  app.put("/api/hmw-questions/:id", requireAuth, async (req, res) => {
    try {
      // First, check if the HMW question exists
      const existingHmwQuestion = await storage.getHmwQuestion(req.params.id);
      if (!existingHmwQuestion) {
        return res.status(404).json({ error: "HMW question not found" });
      }

      // Validate the update data
      const validatedData = insertHmwQuestionSchema.omit({ projectId: true }).partial().parse(req.body);
      
      // Perform the update
      const hmwQuestion = await storage.updateHmwQuestion(req.params.id, validatedData);
      if (!hmwQuestion) {
        return res.status(404).json({ error: "HMW question not found" });
      }
      res.json(hmwQuestion);
    } catch (error) {
      res.status(400).json({ error: "Invalid HMW question data" });
    }
  });

  app.delete("/api/hmw-questions/:id", requireAuth, async (req, res) => {
    try {
      // First, check if the HMW question exists
      const existingHmwQuestion = await storage.getHmwQuestion(req.params.id);
      if (!existingHmwQuestion) {
        return res.status(404).json({ error: "HMW question not found" });
      }

      // Perform the deletion
      const success = await storage.deleteHmwQuestion(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "HMW question not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete HMW question" });
    }
  });

  // Phase 3: Ideate - Ideas
  app.get("/api/projects/:projectId/ideas", requireAuth, async (req, res) => {
    try {
      const ideas = await storage.getIdeas(req.params.projectId);
      res.json(ideas);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ideas" });
    }
  });

  app.post("/api/projects/:projectId/ideas", requireAuth, async (req, res) => {
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

  app.put("/api/ideas/:id", requireAuth, async (req, res) => {
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

  app.delete("/api/ideas/:id", requireAuth, async (req, res) => {
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

  // Phase 4: Prototype - Prototypes
  app.get("/api/projects/:projectId/prototypes", requireAuth, async (req, res) => {
    try {
      const prototypes = await storage.getPrototypes(req.params.projectId);
      res.json(prototypes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch prototypes" });
    }
  });

  app.post("/api/projects/:projectId/prototypes", requireAuth, async (req, res) => {
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

  // Phase 5: Test - Test Plans
  app.get("/api/projects/:projectId/test-plans", requireAuth, async (req, res) => {
    try {
      const testPlans = await storage.getTestPlans(req.params.projectId);
      res.json(testPlans);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch test plans" });
    }
  });

  app.post("/api/projects/:projectId/test-plans", requireAuth, async (req, res) => {
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

  // Phase 5: Test - Test Results
  app.get("/api/test-plans/:testPlanId/results", requireAuth, async (req, res) => {
    try {
      const testResults = await storage.getTestResults(req.params.testPlanId);
      res.json(testResults);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch test results" });
    }
  });

  app.post("/api/test-plans/:testPlanId/results", requireAuth, async (req, res) => {
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

  // User Progress routes
  app.get("/api/users/:userId/projects/:projectId/progress", requireAuth, async (req, res) => {
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

  app.put("/api/users/:userId/projects/:projectId/progress", requireAuth, async (req, res) => {
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

  // Analytics routes
  app.get("/api/projects/:projectId/stats", requireAuth, async (req, res) => {
    try {
      const stats = await storage.getProjectStats(req.params.projectId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project stats" });
    }
  });

  // Dashboard summary route
  app.get("/api/dashboard", requireAuth, async (req, res) => {
    try {
      const projects = await storage.getProjects();
      const totalProjects = projects.length;
      const activeProjects = projects.filter(p => p.status === "in_progress").length;
      const completedProjects = projects.filter(p => p.status === "completed").length;
      
      // Get average completion rate
      const avgCompletion = projects.length > 0 
        ? projects.reduce((sum, p) => sum + (p.completionRate || 0), 0) / projects.length 
        : 0;

      res.json({
        totalProjects,
        activeProjects, 
        completedProjects,
        avgCompletion: Math.round(avgCompletion),
        recentProjects: projects.slice(-3).reverse()
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard data" });
    }
  });

  // Articles routes
  app.get("/api/articles", async (_req, res) => {
    try {
      const articles = await storage.getArticles();
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  });

  app.get("/api/articles/category/:category", async (req, res) => {
    try {
      const articles = await storage.getArticlesByCategory(req.params.category);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch articles by category" });
    }
  });

  app.get("/api/articles/:id", async (req, res) => {
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

  app.post("/api/articles", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertArticleSchema.parse(req.body);
      const article = await storage.createArticle(validatedData);
      res.status(201).json(article);
    } catch (error) {
      res.status(400).json({ error: "Invalid article data" });
    }
  });

  app.put("/api/articles/:id", requireAdmin, async (req, res) => {
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

  app.delete("/api/articles/:id", requireAdmin, async (req, res) => {
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

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      console.log("Login attempt:", { username, passwordLength: password?.length });
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }

      // Debug: List all users before search
      const allUsers = await storage.getUsers();
      console.log("Total users in system:", allUsers.length);
      console.log("All usernames:", allUsers.map(u => u.username));
      console.log("Searching for username:", username);

      const user = await storage.getUserByUsername(username);
      console.log("User found:", user ? "Yes" : "No");
      
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      console.log("Password valid:", isValidPassword);
      
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Create session
      const { password: _, ...userWithoutPassword } = user;
      req.session.userId = user.id;
      req.session.user = {
        id: userWithoutPassword.id,
        username: userWithoutPassword.username,
        role: userWithoutPassword.role,
        createdAt: userWithoutPassword.createdAt || new Date()
      };

      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Signup route
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Nome de usuário e senha são obrigatórios" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: "Este nome de usuário já está em uso" });
      }

      // Create new user with minimal data
      const userData = {
        username,
        email: `${username}@temp.local`, // Temporary email
        name: username, // Use username as display name initially
        password,
        role: "user"
      };

      const user = await storage.createUser(userData);
      console.log("User created successfully:", user.username);
      
      // Debug: List all users
      const allUsers = await storage.getUsers();
      console.log("Total users in system:", allUsers.length);
      console.log("All usernames:", allUsers.map(u => u.username));
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({ user: userWithoutPassword, message: "Conta criada com sucesso!" });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ error: "Erro ao criar conta. Tente novamente." });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    try {
      // Destroy session
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ error: "Logout failed" });
        }
        res.clearCookie('dttools.session');
        res.json({ message: "Logged out successfully" });
      });
    } catch (error) {
      res.status(500).json({ error: "Logout failed" });
    }
  });

  // Check current session/user
  app.get("/api/auth/me", async (req, res) => {
    try {
      if (!req.session?.userId || !req.session?.user) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      
      // TEMP FIX: Refresh user data from storage if role might have changed
      if (req.session.user && req.session.user.username === "dttools.app@gmail.com") {
        const freshUser = await storage.getUserByUsername(req.session.user.username);
        if (freshUser && freshUser.role !== req.session.user.role) {
          req.session.user = {
            id: freshUser.id,
            username: freshUser.username,
            role: freshUser.role,
            createdAt: freshUser.createdAt || new Date()
          };
        }
      }
      
      // Return current user data from session
      res.json({ user: req.session.user });
    } catch (error) {
      console.error("Auth check error:", error);
      res.status(500).json({ error: "Failed to check authentication" });
    }
  });

  // User profile routes
  app.get("/api/users/profile", requireAuth, async (req, res) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Remove password from response
      const { password: _, ...userProfile } = user;
      res.json(userProfile);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user profile" });
    }
  });

  app.put("/api/users/profile", requireAuth, async (req, res) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const validatedData = updateProfileSchema.parse(req.body);
      const user = await storage.updateUser(req.user.id, validatedData);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Update session user data  
      if (req.session?.user) {
        req.session.user = {
          ...req.session.user,
          username: user.email, // Use email as username
        };
      }

      // Remove password from response
      const { password: _, ...userProfile } = user;
      res.json(userProfile);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to update user profile" });
      }
    }
  });

  // User management routes (admin only)
  app.get("/api/users", requireAdmin, async (_req, res) => {
    try {
      const users = await storage.getUsers();
      // Remove passwords from response
      const usersWithoutPasswords = users.map(({ password: _, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.post("/api/users", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validatedData);
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.put("/api/users/:id", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(req.params.id, validatedData);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.delete("/api/users/:id", requireAdmin, async (req, res) => {
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

  // Admin routes
  app.get("/api/admin/stats", requireAdmin, async (_req, res) => {
    try {
      const users = await storage.getUsers();
      const projects = await storage.getProjects();
      const articles = await storage.getArticles();
      
      const stats = {
        totalUsers: users.length,
        totalProjects: projects.length,
        totalArticles: articles.length,
        projectsByStatus: {
          in_progress: projects.filter(p => p.status === 'in_progress').length,
          completed: projects.filter(p => p.status === 'completed').length,
        },
        projectsByPhase: {
          phase1: projects.filter(p => p.currentPhase === 1).length,
          phase2: projects.filter(p => p.currentPhase === 2).length,
          phase3: projects.filter(p => p.currentPhase === 3).length,
          phase4: projects.filter(p => p.currentPhase === 4).length,
          phase5: projects.filter(p => p.currentPhase === 5).length,
        },
        usersByRole: {
          admin: users.filter(u => u.role === 'admin').length,
          user: users.filter(u => u.role === 'user').length,
        },
        articlesByCategory: {
          empathize: articles.filter(a => a.category === 'empathize').length,
          define: articles.filter(a => a.category === 'define').length,
          ideate: articles.filter(a => a.category === 'ideate').length,
          prototype: articles.filter(a => a.category === 'prototype').length,
          test: articles.filter(a => a.category === 'test').length,
        }
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch admin stats" });
    }
  });

  // Subscription Plans routes
  app.get("/api/subscription-plans", async (_req, res) => {
    try {
      const plans = await storage.getSubscriptionPlans();
      res.json(plans);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subscription plans" });
    }
  });

  app.get("/api/subscription-plans/:id", async (req, res) => {
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

  // Admin routes for subscription plans
  app.post("/api/subscription-plans", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertSubscriptionPlanSchema.parse(req.body);
      const plan = await storage.createSubscriptionPlan(validatedData);
      res.status(201).json(plan);
    } catch (error) {
      res.status(400).json({ error: "Invalid subscription plan data" });
    }
  });

  app.put("/api/subscription-plans/:id", requireAdmin, async (req, res) => {
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

  // User Subscription routes
  app.get("/api/user/subscription", requireAuth, async (req, res) => {
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

  // Create Stripe Checkout Session
  app.post("/api/create-checkout-session", requireAuth, async (req, res) => {
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

      // Free plan doesn't need Stripe
      if (plan.name === "free") {
        const subscription = await storage.createUserSubscription({
          userId: req.user.id,
          planId: plan.id,
          status: "active",
          billingPeriod: "monthly"
        });
        return res.json({ subscription });
      }

      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Create or get Stripe customer
      let stripeCustomerId = user.stripeCustomerId;
      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: user.username,
          metadata: {
            userId: user.id,
          },
        });
        stripeCustomerId = customer.id;
        
        // Update user with stripe customer ID
        await storage.updateUser(user.id, { stripeCustomerId });
      }

      const price = billingPeriod === "yearly" ? plan.priceYearly : plan.priceMonthly;
      
      // Create Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "brl",
              product_data: {
                name: plan.displayName,
                description: plan.description || undefined,
              },
              unit_amount: price,
              recurring: {
                interval: billingPeriod === "yearly" ? "year" : "month",
              },
            },
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${req.headers.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/pricing`,
        metadata: {
          userId: req.user.id,
          planId: plan.id,
          billingPeriod,
        },
      });

      res.json({ url: session.url });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  // Stripe webhook to handle subscription events
  app.post("/api/stripe-webhook", async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig!, process.env.STRIPE_WEBHOOK_SECRET || "");
    } catch (err: any) {
      console.log(`Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      switch (event.type) {
        case "checkout.session.completed":
          const session = event.data.object as Stripe.Checkout.Session;
          if (session.metadata) {
            const { userId, planId, billingPeriod } = session.metadata;
            
            // Create user subscription
            await storage.createUserSubscription({
              userId,
              planId,
              stripeSubscriptionId: session.subscription as string,
              status: "active",
              billingPeriod: billingPeriod as "monthly" | "yearly",
              currentPeriodStart: new Date(),
              currentPeriodEnd: new Date(Date.now() + (billingPeriod === "yearly" ? 365 : 30) * 24 * 60 * 60 * 1000)
            });

            // Update user subscription info
            await storage.updateUser(userId, {
              stripeSubscriptionId: session.subscription as string,
              subscriptionPlanId: planId,
              subscriptionStatus: "active"
            });
          }
          break;

        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          const subscription = event.data.object as Stripe.Subscription;
          const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
          
          if (customer.metadata?.userId) {
            const status = subscription.status === "active" ? "active" : 
                          subscription.status === "canceled" ? "canceled" : "expired";
            
            await storage.updateUser(customer.metadata.userId, {
              subscriptionStatus: status,
              subscriptionEndDate: (subscription as any).current_period_end ? new Date((subscription as any).current_period_end * 1000) : null
            });

            // Update user subscription
            const userSub = await storage.getUserActiveSubscription(customer.metadata.userId);
            if (userSub) {
              await storage.updateUserSubscription(userSub.id, {
                status,
                currentPeriodEnd: (subscription as any).current_period_end ? new Date((subscription as any).current_period_end * 1000) : null,
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

  // Cancel subscription
  app.post("/api/cancel-subscription", requireAuth, async (req, res) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const user = await storage.getUser(req.user.id);
      if (!user?.stripeSubscriptionId) {
        return res.status(400).json({ error: "No active subscription found" });
      }

      // Cancel the subscription at period end
      await stripe.subscriptions.update(user.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });

      // Update local subscription
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

  // AI Chat routes
  app.post("/api/chat", requireAuth, async (req, res) => {
    try {
      const { messages, context }: { messages: ChatMessage[], context: DesignThinkingContext } = req.body;
      
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required" });
      }

      if (!context || typeof context.currentPhase !== 'number') {
        return res.status(400).json({ error: "Valid context with currentPhase is required" });
      }

      const response = await designThinkingAI.chat(messages, context);
      res.json({ message: response });
    } catch (error) {
      console.error("Error in AI chat:", error);
      // Always return 200 with helpful message, since chat() method now handles fallbacks gracefully
      res.json({ message: "Desculpe, houve um problema temporário. Tente novamente ou continue usando as ferramentas de Design Thinking disponíveis na plataforma." });
    }
  });

  app.post("/api/chat/suggestions", requireAuth, async (req, res) => {
    try {
      const { context, topic }: { context: DesignThinkingContext, topic: string } = req.body;
      
      if (!context || typeof context.currentPhase !== 'number') {
        return res.status(400).json({ error: "Valid context with currentPhase is required" });
      }

      if (!topic || typeof topic !== 'string') {
        return res.status(400).json({ error: "Topic is required" });
      }

      const suggestions = await designThinkingAI.generateSuggestions(context, topic);
      res.json({ suggestions });
    } catch (error) {
      console.error("Error generating suggestions:", error);
      res.status(500).json({ error: "Failed to generate suggestions" });
    }
  });

  app.post("/api/projects/:projectId/analyze", requireAuth, async (req, res) => {
    try {
      const { projectId } = req.params;
      const { currentPhase } = req.body;
      
      // Get project data
      const project = await storage.getProject(projectId);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      // Get phase-specific data
      const empathyMaps = await storage.getEmpathyMaps(projectId);
      const personas = await storage.getPersonas(projectId);
      const interviews = await storage.getInterviews(projectId);
      const observations = await storage.getObservations(projectId);
      const povStatements = await storage.getPovStatements(projectId);
      const hmwQuestions = await storage.getHmwQuestions(projectId);
      const ideas = await storage.getIdeas(projectId);
      const prototypes = await storage.getPrototypes(projectId);
      const testPlans = await storage.getTestPlans(projectId);

      const projectData = {
        project,
        empathyMaps,
        personas,
        interviews,
        observations,
        povStatements,
        hmwQuestions,
        ideas,
        prototypes,
        testPlans
      };

      const analysis = await designThinkingAI.analyzeProjectPhase(projectData, currentPhase || project.currentPhase);
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing project:", error);
      res.status(500).json({ error: "Failed to analyze project" });
    }
  });

  // Comprehensive AI Analysis endpoint
  app.post("/api/projects/:projectId/ai-analysis", requireAuth, async (req, res) => {
    try {
      const { projectId } = req.params;
      
      // Get project data
      const project = await storage.getProject(projectId);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      // Get all project data across all phases
      const empathyMaps = await storage.getEmpathyMaps(projectId);
      const personas = await storage.getPersonas(projectId);
      const interviews = await storage.getInterviews(projectId);
      const observations = await storage.getObservations(projectId);
      const povStatements = await storage.getPovStatements(projectId);
      const hmwQuestions = await storage.getHmwQuestions(projectId);
      const ideas = await storage.getIdeas(projectId);
      const prototypes = await storage.getPrototypes(projectId);
      const testPlans = await storage.getTestPlans(projectId);

      // Get test results for all test plans
      const testResults = [];
      for (const testPlan of testPlans) {
        const results = await storage.getTestResults(testPlan.id);
        testResults.push(...results);
      }

      const analysisData = {
        project,
        empathyMaps,
        personas,
        interviews,
        observations,
        povStatements,
        hmwQuestions,
        ideas,
        prototypes,
        testPlans,
        testResults
      };

      const analysis = await designThinkingAI.analyzeCompleteProject(analysisData);
      res.json(analysis);
    } catch (error) {
      console.error("Error generating AI analysis:", error);
      if (error instanceof Error && error.message.includes('OpenAI')) {
        res.status(503).json({ error: "AI service temporarily unavailable. Please check API configuration." });
      } else {
        res.status(500).json({ error: "Failed to generate AI analysis" });
      }
    }
  });

  // Canvas Drawings Routes
  // GET /api/canvas-drawings/:projectId
  app.get("/api/canvas-drawings/:projectId", requireAuth, async (req, res) => {
    try {
      const { projectId } = req.params;
      const drawings = await storage.getCanvasDrawings(projectId);
      res.json(drawings);
    } catch (error) {
      console.error("Error fetching canvas drawings:", error);
      res.status(500).json({ error: "Failed to fetch canvas drawings" });
    }
  });

  // POST /api/canvas-drawings
  app.post("/api/canvas-drawings", requireAuth, async (req, res) => {
    try {
      const parsed = insertCanvasDrawingSchema.parse(req.body);
      const drawing = await storage.createCanvasDrawing(parsed);
      res.status(201).json(drawing);
    } catch (error) {
      console.error("Error creating canvas drawing:", error);
      res.status(500).json({ error: "Failed to create canvas drawing" });
    }
  });

  // PUT /api/canvas-drawings/:id
  app.put("/api/canvas-drawings/:id", requireAuth, async (req, res) => {
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

  // DELETE /api/canvas-drawings/:id
  app.delete("/api/canvas-drawings/:id", requireAuth, async (req, res) => {
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

  // Phase Cards (Kanban) Routes
  // GET /api/phase-cards/:projectId
  app.get("/api/phase-cards/:projectId", requireAuth, async (req, res) => {
    try {
      const { projectId } = req.params;
      const cards = await storage.getPhaseCards(projectId);
      res.json(cards);
    } catch (error) {
      console.error("Error fetching phase cards:", error);
      res.status(500).json({ error: "Failed to fetch phase cards" });
    }
  });

  // POST /api/phase-cards
  app.post("/api/phase-cards", requireAuth, async (req, res) => {
    try {
      const parsed = insertPhaseCardSchema.parse(req.body);
      const card = await storage.createPhaseCard(parsed);
      res.status(201).json(card);
    } catch (error) {
      console.error("Error creating phase card:", error);
      res.status(500).json({ error: "Failed to create phase card" });
    }
  });

  // PUT /api/phase-cards/:id
  app.put("/api/phase-cards/:id", requireAuth, async (req, res) => {
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

  // DELETE /api/phase-cards/:id
  app.delete("/api/phase-cards/:id", requireAuth, async (req, res) => {
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

  // Benchmarking Routes
  // GET /api/benchmarks/:projectId
  app.get("/api/benchmarks/:projectId", requireAuth, async (req, res) => {
    try {
      const { projectId } = req.params;
      const benchmarks = await storage.getBenchmarks(projectId);
      res.json(benchmarks);
    } catch (error) {
      console.error("Error fetching benchmarks:", error);
      res.status(500).json({ error: "Failed to fetch benchmarks" });
    }
  });

  // GET /api/benchmarks/detail/:id
  app.get("/api/benchmarks/detail/:id", requireAuth, async (req, res) => {
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

  // POST /api/benchmarks
  app.post("/api/benchmarks", requireAuth, async (req, res) => {
    try {
      const parsed = insertBenchmarkSchema.parse(req.body);
      const benchmark = await storage.createBenchmark(parsed);
      res.status(201).json(benchmark);
    } catch (error) {
      console.error("Error creating benchmark:", error);
      res.status(500).json({ error: "Failed to create benchmark" });
    }
  });

  // PUT /api/benchmarks/:id
  app.put("/api/benchmarks/:id", requireAuth, async (req, res) => {
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

  // DELETE /api/benchmarks/:id
  app.delete("/api/benchmarks/:id", requireAuth, async (req, res) => {
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

  // Benchmark Assessment Routes
  // GET /api/benchmark-assessments/:benchmarkId
  app.get("/api/benchmark-assessments/:benchmarkId", requireAuth, async (req, res) => {
    try {
      const { benchmarkId } = req.params;
      const assessments = await storage.getBenchmarkAssessments(benchmarkId);
      res.json(assessments);
    } catch (error) {
      console.error("Error fetching benchmark assessments:", error);
      res.status(500).json({ error: "Failed to fetch benchmark assessments" });
    }
  });

  // POST /api/benchmark-assessments
  app.post("/api/benchmark-assessments", requireAuth, async (req, res) => {
    try {
      const parsed = insertBenchmarkAssessmentSchema.parse(req.body);
      const assessment = await storage.createBenchmarkAssessment(parsed);
      res.status(201).json(assessment);
    } catch (error) {
      console.error("Error creating benchmark assessment:", error);
      res.status(500).json({ error: "Failed to create benchmark assessment" });
    }
  });

  // PUT /api/benchmark-assessments/:id
  app.put("/api/benchmark-assessments/:id", requireAuth, async (req, res) => {
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

  // DELETE /api/benchmark-assessments/:id
  app.delete("/api/benchmark-assessments/:id", requireAuth, async (req, res) => {
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

  // GET /api/projects/:id/export-pptx - Export project as PPTX
  app.get("/api/projects/:id/export-pptx", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      
      // Verify project ownership
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      // Generate PPTX
      const pptxService = new PPTXService();
      const pptxBuffer = await pptxService.generateProjectPPTX(id);
      
      // Set response headers for file download
      const filename = `${project.name.replace(/[^a-zA-Z0-9]/g, '_')}_DTTools.pptx`;
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', pptxBuffer.length);
      
      // Send the buffer
      res.send(pptxBuffer);
      
    } catch (error) {
      console.error("Error generating PPTX:", error);
      res.status(500).json({ error: "Failed to generate PPTX presentation" });
    }
  });

  // GET /api/projects/:id/export-pdf - Export project as PDF
  app.get("/api/projects/:id/export-pdf", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      
      // Verify project ownership
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      // Generate PDF using PPTX service and convert
      const pptxService = new PPTXService();
      const pdfBuffer = await pptxService.generateProjectPDF(id);
      
      // Set response headers for file download
      const filename = `${project.name.replace(/[^a-zA-Z0-9]/g, '_')}_DTTools.pdf`;
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      // Send the buffer
      res.send(pdfBuffer);
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ error: "Failed to generate PDF document" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}