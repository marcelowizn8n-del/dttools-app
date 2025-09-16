import { 
  type Project, type InsertProject,
  type EmpathyMap, type InsertEmpathyMap,
  type Persona, type InsertPersona,
  type Interview, type InsertInterview,
  type Observation, type InsertObservation,
  type PovStatement, type InsertPovStatement,
  type HmwQuestion, type InsertHmwQuestion,
  type Idea, type InsertIdea,
  type Prototype, type InsertPrototype,
  type TestPlan, type InsertTestPlan,
  type TestResult, type InsertTestResult,
  type UserProgress, type InsertUserProgress
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Projects
  getProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;

  // Phase 1: Empathize
  getEmpathyMaps(projectId: string): Promise<EmpathyMap[]>;
  createEmpathyMap(empathyMap: InsertEmpathyMap): Promise<EmpathyMap>;
  updateEmpathyMap(id: string, empathyMap: Partial<InsertEmpathyMap>): Promise<EmpathyMap | undefined>;
  deleteEmpathyMap(id: string): Promise<boolean>;

  getPersonas(projectId: string): Promise<Persona[]>;
  createPersona(persona: InsertPersona): Promise<Persona>;
  updatePersona(id: string, persona: Partial<InsertPersona>): Promise<Persona | undefined>;
  deletePersona(id: string): Promise<boolean>;

  getInterviews(projectId: string): Promise<Interview[]>;
  createInterview(interview: InsertInterview): Promise<Interview>;
  updateInterview(id: string, interview: Partial<InsertInterview>): Promise<Interview | undefined>;
  deleteInterview(id: string): Promise<boolean>;

  getObservations(projectId: string): Promise<Observation[]>;
  createObservation(observation: InsertObservation): Promise<Observation>;
  updateObservation(id: string, observation: Partial<InsertObservation>): Promise<Observation | undefined>;
  deleteObservation(id: string): Promise<boolean>;

  // Phase 2: Define
  getPovStatements(projectId: string): Promise<PovStatement[]>;
  getPovStatement(id: string): Promise<PovStatement | undefined>;
  createPovStatement(pov: InsertPovStatement): Promise<PovStatement>;
  updatePovStatement(id: string, pov: Partial<InsertPovStatement>): Promise<PovStatement | undefined>;
  deletePovStatement(id: string): Promise<boolean>;

  getHmwQuestions(projectId: string): Promise<HmwQuestion[]>;
  getHmwQuestion(id: string): Promise<HmwQuestion | undefined>;
  createHmwQuestion(hmw: InsertHmwQuestion): Promise<HmwQuestion>;
  updateHmwQuestion(id: string, hmw: Partial<InsertHmwQuestion>): Promise<HmwQuestion | undefined>;
  deleteHmwQuestion(id: string): Promise<boolean>;

  // Phase 3: Ideate
  getIdeas(projectId: string): Promise<Idea[]>;
  createIdea(idea: InsertIdea): Promise<Idea>;
  updateIdea(id: string, idea: Partial<InsertIdea>): Promise<Idea | undefined>;
  deleteIdea(id: string): Promise<boolean>;

  // Phase 4: Prototype
  getPrototypes(projectId: string): Promise<Prototype[]>;
  createPrototype(prototype: InsertPrototype): Promise<Prototype>;
  updatePrototype(id: string, prototype: Partial<InsertPrototype>): Promise<Prototype | undefined>;
  deletePrototype(id: string): Promise<boolean>;

  // Phase 5: Test
  getTestPlans(projectId: string): Promise<TestPlan[]>;
  createTestPlan(testPlan: InsertTestPlan): Promise<TestPlan>;
  updateTestPlan(id: string, testPlan: Partial<InsertTestPlan>): Promise<TestPlan | undefined>;

  getTestResults(testPlanId: string): Promise<TestResult[]>;
  createTestResult(testResult: InsertTestResult): Promise<TestResult>;

  // User Progress
  getUserProgress(userId: string, projectId: string): Promise<UserProgress | undefined>;
  updateUserProgress(progress: InsertUserProgress): Promise<UserProgress>;

  // Analytics
  getProjectStats(projectId: string): Promise<{
    totalTools: number;
    completedTools: number;
    currentPhase: number;
    completionRate: number;
  }>;
}

