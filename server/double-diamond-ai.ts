import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "" 
});

// ===== PHASE 1: DISCOVER (Divergence) =====

export interface DiscoverResult {
  painPoints: Array<{
    text: string;
    category: string;
    severity: number; // 1-5
  }>;
  insights: Array<{
    text: string;
    source: string; // 'sector', 'case', 'persona'
  }>;
  userNeeds: Array<{
    need: string;
    priority: number; // 1-5
  }>;
  empathyMap: {
    says: string[];
    thinks: string[];
    does: string[];
    feels: string[];
  };
}

export async function generateDiscoverPhase(input: {
  sector: string;
  successCase?: string;
  targetAudience: string;
  problemStatement: string;
  language?: string;
}): Promise<DiscoverResult> {
  const lang = input.language || "pt-BR";
  const isPortuguese = lang.startsWith("pt");
  const isSpanish = lang.startsWith("es");
  const isFrench = lang.startsWith("fr");
  
  const languageInstruction = isPortuguese 
    ? "IMPORTANTE: Responda APENAS em PORTUGUÊS DO BRASIL. Todos os textos devem estar em português."
    : isSpanish
    ? "IMPORTANTE: Responda APENAS em ESPANHOL. Todos os textos devem estar em espanhol."
    : isFrench
    ? "IMPORTANTE: Responda APENAS em FRANCÊS. Todos os textos devem estar em francês."
    : "IMPORTANTE: Responda APENAS em INGLÊS. Todos os textos devem estar em inglês.";

  const prompt = `Você é um especialista em Design Thinking conduzindo a fase DISCOVER do framework Double Diamond.

${languageInstruction}

CONTEXTO:
- Setor: ${input.sector}
- Case de Sucesso de Referência: ${input.successCase || 'Nenhum'}
- Público-Alvo: ${input.targetAudience}
- Declaração do Problema: ${input.problemStatement}

Gere uma análise de descoberta abrangente com:

1. **Pain Points** (8-12 itens): Identifique problemas específicos, frustrações e desafios que o público-alvo enfrenta
   - Inclua categoria (operacional, emocional, financeiro, tecnológico)
   - Classifique severidade 1-5 (5 = crítico)

2. **Insights** (6-10 itens): Observações-chave sobre comportamento do usuário, tendências de mercado ou padrões do setor
   - Marque fonte: 'setor', 'case' ou 'persona'

3. **Necessidades do Usuário** (8-12 itens): Necessidades centrais que os usuários estão tentando satisfazer
   - Priorize 1-5 (5 = essencial)

4. **Mapa de Empatia**: O que o usuário Diz, Pensa, Faz e Sente (3-5 itens por quadrante)

Retorne APENAS um objeto JSON (sem markdown):
{
  "painPoints": [{"text": "...", "category": "...", "severity": 3}],
  "insights": [{"text": "...", "source": "sector"}],
  "userNeeds": [{"need": "...", "priority": 4}],
  "empathyMap": {
    "says": ["..."],
    "thinks": ["..."],
    "does": ["..."],
    "feels": ["..."]
  }
}`;

  try {
    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt
    });
    
    const text = result.text;
    if (!text) throw new Error("Empty AI response");
    if (!text) throw new Error("Empty AI response");
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI response format");
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Discover phase generation error:", error);
    throw error;
  }
}

// ===== PHASE 2: DEFINE (Convergence) =====

export interface DefineResult {
  povStatements: Array<{
    user: string;
    need: string;
    insight: string;
    fullStatement: string;
  }>;
  hmwQuestions: Array<{
    question: string;
    focusArea: string; // 'desirability', 'feasibility', 'viability'
  }>;
}

