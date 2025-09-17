import OpenAI from "openai";

/*
Integration blueprint: javascript_openai
Follow these instructions when using this blueprint:
1. Note that the newest OpenAI model is "gpt-5", not "gpt-4o" or "gpt-4". gpt-5 was released August 7, 2025 after your knowledge cutoff. Always prefer using gpt-5 as it is the latest model. When copying code from this blueprint, ensure you also mention this information verbatim as a comment so that you don't revert it to older models: `// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user`
2. Use the response_format: { type: "json_object" } option
3. Request output in JSON format in the prompt
*/

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface DesignThinkingContext {
  projectId?: string;
  currentPhase: number;
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  focusArea?: 'empathize' | 'define' | 'ideate' | 'prototype' | 'test';
}

// Comprehensive AI Analysis interfaces
export interface ProjectAnalysisData {
  project: any;
  empathyMaps: any[];
  personas: any[];
  interviews: any[];
  observations: any[];
  povStatements: any[];
  hmwQuestions: any[];
  ideas: any[];
  prototypes: any[];
  testPlans: any[];
  testResults: any[];
}

export interface PhaseAnalysis {
  phase: number;
  phaseName: string;
  completeness: number;
  quality: number;
  insights: string[];
  gaps: string[];
  recommendations: string[];
  strengths: string[];
}

export interface AIProjectAnalysis {
  executiveSummary: string;
  maturityScore: number;
  overallInsights: string[];
  attentionPoints: string[];
  priorityNextSteps: string[];
  phaseAnalyses: PhaseAnalysis[];
  consistency: {
    score: number;
    issues: string[];
    strengths: string[];
  };
  alignment: {
    problemSolutionAlignment: number;
    researchInsightsAlignment: number;
    comments: string[];
  };
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
}

export class DesignThinkingAI {
  private getSystemPrompt(context: DesignThinkingContext): string {
    const phaseGuides = {
      1: {
        name: "Empatizar",
        description: "compreender profundamente as necessidades dos usuários",
        tools: "mapas de empatia, personas, entrevistas, observações",
        questions: "Quem são seus usuários? Quais suas necessidades, desejos e frustrações?"
      },
      2: {
        name: "Definir", 
        description: "sintetizar insights para definir o problema principal",
        tools: "declarações de ponto de vista (POV), perguntas 'Como Podemos' (HMW)",
        questions: "Qual é o problema real que precisamos resolver? Como podemos reformular este desafio?"
      },
      3: {
        name: "Idear",
        description: "gerar soluções criativas e inovadoras",
        tools: "brainstorming, brainwriting, método das piores ideias",
        questions: "Que soluções podemos imaginar? Como podemos pensar fora da caixa?"
      },
      4: {
        name: "Prototipar",
        description: "construir representações rápidas e simples das ideias",
        tools: "protótipos de papel, wireframes, mockups, modelos 3D",
        questions: "Como podemos tornar nossa ideia tangível? Que versão mínima podemos testar?"
      },
      5: {
        name: "Testar",
        description: "validar protótipos com usuários reais",
        tools: "planos de teste, testes de usabilidade, entrevistas de feedback",
        questions: "O que os usuários pensam da nossa solução? Que melhorias precisamos fazer?"
      }
    };

    const currentPhaseInfo = phaseGuides[context.currentPhase as keyof typeof phaseGuides] || phaseGuides[1];
    
    return `Você é um mentor experiente em Design Thinking, especializado em guiar equipes através do processo de inovação centrada no usuário.

CONTEXTO ATUAL:
- Fase atual: ${currentPhaseInfo.name} (Fase ${context.currentPhase}/5)
- Objetivo da fase: ${currentPhaseInfo.description}
- Ferramentas principais: ${currentPhaseInfo.tools}
- Perguntas-chave: ${currentPhaseInfo.questions}
- Nível do usuário: ${context.userLevel === 'beginner' ? 'Iniciante' : context.userLevel === 'intermediate' ? 'Intermediário' : 'Avançado'}

SUAS RESPONSABILIDADES:
1. Fornecer orientações práticas e específicas para a fase atual
2. Sugerir métodos, ferramentas e exercícios apropriados
3. Fazer perguntas instigantes que guiem o pensamento criativo
4. Oferecer exemplos concretos e aplicáveis
5. Adaptar a linguagem ao nível de experiência do usuário
6. Motivar e encorajar a experimentação

ESTILO DE COMUNICAÇÃO:
- Use um tom amigável, encorajador e profissional
- Seja conciso mas informativo
- Faça perguntas abertas que estimulem a reflexão
- Ofereça sugestões práticas e acionáveis
- Use exemplos do mundo real quando relevante

FOCO ESPECIAL: ${context.focusArea ? `Concentre-se especialmente em ${context.focusArea}` : 'Mantenha foco na fase atual'}.

Responda sempre em português brasileiro de forma clara e didática.`;
  }

