import type { Express } from "express";
import { createServer, type Server } from "http";
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
  insertUserProgressSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Projects routes
  app.get("/api/projects", async (_req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
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

  app.post("/api/projects", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      res.status(400).json({ error: "Invalid project data" });
    }
  });

  app.put("/api/projects/:id", async (req, res) => {
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

  app.delete("/api/projects/:id", async (req, res) => {
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
  app.get("/api/projects/:projectId/empathy-maps", async (req, res) => {
    try {
      const empathyMaps = await storage.getEmpathyMaps(req.params.projectId);
      res.json(empathyMaps);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch empathy maps" });
    }
  });

  app.post("/api/projects/:projectId/empathy-maps", async (req, res) => {
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

  app.put("/api/empathy-maps/:id", async (req, res) => {
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

  app.delete("/api/empathy-maps/:id", async (req, res) => {
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

  // Phase 1: Empathize - Personas
  app.get("/api/projects/:projectId/personas", async (req, res) => {
    try {
      const personas = await storage.getPersonas(req.params.projectId);
      res.json(personas);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch personas" });
    }
  });

  app.post("/api/projects/:projectId/personas", async (req, res) => {
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

  app.put("/api/personas/:id", async (req, res) => {
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

  app.delete("/api/personas/:id", async (req, res) => {
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
  app.get("/api/projects/:projectId/interviews", async (req, res) => {
    try {
      const interviews = await storage.getInterviews(req.params.projectId);
      res.json(interviews);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch interviews" });
    }
  });

  app.post("/api/projects/:projectId/interviews", async (req, res) => {
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

  app.put("/api/interviews/:id", async (req, res) => {
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

  app.delete("/api/interviews/:id", async (req, res) => {
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
  app.get("/api/projects/:projectId/observations", async (req, res) => {
    try {
      const observations = await storage.getObservations(req.params.projectId);
      res.json(observations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch observations" });
    }
  });

  app.post("/api/projects/:projectId/observations", async (req, res) => {
    try {
      const validatedData = insertObservationSchema.parse({
        ...req.body,
        projectId: req.params.projectId
      });
      const observation = await storage.createObservation(validatedData);
      res.status(201).json(observation);
    } catch (error) {
      res.status(400).json({ error: "Invalid observation data" });
    }
  });

  app.put("/api/observations/:id", async (req, res) => {
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

  app.delete("/api/observations/:id", async (req, res) => {
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
  app.get("/api/projects/:projectId/pov-statements", async (req, res) => {
    try {
      const povStatements = await storage.getPovStatements(req.params.projectId);
      res.json(povStatements);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch POV statements" });
    }
  });

  app.post("/api/projects/:projectId/pov-statements", async (req, res) => {
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

  app.put("/api/pov-statements/:id", async (req, res) => {
    try {
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

  app.delete("/api/pov-statements/:id", async (req, res) => {
    try {
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
  app.get("/api/projects/:projectId/hmw-questions", async (req, res) => {
    try {
      const hmwQuestions = await storage.getHmwQuestions(req.params.projectId);
      res.json(hmwQuestions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch HMW questions" });
    }
  });

  app.post("/api/projects/:projectId/hmw-questions", async (req, res) => {
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

  app.put("/api/hmw-questions/:id", async (req, res) => {
    try {
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

  app.delete("/api/hmw-questions/:id", async (req, res) => {
    try {
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
  app.get("/api/projects/:projectId/ideas", async (req, res) => {
    try {
      const ideas = await storage.getIdeas(req.params.projectId);
      res.json(ideas);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ideas" });
    }
  });

  app.post("/api/projects/:projectId/ideas", async (req, res) => {
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

  app.put("/api/ideas/:id", async (req, res) => {
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

  // Phase 4: Prototype - Prototypes
  app.get("/api/projects/:projectId/prototypes", async (req, res) => {
    try {
      const prototypes = await storage.getPrototypes(req.params.projectId);
      res.json(prototypes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch prototypes" });
    }
  });

  app.post("/api/projects/:projectId/prototypes", async (req, res) => {
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
  app.get("/api/projects/:projectId/test-plans", async (req, res) => {
    try {
      const testPlans = await storage.getTestPlans(req.params.projectId);
      res.json(testPlans);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch test plans" });
    }
  });

  app.post("/api/projects/:projectId/test-plans", async (req, res) => {
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
  app.get("/api/test-plans/:testPlanId/results", async (req, res) => {
    try {
      const testResults = await storage.getTestResults(req.params.testPlanId);
      res.json(testResults);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch test results" });
    }
  });

  app.post("/api/test-plans/:testPlanId/results", async (req, res) => {
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
  app.get("/api/users/:userId/projects/:projectId/progress", async (req, res) => {
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

  app.put("/api/users/:userId/projects/:projectId/progress", async (req, res) => {
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
  app.get("/api/projects/:projectId/stats", async (req, res) => {
    try {
      const stats = await storage.getProjectStats(req.params.projectId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project stats" });
    }
  });

  // Dashboard summary route
  app.get("/api/dashboard", async (_req, res) => {
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

  const httpServer = createServer(app);
  return httpServer;
}