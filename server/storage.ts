import { 
  type Event, type InsertEvent,
  type TeamMember, type InsertTeamMember,
  type Report, type InsertReport,
  type Integration, type InsertIntegration,
  type AIInsight, type InsertAIInsight,
  type UserBehavior, type InsertUserBehavior
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Events
  getEvents(): Promise<Event[]>;
  getEvent(id: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: string, event: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: string): Promise<boolean>;

  // Team Members
  getTeamMembers(): Promise<TeamMember[]>;
  getTeamMember(id: string): Promise<TeamMember | undefined>;
  createTeamMember(member: InsertTeamMember): Promise<TeamMember>;
  updateTeamMember(id: string, member: Partial<InsertTeamMember>): Promise<TeamMember | undefined>;

  // Reports
  getReports(): Promise<Report[]>;
  getReportsByEvent(eventId: string): Promise<Report[]>;
  createReport(report: InsertReport): Promise<Report>;
  getRecentReports(limit?: number): Promise<Report[]>;

  // Integrations
  getIntegrations(): Promise<Integration[]>;
  getIntegration(id: string): Promise<Integration | undefined>;
  createIntegration(integration: InsertIntegration): Promise<Integration>;
  updateIntegration(id: string, integration: Partial<InsertIntegration>): Promise<Integration | undefined>;

  // AI Insights
  getAIInsights(): Promise<AIInsight[]>;
  createAIInsight(insight: InsertAIInsight): Promise<AIInsight>;
  markInsightAsRead(id: string): Promise<boolean>;
  getUnreadInsights(): Promise<AIInsight[]>;

  // User Behavior
  logUserBehavior(behavior: InsertUserBehavior): Promise<UserBehavior>;
  getUserBehaviorData(userId: string, limit?: number): Promise<UserBehavior[]>;

  // Analytics
  getMetrics(): Promise<{
    activeEvents: number;
    completionRate: number;
    teamEfficiency: number;
    budgetUsage: number;
  }>;
}

export class MemStorage implements IStorage {
  private events: Map<string, Event>;
  private teamMembers: Map<string, TeamMember>;
  private reports: Map<string, Report>;
  private integrations: Map<string, Integration>;
  private aiInsights: Map<string, AIInsight>;
  private userBehavior: Map<string, UserBehavior>;

  constructor() {
    this.events = new Map();
    this.teamMembers = new Map();
    this.reports = new Map();
    this.integrations = new Map();
    this.aiInsights = new Map();
    this.userBehavior = new Map();
    
    this.initializeData();
  }

