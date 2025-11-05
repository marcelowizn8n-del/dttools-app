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
}): Promise<DiscoverResult> {
  const prompt = `You are a Design Thinking expert conducting the DISCOVER phase of the Double Diamond framework.

CONTEXT:
- Sector: ${input.sector}
- Success Case Reference: ${input.successCase || 'None'}
- Target Audience: ${input.targetAudience}
- Problem Statement: ${input.problemStatement}

Generate a comprehensive discovery analysis with:

1. **Pain Points** (8-12 items): Identify specific problems, frustrations, and challenges the target audience faces
   - Include category (operational, emotional, financial, technological)
   - Rate severity 1-5 (5 = critical)

2. **Insights** (6-10 items): Key observations about user behavior, market trends, or sector patterns
   - Mark source: 'sector', 'case', or 'persona'

3. **User Needs** (8-12 items): Core needs that users are trying to fulfill
   - Prioritize 1-5 (5 = essential)

4. **Empathy Map**: What the user Says, Thinks, Does, and Feels (3-5 items per quadrant)

Return ONLY a JSON object (no markdown):
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
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt
    });
    
    const text = response.text || "";
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
}): Promise<DefineResult> {
  const prompt = `You are a Design Thinking expert conducting the DEFINE phase of the Double Diamond framework.

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
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt
    });
    
    const text = response.text || "";
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
}): Promise<DevelopResult> {
  const prompt = `You are a creative Design Thinking facilitator conducting the DEVELOP phase (Ideation).

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
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt
    });
    
    const text = response.text || "";
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
}): Promise<DeliverResult> {
  const ideaDescriptions = input.selectedIdeas.map(idea => 
    `- ${idea.title}: ${idea.description}`
  ).join('\n');

  const prompt = `You are a Design Thinking expert conducting the DELIVER phase - creating a functional MVP.

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
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt
    });
    
    const text = response.text || "";
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
}): Promise<DFVAnalysis> {
  const prompt = `You are a business strategist analyzing a Design Thinking project using the DFV framework.

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
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt
    });
    
    const text = response.text || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI response format");
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("DFV analysis error:", error);
    throw error;
  }
}
