// DON'T DELETE THIS COMMENT
// Using javascript_gemini blueprint integration
import { GoogleGenAI } from "@google/genai";
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface DesignThinkingContext {
  projectId?: string;
  projectName?: string;
  projectDescription?: string;
  currentPhase: number;
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
  focusArea?: 'empathize' | 'define' | 'ideate' | 'prototype' | 'test';
  personas?: any[];
  empathyMaps?: any[];
  ideas?: any[];
  prototypes?: any[];
}

// This API key is from Gemini Developer API Key, not vertex AI API Key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export class DesignThinkingGeminiAI {
  private readonly model = "gemini-2.5-flash";

  async chat(message: string, context: DesignThinkingContext): Promise<string> {
    try {
      const systemPrompt = this.buildSystemPrompt(context);
      const prompt = `${systemPrompt}\n\nUser: ${message}\n\nAssistant:`;

      const response = await ai.models.generateContent({
        model: this.model,
        contents: prompt,
      });

      return response.text || "Desculpe, não consegui processar sua mensagem no momento.";
    } catch (error) {
      console.error("Erro no chat da IA Gemini:", error);
      throw new Error("Erro ao processar sua mensagem. Verifique se a chave da API Gemini está configurada corretamente.");
    }
  }

  async generateSuggestions(context: DesignThinkingContext): Promise<string[]> {
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
        contents: prompt,
      });

      const result = JSON.parse(response.text || "{}");
      return result.suggestions || [
        "Como podemos entender melhor nossos usuários?",
        "Que problemas estamos tentando resolver?",
        "Quais são as principais necessidades identificadas?"
      ];
    } catch (error) {
      console.error("Erro ao gerar sugestões:", error);
      // Fallback suggestions
      return [
        "Como podemos entender melhor nossos usuários?",
        "Que problemas estamos tentando resolver?",
        "Quais são as principais necessidades identificadas?"
      ];
    }
  }

  private buildSystemPrompt(context: DesignThinkingContext): string {
    const phaseNames: Record<number, string> = {
      1: "Empatizar",
      2: "Definir", 
      3: "Idear",
      4: "Prototipar",
      5: "Testar"
    };

    const currentPhase = phaseNames[context.currentPhase] || "Desconhecida";

    return `Você é um especialista em Design Thinking e facilitador de inovação. 
Você está ajudando com um projeto chamado "${context.projectName}" na fase de ${currentPhase}.

Contexto do projeto:
- Fase atual: ${currentPhase} (${context.currentPhase}/5)
- Descrição: ${context.projectDescription}
- Personas criadas: ${context.personas?.length || 0}
- Mapas de empatia: ${context.empathyMaps?.length || 0}  
- Ideias geradas: ${context.ideas?.length || 0}
- Protótipos: ${context.prototypes?.length || 0}

Diretrizes:
- Seja prático e focado na metodologia de Design Thinking
- Faça perguntas que estimulem o pensamento criativo
- Sugira atividades específicas para a fase atual
- Mantenha o foco no usuário final
- Responda em português brasileiro
- Use uma linguagem acessível e motivadora
- Limite respostas a 150 palavras quando possível`;
  }

  private buildSuggestionsPrompt(context: DesignThinkingContext): string {
    const phasePrompts: Record<number, string> = {
      1: "Gere 4 sugestões de perguntas para a fase Empatizar, focando em entender o usuário:",
      2: "Gere 4 sugestões de perguntas para a fase Definir, focando em sintetizar insights:",
      3: "Gere 4 sugestões de perguntas para a fase Idear, focando em gerar soluções criativas:",
      4: "Gere 4 sugestões de perguntas para a fase Prototipar, focando em materializar ideias:",
      5: "Gere 4 sugestões de perguntas para a fase Testar, focando em validar soluções:"
    };

    const phasePrompt = phasePrompts[context.currentPhase] || phasePrompts[1];

    return `${phasePrompt}

Projeto: ${context.projectName || 'Projeto de Design Thinking'}
Descrição: ${context.projectDescription || 'Desenvolvimento de soluções centradas no usuário'}

Retorne apenas um JSON com o array "suggestions" contendo 4 perguntas curtas e práticas em português brasileiro.
Exemplo: {"suggestions": ["Como podemos...", "O que aconteceria se...", "Quais são...", "Por que nossos usuários..."]}`;
  }
}

export const designThinkingGeminiAI = new DesignThinkingGeminiAI();