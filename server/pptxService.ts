import pptxgen from "pptxgenjs";
import { storage } from "./storage";
import type { 
  Project, 
  EmpathyMap, 
  Persona, 
  Interview, 
  Observation, 
  PovStatement, 
  HmwQuestion, 
  Idea, 
  Prototype, 
  TestPlan, 
  TestResult 
} from "@shared/schema";

export interface PPTXExportData {
  project: Project;
  empathyMaps: EmpathyMap[];
  personas: Persona[];
  interviews: Interview[];
  observations: Observation[];
  povStatements: PovStatement[];
  hmwQuestions: HmwQuestion[];
  ideas: Idea[];
  prototypes: Prototype[];
  testPlans: TestPlan[];
  testResults: TestResult[];
}

export class PPTXService {
  private pres: pptxgen;

  constructor() {
    this.pres = new pptxgen();
    this.setupMasterSlide();
  }

  private setupMasterSlide() {
    // Define master slide for consistent branding
    this.pres.defineSlideMaster({
      title: "DTTools_MASTER",
      background: { color: "FFFFFF" },
      objects: [
        // Header with DTTools branding
        {
          rect: {
            x: 0, y: 0, w: "100%", h: 0.75,
            fill: { color: "1E40AF" }, // DTTools blue
          }
        },
        {
          text: {
            text: "DTTools - Design Thinking",
            options: {
              x: 0.5, y: 0.1, w: 8, h: 0.5,
              color: "FFFFFF",
              fontSize: 18,
              fontFace: "Arial",
              bold: true
            }
          }
        },
        // Footer
        {
          text: {
            text: "Gerado pelo DTTools • dttools.app",
            options: {
              x: 0.5, y: 6.8, w: 9, h: 0.3,
              color: "666666",
              fontSize: 10,
              fontFace: "Arial",
              align: "center"
            }
          }
        }
      ]
    });
  }

  private addTitleSlide(projectName: string, description: string = "") {
    const slide = this.pres.addSlide({ masterName: "DTTools_MASTER" });
    
    slide.addText(projectName, {
      x: 1, y: 2, w: 8, h: 1.5,
      fontSize: 36,
      bold: true,
      color: "1E40AF",
      align: "center"
    });

    if (description) {
      slide.addText(description, {
        x: 1, y: 3.5, w: 8, h: 1,
        fontSize: 16,
        color: "333333",
        align: "center"
      });
    }

    slide.addText("Processo de Design Thinking", {
      x: 1, y: 4.5, w: 8, h: 0.8,
      fontSize: 14,
      color: "666666",
      align: "center",
      italic: true
    });

    // Add 5 phases overview
    const phases = ["Empatizar", "Definir", "Idear", "Prototipar", "Testar"];
    phases.forEach((phase, index) => {
      slide.addText(`${index + 1}. ${phase}`, {
        x: 1 + (index * 1.6), y: 5.5, w: 1.5, h: 0.5,
        fontSize: 12,
        color: "1E40AF",
        align: "center",
        bold: true
      });
    });
  }

  private addPhaseOverviewSlide(phase: number, title: string, description: string) {
    const slide = this.pres.addSlide({ masterName: "DTTools_MASTER" });
    
    slide.addText(`Fase ${phase}: ${title}`, {
      x: 1, y: 1.2, w: 8, h: 1,
      fontSize: 28,
      bold: true,
      color: "1E40AF"
    });

    slide.addText(description, {
      x: 1, y: 2.5, w: 8, h: 1.5,
      fontSize: 16,
      color: "333333"
    });
  }

  private addEmpathyMapSlide(empathyMap: EmpathyMap) {
    const slide = this.pres.addSlide({ masterName: "DTTools_MASTER" });
    
    slide.addText(`Mapa de Empatia: ${empathyMap.title}`, {
      x: 1, y: 1.2, w: 8, h: 0.8,
      fontSize: 24,
      bold: true,
      color: "1E40AF"
    });

    // Create empathy map quadrants
    const quadrants = [
      { title: "DIZ", data: empathyMap.says as string[], x: 1, y: 2.2, color: "E8F4FA" },
      { title: "PENSA", data: empathyMap.thinks as string[], x: 5, y: 2.2, color: "E2E6ED" },
      { title: "FAZ", data: empathyMap.does as string[], x: 1, y: 4.7, color: "FFFBEB" },
      { title: "SENTE", data: empathyMap.feels as string[], x: 5, y: 4.7, color: "FFF2EC" }
    ];

    quadrants.forEach(quadrant => {
      // Add quadrant background
      slide.addShape("rect", {
        x: quadrant.x, y: quadrant.y, w: 3.5, h: 2.2,
        fill: { color: quadrant.color },
        line: { color: "CCCCCC", width: 1 }
      });

      // Add quadrant title
      slide.addText(quadrant.title, {
        x: quadrant.x, y: quadrant.y + 0.1, w: 3.5, h: 0.4,
        fontSize: 14,
        bold: true,
        color: "333333",
        align: "center"
      });

      // Add quadrant items
      const items = quadrant.data.slice(0, 3); // Limit to 3 items per quadrant
      items.forEach((item, index) => {
        slide.addText(`• ${item}`, {
          x: quadrant.x + 0.2, y: quadrant.y + 0.6 + (index * 0.4), w: 3.1, h: 0.3,
          fontSize: 11,
          color: "333333"
        });
      });
    });
  }