  async chat(
    messages: ChatMessage[],
    context: DesignThinkingContext
  ): Promise<string> {
    try {
      const systemPrompt = this.getSystemPrompt(context);
      
      const openaiMessages = [
        { role: 'system' as const, content: systemPrompt },
        ...messages.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        }))
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
        messages: openaiMessages,
        max_tokens: 1000,
        temperature: 0.7,
      });

      return response.choices[0].message.content || "Desculpe, não consegui gerar uma resposta. Tente novamente.";
    } catch (error) {
      console.error('Erro no chat da IA:', error);
      throw new Error("Erro ao processar sua mensagem. Verifique se a chave da API OpenAI está configurada corretamente.");
    }
  }

  async generateSuggestions(
    context: DesignThinkingContext,
    currentTopic: string
  ): Promise<string[]> {
    try {
      const prompt = `Baseado no contexto de Design Thinking na fase ${context.currentPhase} e no tópico "${currentTopic}", gere 3 sugestões práticas e específicas de próximos passos ou perguntas relevantes. Responda em formato JSON com um array de strings chamado "suggestions".`;

      const response = await openai.chat.completions.create({
        model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
        messages: [
          { role: 'system', content: this.getSystemPrompt(context) },
          { role: 'user', content: prompt }
        ],
        response_format: { type: "json_object" },
        max_tokens: 500,
        temperature: 0.8,
      });

      const result = JSON.parse(response.choices[0].message.content || '{"suggestions": []}');
      return result.suggestions || [];
    } catch (error) {
      console.error('Erro ao gerar sugestões:', error);
      return [
        "Como podemos entender melhor nossos usuários?",
        "Que ferramentas seriam mais úteis nesta fase?",
        "Qual seria o próximo passo mais importante?"
      ];
    }
  }

  async analyzeProjectPhase(
    projectData: any,
    currentPhase: number
  ): Promise<{ insights: string[]; nextSteps: string[]; completeness: number }> {
    try {
      const prompt = `Analise os dados do projeto de Design Thinking e forneça insights sobre a fase ${currentPhase}. 

      Dados do projeto: ${JSON.stringify(projectData, null, 2)}

      Forneça sua análise em formato JSON com:
      - "insights": array de strings com insights sobre o progresso
      - "nextSteps": array de strings com próximos passos recomendados  
      - "completeness": número de 0 a 100 indicando o percentual de completude da fase`;

      const response = await openai.chat.completions.create({
        model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
        messages: [
          { role: 'system', content: this.getSystemPrompt({ currentPhase, userLevel: 'intermediate' }) },
          { role: 'user', content: prompt }
        ],
        response_format: { type: "json_object" },
        max_tokens: 800,
        temperature: 0.6,
      });

      const result = JSON.parse(response.choices[0].message.content || '{"insights": [], "nextSteps": [], "completeness": 0}');
      return {
        insights: result.insights || [],
        nextSteps: result.nextSteps || [],
        completeness: Math.max(0, Math.min(100, result.completeness || 0))
      };
    } catch (error) {
      console.error('Erro ao analisar fase do projeto:', error);
      return {
        insights: ["Análise não disponível no momento"],
        nextSteps: ["Continue trabalhando nas ferramentas da fase atual"],
        completeness: 0
      };
    }
  }

  async analyzeCompleteProject(
    analysisData: ProjectAnalysisData
  ): Promise<AIProjectAnalysis> {
    if (!openai) {
      throw new Error("OpenAI não está configurado. Verifique se a chave da API está definida.");
    }

    try {
      const prompt = `Como especialista em Design Thinking, analise este projeto completo e forneça uma análise abrangente.

DADOS DO PROJETO:
${JSON.stringify(analysisData, null, 2)}

Forneça uma análise completa em formato JSON com a seguinte estrutura:

{
  "executiveSummary": "Resumo executivo do projeto (2-3 frases)",
  "maturityScore": numero de 1-10 indicando maturidade geral do projeto,
  "overallInsights": ["insight geral 1", "insight geral 2", "..."],
  "attentionPoints": ["ponto que precisa atenção 1", "ponto que precisa atenção 2", "..."],
  "priorityNextSteps": ["próximo passo prioritário 1", "próximo passo prioritário 2", "..."],
  "phaseAnalyses": [
    {
      "phase": 1,
      "phaseName": "Empatizar",
      "completeness": numero 0-100,
      "quality": numero 0-100,
      "insights": ["insight específico da fase"],
      "gaps": ["gap ou oportunidade perdida"],
      "recommendations": ["recomendação específica"],
      "strengths": ["ponto forte da fase"]
    },
    // ... para cada uma das 5 fases
  ],
  "consistency": {
    "score": numero 0-100,
    "issues": ["problema de consistência"],
    "strengths": ["ponto forte de consistência"]
  },
  "alignment": {
    "problemSolutionAlignment": numero 0-100,
    "researchInsightsAlignment": numero 0-100,
    "comments": ["comentário sobre alinhamento"]
  },
  "recommendations": {
    "immediate": ["ação imediata"],
    "shortTerm": ["ação de curto prazo"],
    "longTerm": ["ação de longo prazo"]
  }
}

CRITÉRIOS DE ANÁLISE:
1. Completeness: Verifique se cada fase tem ferramentas suficientes e bem desenvolvidas
2. Quality: Avalie a profundidade e relevância dos insights e dados coletados
3. Consistency: Analise se há fluxo lógico e consistência entre as fases
4. Alignment: Verifique se as soluções propostas realmente abordam os problemas identificados
5. Research Quality: Avalie se a pesquisa de usuário foi robusta o suficiente
6. Innovation: Considere o nível de criatividade e inovação das soluções
7. Feasibility: Analise a viabilidade das soluções propostas
8. User-Centricity: Verifique se o foco no usuário é mantido consistentemente

Seja específico, construtivo e ofereça insights acionáveis. Responda em português brasileiro.`;

      const response = await openai.chat.completions.create({
        model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
        messages: [
          { 
            role: 'system', 
            content: `Você é um especialista sênior em Design Thinking com 15+ anos de experiência, conhecido por análises profundas e insights transformadores. Analise projetos com rigor acadêmico mas linguagem acessível.` 
          },
          { role: 'user', content: prompt }
        ],
        response_format: { type: "json_object" },
        max_tokens: 3000,
        temperature: 0.7,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      // Validate and provide defaults
      return {
        executiveSummary: result.executiveSummary || "Análise do projeto não pôde ser completada.",
        maturityScore: Math.max(1, Math.min(10, result.maturityScore || 5)),
        overallInsights: result.overallInsights || ["Análise detalhada não disponível no momento."],
        attentionPoints: result.attentionPoints || ["Verificar dados do projeto."],
        priorityNextSteps: result.priorityNextSteps || ["Continuar desenvolvimento do projeto."],
        phaseAnalyses: result.phaseAnalyses || this.getDefaultPhaseAnalyses(),
        consistency: {
          score: Math.max(0, Math.min(100, result.consistency?.score || 50)),
          issues: result.consistency?.issues || ["Dados insuficientes para análise de consistência."],
          strengths: result.consistency?.strengths || ["Projeto em desenvolvimento."]
        },
        alignment: {
          problemSolutionAlignment: Math.max(0, Math.min(100, result.alignment?.problemSolutionAlignment || 50)),
          researchInsightsAlignment: Math.max(0, Math.min(100, result.alignment?.researchInsightsAlignment || 50)),
          comments: result.alignment?.comments || ["Necessário mais dados para avaliar alinhamento."]
        },
        recommendations: {
          immediate: result.recommendations?.immediate || ["Continuar coletando dados de usuário."],
          shortTerm: result.recommendations?.shortTerm || ["Desenvolver ferramentas das fases atuais."],
          longTerm: result.recommendations?.longTerm || ["Planejar testes com usuários reais."]
        }
      };
    } catch (error) {
      console.error('Erro ao analisar projeto completo:', error);
      
      // Return default analysis on error
      return {
        executiveSummary: "Não foi possível gerar análise completa neste momento. Verifique a configuração da API OpenAI.",
        maturityScore: 5,
        overallInsights: ["Análise automática indisponível. Continue desenvolvendo o projeto seguindo as melhores práticas de Design Thinking."],
        attentionPoints: ["Serviço de análise IA temporariamente indisponível."],
        priorityNextSteps: ["Revisar dados do projeto e tentar análise novamente."],
        phaseAnalyses: this.getDefaultPhaseAnalyses(),
        consistency: {
          score: 50,
          issues: ["Análise de consistência indisponível."],
          strengths: ["Continue seguindo a metodologia Design Thinking."]
        },
        alignment: {
          problemSolutionAlignment: 50,
          researchInsightsAlignment: 50,
          comments: ["Análise de alinhamento indisponível no momento."]
        },
        recommendations: {
          immediate: ["Verificar configurações do sistema."],
          shortTerm: ["Continuar desenvolvimento seguindo metodologia."],
          longTerm: ["Considerar análise manual com especialista."]
        }
      };
    }
  }

  private getDefaultPhaseAnalyses(): PhaseAnalysis[] {
    const phases = [
      { phase: 1, name: "Empatizar" },
      { phase: 2, name: "Definir" },
      { phase: 3, name: "Idear" },
      { phase: 4, name: "Prototipar" },
      { phase: 5, name: "Testar" }
    ];

    return phases.map(p => ({
      phase: p.phase,
      phaseName: p.name,
      completeness: 50,
      quality: 50,
      insights: [`Fase ${p.name} em desenvolvimento.`],
      gaps: ["Dados insuficientes para análise detalhada."],
      recommendations: [`Continue trabalhando nas ferramentas da fase ${p.name}.`],
      strengths: ["Seguindo metodologia correta."]
    }));
  }
}

export const designThinkingAI = new DesignThinkingAI();