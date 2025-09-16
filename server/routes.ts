import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertEventSchema,
  insertTeamMemberSchema,
  insertReportSchema,
  insertIntegrationSchema,
  insertAIInsightSchema,
  insertUserBehaviorSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Events routes
  app.get("/api/events", async (_req, res) => {
    try {
      const events = await storage.getEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const event = await storage.getEvent(req.params.id);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch event" });
    }
  });

  app.post("/api/events", async (req, res) => {
    try {
      const validatedData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(validatedData);
      res.status(201).json(event);
    } catch (error) {
      res.status(400).json({ error: "Invalid event data" });
    }
  });

  app.put("/api/events/:id", async (req, res) => {
    try {
      const validatedData = insertEventSchema.partial().parse(req.body);
      const event = await storage.updateEvent(req.params.id, validatedData);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(400).json({ error: "Invalid event data" });
    }
  });

  // Team members routes
  app.get("/api/team-members", async (_req, res) => {
    try {
      const members = await storage.getTeamMembers();
      res.json(members);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch team members" });
    }
  });

  app.post("/api/team-members", async (req, res) => {
    try {
      const validatedData = insertTeamMemberSchema.parse(req.body);
      const member = await storage.createTeamMember(validatedData);
      res.status(201).json(member);
    } catch (error) {
      res.status(400).json({ error: "Invalid team member data" });
    }
  });

  // Reports routes
  app.get("/api/reports", async (_req, res) => {
    try {
      const reports = await storage.getReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reports" });
    }
  });

  app.get("/api/reports/recent", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const reports = await storage.getRecentReports(limit);
      res.json(reports);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recent reports" });
    }
  });

  app.post("/api/reports", async (req, res) => {
    try {
      const validatedData = insertReportSchema.parse(req.body);
      const report = await storage.createReport(validatedData);
      res.status(201).json(report);
    } catch (error) {
      res.status(400).json({ error: "Invalid report data" });
    }
  });

  app.post("/api/reports/generate", async (req, res) => {
    try {
      const { eventId } = req.body;
      
      // Get event data
      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      // Get team members for efficiency calculation
      const teamMembers = await storage.getTeamMembers();
      const avgEfficiency = teamMembers.length > 0 
        ? teamMembers.reduce((sum, member) => sum + (member.efficiency || 0), 0) / teamMembers.length
        : 0;

      // Create report
      const startDate = event.startDate ? new Date(event.startDate) : new Date();
      const currentWeek = Math.max(1, Math.ceil((Date.now() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000)));
      const report = await storage.createReport({
        eventId,
        title: `${event.name} - Week ${currentWeek}`,
        weekNumber: currentWeek,
        year: new Date().getFullYear(),
        completionRate: event.completionRate || 0,
        teamEfficiency: avgEfficiency,
        budgetUsage: event.budgetUsed || 0,
        insights: {
          recommendations: [
            "Consider adjusting task assignments based on team performance",
            "Monitor budget closely to prevent overruns"
          ]
        },
        pdfUrl: null,
      });

      res.status(201).json(report);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate report" });
    }
  });

  // Integrations routes
  app.get("/api/integrations", async (_req, res) => {
    try {
      const integrations = await storage.getIntegrations();
      res.json(integrations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch integrations" });
    }
  });

  app.post("/api/integrations", async (req, res) => {
    try {
      const validatedData = insertIntegrationSchema.parse(req.body);
      const integration = await storage.createIntegration(validatedData);
      res.status(201).json(integration);
    } catch (error) {
      res.status(400).json({ error: "Invalid integration data" });
    }
  });

  app.put("/api/integrations/:id", async (req, res) => {
    try {
      const validatedData = insertIntegrationSchema.partial().parse(req.body);
      const integration = await storage.updateIntegration(req.params.id, validatedData);
      if (!integration) {
        return res.status(404).json({ error: "Integration not found" });
      }
      res.json(integration);
    } catch (error) {
      res.status(400).json({ error: "Invalid integration data" });
    }
  });

  // AI Insights routes
  app.get("/api/ai-insights", async (_req, res) => {
    try {
      const insights = await storage.getAIInsights();
      res.json(insights);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch AI insights" });
    }
  });

  app.get("/api/ai-insights/unread", async (_req, res) => {
    try {
      const insights = await storage.getUnreadInsights();
      res.json(insights);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch unread insights" });
    }
  });

  app.post("/api/ai-insights", async (req, res) => {
    try {
      const validatedData = insertAIInsightSchema.parse(req.body);
      const insight = await storage.createAIInsight(validatedData);
      res.status(201).json(insight);
    } catch (error) {
      res.status(400).json({ error: "Invalid AI insight data" });
    }
  });

  app.put("/api/ai-insights/:id/read", async (req, res) => {
    try {
      const success = await storage.markInsightAsRead(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Insight not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to mark insight as read" });
    }
  });

  // User behavior routes
  app.post("/api/user-behavior", async (req, res) => {
    try {
      const validatedData = insertUserBehaviorSchema.parse(req.body);
      const behavior = await storage.logUserBehavior(validatedData);
      res.status(201).json(behavior);
    } catch (error) {
      res.status(400).json({ error: "Invalid user behavior data" });
    }
  });

  // Metrics routes
  app.get("/api/metrics", async (_req, res) => {
    try {
      const metrics = await storage.getMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch metrics" });
    }
  });

  // Analytics routes
  app.get("/api/analytics/progress-trends", async (_req, res) => {
    try {
      // Simulate weekly progress data
      const weeks = ['Week 7', 'Week 8', 'Week 9', 'Week 10', 'Week 11', 'Week 12'];
      const completionRates = [72, 78, 85, 82, 89, 87];
      const teamEfficiency = [68, 75, 80, 83, 88, 92];
      
      res.json({
        labels: weeks,
        datasets: [
          {
            label: 'Completion Rate',
            data: completionRates,
            borderColor: 'hsl(221.2 83.2% 53.3%)',
            backgroundColor: 'hsla(221.2, 83.2%, 53.3%, 0.1)',
          },
          {
            label: 'Team Efficiency',
            data: teamEfficiency,
            borderColor: 'hsl(142.1 76.2% 36.3%)',
            backgroundColor: 'hsla(142.1, 76.2%, 36.3%, 0.1)',
          }
        ]
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analytics data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