  private addPersonasSlide(personas: Persona[]) {
    const slide = this.pres.addSlide({ masterName: "DTTools_MASTER" });
    
    slide.addText("Personas do Projeto", {
      x: 1, y: 1.2, w: 8, h: 0.8,
      fontSize: 24,
      bold: true,
      color: "1E40AF"
    });

    personas.slice(0, 2).forEach((persona, index) => {
      const xPos = index === 0 ? 1 : 5;
      
      // Persona card background
      slide.addShape("rect", {
        x: xPos, y: 2.2, w: 3.5, h: 4,
        fill: { color: "F8F9FA" },
        line: { color: "CCCCCC", width: 1 }
      });

      // Persona name and details
      slide.addText(persona.name, {
        x: xPos + 0.2, y: 2.4, w: 3.1, h: 0.5,
        fontSize: 16,
        bold: true,
        color: "1E40AF"
      });

      slide.addText(`${persona.age} anos • ${persona.occupation}`, {
        x: xPos + 0.2, y: 2.9, w: 3.1, h: 0.3,
        fontSize: 12,
        color: "666666"
      });

      if (persona.bio) {
        slide.addText(persona.bio.slice(0, 150) + "...", {
          x: xPos + 0.2, y: 3.3, w: 3.1, h: 1,
          fontSize: 10,
          color: "333333"
        });
      }

      // Goals
      if (persona.goals && Array.isArray(persona.goals) && persona.goals.length > 0) {
        slide.addText("Objetivos:", {
          x: xPos + 0.2, y: 4.5, w: 3.1, h: 0.3,
          fontSize: 11,
          bold: true,
          color: "1E40AF"
        });

        (persona.goals as string[]).slice(0, 2).forEach((goal, goalIndex) => {
          slide.addText(`• ${goal}`, {
            x: xPos + 0.2, y: 4.8 + (goalIndex * 0.3), w: 3.1, h: 0.25,
            fontSize: 9,
            color: "333333"
          });
        });
      }
    });
  }

  private addIdeasSlide(ideas: Idea[]) {
    const slide = this.pres.addSlide({ masterName: "DTTools_MASTER" });
    
    slide.addText("Ideias Geradas", {
      x: 1, y: 1.2, w: 8, h: 0.8,
      fontSize: 24,
      bold: true,
      color: "1E40AF"
    });

    // Sort ideas by DVF score (highest first)
    const sortedIdeas = ideas.sort((a, b) => (b.dvfScore || 0) - (a.dvfScore || 0)).slice(0, 5);

    sortedIdeas.forEach((idea, index) => {
      const yPos = 2.2 + (index * 0.9);
      
      // Idea background
      slide.addShape("rect", {
        x: 1, y: yPos, w: 8, h: 0.8,
        fill: { color: index < 3 ? "E8F5E8" : "F8F9FA" },
        line: { color: "CCCCCC", width: 1 }
      });

      // Idea title
      slide.addText(idea.title, {
        x: 1.2, y: yPos + 0.1, w: 5, h: 0.3,
        fontSize: 12,
        bold: true,
        color: "1E40AF"
      });

      // DVF Score
      if (idea.dvfScore) {
        slide.addText(`DVF: ${idea.dvfScore.toFixed(1)}/5`, {
          x: 6.5, y: yPos + 0.1, w: 1.5, h: 0.3,
          fontSize: 11,
          bold: true,
          color: idea.dvfScore >= 3.5 ? "22C55E" : idea.dvfScore >= 2.5 ? "F59E0B" : "EF4444"
        });
      }

      // Action decision
      if (idea.actionDecision && idea.actionDecision !== "evaluate") {
        const actionColors = {
          love_it: "22C55E",
          change_it: "F59E0B", 
          leave_it: "EF4444"
        };
        const actionTexts = {
          love_it: "💚 AMAR",
          change_it: "🔄 MUDAR",
          leave_it: "❌ DEIXAR"
        };

        slide.addText(actionTexts[idea.actionDecision as keyof typeof actionTexts] || "", {
          x: 8, y: yPos + 0.1, w: 1, h: 0.3,
          fontSize: 10,
          bold: true,
          color: actionColors[idea.actionDecision as keyof typeof actionColors] || "666666"
        });
      }

      // Description
      slide.addText(idea.description.slice(0, 80) + "...", {
        x: 1.2, y: yPos + 0.4, w: 6.6, h: 0.3,
        fontSize: 10,
        color: "333333"
      });
    });
  }

