import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import { storage } from "./storage";
import type { 
  IndustrySector, 
  SuccessCase, 
  InsertProject, 
  InsertPersona, 
  InsertPovStatement, 
  InsertIdea,
  InsertAiGeneratedAsset
} from "../shared/schema";

// Initialize Gemini AI
const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// Keep OpenAI for logo generation (DALL-E) - Gemini doesn't have native image generation yet
// This is optional - if credentials are not available, we skip logo generation
let openai: OpenAI | null = null;
try {
  const hasOpenAICredentials = process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  if (hasOpenAICredentials) {
    openai = new OpenAI({
      baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
      apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
    });
    console.log("✅ OpenAI initialized for logo generation");
  } else {
    console.log("⚠️ OpenAI credentials not found - logo generation will be skipped");
  }
} catch (error) {
  console.warn("⚠️ Failed to initialize OpenAI:", error);
  openai = null;
}

interface GenerationContext {
  sector: IndustrySector;
  successCase: SuccessCase;
  userProblemDescription: string;
  language: string;
}

interface GeneratedMVP {
  project: InsertProject;
  personas: InsertPersona[];
  povStatements: InsertPovStatement[];
  ideas: InsertIdea[];
  landingPageContent: {
    headline: string;
    subheadline: string;
    valueProposition: string;
    features: string[];
    ctaText: string;
  };
  socialMediaStrategy: {
    platform: string;
    contentIdeas: string[];
    postingFrequency: string;
  }[];
  businessModel: {
    revenueStreams: string[];
    keyResources: string[];
    keyActivities: string[];
    costStructure: string[];
  };
  logoUrl: string | null;
  generationCosts: {
    textGeneration: number;
    imageGeneration: number;
    total: number;
  };
}

export class AIGenerationService {
  