export class MemStorage implements IStorage {
  private projects: Map<string, Project>;
  private empathyMaps: Map<string, EmpathyMap>;
  private personas: Map<string, Persona>;
  private interviews: Map<string, Interview>;
  private observations: Map<string, Observation>;
  private povStatements: Map<string, PovStatement>;
  private hmwQuestions: Map<string, HmwQuestion>;
  private ideas: Map<string, Idea>;
  private prototypes: Map<string, Prototype>;
  private testPlans: Map<string, TestPlan>;
  private testResults: Map<string, TestResult>;
  private userProgress: Map<string, UserProgress>;

  constructor() {
    this.projects = new Map();
    this.empathyMaps = new Map();
    this.personas = new Map();
    this.interviews = new Map();
    this.observations = new Map();
    this.povStatements = new Map();
    this.hmwQuestions = new Map();
    this.ideas = new Map();
    this.prototypes = new Map();
    this.testPlans = new Map();
    this.testResults = new Map();
    this.userProgress = new Map();
    
    this.initializeData();
  }

  private initializeData() {
    // Initialize with sample Design Thinking project
    const sampleProject: Project = {
      id: randomUUID(),
      name: "App de Delivery Sustentável",
      description: "Projeto para criar um aplicativo de delivery focado em sustentabilidade e impacto social",
      status: "in_progress",
      currentPhase: 1,
      completionRate: 15,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.projects.set(sampleProject.id, sampleProject);

    // Sample Empathy Map
    const sampleEmpathyMap: EmpathyMap = {
      id: randomUUID(),
      projectId: sampleProject.id,
      title: "Consumidor Sustentável",
      says: ["Quero opções mais sustentáveis", "O preço não pode ser muito alto"],
      thinks: ["Será que faz diferença mesmo?", "Como posso ter certeza que é sustentável?"],
      does: ["Pesquisa sobre sustentabilidade", "Compra produtos orgânicos ocasionalmente"],
      feels: ["Preocupado com o meio ambiente", "Frustrado com poucas opções"],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.empathyMaps.set(sampleEmpathyMap.id, sampleEmpathyMap);

    // Sample Persona
    const samplePersona: Persona = {
      id: randomUUID(),
      projectId: sampleProject.id,
      name: "Maria Silva",
      age: 32,
      occupation: "Designer Gráfico",
      bio: "Profissional criativa que valoriza sustentabilidade e praticidade no dia a dia",
      goals: ["Reduzir impacto ambiental", "Economizar tempo", "Apoiar negócios locais"],
      frustrations: ["Poucas opções sustentáveis", "Informações confusas", "Preços altos"],
      motivations: ["Responsabilidade ambiental", "Conveniência", "Qualidade"],
      techSavviness: "high",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.personas.set(samplePersona.id, samplePersona);

    // Sample Interview
    const sampleInterview: Interview = {
      id: randomUUID(),
      projectId: sampleProject.id,
      participantName: "João Santos",
      date: new Date(),
      duration: 45,
      questions: [
        "Como você escolhe onde pedir comida?",
        "O que sustentabilidade significa para você?",
        "Que dificuldades você tem para ser mais sustentável?"
      ],
      responses: [
        "Geralmente escolho pela conveniência e preço",
        "É importante para o futuro do planeta",
        "Falta informação e as opções são limitadas"
      ],
      insights: "Usuário valoriza sustentabilidade mas prioriza conveniência no dia a dia",
      createdAt: new Date(),
    };
    this.interviews.set(sampleInterview.id, sampleInterview);

    // Sample User Progress
    const sampleProgress: UserProgress = {
      id: randomUUID(),
      userId: "user_001",
      projectId: sampleProject.id,
      phase: 1,
      completedTools: ["empathy_map", "personas", "interviews"],
      badges: ["first_project", "empathy_expert"],
      points: 150,
      timeSpent: 120, // 2 hours
      updatedAt: new Date(),
    };
    this.userProgress.set(`${sampleProgress.userId}_${sampleProject.id}`, sampleProgress);
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = {
      ...insertProject,
      id,
      description: insertProject.description || null,
      status: insertProject.status || "in_progress",
      currentPhase: insertProject.currentPhase || 1,
      completionRate: insertProject.completionRate || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: string, updateProject: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updatedProject: Project = {
      ...project,
      ...updateProject,
      updatedAt: new Date(),
    };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Phase 1: Empathize - Empathy Maps
  async getEmpathyMaps(projectId: string): Promise<EmpathyMap[]> {
    return Array.from(this.empathyMaps.values()).filter(map => map.projectId === projectId);
  }

  async createEmpathyMap(insertEmpathyMap: InsertEmpathyMap): Promise<EmpathyMap> {
    const id = randomUUID();
    const empathyMap: EmpathyMap = {
      ...insertEmpathyMap,
      id,
      says: insertEmpathyMap.says || [],
      thinks: insertEmpathyMap.thinks || [],
      does: insertEmpathyMap.does || [],
      feels: insertEmpathyMap.feels || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.empathyMaps.set(id, empathyMap);
    return empathyMap;
  }

  async updateEmpathyMap(id: string, updateEmpathyMap: Partial<InsertEmpathyMap>): Promise<EmpathyMap | undefined> {
    const empathyMap = this.empathyMaps.get(id);
    if (!empathyMap) return undefined;
    
    const updatedEmpathyMap: EmpathyMap = {
      ...empathyMap,
      ...updateEmpathyMap,
      updatedAt: new Date(),
    };
    this.empathyMaps.set(id, updatedEmpathyMap);
    return updatedEmpathyMap;
  }

  async deleteEmpathyMap(id: string): Promise<boolean> {
    return this.empathyMaps.delete(id);
  }

  // Phase 1: Empathize - Personas
  async getPersonas(projectId: string): Promise<Persona[]> {
    return Array.from(this.personas.values()).filter(persona => persona.projectId === projectId);
  }

  async createPersona(insertPersona: InsertPersona): Promise<Persona> {
    const id = randomUUID();
    const persona: Persona = {
      ...insertPersona,
      id,
      age: insertPersona.age || null,
      occupation: insertPersona.occupation || null,
      bio: insertPersona.bio || null,
      goals: insertPersona.goals || [],
      frustrations: insertPersona.frustrations || [],
      motivations: insertPersona.motivations || [],
      techSavviness: insertPersona.techSavviness || null,
      avatar: insertPersona.avatar || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.personas.set(id, persona);
    return persona;
  }

  async updatePersona(id: string, updatePersona: Partial<InsertPersona>): Promise<Persona | undefined> {
    const persona = this.personas.get(id);
    if (!persona) return undefined;
    
    const updatedPersona: Persona = {
      ...persona,
      ...updatePersona,
      updatedAt: new Date(),
    };
    this.personas.set(id, updatedPersona);
    return updatedPersona;
  }

  async deletePersona(id: string): Promise<boolean> {
    return this.personas.delete(id);
  }

  // Phase 1: Empathize - Interviews
  async getInterviews(projectId: string): Promise<Interview[]> {
    return Array.from(this.interviews.values()).filter(interview => interview.projectId === projectId);
  }

  async createInterview(insertInterview: InsertInterview): Promise<Interview> {
    const id = randomUUID();
    const interview: Interview = {
      ...insertInterview,
      id,
      duration: insertInterview.duration || null,
      questions: insertInterview.questions || [],
      responses: insertInterview.responses || [],
      insights: insertInterview.insights || null,
      createdAt: new Date(),
    };
    this.interviews.set(id, interview);
    return interview;
  }

  async updateInterview(id: string, updateInterview: Partial<InsertInterview>): Promise<Interview | undefined> {
    const interview = this.interviews.get(id);
    if (!interview) return undefined;
    
    const updatedInterview: Interview = {
      ...interview,
      ...updateInterview,
    };
    this.interviews.set(id, updatedInterview);
    return updatedInterview;
  }

  async deleteInterview(id: string): Promise<boolean> {
    return this.interviews.delete(id);
  }

  // Phase 1: Empathize - Observations
  async getObservations(projectId: string): Promise<Observation[]> {
    return Array.from(this.observations.values()).filter(observation => observation.projectId === projectId);
  }

  async createObservation(insertObservation: InsertObservation): Promise<Observation> {
    const id = randomUUID();
    const observation: Observation = {
      ...insertObservation,
      id,
      insights: insertObservation.insights || null,
      createdAt: new Date(),
    };
    this.observations.set(id, observation);
    return observation;
  }

  async updateObservation(id: string, updateObservation: Partial<InsertObservation>): Promise<Observation | undefined> {
    const observation = this.observations.get(id);
    if (!observation) return undefined;
    
    const updatedObservation: Observation = {
      ...observation,
      ...updateObservation,
      insights: updateObservation.insights !== undefined ? updateObservation.insights : observation.insights,
    };
    this.observations.set(id, updatedObservation);
    return updatedObservation;
  }

  async deleteObservation(id: string): Promise<boolean> {
    return this.observations.delete(id);
  }

  // Phase 2: Define - POV Statements
  async getPovStatements(projectId: string): Promise<PovStatement[]> {
    return Array.from(this.povStatements.values()).filter(pov => pov.projectId === projectId);
  }

  async getPovStatement(id: string): Promise<PovStatement | undefined> {
    return this.povStatements.get(id);
  }

  async createPovStatement(insertPov: InsertPovStatement): Promise<PovStatement> {
    const id = randomUUID();
    const pov: PovStatement = {
      ...insertPov,
      id,
      priority: insertPov.priority || "medium",
      createdAt: new Date(),
    };
    this.povStatements.set(id, pov);
    return pov;
  }

  async updatePovStatement(id: string, updatePov: Partial<InsertPovStatement>): Promise<PovStatement | undefined> {
    const pov = this.povStatements.get(id);
    if (!pov) return undefined;
    
    const updatedPov: PovStatement = { ...pov, ...updatePov };
    this.povStatements.set(id, updatedPov);
    return updatedPov;
  }

  async deletePovStatement(id: string): Promise<boolean> {
    return this.povStatements.delete(id);
  }

  // Phase 2: Define - HMW Questions
  async getHmwQuestions(projectId: string): Promise<HmwQuestion[]> {
    return Array.from(this.hmwQuestions.values()).filter(hmw => hmw.projectId === projectId);
  }

  async getHmwQuestion(id: string): Promise<HmwQuestion | undefined> {
    return this.hmwQuestions.get(id);
  }

  async createHmwQuestion(insertHmw: InsertHmwQuestion): Promise<HmwQuestion> {
    const id = randomUUID();
    const hmw: HmwQuestion = {
      ...insertHmw,
      id,
      category: insertHmw.category || null,
      votes: insertHmw.votes || 0,
      createdAt: new Date(),
    };
    this.hmwQuestions.set(id, hmw);
    return hmw;
  }

  async updateHmwQuestion(id: string, updateHmw: Partial<InsertHmwQuestion>): Promise<HmwQuestion | undefined> {
    const hmw = this.hmwQuestions.get(id);
    if (!hmw) return undefined;
    
    const updatedHmw: HmwQuestion = { ...hmw, ...updateHmw };
    this.hmwQuestions.set(id, updatedHmw);
    return updatedHmw;
  }

  async deleteHmwQuestion(id: string): Promise<boolean> {
    return this.hmwQuestions.delete(id);
  }

  // Phase 3: Ideate - Ideas
  async getIdeas(projectId: string): Promise<Idea[]> {
    return Array.from(this.ideas.values()).filter(idea => idea.projectId === projectId);
  }

  async createIdea(insertIdea: InsertIdea): Promise<Idea> {
    const id = randomUUID();
    const idea: Idea = {
      ...insertIdea,
      id,
      category: insertIdea.category || null,
      feasibility: insertIdea.feasibility || null,
      impact: insertIdea.impact || null,
      votes: insertIdea.votes || 0,
      status: insertIdea.status || "idea",
      createdAt: new Date(),
    };
    this.ideas.set(id, idea);
    return idea;
  }

  async updateIdea(id: string, updateIdea: Partial<InsertIdea>): Promise<Idea | undefined> {
    const idea = this.ideas.get(id);
    if (!idea) return undefined;
    
    const updatedIdea: Idea = { ...idea, ...updateIdea };
    this.ideas.set(id, updatedIdea);
    return updatedIdea;
  }

  async deleteIdea(id: string): Promise<boolean> {
    return this.ideas.delete(id);
  }

  // Phase 4: Prototype - Prototypes
  async getPrototypes(projectId: string): Promise<Prototype[]> {
    return Array.from(this.prototypes.values()).filter(prototype => prototype.projectId === projectId);
  }

  async createPrototype(insertPrototype: InsertPrototype): Promise<Prototype> {
    const id = randomUUID();
    const prototype: Prototype = {
      ...insertPrototype,
      id,
      ideaId: insertPrototype.ideaId || null,
      materials: insertPrototype.materials || [],
      images: insertPrototype.images || [],
      version: insertPrototype.version || 1,
      feedback: insertPrototype.feedback || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.prototypes.set(id, prototype);
    return prototype;
  }

  async updatePrototype(id: string, updatePrototype: Partial<InsertPrototype>): Promise<Prototype | undefined> {
    const prototype = this.prototypes.get(id);
    if (!prototype) return undefined;
    
    const updatedPrototype: Prototype = {
      ...prototype,
      ...updatePrototype,
      updatedAt: new Date(),
    };
    this.prototypes.set(id, updatedPrototype);
    return updatedPrototype;
  }

  async deletePrototype(id: string): Promise<boolean> {
    return this.prototypes.delete(id);
  }

  // Phase 5: Test - Test Plans
  async getTestPlans(projectId: string): Promise<TestPlan[]> {
    return Array.from(this.testPlans.values()).filter(plan => plan.projectId === projectId);
  }

  async createTestPlan(insertTestPlan: InsertTestPlan): Promise<TestPlan> {
    const id = randomUUID();
    const testPlan: TestPlan = {
      ...insertTestPlan,
      id,
      prototypeId: insertTestPlan.prototypeId || null,
      duration: insertTestPlan.duration || null,
      tasks: insertTestPlan.tasks || [],
      metrics: insertTestPlan.metrics || [],
      status: insertTestPlan.status || "planned",
      createdAt: new Date(),
    };
    this.testPlans.set(id, testPlan);
    return testPlan;
  }

  async updateTestPlan(id: string, updateTestPlan: Partial<InsertTestPlan>): Promise<TestPlan | undefined> {
    const testPlan = this.testPlans.get(id);
    if (!testPlan) return undefined;
    
    const updatedTestPlan: TestPlan = { ...testPlan, ...updateTestPlan };
    this.testPlans.set(id, updatedTestPlan);
    return updatedTestPlan;
  }

  // Phase 5: Test - Test Results
  async getTestResults(testPlanId: string): Promise<TestResult[]> {
    return Array.from(this.testResults.values()).filter(result => result.testPlanId === testPlanId);
  }

  async createTestResult(insertTestResult: InsertTestResult): Promise<TestResult> {
    const id = randomUUID();
    const testResult: TestResult = {
      ...insertTestResult,
      id,
      taskResults: insertTestResult.taskResults || [],
      feedback: insertTestResult.feedback || null,
      successRate: insertTestResult.successRate || null,
      completionTime: insertTestResult.completionTime || null,
      insights: insertTestResult.insights || null,
      createdAt: new Date(),
    };
    this.testResults.set(id, testResult);
    return testResult;
  }

  // User Progress
  async getUserProgress(userId: string, projectId: string): Promise<UserProgress | undefined> {
    return this.userProgress.get(`${userId}_${projectId}`);
  }

  async updateUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const key = `${insertProgress.userId}_${insertProgress.projectId}`;
    const existing = this.userProgress.get(key);
    
    const progress: UserProgress = {
      id: existing?.id || randomUUID(),
      ...insertProgress,
      completedTools: insertProgress.completedTools || [],
      badges: insertProgress.badges || [],
      points: insertProgress.points || 0,
      timeSpent: insertProgress.timeSpent || 0,
      updatedAt: new Date(),
    };
    
    this.userProgress.set(key, progress);
    return progress;
  }

  // Analytics
  async getProjectStats(projectId: string): Promise<{
    totalTools: number;
    completedTools: number;
    currentPhase: number;
    completionRate: number;
  }> {
    const project = this.projects.get(projectId);
    if (!project) {
      return { totalTools: 0, completedTools: 0, currentPhase: 1, completionRate: 0 };
    }

    const totalTools = 15; // Total tools across all phases
    const empathyMaps = await this.getEmpathyMaps(projectId);
    const personas = await this.getPersonas(projectId);
    const interviews = await this.getInterviews(projectId);
    const povStatements = await this.getPovStatements(projectId);
    const ideas = await this.getIdeas(projectId);
    const prototypes = await this.getPrototypes(projectId);
    const testPlans = await this.getTestPlans(projectId);

    const completedTools = 
      empathyMaps.length + personas.length + interviews.length + 
      povStatements.length + ideas.length + prototypes.length + testPlans.length;

    return {
      totalTools,
      completedTools,
      currentPhase: project.currentPhase || 1,
      completionRate: Math.round((completedTools / totalTools) * 100),
    };
  }
}

export const storage = new MemStorage();