  private addDVFAnalysisSlide(ideas: Idea[]) {
    const slide = this.pres.addSlide({ masterName: "DTTools_MASTER" });
    
    slide.addText("Análise DVF - Benchmarking", {
      x: 1, y: 1.2, w: 8, h: 0.8,
      fontSize: 24,
      bold: true,
      color: "1E40AF"
    });

    // Calculate averages
    const validIdeas = ideas.filter(idea => idea.dvfScore);
    if (validIdeas.length === 0) return;

    const avgDesirability = validIdeas.reduce((sum, idea) => sum + (idea.desirability || 0), 0) / validIdeas.length;
    const avgViability = validIdeas.reduce((sum, idea) => sum + (idea.viability || 0), 0) / validIdeas.length;
    const avgFeasibility = validIdeas.reduce((sum, idea) => sum + (idea.feasibility || 0), 0) / validIdeas.length;
    const avgDVF = validIdeas.reduce((sum, idea) => sum + (idea.dvfScore || 0), 0) / validIdeas.length;

    // DVF Metrics
    const metrics = [
      { label: "Desejabilidade", value: avgDesirability, color: "22C55E" },
      { label: "Viabilidade", value: avgViability, color: "3B82F6" },
      { label: "Exequibilidade", value: avgFeasibility, color: "8B5CF6" }
    ];

    slide.addText("Métricas Médias do Projeto:", {
      x: 1, y: 2.2, w: 8, h: 0.5,
      fontSize: 16,
      bold: true,
      color: "333333"
    });

    metrics.forEach((metric, index) => {
      const yPos = 2.8 + (index * 0.8);
      
      // Metric label
      slide.addText(metric.label, {
        x: 1, y: yPos, w: 2, h: 0.4,
        fontSize: 14,
        color: "333333"
      });

      // Progress bar background
      slide.addShape("rect", {
        x: 3.5, y: yPos + 0.05, w: 4, h: 0.3,
        fill: { color: "E5E7EB" },
        line: { color: "D1D5DB", width: 1 }
      });

      // Progress bar fill
      slide.addShape("rect", {
        x: 3.5, y: yPos + 0.05, w: (metric.value / 5) * 4, h: 0.3,
        fill: { color: metric.color },
        line: { width: 0 }
      });

      // Score text
      slide.addText(`${metric.value.toFixed(1)}/5`, {
        x: 7.8, y: yPos, w: 1, h: 0.4,
        fontSize: 12,
        bold: true,
        color: metric.color
      });
    });

    // Overall DVF Score
    slide.addText("Pontuação DVF Geral:", {
      x: 1, y: 5.5, w: 3, h: 0.5,
      fontSize: 16,
      bold: true,
      color: "1E40AF"
    });

    slide.addText(`${avgDVF.toFixed(1)}/5`, {
      x: 4, y: 5.5, w: 1.5, h: 0.5,
      fontSize: 24,
      bold: true,
      color: avgDVF >= 3.5 ? "22C55E" : avgDVF >= 2.5 ? "F59E0B" : "EF4444"
    });

    // Industry comparison (mock data for demo)
    slide.addText("vs. Média da Indústria: 3.2/5", {
      x: 6, y: 5.5, w: 2.5, h: 0.5,
      fontSize: 12,
      color: "666666"
    });
  }