export async function generateDefinePhase(input: {
  painPoints: Array<{ text: string; category: string; severity: number }>;
  userNeeds: Array<{ need: string; priority: number }>;
  insights: Array<{ text: string; source: string }>;
  language?: string;
}): Promise<DefineResult> {
  const lang = input.language || "pt-BR";
  const isPortuguese = lang.startsWith("pt");
  const isSpanish = lang.startsWith("es");
  const isFrench = lang.startsWith("fr");
  
  const languageInstruction = isPortuguese 
    ? "IMPORTANTE: Responda APENAS em PORTUGUÊS DO BRASIL. Todos os textos devem estar em português."
    : isSpanish
    ? "IMPORTANTE: Responda APENAS em ESPANHOL. Todos os textos devem estar em espanhol."
    : isFrench
    ? "IMPORTANTE: Responda APENAS em FRANCÊS. Todos os textos devem estar em francês."
    : "IMPORTANTE: Responda APENAS em INGLÊS. Todos os textos devem estar em inglês.";

  const prompt = `Você é um especialista em Design Thinking conduzindo a fase DEFINE do framework Double Diamond.

${languageInstruction}

Based on the DISCOVER phase findings, synthesize the problem:

PAIN POINTS:
${input.painPoints.map(p => `- [${p.severity}/5] ${p.text}`).join('\n')}

USER NEEDS:
${input.userNeeds.map(n => `- [${n.priority}/5] ${n.need}`).join('\n')}

INSIGHTS:
${input.insights.map(i => `- ${i.text}`).join('\n')}

Generate:

1. **POV Statements** (3-5): Using formula: [User] needs [Need] because [Insight]
   - Focus on the most critical pain points and needs
   - Each POV should be specific and actionable

2. **HMW Questions** (8-12): "How Might We..." questions that open up solution space
   - Tag each with focus area: 'desirability', 'feasibility', or 'viability'
   - Avoid too broad or too narrow questions
   - Each HMW should be inspiring and solution-oriented

Return ONLY a JSON object (no markdown):
{
  "povStatements": [{
    "user": "busy professionals",
    "need": "quick healthy meals",
    "insight": "they have limited time but care about nutrition",
    "fullStatement": "Busy professionals need quick healthy meals because they have limited time but care about nutrition"
  }],
  "hmwQuestions": [{
    "question": "How might we make healthy eating as convenient as fast food?",
    "focusArea": "desirability"
  }]
}`;

  try {
    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt
    });
    
    const text = result.text;
    if (!text) throw new Error("Empty AI response");
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI response format");
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Define phase generation error:", error);
    throw error;
  }
}

// ===== PHASE 3: DEVELOP (Divergence) =====

export interface DevelopResult {
  ideas: Array<{
    title: string;
    description: string;
    category: string;
    innovationLevel: number; // 1-5 (5 = highly innovative)
  }>;
  crossPollinatedIdeas: Array<{
    title: string;
    description: string;
    domains: string[]; // domains combined
    uniqueness: number; // 1-5
  }>;
}

export async function generateDevelopPhase(input: {
  selectedPov: string;
  selectedHmw: string;
  sector: string;
  language?: string;
}): Promise<DevelopResult> {
  const lang = input.language || "pt-BR";
  const isPortuguese = lang.startsWith("pt");
  const isSpanish = lang.startsWith("es");
  const isFrench = lang.startsWith("fr");
  
  const languageInstruction = isPortuguese 
    ? "IMPORTANTE: Responda APENAS em PORTUGUÊS DO BRASIL. Todos os textos devem estar em português."
    : isSpanish
    ? "IMPORTANTE: Responda APENAS em ESPANHOL. Todos os textos devem estar em espanhol."
    : isFrench
    ? "IMPORTANTE: Responda APENAS em FRANCÊS. Todos os textos devem estar em francês."
    : "IMPORTANTE: Responda APENAS em INGLÊS. Todos os textos devem estar em inglês.";

  const prompt = `Você é um facilitador criativo de Design Thinking conduzindo a fase DEVELOP (Ideação).

${languageInstruction}

POV STATEMENT: ${input.selectedPov}
HMW QUESTION: ${input.selectedHmw}
SECTOR: ${input.sector}

Generate a LARGE quantity of diverse ideas:

1. **Regular Ideas** (15-20 ideas): Creative solutions to the HMW question
   - Categories: digital product, physical product, service, platform, hybrid
   - Rate innovation level 1-5 (1=incremental, 5=breakthrough)
   - Be bold and imaginative

2. **Cross-Pollinated Ideas** (5-8 ideas): Innovative solutions by combining concepts from different domains
   - Example: Combine "ride-sharing" (Uber) + "subscription model" (Netflix) + "social gaming" (TikTok)
   - Show which domains were combined
   - Rate uniqueness 1-5

Return ONLY a JSON object (no markdown):
{
  "ideas": [{
    "title": "AI-Powered Meal Planner",
    "description": "An app that creates personalized weekly meal plans based on dietary preferences, budget, and available time",
    "category": "digital product",
    "innovationLevel": 3
  }],
  "crossPollinatedIdeas": [{
    "title": "Netflix for Meal Kits",
    "description": "Subscription service that delivers ready-to-cook meal ingredients with recipe videos you can binge-watch",
    "domains": ["subscription model", "meal delivery", "video streaming"],
    "uniqueness": 4
  }]
}`;

  try {
    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt
    });
    
    const text = result.text;
    if (!text) throw new Error("Empty AI response");
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI response format");
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Develop phase generation error:", error);
    throw error;
  }
}

