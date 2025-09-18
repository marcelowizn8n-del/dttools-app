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
  type UserProgress, type InsertUserProgress,
  type User, type InsertUser,
  type Article, type InsertArticle,
  type SubscriptionPlan, type InsertSubscriptionPlan,
  type UserSubscription, type InsertUserSubscription
} from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

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

  // Users
  getUsers(): Promise<User[]>;
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;

  // Articles
  getArticles(): Promise<Article[]>;
  getArticlesByCategory(category: string): Promise<Article[]>;
  getArticle(id: string): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: string, article: Partial<InsertArticle>): Promise<Article | undefined>;
  deleteArticle(id: string): Promise<boolean>;

  // Subscription Plans
  getSubscriptionPlans(): Promise<SubscriptionPlan[]>;
  getSubscriptionPlan(id: string): Promise<SubscriptionPlan | undefined>;
  getSubscriptionPlanByName(name: string): Promise<SubscriptionPlan | undefined>;
  createSubscriptionPlan(plan: InsertSubscriptionPlan): Promise<SubscriptionPlan>;
  updateSubscriptionPlan(id: string, plan: Partial<InsertSubscriptionPlan>): Promise<SubscriptionPlan | undefined>;
  deleteSubscriptionPlan(id: string): Promise<boolean>;

  // User Subscriptions
  getUserSubscriptions(userId: string): Promise<UserSubscription[]>;
  getUserActiveSubscription(userId: string): Promise<UserSubscription | undefined>;
  createUserSubscription(subscription: InsertUserSubscription): Promise<UserSubscription>;
  updateUserSubscription(id: string, subscription: Partial<InsertUserSubscription>): Promise<UserSubscription | undefined>;
  cancelUserSubscription(id: string): Promise<boolean>;
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
  private users: Map<string, User>;
  private articles: Map<string, Article>;
  private subscriptionPlans: Map<string, SubscriptionPlan>;
  private userSubscriptions: Map<string, UserSubscription>;

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
    this.users = new Map();
    this.articles = new Map();
    this.subscriptionPlans = new Map();
    this.userSubscriptions = new Map();
    
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

    // Sample Users
    const adminUser: User = {
      id: randomUUID(),
      username: "admin",
      email: "admin@dttools.app",
      name: "Administrator",
      password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password: "password"
      role: "admin",
      company: null,
      jobRole: "Administrator",
      industry: "Technology", 
      experience: "Expert",
      country: "Brasil",
      state: "São Paulo",
      city: "São Paulo",
      zipCode: "00000000",
      phone: null,
      bio: null,
      profilePicture: null,
      interests: [],
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      subscriptionPlanId: null,
      subscriptionStatus: null,
      subscriptionEndDate: null,
      createdAt: new Date(),
    };
    this.users.set(adminUser.id, adminUser);

    const regularUser: User = {
      id: randomUUID(),
      username: "usuario",
      email: "usuario@test.com",
      name: "Usuario Teste",
      password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password: "password" 
      role: "user",
      company: null,
      jobRole: null,
      industry: null,
      experience: null,
      country: null,
      state: null,
      city: null,
      zipCode: null,
      phone: null,
      bio: null,
      profilePicture: null,
      interests: [],
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      subscriptionPlanId: null,
      subscriptionStatus: null,
      subscriptionEndDate: null,
      createdAt: new Date(),
    };
    this.users.set(regularUser.id, regularUser);

    // Create Marcelo's user account
    const marceloUser: User = {
      id: randomUUID(),
      username: "dttools.app@gmail.com",
      email: "dttools.app@gmail.com", 
      name: "Marcelo Araujo",
      password: "$2b$10$YourHashedPasswordHere", // Will be replaced with actual hash
      role: "user",
      company: null,
      jobRole: "Designer",
      industry: "Design",
      experience: "Sênior (6-10 anos)",
      country: "Brasil",
      state: "São Paulo",
      city: "São Paulo",
      zipCode: "05616090",
      phone: null,
      bio: null,
      profilePicture: null,
      interests: ["UX/UI Design", "Design Thinking"],
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      subscriptionPlanId: null,
      subscriptionStatus: null,
      subscriptionEndDate: null,
      createdAt: new Date(),
    };
    
    // Hash the password for Marcelo's account
    bcrypt.hash("Gulex0519!@", 10).then(hashedPassword => {
      marceloUser.password = hashedPassword;
      this.users.set(marceloUser.id, marceloUser);
    });

    const adminUserUpdated: User = {
      id: randomUUID(),
      username: "admin",
      email: "admin@dttools.app",
      name: "Administrator",
      password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password: "password"
      role: "admin",
      company: null,
      jobRole: "Administrator",
      industry: "Technology",
      experience: "Expert",
      country: "Brasil",
      state: "São Paulo",
      city: "São Paulo",
      zipCode: "00000000",
      phone: null,
      bio: null,
      profilePicture: null,
      interests: [],
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      subscriptionPlanId: null,
      subscriptionStatus: null,
      subscriptionEndDate: null,
      createdAt: new Date(),
    };
    // Replace the admin user
    this.users.delete(adminUser.id);
    this.users.set(adminUserUpdated.id, adminUserUpdated);

    // Sample Articles
    const articles = [
      {
        id: randomUUID(),
        title: "Introdução ao Design Thinking",
        content: `# Introdução ao Design Thinking

O Design Thinking é uma abordagem centrada no ser humano para inovação que integra as necessidades das pessoas, as possibilidades da tecnologia e os requisitos para o sucesso empresarial.

## O que é Design Thinking?

Design Thinking é uma metodologia que usa elementos do kit de ferramentas do designer para integrar as necessidades das pessoas, as possibilidades da tecnologia e os requisitos para o sucesso empresarial.

## Os 5 Estágios do Design Thinking

### 1. Empatizar
Compreender profundamente as necessidades dos usuários através de observação, engajamento e imersão.

### 2. Definir  
Sintetizar observações para definir os problemas principais que você identificou.

### 3. Idear
Brainstorm e gerar soluções criativas usando técnicas como brainstorming, brainwriting e worst possible idea.

### 4. Prototipar
Construir representações simples e rápidas de suas ideias para mostrar aos outros.

### 5. Testar
Testar protótipos com usuários reais e iterar baseado no feedback recebido.

## Benefícios

- **Inovação centrada no usuário**: Soluções que realmente atendem necessidades reais
- **Colaboração multidisciplinar**: Equipes diversas geram melhores resultados  
- **Iteração rápida**: Falhe rápido e barato para aprender mais cedo
- **Tangibilização**: Torne ideias abstratas em algo concreto

O Design Thinking não é apenas para designers - é uma mentalidade que pode ser aplicada em qualquer área para resolver problemas complexos.`,
        category: "empathize",
        author: "Design Thinking Expert",
        description: "Uma introdução completa ao Design Thinking, sua metodologia e benefícios",
        tags: ["introdução", "metodologia", "inovação", "processo"],
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Técnicas de Empatia: Como Entender Seus Usuários",
        content: `# Técnicas de Empatia: Como Entender Seus Usuários

A empatia é o coração do Design Thinking. É sobre entender profundamente as necessidades, pensamentos, emoções e motivações dos seus usuários.

## Por que a Empatia é Importante?

A empatia permite que você:
- Compreenda as necessidades reais dos usuários
- Identifique problemas que os usuários podem nem saber que têm
- Desenvolva soluções mais relevantes e eficazes
- Reduza o risco de criar produtos que ninguém quer

## Principais Técnicas de Empatia

### 1. Entrevistas com Usuários
Conversas estruturadas para entender motivações, comportamentos e necessidades.

**Dicas para entrevistas eficazes:**
- Faça perguntas abertas
- Escute mais do que fale
- Pergunte "por quê?" para ir mais fundo
- Observe linguagem corporal e emoções

### 2. Observação
Observe usuários em seu ambiente natural sem interferir.

**O que observar:**
- Comportamentos inconscientes
- Frustrações não expressas
- Workarounds criativos
- Contexto de uso

### 3. Mapas de Empatia
Visualize o que os usuários pensam, sentem, veem, fazem, ouvem, suas dores e ganhos.

### 4. Jornada do Usuário
Mapeie toda a experiência do usuário, identificando pontos de dor e oportunidades.

### 5. Shadowing
Acompanhe usuários durante suas atividades diárias.

## Ferramentas Práticas

- **Personas**: Representações fictícias de usuários reais
- **Cenários**: Histórias que descrevem como usuários interagem com soluções
- **Storyboards**: Visualização da jornada do usuário

## Dicas para Desenvolver Empatia

1. **Deixe seus preconceitos de lado**
2. **Seja genuinamente curioso**
3. **Pratique escuta ativa**
4. **Documente insights imediatamente**
5. **Busque diversidade de perspectivas**

Lembre-se: empatia é uma habilidade que pode ser desenvolvida com prática e dedicação.`,
        category: "empathize",
        author: "UX Researcher",
        description: "Aprenda técnicas essenciais para desenvolver empatia e entender profundamente seus usuários",
        tags: ["empatia", "pesquisa", "usuários", "entrevistas", "observação"],
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Como Definir o Problema Certo",
        content: `# Como Definir o Problema Certo

Definir o problema corretamente é crucial para o sucesso de qualquer projeto. Um problema bem definido está meio resolvido.

## A Importância da Definição do Problema

- **Direcionamento**: Guia todas as decisões subsequentes
- **Alinhamento**: Mantém a equipe focada no mesmo objetivo  
- **Eficiência**: Evita desperdício de tempo e recursos
- **Inovação**: Problemas bem definidos inspiram soluções criativas

## Ferramentas para Definir Problemas

### 1. Problem Statement (Declaração do Problema)
Formato: "O usuário [tipo de usuário] precisa de [necessidade] porque [insight]"

### 2. How Might We (Como Podemos)
Transforme desafios em oportunidades:
- "Como podemos ajudar pais ocupados a preparar refeições saudáveis rapidamente?"
- "Como podemos tornar a experiência de transporte público mais agradável?"

### 3. 5 Porquês
Técnica para chegar à raiz do problema fazendo "por quê?" repetidamente.

## Critérios de um Bom Problem Statement

### Específico
- Evite generalidades
- Use dados concretos
- Seja preciso sobre o contexto

### Orientado ao Usuário
- Foque nas necessidades humanas
- Use linguagem do usuário
- Considere diferentes tipos de usuários

### Inspirador
- Motive a equipe
- Sugira múltiplas soluções
- Seja otimista mas realista

### Acionável
- Seja possível de resolver
- Tenha escopo apropriado
- Permita medição de sucesso

## Processo de Definição

### 1. Coleta de Insights
- Analise dados da fase de empatia
- Identifique padrões e temas
- Priorize insights mais importantes

### 2. Síntese
- Agrupe insights relacionados
- Identifique oportunidades
- Crie hipóteses sobre necessidades

### 3. Formulação
- Escreva múltiplas versões do problema
- Teste com stakeholders
- Refine baseado no feedback

### 4. Validação
- Confirme com usuários
- Verifique viabilidade
- Ajuste se necessário

## Armadilhas Comuns

- **Pular direto para soluções**
- **Definir problemas muito amplos**
- **Focar em sintomas, não causas**
- **Ignorar o contexto do usuário**
- **Não validar com usuários**

Lembre-se: um problema bem definido inspira soluções inovadoras e mantém a equipe alinhada.`,
        category: "define",
        author: "Product Manager",
        description: "Aprenda a arte de definir problemas de forma clara e inspiradora para impulsionar a inovação",
        tags: ["problema", "definição", "metodologia", "process"],
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    articles.forEach(articleData => {
      const article: Article = {
        ...articleData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.articles.set(article.id, article);
    });

    // Initialize subscription plans
    const subscriptionPlanData = [
      {
        id: randomUUID(),
        name: "free",
        displayName: "Grátis",
        description: "Perfeito para começar e explorar o Design Thinking",
        priceMonthly: 0,
        priceYearly: 0,
        stripePriceIdMonthly: null,
        stripePriceIdYearly: null,
        maxProjects: 2,
        maxPersonasPerProject: 2,
        maxUsersPerTeam: null,
        aiChatLimit: 10,
        libraryArticlesCount: 3,
        features: [
          "Acesso às 5 fases do Design Thinking",
          "Ferramentas básicas (Personas, Mapa de Empatia)",
          "Até 2 projetos simultâneos",
          "Até 2 personas por projeto",
          "10 mensagens no Chat IA por mês",
          "Biblioteca básica (3 artigos)"
        ],
        exportFormats: [],
        hasCollaboration: false,
        hasPermissionManagement: false,
        hasSharedWorkspace: false,
        hasCommentsAndFeedback: false,
        hasSso: false,
        hasCustomApi: false,
        hasCustomIntegrations: false,
        has24x7Support: false,
        order: 0,
        isActive: true,
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        name: "pro",
        displayName: "Pro",
        description: "Ideal para profissionais e freelancers",
        priceMonthly: 2900, // R$ 29.00 in cents
        priceYearly: 31320, // R$ 29 * 12 * 0.9 (10% discount yearly)
        stripePriceIdMonthly: null,
        stripePriceIdYearly: null,
        maxProjects: null, // unlimited
        maxPersonasPerProject: null, // unlimited
        maxUsersPerTeam: null,
        aiChatLimit: null, // unlimited
        libraryArticlesCount: null, // all articles
        features: [
          "Tudo do plano Gratuito",
          "Projetos ilimitados",
          "Personas ilimitadas",
          "Chat IA ilimitado",
          "Biblioteca completa (todos os artigos)",
          "Exportação em PDF, PNG, CSV"
        ],
        exportFormats: ["pdf", "png", "csv"],
        hasCollaboration: false,
        hasPermissionManagement: false,
        hasSharedWorkspace: false,
        hasCommentsAndFeedback: false,
        hasSso: false,
        hasCustomApi: false,
        hasCustomIntegrations: false,
        has24x7Support: false,
        order: 1,
        isActive: true,
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        name: "team",
        displayName: "Team",
        description: "Perfeito para equipes e startups",
        priceMonthly: 14900, // R$ 149.00 in cents
        priceYearly: 161280, // R$ 149 * 12 * 0.9 (10% discount yearly)
        stripePriceIdMonthly: null,
        stripePriceIdYearly: null,
        maxProjects: null, // unlimited
        maxPersonasPerProject: null, // unlimited
        maxUsersPerTeam: 10,
        aiChatLimit: null, // unlimited
        libraryArticlesCount: null, // all articles
        features: [
          "Tudo do plano Pro",
          "Até 10 usuários na equipe",
          "Colaboração em tempo real",
          "Gestão de permissões",
          "Workspace compartilhado",
          "Comentários e feedback"
        ],
        exportFormats: ["pdf", "png", "csv"],
        hasCollaboration: true,
        hasPermissionManagement: true,
        hasSharedWorkspace: true,
        hasCommentsAndFeedback: true,
        hasSso: false,
        hasCustomApi: false,
        hasCustomIntegrations: false,
        has24x7Support: false,
        order: 2,
        isActive: true,
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        name: "enterprise",
        displayName: "Enterprise",
        description: "Soluções completas para grandes empresas",
        priceMonthly: 29900, // R$ 299.00 in cents
        priceYearly: 323280, // R$ 299 * 12 * 0.9 (10% discount yearly)
        stripePriceIdMonthly: null,
        stripePriceIdYearly: null,
        maxProjects: null, // unlimited
        maxPersonasPerProject: null, // unlimited
        maxUsersPerTeam: null, // unlimited
        aiChatLimit: null, // unlimited
        libraryArticlesCount: null, // all articles
        features: [
          "Tudo do plano Team",
          "Usuários ilimitados",
          "SSO (Single Sign-On)",
          "API personalizada",
          "Integrações customizadas",
          "Suporte 24/7"
        ],
        exportFormats: ["pdf", "png", "csv"],
        hasCollaboration: true,
        hasPermissionManagement: true,
        hasSharedWorkspace: true,
        hasCommentsAndFeedback: true,
        hasSso: true,
        hasCustomApi: true,
        hasCustomIntegrations: true,
        has24x7Support: true,
        order: 3,
        isActive: true,
        createdAt: new Date()
      }
    ];

    subscriptionPlanData.forEach(planData => {
      const plan: SubscriptionPlan = {
        ...planData,
        createdAt: new Date(),
      };
      this.subscriptionPlans.set(plan.id, plan);
    });
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
      challenge: insertHmw.challenge || null,
      scope: insertHmw.scope || null,
      context: insertHmw.context || null,
      priority: insertHmw.priority || null,
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

  // Users
  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    
    const user: User = {
      ...insertUser,
      id,
      password: hashedPassword,
      role: insertUser.role || "user",
      company: insertUser.company || null,
      jobRole: insertUser.jobRole || null,
      industry: insertUser.industry || null,
      experience: insertUser.experience || null,
      country: insertUser.country || null,
      state: insertUser.state || null,
      city: insertUser.city || null,
      zipCode: insertUser.zipCode || null,
      phone: insertUser.phone || null,
      bio: insertUser.bio || null,
      profilePicture: insertUser.profilePicture || null,
      interests: insertUser.interests || [],
      stripeCustomerId: insertUser.stripeCustomerId || null,
      stripeSubscriptionId: insertUser.stripeSubscriptionId || null,
      subscriptionPlanId: insertUser.subscriptionPlanId || null,
      subscriptionStatus: insertUser.subscriptionStatus || null,
      subscriptionEndDate: insertUser.subscriptionEndDate || null,
      createdAt: new Date(),
    };
    
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updateUser: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    // Hash password if it's being updated
    let updatedData = { ...updateUser };
    if (updateUser.password) {
      updatedData.password = await bcrypt.hash(updateUser.password, 10);
    }
    
    const updatedUser: User = { ...user, ...updatedData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  // Articles
  async getArticles(): Promise<Article[]> {
    return Array.from(this.articles.values()).filter(article => article.published);
  }

  async getArticlesByCategory(category: string): Promise<Article[]> {
    return Array.from(this.articles.values()).filter(
      article => article.published && article.category === category
    );
  }

  async getArticle(id: string): Promise<Article | undefined> {
    const article = this.articles.get(id);
    return article?.published ? article : undefined;
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = randomUUID();
    const article: Article = {
      ...insertArticle,
      id,
      description: insertArticle.description || null,
      tags: insertArticle.tags || [],
      published: insertArticle.published ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.articles.set(id, article);
    return article;
  }

  async updateArticle(id: string, updateArticle: Partial<InsertArticle>): Promise<Article | undefined> {
    const article = this.articles.get(id);
    if (!article) return undefined;
    
    const updatedArticle: Article = { 
      ...article, 
      ...updateArticle, 
      updatedAt: new Date() 
    };
    this.articles.set(id, updatedArticle);
    return updatedArticle;
  }

  async deleteArticle(id: string): Promise<boolean> {
    return this.articles.delete(id);
  }

  // Subscription Plans
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return Array.from(this.subscriptionPlans.values()).filter(plan => plan.isActive);
  }

  async getSubscriptionPlan(id: string): Promise<SubscriptionPlan | undefined> {
    return this.subscriptionPlans.get(id);
  }

  async getSubscriptionPlanByName(name: string): Promise<SubscriptionPlan | undefined> {
    return Array.from(this.subscriptionPlans.values()).find(plan => plan.name === name);
  }

  async createSubscriptionPlan(insertPlan: InsertSubscriptionPlan): Promise<SubscriptionPlan> {
    const id = randomUUID();
    const plan: SubscriptionPlan = {
      ...insertPlan,
      id,
      description: insertPlan.description || null,
      stripePriceIdMonthly: insertPlan.stripePriceIdMonthly || null,
      stripePriceIdYearly: insertPlan.stripePriceIdYearly || null,
      maxProjects: insertPlan.maxProjects || null,
      maxPersonasPerProject: insertPlan.maxPersonasPerProject || null,
      maxUsersPerTeam: insertPlan.maxUsersPerTeam || null,
      aiChatLimit: insertPlan.aiChatLimit || null,
      libraryArticlesCount: insertPlan.libraryArticlesCount || null,
      features: insertPlan.features || [],
      exportFormats: insertPlan.exportFormats || [],
      hasCollaboration: insertPlan.hasCollaboration ?? false,
      hasPermissionManagement: insertPlan.hasPermissionManagement ?? false,
      hasSharedWorkspace: insertPlan.hasSharedWorkspace ?? false,
      hasCommentsAndFeedback: insertPlan.hasCommentsAndFeedback ?? false,
      hasSso: insertPlan.hasSso ?? false,
      hasCustomApi: insertPlan.hasCustomApi ?? false,
      hasCustomIntegrations: insertPlan.hasCustomIntegrations ?? false,
      has24x7Support: insertPlan.has24x7Support ?? false,
      order: insertPlan.order ?? 0,
      isActive: insertPlan.isActive ?? true,
      createdAt: new Date(),
    };
    
    this.subscriptionPlans.set(id, plan);
    return plan;
  }

  async updateSubscriptionPlan(id: string, updatePlan: Partial<InsertSubscriptionPlan>): Promise<SubscriptionPlan | undefined> {
    const plan = this.subscriptionPlans.get(id);
    if (!plan) return undefined;
    
    const updatedPlan: SubscriptionPlan = { 
      ...plan, 
      ...updatePlan
    };
    this.subscriptionPlans.set(id, updatedPlan);
    return updatedPlan;
  }

  async deleteSubscriptionPlan(id: string): Promise<boolean> {
    return this.subscriptionPlans.delete(id);
  }

  // User Subscriptions
  async getUserSubscriptions(userId: string): Promise<UserSubscription[]> {
    return Array.from(this.userSubscriptions.values()).filter(sub => sub.userId === userId);
  }

  async getUserActiveSubscription(userId: string): Promise<UserSubscription | undefined> {
    return Array.from(this.userSubscriptions.values()).find(
      sub => sub.userId === userId && sub.status === 'active'
    );
  }

  async createUserSubscription(insertSubscription: InsertUserSubscription): Promise<UserSubscription> {
    const id = randomUUID();
    const subscription: UserSubscription = {
      ...insertSubscription,
      id,
      stripeSubscriptionId: insertSubscription.stripeSubscriptionId || null,
      currentPeriodStart: insertSubscription.currentPeriodStart || null,
      currentPeriodEnd: insertSubscription.currentPeriodEnd || null,
      cancelAtPeriodEnd: insertSubscription.cancelAtPeriodEnd ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.userSubscriptions.set(id, subscription);
    return subscription;
  }

  async updateUserSubscription(id: string, updateSubscription: Partial<InsertUserSubscription>): Promise<UserSubscription | undefined> {
    const subscription = this.userSubscriptions.get(id);
    if (!subscription) return undefined;
    
    const updatedSubscription: UserSubscription = { 
      ...subscription, 
      ...updateSubscription, 
      updatedAt: new Date() 
    };
    this.userSubscriptions.set(id, updatedSubscription);
    return updatedSubscription;
  }

  async cancelUserSubscription(id: string): Promise<boolean> {
    const subscription = this.userSubscriptions.get(id);
    if (!subscription) return false;
    
    const updatedSubscription: UserSubscription = { 
      ...subscription, 
      status: 'canceled',
      cancelAtPeriodEnd: true,
      updatedAt: new Date() 
    };
    this.userSubscriptions.set(id, updatedSubscription);
    return true;
  }
}

export const storage = new MemStorage();