  async generateProjectPPTX(projectId: string): Promise<Buffer> {
    try {
      // Fetch all project data
      const project = await storage.getProject(projectId);
      if (!project) {
        throw new Error("Project not found");
      }

      const empathyMaps = await storage.getEmpathyMaps(projectId);
      const personas = await storage.getPersonas(projectId);
      const interviews = await storage.getInterviews(projectId);
      const observations = await storage.getObservations(projectId);
      const povStatements = await storage.getPovStatements(projectId);
      const hmwQuestions = await storage.getHmwQuestions(projectId);
      const ideas = await storage.getIdeas(projectId);
      const prototypes = await storage.getPrototypes(projectId);
      const testPlans = await storage.getTestPlans(projectId);
      const testResults = await storage.getTestResults(projectId);

      // Build presentation
      this.addTitleSlide(project.name, project.description || "");

      // Phase 1: Empathize
      if (empathyMaps.length > 0 || personas.length > 0) {
        this.addPhaseOverviewSlide(1, "Empatizar", "Compreenda profundamente seus usuários através de pesquisas, entrevistas e observações.");
        
        empathyMaps.forEach(empathyMap => {
          this.addEmpathyMapSlide(empathyMap);
        });

        if (personas.length > 0) {
          this.addPersonasSlide(personas);
        }
      }

      // Phase 2: Define
      if (povStatements.length > 0) {
        this.addPhaseOverviewSlide(2, "Definir", "Defina claramente o problema e crie declarações de ponto de vista focadas.");
        
        // Add POV statements slide
        const slide = this.pres.addSlide({ masterName: "DTTools_MASTER" });
        slide.addText("Declarações POV", {
          x: 1, y: 1.2, w: 8, h: 0.8,
          fontSize: 24,
          bold: true,
          color: "1E40AF"
        });

        povStatements.slice(0, 3).forEach((pov, index) => {
          const yPos = 2.2 + (index * 1.5);
          slide.addText(pov.statement, {
            x: 1, y: yPos, w: 8, h: 1,
            fontSize: 12,
            color: "333333"
          });
        });
      }

      // Phase 3: Ideate
      if (ideas.length > 0) {
        this.addPhaseOverviewSlide(3, "Idear", "Gere uma ampla gama de ideias criativas através de brainstorming estruturado.");
        this.addIdeasSlide(ideas);
        this.addDVFAnalysisSlide(ideas);
      }

      // Phase 4: Prototype
      if (prototypes.length > 0) {
        this.addPhaseOverviewSlide(4, "Prototipar", "Construa protótipos rápidos e baratos para testar suas melhores ideias.");
        
        const slide = this.pres.addSlide({ masterName: "DTTools_MASTER" });
        slide.addText("Protótipos Criados", {
          x: 1, y: 1.2, w: 8, h: 0.8,
          fontSize: 24,
          bold: true,
          color: "1E40AF"
        });

        prototypes.slice(0, 3).forEach((prototype, index) => {
          const yPos = 2.2 + (index * 1.2);
          slide.addText(`${prototype.name} (${prototype.type})`, {
            x: 1, y: yPos, w: 8, h: 0.4,
            fontSize: 14,
            bold: true,
            color: "1E40AF"
          });
          
          if (prototype.description) {
            slide.addText(prototype.description.slice(0, 100) + "...", {
              x: 1, y: yPos + 0.4, w: 8, h: 0.6,
              fontSize: 11,
              color: "333333"
            });
          }
        });
      }

      // Phase 5: Test
      if (testPlans.length > 0 || testResults.length > 0) {
        this.addPhaseOverviewSlide(5, "Testar", "Teste seus protótipos com usuários reais e colete feedback valioso.");
        
        if (testResults.length > 0) {
          const slide = this.pres.addSlide({ masterName: "DTTools_MASTER" });
          slide.addText("Resultados dos Testes", {
            x: 1, y: 1.2, w: 8, h: 0.8,
            fontSize: 24,
            bold: true,
            color: "1E40AF"
          });

          testResults.slice(0, 2).forEach((result, index) => {
            const yPos = 2.2 + (index * 2);
            slide.addText(`Teste ID: ${result.participantId}`, {
              x: 1, y: yPos, w: 8, h: 0.4,
              fontSize: 14,
              bold: true,
              color: "1E40AF"
            });

            if (result.insights) {
              slide.addText(result.insights.slice(0, 150) + "...", {
                x: 1, y: yPos + 0.5, w: 8, h: 1,
                fontSize: 11,
                color: "333333"
              });
            }
          });
        }
      }

      // Generate buffer
      const buffer = await this.pres.write({ outputType: "nodebuffer" }) as Buffer;
      return buffer;

    } catch (error) {
      console.error("Error generating PPTX:", error);
      throw new Error("Failed to generate PPTX presentation");
    }
  }
}