  private initializeData() {
    // Initialize with sample data
    const sampleEvent: Event = {
      id: randomUUID(),
      name: "Summer Festival 2024",
      description: "Annual summer music festival",
      status: "active",
      completionRate: 87,
      budget: 150000,
      budgetUsed: 109500,
      startDate: new Date("2024-06-01"),
      endDate: new Date("2024-08-15"),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.events.set(sampleEvent.id, sampleEvent);

    const sampleMembers: TeamMember[] = [
      {
        id: randomUUID(),
        name: "Mike Chen",
        email: "mike@eventflow.com",
        role: "Project Manager",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
        efficiency: 95,
        tasksCompleted: 23,
        tasksAssigned: 25,
      },
      {
        id: randomUUID(),
        name: "Emily Rodriguez",
        email: "emily@eventflow.com",
        role: "Coordinator",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
        efficiency: 88,
        tasksCompleted: 19,
        tasksAssigned: 22,
      },
      {
        id: randomUUID(),
        name: "David Park",
        email: "david@eventflow.com",
        role: "Operations",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
        efficiency: 91,
        tasksCompleted: 17,
        tasksAssigned: 19,
      },
    ];
    sampleMembers.forEach(member => this.teamMembers.set(member.id, member));

    const sampleIntegrations: Integration[] = [
      {
        id: randomUUID(),
        name: "Asana",
        type: "asana",
        status: "connected",
        apiKey: "asana_key_123",
        webhook: null,
        lastSync: new Date(),
        settings: { projectIds: ["123", "456"] },
      },
      {
        id: randomUUID(),
        name: "Trello",
        type: "trello",
        status: "connected",
        apiKey: "trello_key_456",
        webhook: null,
        lastSync: new Date(),
        settings: { boardIds: ["board1", "board2"] },
      },
      {
        id: randomUUID(),
        name: "Monday.com",
        type: "monday",
        status: "syncing",
        apiKey: "monday_key_789",
        webhook: null,
        lastSync: new Date(Date.now() - 300000), // 5 minutes ago
        settings: { workspaceId: "workspace1" },
      },
      {
        id: randomUUID(),
        name: "Slack",
        type: "slack",
        status: "disconnected",
        apiKey: null,
        webhook: null,
        lastSync: null,
        settings: null,
      },
    ];
    sampleIntegrations.forEach(integration => this.integrations.set(integration.id, integration));

    const sampleInsights: AIInsight[] = [
      {
        id: randomUUID(),
        type: "pattern",
        title: "Pattern Detected",
        description: "Teams perform 23% better when tasks are assigned on Mondays vs Fridays.",
        confidence: 0.87,
        priority: "medium",
        isRead: false,
        createdAt: new Date(),
        relatedEventId: sampleEvent.id,
      },
      {
        id: randomUUID(),
        type: "trend",
        title: "Trend Identified",
        description: "Vendor response times improve by 15% when contacted before 10 AM.",
        confidence: 0.92,
        priority: "medium",
        isRead: false,
        createdAt: new Date(),
        relatedEventId: sampleEvent.id,
      },
      {
        id: randomUUID(),
        type: "risk",
        title: "Risk Alert",
        description: "Summer Festival budget may exceed by 12% based on current spending rate.",
        confidence: 0.78,
        priority: "high",
        isRead: false,
        createdAt: new Date(),
        relatedEventId: sampleEvent.id,
      },
    ];
    sampleInsights.forEach(insight => this.aiInsights.set(insight.id, insight));
  }

  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getEvent(id: string): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = randomUUID();
    const event: Event = {
      ...insertEvent,
      id,
      description: insertEvent.description || null,
      status: insertEvent.status || "planning",
      completionRate: insertEvent.completionRate || 0,
      budget: insertEvent.budget || null,
      budgetUsed: insertEvent.budgetUsed || 0,
      startDate: insertEvent.startDate || null,
      endDate: insertEvent.endDate || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.events.set(id, event);
    return event;
  }

  async updateEvent(id: string, updateEvent: Partial<InsertEvent>): Promise<Event | undefined> {
    const event = this.events.get(id);
    if (!event) return undefined;
    
    const updatedEvent: Event = {
      ...event,
      ...updateEvent,
      updatedAt: new Date(),
    };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteEvent(id: string): Promise<boolean> {
    return this.events.delete(id);
  }

  async getTeamMembers(): Promise<TeamMember[]> {
    return Array.from(this.teamMembers.values());
  }

  async getTeamMember(id: string): Promise<TeamMember | undefined> {
    return this.teamMembers.get(id);
  }

  async createTeamMember(insertMember: InsertTeamMember): Promise<TeamMember> {
    const id = randomUUID();
    const member: TeamMember = { 
      ...insertMember, 
      id,
      avatar: insertMember.avatar || null,
      efficiency: insertMember.efficiency || 0,
      tasksCompleted: insertMember.tasksCompleted || 0,
      tasksAssigned: insertMember.tasksAssigned || 0
    };
    this.teamMembers.set(id, member);
    return member;
  }

  async updateTeamMember(id: string, updateMember: Partial<InsertTeamMember>): Promise<TeamMember | undefined> {
    const member = this.teamMembers.get(id);
    if (!member) return undefined;
    
    const updatedMember: TeamMember = { ...member, ...updateMember };
    this.teamMembers.set(id, updatedMember);
    return updatedMember;
  }

  async getReports(): Promise<Report[]> {
    return Array.from(this.reports.values());
  }

  async getReportsByEvent(eventId: string): Promise<Report[]> {
    return Array.from(this.reports.values()).filter(report => report.eventId === eventId);
  }

  async createReport(insertReport: InsertReport): Promise<Report> {
    const id = randomUUID();
    const report: Report = {
      ...insertReport,
      id,
      eventId: insertReport.eventId || null,
      insights: insertReport.insights || null,
      pdfUrl: insertReport.pdfUrl || null,
      generatedAt: new Date(),
    };
    this.reports.set(id, report);
    return report;
  }

  async getRecentReports(limit = 10): Promise<Report[]> {
    const reports = Array.from(this.reports.values());
    return reports
      .sort((a, b) => (b.generatedAt?.getTime() || 0) - (a.generatedAt?.getTime() || 0))
      .slice(0, limit);
  }

  async getIntegrations(): Promise<Integration[]> {
    return Array.from(this.integrations.values());
  }

  async getIntegration(id: string): Promise<Integration | undefined> {
    return this.integrations.get(id);
  }

  async createIntegration(insertIntegration: InsertIntegration): Promise<Integration> {
    const id = randomUUID();
    const integration: Integration = { 
      ...insertIntegration, 
      id,
      status: insertIntegration.status || "disconnected",
      apiKey: insertIntegration.apiKey || null,
      webhook: insertIntegration.webhook || null,
      lastSync: null,
      settings: insertIntegration.settings || null
    };
    this.integrations.set(id, integration);
    return integration;
  }

  async updateIntegration(id: string, updateIntegration: Partial<InsertIntegration>): Promise<Integration | undefined> {
    const integration = this.integrations.get(id);
    if (!integration) return undefined;
    
    const updatedIntegration: Integration = { ...integration, ...updateIntegration };
    this.integrations.set(id, updatedIntegration);
    return updatedIntegration;
  }

  async getAIInsights(): Promise<AIInsight[]> {
    return Array.from(this.aiInsights.values());
  }

  async createAIInsight(insertInsight: InsertAIInsight): Promise<AIInsight> {
    const id = randomUUID();
    const insight: AIInsight = {
      ...insertInsight,
      id,
      priority: insertInsight.priority || "medium",
      isRead: insertInsight.isRead || false,
      relatedEventId: insertInsight.relatedEventId || null,
      createdAt: new Date(),
    };
    this.aiInsights.set(id, insight);
    return insight;
  }

  async markInsightAsRead(id: string): Promise<boolean> {
    const insight = this.aiInsights.get(id);
    if (!insight) return false;
    
    insight.isRead = true;
    this.aiInsights.set(id, insight);
    return true;
  }

  async getUnreadInsights(): Promise<AIInsight[]> {
    return Array.from(this.aiInsights.values()).filter(insight => !insight.isRead);
  }

  async logUserBehavior(insertBehavior: InsertUserBehavior): Promise<UserBehavior> {
    const id = randomUUID();
    const behavior: UserBehavior = {
      ...insertBehavior,
      id,
      context: insertBehavior.context || null,
      timestamp: new Date(),
    };
    this.userBehavior.set(id, behavior);
    return behavior;
  }

  async getUserBehaviorData(userId: string, limit = 100): Promise<UserBehavior[]> {
    const behaviors = Array.from(this.userBehavior.values())
      .filter(behavior => behavior.userId === userId)
      .sort((a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0));
    
    return limit ? behaviors.slice(0, limit) : behaviors;
  }

  async getMetrics(): Promise<{
    activeEvents: number;
    completionRate: number;
    teamEfficiency: number;
    budgetUsage: number;
  }> {
    const events = Array.from(this.events.values());
    const activeEvents = events.filter(event => event.status === "active");
    const members = Array.from(this.teamMembers.values());
    
    const avgCompletionRate = events.length > 0 
      ? events.reduce((sum, event) => sum + (event.completionRate || 0), 0) / events.length 
      : 0;
      
    const avgTeamEfficiency = members.length > 0
      ? members.reduce((sum, member) => sum + (member.efficiency || 0), 0) / members.length
      : 0;
      
    const totalBudget = events.reduce((sum, event) => sum + (event.budget || 0), 0);
    const totalUsed = events.reduce((sum, event) => sum + (event.budgetUsed || 0), 0);
    
    return {
      activeEvents: activeEvents.length,
      completionRate: Math.round(avgCompletionRate),
      teamEfficiency: Math.round(avgTeamEfficiency),
      budgetUsage: totalUsed,
    };
  }
}

export const storage = new MemStorage();