  /**
   * Generate a complete business MVP based on sector, success case, and user problem
   */
  async generateCompleteMVP(
    userId: string,
    context: GenerationContext
  ): Promise<GeneratedMVP> {
    
    const startTime = Date.now();
    console.log(`🤖 Starting AI MVP generation with Gemini for user ${userId}`);
    
    // Initialize cost tracking (Gemini is much cheaper than GPT-4o!)
    let textGenerationCost = 0;
    let imageGenerationCost = 0;
    
    try {
      // Step 1: Generate project core (name, description, business model)
      const projectCore = await this.generateProjectCore(context);
      textGenerationCost += 0.002; // Gemini 2.0 Flash is ~5x cheaper than GPT-4o
      
      // Step 2: Generate logo using DALL-E (still using OpenAI for images)
      const logoUrl = await this.generateLogo(context, projectCore.name);
      imageGenerationCost += 0.05; // DALL-E cost
      
      // Step 3: Generate personas (2-3 user personas)
      const personas = await this.generatePersonas(context, projectCore);
      textGenerationCost += 0.002;
      
      // Step 4: Generate POV statements based on personas
      const povStatements = await this.generatePOVStatements(context, personas);
      textGenerationCost += 0.0015;
      
      // Step 5: Generate ideas for solutions
      const ideas = await this.generateIdeas(context, povStatements);
      textGenerationCost += 0.002;
      
      // Step 6: Generate landing page content
      const landingPageContent = await this.generateLandingPage(context, projectCore);
      textGenerationCost += 0.002;
      
      // Step 7: Generate social media strategy
      const socialMediaStrategy = await this.generateSocialMediaStrategy(context, projectCore);
      textGenerationCost += 0.0015;
      
      // Step 8: Generate business model canvas
      const businessModel = await this.generateBusinessModel(context, projectCore);
      textGenerationCost += 0.002;
      
      const totalCost = textGenerationCost + imageGenerationCost;
      const duration = Date.now() - startTime;
      
      console.log(`✅ MVP generation completed in ${duration}ms - Total cost: R$ ${totalCost.toFixed(4)} (Gemini: R$ ${textGenerationCost.toFixed(4)}, DALL-E: R$ ${imageGenerationCost.toFixed(2)})`);
      
      return {
        project: {
          name: projectCore.name,
          description: projectCore.description,
          sectorId: context.sector.id,
          successCaseId: context.successCase.id,
          userProblemDescription: context.userProblemDescription,
          aiGenerated: true,
          businessModelBase: context.successCase.name,
        },
        personas,
        povStatements,
        ideas,
        landingPageContent,
        socialMediaStrategy,
        businessModel,
        logoUrl,
        generationCosts: {
          textGeneration: textGenerationCost,
          imageGeneration: imageGenerationCost,
          total: totalCost,
        },
      };
      
    } catch (error) {
      console.error("❌ Error generating MVP:", error);
      throw new Error(`Failed to generate MVP: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * Generate project core information (name, description, tagline)
   */
  private async generateProjectCore(context: GenerationContext): Promise<{
    name: string;
    description: string;
    tagline: string;
  }> {
    
    const prompt = `You are an expert business consultant and Design Thinking facilitator.

Context:
- Industry Sector: ${context.sector.namePt}
- Success Case Inspiration: ${context.successCase.name} (${context.successCase.descriptionPt || context.successCase.descriptionEn || ''})
- User Problem: ${context.userProblemDescription}

Task: Generate a complete business project foundation inspired by the success case but adapted to the user's specific problem.

Return ONLY a valid JSON object with this structure:
{
  "name": "Concise, memorable project name (2-3 words)",
  "tagline": "One-sentence value proposition",
  "description": "2-paragraph description explaining the solution, target audience, and unique value proposition"
}

Language: ${context.language === 'pt' ? 'Portuguese (Brazil)' : context.language === 'en' ? 'English' : context.language === 'es' ? 'Spanish' : 'French'}

Be creative, professional, and market-ready. The name should be brandable and memorable.`;

    const response = await gemini.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: prompt,
      config: {
        temperature: 0.8,
        maxOutputTokens: 500,
      },
    });
    
    const content = response.text || "{}";
    
    try {
      const parsed = JSON.parse(content);
      return {
        name: parsed.name || "Unnamed Project",
        description: parsed.description || "No description available",
        tagline: parsed.tagline || "",
      };
    } catch (error) {
      console.error("Failed to parse project core JSON:", content);
      return {
        name: "Unnamed Project",
        description: "No description available",
        tagline: "",
      };
    }
  }
  
  /**
   * Generate logo using DALL-E (gpt-image-1)
   * Note: Gemini doesn't have native image generation yet, so we still use OpenAI for logos
   */
  private async generateLogo(context: GenerationContext, projectName: string): Promise<string | null> {
    
    // Skip logo generation if OpenAI is not available
    if (!openai) {
      console.log("⚠️ Skipping logo generation - OpenAI not initialized");
      return null;
    }
    
    try {
      const prompt = `Professional, modern, minimalist logo for "${projectName}" - a ${context.sector.namePt} business inspired by ${context.successCase.name}. Clean design, suitable for digital platforms, memorable brand identity. No text in the image.`;
      
      const response = await openai.images.generate({
        model: "gpt-image-1",
        prompt,
        n: 1,
        size: "1024x1024",
      });
      
      return response.data?.[0]?.url || null;
      
    } catch (error) {
      console.error("Error generating logo:", error);
      return null; // Continue without logo if generation fails
    }
  }
  
  /**
   * Generate 2-3 user personas based on the project
   */
  private async generatePersonas(context: GenerationContext, projectCore: any): Promise<InsertPersona[]> {
    
    const prompt = `You are a UX researcher creating user personas.

Project: ${projectCore.name}
Description: ${projectCore.description}
Industry: ${context.sector.namePt}
Inspiration: ${context.successCase.name}

Task: Create 2-3 detailed user personas representing the target audience.

Return ONLY a valid JSON array with this structure:
[
  {
    "name": "Full name",
    "age": 25-45,
    "occupation": "Job title",
    "bio": "2-sentence background and lifestyle",
    "goals": "What they want to achieve (2 sentences)",
    "frustrations": "Pain points and challenges (2 sentences)",
    "behaviors": "Habits, preferences, tech-savviness (2 sentences)"
  }
]

Language: ${context.language === 'pt' ? 'Portuguese (Brazil)' : 'English'}`;

    const response = await gemini.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 800,
      },
    });
    
    const content = response.text || "[]";
    
    try {
      const parsed = JSON.parse(content);
      return parsed.map((p: any) => ({
        name: p.name,
        age: p.age,
        occupation: p.occupation,
        bio: p.bio,
        goals: p.goals,
        frustrations: p.frustrations,
        behaviors: p.behaviors,
        projectId: "", // Will be set after project creation
      }));
    } catch (error) {
      console.error("Failed to parse personas JSON:", content);
      return [];
    }
  }
  
  /**
   * Generate POV (Point of View) statements from personas
   */
  private async generatePOVStatements(context: GenerationContext, personas: any[]): Promise<InsertPovStatement[]> {
    
    const personasText = personas.map(p => `${p.name} (${p.occupation}): Goals - ${p.goals}, Frustrations - ${p.frustrations}`).join("\n");
    
    const prompt = `You are a Design Thinking facilitator creating POV statements.

Personas:
${personasText}

Task: Create 2-3 POV statements using the format:
"[User] needs [need] because [insight]"

Return ONLY a valid JSON array:
[
  {
    "user": "Persona name or type",
    "need": "What they need",
    "insight": "Why they need it (the deeper insight)"
  }
]

Language: ${context.language === 'pt' ? 'Portuguese (Brazil)' : 'English'}`;

    const response = await gemini.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 400,
      },
    });
    
    const content = response.text || "[]";
    
    try {
      const parsed = JSON.parse(content);
      return parsed.map((pov: any) => ({
        user: pov.user,
        need: pov.need,
        insight: pov.insight,
        projectId: "", // Will be set after project creation
      }));
    } catch (error) {
      console.error("Failed to parse POV statements JSON:", content);
      return [];
    }
  }
  
  /**
   * Generate initial ideas for solutions
   */
  private async generateIdeas(context: GenerationContext, povStatements: any[]): Promise<InsertIdea[]> {
    
    const povText = povStatements.map(p => `${p.user} needs ${p.need} because ${p.insight}`).join("\n");
    
    const prompt = `You are an innovation consultant in an ideation session.

POV Statements:
${povText}

Success Case Inspiration: ${context.successCase.name}

Task: Generate 5-7 innovative solution ideas that address these needs.

Return ONLY a valid JSON array:
[
  {
    "title": "Concise idea name",
    "description": "2-3 sentence explanation of the idea and how it works",
    "category": "feature" or "service" or "product"
  }
]

Be creative and actionable. Mix quick wins with bold innovations.

Language: ${context.language === 'pt' ? 'Portuguese (Brazil)' : 'English'}`;

    const response = await gemini.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: prompt,
      config: {
        temperature: 0.9,
        maxOutputTokens: 800,
      },
    });
    
    const content = response.text || "[]";
    
    try {
      const parsed = JSON.parse(content);
      return parsed.map((idea: any) => ({
        title: idea.title,
        description: idea.description,
        category: idea.category || "feature",
        projectId: "", // Will be set after project creation
      }));
    } catch (error) {
      console.error("Failed to parse ideas JSON:", content);
      return [];
    }
  }
  
  /**
   * Generate landing page content
   */
  private async generateLandingPage(context: GenerationContext, projectCore: any) {
    
    const prompt = `You are a conversion copywriter creating landing page content.

Project: ${projectCore.name}
Tagline: ${projectCore.tagline}
Description: ${projectCore.description}

Task: Create compelling landing page sections.

Return ONLY a valid JSON object:
{
  "headline": "Powerful headline (6-10 words)",
  "subheadline": "Supporting subheadline (15-20 words)",
  "valueProposition": "Clear value prop paragraph (3-4 sentences)",
  "features": ["Feature 1 with benefit", "Feature 2 with benefit", "Feature 3 with benefit"],
  "ctaText": "Call-to-action button text"
}

Language: ${context.language === 'pt' ? 'Portuguese (Brazil)' : 'English'}`;

    const response = await gemini.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: prompt,
      config: {
        temperature: 0.8,
        maxOutputTokens: 500,
      },
    });
    
    const content = response.text || "{}";
    
    try {
      return JSON.parse(content);
    } catch (error) {
      console.error("Failed to parse landing page JSON:", content);
      return {
        headline: "Welcome",
        subheadline: "Your solution awaits",
        valueProposition: "We provide value.",
        features: [],
        ctaText: "Get Started"
      };
    }
  }
  
  /**
   * Generate social media strategy
   */
  private async generateSocialMediaStrategy(context: GenerationContext, projectCore: any) {
    
    const prompt = `You are a social media strategist.

Project: ${projectCore.name}
Industry: ${context.sector.namePt}

Task: Create social media launch strategy for 3 platforms.

Return ONLY a valid JSON array:
[
  {
    "platform": "Instagram/LinkedIn/TikTok/etc",
    "contentIdeas": ["Post idea 1", "Post idea 2", "Post idea 3"],
    "postingFrequency": "e.g., 3x per week"
  }
]

Language: ${context.language === 'pt' ? 'Portuguese (Brazil)' : 'English'}`;

    const response = await gemini.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 600,
      },
    });
    
    const content = response.text || "[]";
    
    try {
      return JSON.parse(content);
    } catch (error) {
      console.error("Failed to parse social media strategy JSON:", content);
      return [];
    }
  }
  
  /**
   * Generate business model canvas
   */
  private async generateBusinessModel(context: GenerationContext, projectCore: any) {
    
    const prompt = `You are a business model consultant.

Project: ${projectCore.name}
Description: ${projectCore.description}
Inspired by: ${context.successCase.name}

Task: Create a simplified business model canvas.

Return ONLY a valid JSON object:
{
  "revenueStreams": ["Revenue stream 1", "Revenue stream 2"],
  "keyResources": ["Key resource 1", "Key resource 2", "Key resource 3"],
  "keyActivities": ["Key activity 1", "Key activity 2", "Key activity 3"],
  "costStructure": ["Cost item 1", "Cost item 2", "Cost item 3"]
}

Language: ${context.language === 'pt' ? 'Portuguese (Brazil)' : 'English'}`;

    const response = await gemini.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 500,
      },
    });
    
    const content = response.text || "{}";
    
    try {
      return JSON.parse(content);
    } catch (error) {
      console.error("Failed to parse business model JSON:", content);
      return {
        revenueStreams: [],
        keyResources: [],
        keyActivities: [],
        costStructure: []
      };
    }
  }
  
  /**
   * Save generated assets to database with cost tracking
   */
  async saveGeneratedAssets(projectId: string, generatedData: GeneratedMVP): Promise<void> {
    
    const assets: InsertAiGeneratedAsset[] = [];
    
    // Save logo
    if (generatedData.logoUrl) {
      assets.push({
        projectId,
        assetType: "logo",
        content: JSON.stringify({ url: generatedData.logoUrl }),
        generationCost: generatedData.generationCosts.imageGeneration,
      });
    }
    
    // Save landing page
    assets.push({
      projectId,
      assetType: "landing_page",
      content: JSON.stringify(generatedData.landingPageContent),
      generationCost: 0.002,
    });
    
    // Save social media strategy
    assets.push({
      projectId,
      assetType: "social_media",
      content: JSON.stringify(generatedData.socialMediaStrategy),
      generationCost: 0.0015,
    });
    
    // Save business model
    assets.push({
      projectId,
      assetType: "business_model",
      content: JSON.stringify(generatedData.businessModel),
      generationCost: 0.002,
    });
    
    // Batch create assets
    for (const asset of assets) {
      await storage.createAiGeneratedAsset(asset);
    }
    
    console.log(`💾 Saved ${assets.length} AI-generated assets for project ${projectId}`);
  }
}

export const aiGenerationService = new AIGenerationService();