// ===== PHASE 4: DELIVER (Convergence) =====

export interface DeliverResult {
  mvpConcept: {
    name: string;
    tagline: string;
    coreFeatures: string[];
    valueProposition: string;
  };
  logoSuggestions: Array<{
    description: string;
    style: string; // 'modern', 'minimalist', 'playful', 'professional', 'bold'
    colors: string[];
    symbolism: string;
  }>;
  landingPage: {
    headline: string;
    subheadline: string;
    sections: Array<{
      title: string;
      content: string;
      cta?: string;
    }>;
    finalCta: string;
  };
  socialMediaLines: {
    twitter: string[];
    linkedin: string[];
    instagram: string[];
  };
  testPlan: {
    objectives: string[];
    targetUsers: string;
    metrics: string[];
    testMethods: string[];
  };
}

export async function generateDeliverPhase(input: {
  selectedIdeas: Array<{ title: string; description: string }>;
  pov: string;
  sector: string;
  language?: string;
}): Promise<DeliverResult> {
  const lang = input.language || "pt-BR";
  const isPortuguese = lang.startsWith("pt");
  const isSpanish = lang.startsWith("es");
  const isFrench = lang.startsWith("fr");
  
  const languageInstruction = isPortuguese 
    ? "IMPORTANTE: Responda APENAS em PORTUGUÊS DO BRASIL. Todos os textos devem estar em português."
    : isSpanish
    ? "IMPORTANTE: Responda APENAS em ESPANHOL. Todos os textos devem estar em espanhol."
    : isFrench
    ? "IMPORTANTE: Responda APENAS em FRANCÊS. Todos os textos devem estar em francês."
    : "IMPORTANTE: Responda APENAS em INGLÊS. Todos os textos devem estar em inglês.";

  const ideaDescriptions = input.selectedIdeas.map(idea => 
    `- ${idea.title}: ${idea.description}`
  ).join('\n');

  const prompt = `Você é um especialista em Design Thinking conduzindo a fase DELIVER - criando um MVP funcional.

${languageInstruction}

POV: ${input.pov}
SECTOR: ${input.sector}

SELECTED IDEAS FOR MVP:
${ideaDescriptions}

Generate a complete MVP package:

1. **MVP Concept**: Name, tagline, 3-5 core features, value proposition

2. **Logo Suggestions** (3-4 options): Description, style, color palette, symbolism

3. **Landing Page Structure**:
   - Compelling headline and subheadline
   - 4-5 sections (hero, problem, solution, features, testimonials/social proof)
   - Final CTA (call to action)

4. **Social Media Lines** (3-4 per platform):
   - Twitter (concise, engaging)
   - LinkedIn (professional, value-focused)
   - Instagram (visual, aspirational)

5. **Test Plan**: Objectives, target users, key metrics, test methods

Return ONLY a JSON object (no markdown):
{
  "mvpConcept": {
    "name": "QuickBite",
    "tagline": "Healthy meals in minutes",
    "coreFeatures": ["AI meal planning", "15-min recipes", "Nutrition tracking"],
    "valueProposition": "..."
  },
  "logoSuggestions": [{
    "description": "Modern fork and clock combined",
    "style": "minimalist",
    "colors": ["#2ECC71", "#34495E"],
    "symbolism": "Speed meets nutrition"
  }],
  "landingPage": {
    "headline": "...",
    "subheadline": "...",
    "sections": [{"title": "...", "content": "...", "cta": "..."}],
    "finalCta": "Start Your Free Trial"
  },
  "socialMediaLines": {
    "twitter": ["..."],
    "linkedin": ["..."],
    "instagram": ["..."]
  },
  "testPlan": {
    "objectives": ["..."],
    "targetUsers": "...",
    "metrics": ["..."],
    "testMethods": ["..."]
  }
}`;

  try {
    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt
    });
    
    const text = result.text;
    if (!text) throw new Error("Empty AI response");
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI response format");
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Deliver phase generation error:", error);
    throw error;
  }
}

// ===== DFV ANALYSIS (Desirability, Feasibility, Viability) =====

export interface DFVAnalysis {
  desirabilityScore: number; // 0-100
  feasibilityScore: number; // 0-100
  viabilityScore: number; // 0-100
  analysis: {
    desirability: {
      strengths: string[];
      concerns: string[];
      reasoning: string;
    };
    feasibility: {
      strengths: string[];
      concerns: string[];
      reasoning: string;
    };
    viability: {
      strengths: string[];
      concerns: string[];
      reasoning: string;
    };
  };
  overallAssessment: string;
  recommendations: string[];
  nextSteps: string[];
}

export async function analyzeDFV(input: {
  pov: string;
  mvpConcept: any;
  sector: string;
  selectedIdeas: any[];
  language?: string;
}): Promise<DFVAnalysis> {
  const lang = input.language || "pt-BR";
  const isPortuguese = lang.startsWith("pt");
  const isSpanish = lang.startsWith("es");
  const isFrench = lang.startsWith("fr");
  
  const languageInstruction = isPortuguese 
    ? "IMPORTANTE: Responda APENAS em PORTUGUÊS DO BRASIL. Todos os textos devem estar em português."
    : isSpanish
    ? "IMPORTANTE: Responda APENAS em ESPANHOL. Todos os textos devem estar em espanhol."
    : isFrench
    ? "IMPORTANTE: Responda APENAS em FRANCÊS. Todos os textos devem estar em francês."
    : "IMPORTANTE: Responda APENAS em INGLÊS. Todos os textos devem estar em inglês.";

  const prompt = `Você é um estrategista de negócios analisando um projeto de Design Thinking usando o framework DFV.

${languageInstruction}

POV: ${input.pov}
MVP: ${JSON.stringify(input.mvpConcept, null, 2)}
SECTOR: ${input.sector}
IDEAS: ${JSON.stringify(input.selectedIdeas, null, 2)}

Analyze this project across three dimensions:

1. **DESIRABILITY** (0-100): Do users want this?
   - Does it solve a real, validated problem?
   - Is the value proposition compelling?
   - Would users choose this over alternatives?

2. **FEASIBILITY** (0-100): Can we build this?
   - Technical complexity
   - Resource requirements
   - Time to market
   - Team capabilities

3. **VIABILITY** (0-100): Is it a sustainable business?
   - Revenue potential
   - Cost structure
   - Competitive advantage
   - Market size

For each dimension, provide:
- Score (0-100)
- Strengths (2-3 points)
- Concerns (2-3 points)
- Reasoning (1-2 sentences)

Then provide:
- Overall assessment
- Top 3-5 recommendations
- Next steps (prioritized)

Return ONLY a JSON object (no markdown):
{
  "desirabilityScore": 75,
  "feasibilityScore": 60,
  "viabilityScore": 80,
  "analysis": {
    "desirability": {
      "strengths": ["Solves validated pain point", "Clear value proposition"],
      "concerns": ["Market saturation", "User behavior change required"],
      "reasoning": "Strong product-market fit based on POV, but competitive landscape is crowded"
    },
    "feasibility": {...},
    "viability": {...}
  },
  "overallAssessment": "Promising concept with strong viability but moderate feasibility challenges",
  "recommendations": ["Start with MVP", "Validate with 20 users", "..."],
  "nextSteps": ["Build landing page", "Run pre-launch campaign", "..."]
}`;

  try {
    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt
    });
    
    const text = result.text;
    if (!text) throw new Error("Empty AI response");
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI response format");
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("DFV analysis error:", error);
    throw error;
  }
}
