import { jsPDF } from "jspdf";
import type { DoubleDiamondProject } from "../shared/schema";

export async function generateDoubleDiamondPDF(project: DoubleDiamondProject): Promise<Buffer> {
  const doc = new jsPDF();
  let yPos = 20;

  const checkPageBreak = (requiredSpace: number) => {
    if (yPos + requiredSpace > 270) {
      doc.addPage();
      yPos = 35;
    }
  };

  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 12) => {
    doc.setFontSize(fontSize);
    const splitText = doc.splitTextToSize(text, maxWidth);
    doc.text(splitText, x, y);
    return splitText.length * (fontSize * 0.4);
  };

  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text("Double Diamond Framework", 105, 80, { align: "center" });
  
  yPos = 100;
  doc.setFontSize(18);
  doc.setFont("helvetica", "normal");
  doc.text(project.name, 105, yPos, { align: "center" });
  
  yPos += 20;
  doc.setFontSize(12);
  if (project.description) {
    const descHeight = addWrappedText(project.description, 105 - 70, yPos, 140, 12);
    yPos += descHeight + 20;
  }
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Gerado em ${new Date().toLocaleDateString('pt-BR')}`, 105, yPos, { align: "center" });
  doc.text("100% Automatizado com Google Gemini 2.0 Flash", 105, yPos + 8, { align: "center" });
  doc.setTextColor(0, 0, 0);

  doc.addPage();
  yPos = 35;

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("1. Descobrir (Discover)", 20, yPos);
  doc.setFont("helvetica", "normal");
  
  yPos += 15;
  
  if (project.discoverPainPoints && (project.discoverPainPoints as any).length > 0) {
    checkPageBreak(40);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Pain Points", 20, yPos);
    doc.setFont("helvetica", "normal");
    yPos += 10;
    
    (project.discoverPainPoints as any).forEach((pain: any, idx: number) => {
      checkPageBreak(15);
      doc.setFontSize(11);
      doc.text(`${idx + 1}.`, 20, yPos);
      // Handle both string and object formats
      const painText = typeof pain === 'string' ? pain : (pain.text || pain);
      const painHeight = addWrappedText(painText, 30, yPos, 160, 11);
      yPos += Math.max(8, painHeight + 3);
    });
    yPos += 10;
  }

  if (project.discoverInsights && (project.discoverInsights as any).length > 0) {
    checkPageBreak(40);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Insights", 20, yPos);
    doc.setFont("helvetica", "normal");
    yPos += 10;
    
    (project.discoverInsights as any).forEach((insight: any, idx: number) => {
      checkPageBreak(15);
      doc.setFontSize(11);
      doc.text(`${idx + 1}.`, 20, yPos);
      // Handle both string and object formats
      const insightText = typeof insight === 'string' ? insight : (insight.text || insight);
      const insightHeight = addWrappedText(insightText, 30, yPos, 160, 11);
      yPos += Math.max(8, insightHeight + 3);
    });
    yPos += 10;
  }

  if (project.discoverUserNeeds && (project.discoverUserNeeds as any).length > 0) {
    checkPageBreak(40);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Necessidades do Usuário", 20, yPos);
    doc.setFont("helvetica", "normal");
    yPos += 10;
    
    (project.discoverUserNeeds as any).forEach((need: any, idx: number) => {
      checkPageBreak(15);
      doc.setFontSize(11);
      doc.text(`${idx + 1}.`, 20, yPos);
      // Handle both string and object formats
      const needText = typeof need === 'string' ? need : (need.need || need);
      const needHeight = addWrappedText(needText, 30, yPos, 160, 11);
      yPos += Math.max(8, needHeight + 3);
    });
  }

  doc.addPage();
  yPos = 35;

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("2. Definir (Define)", 20, yPos);
  doc.setFont("helvetica", "normal");
  
  yPos += 15;

  if (project.definePovStatements && (project.definePovStatements as any).length > 0) {
    checkPageBreak(40);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("POV Statements", 20, yPos);
    doc.setFont("helvetica", "normal");
    yPos += 10;
    
    (project.definePovStatements as any).forEach((pov: any, idx: number) => {
      checkPageBreak(25);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`POV ${idx + 1}:`, 20, yPos);
      doc.setFont("helvetica", "normal");
      yPos += 8;
      
      doc.setFontSize(11);
      const povHeight = addWrappedText(pov.fullStatement || pov, 25, yPos, 165, 11);
      yPos += povHeight + 10;
    });
    yPos += 10;
  }

  if (project.defineHmwQuestions && (project.defineHmwQuestions as any).length > 0) {
    checkPageBreak(40);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("How Might We Questions", 20, yPos);
    doc.setFont("helvetica", "normal");
    yPos += 10;
    
    (project.defineHmwQuestions as any).forEach((hmw: any, idx: number) => {
      checkPageBreak(15);
      doc.setFontSize(11);
      doc.text(`${idx + 1}.`, 20, yPos);
      const hmwText = hmw.question || hmw;
      const hmwHeight = addWrappedText(hmwText, 30, yPos, 160, 11);
      yPos += Math.max(8, hmwHeight + 3);
    });
  }

  doc.addPage();
  yPos = 35;

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("3. Desenvolver (Develop)", 20, yPos);
  doc.setFont("helvetica", "normal");
  
  yPos += 15;

  if (project.developIdeas && (project.developIdeas as any).length > 0) {
    checkPageBreak(40);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Ideias Geradas", 20, yPos);
    doc.setFont("helvetica", "normal");
    yPos += 10;
    
    (project.developIdeas as any).forEach((idea: any, idx: number) => {
      checkPageBreak(30);
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`${idx + 1}. ${idea.title || idea}`, 20, yPos);
      doc.setFont("helvetica", "normal");
      
      yPos += 8;
      
      if (idea.description) {
        doc.setFontSize(11);
        const ideaHeight = addWrappedText(idea.description, 25, yPos, 165, 10);
        yPos += ideaHeight + 5;
      }
      
      if (idea.category) {
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(`Categoria: ${idea.category}`, 25, yPos);
        doc.setTextColor(0, 0, 0);
        yPos += 6;
      }
      
      yPos += 8;
    });
  }

  doc.addPage();
  yPos = 35;

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("4. Entregar (Deliver)", 20, yPos);
  doc.setFont("helvetica", "normal");
  
  yPos += 15;

  if (project.deliverMvpConcept) {
    checkPageBreak(40);
    const mvpConcept = project.deliverMvpConcept as any;
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Conceito do MVP", 20, yPos);
    doc.setFont("helvetica", "normal");
    yPos += 10;
    
    if (mvpConcept.name) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(mvpConcept.name, 20, yPos);
      doc.setFont("helvetica", "normal");
      yPos += 10;
    }
    
    if (mvpConcept.description) {
      doc.setFontSize(11);
      const descHeight = addWrappedText(mvpConcept.description, 20, yPos, 170, 11);
      yPos += descHeight + 15;
    }
    
    if (mvpConcept.coreFeatures && mvpConcept.coreFeatures.length > 0) {
      checkPageBreak(30);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Recursos Principais:", 20, yPos);
      doc.setFont("helvetica", "normal");
      yPos += 8;
      
      mvpConcept.coreFeatures.forEach((feature: string) => {
        checkPageBreak(10);
        doc.setFontSize(10);
        doc.text("•", 25, yPos);
        const featureHeight = addWrappedText(feature, 32, yPos, 160, 10);
        yPos += Math.max(7, featureHeight + 2);
      });
      yPos += 10;
    }
  }

  if (project.deliverLogoSuggestions && (project.deliverLogoSuggestions as any).length > 0) {
    checkPageBreak(50);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Sugestões de Logo", 20, yPos);
    doc.setFont("helvetica", "normal");
    yPos += 10;
    
    (project.deliverLogoSuggestions as any).forEach((logo: any, idx: number) => {
      checkPageBreak(25);
      
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(`Opção ${idx + 1}:`, 20, yPos);
      doc.setFont("helvetica", "normal");
      yPos += 7;
      
      if (logo.concept) {
        const logoHeight = addWrappedText(logo.concept, 25, yPos, 165, 10);
        yPos += logoHeight + 3;
      }
      
      if (logo.colors) {
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(`Cores: ${logo.colors}`, 25, yPos);
        doc.setTextColor(0, 0, 0);
        yPos += 6;
      }
      
      yPos += 8;
    });
  }

  if (project.deliverLandingPage) {
    doc.addPage();
    yPos = 35;
    
    const landingPage = project.deliverLandingPage as any;
    
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Landing Page", 20, yPos);
    doc.setFont("helvetica", "normal");
    yPos += 15;
    
    if (landingPage.headline) {
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      const headlineHeight = addWrappedText(landingPage.headline, 20, yPos, 170, 14);
      doc.setFont("helvetica", "normal");
      yPos += headlineHeight + 10;
    }
    
    if (landingPage.subheadline) {
      doc.setFontSize(12);
      const subHeight = addWrappedText(landingPage.subheadline, 20, yPos, 170, 12);
      yPos += subHeight + 15;
    }
    
    if (landingPage.sections && landingPage.sections.length > 0) {
      landingPage.sections.forEach((section: any) => {
        checkPageBreak(25);
        
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(section.title, 20, yPos);
        doc.setFont("helvetica", "normal");
        yPos += 8;
        
        doc.setFontSize(10);
        const sectionHeight = addWrappedText(section.content, 25, yPos, 165, 10);
        yPos += sectionHeight + 10;
      });
    }
  }

  doc.addPage();
  yPos = 35;

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("5. Análise DFV", 20, yPos);
  doc.setFont("helvetica", "normal");
  
  yPos += 15;

  // Mostrar scores principais primeiro (se existirem)
  if (project.dfvDesirabilityScore !== null && project.dfvDesirabilityScore !== undefined ||
      project.dfvFeasibilityScore !== null && project.dfvFeasibilityScore !== undefined ||
      project.dfvViabilityScore !== null && project.dfvViabilityScore !== undefined) {
    
    checkPageBreak(50);
    
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Pontuações DFV", 20, yPos);
    doc.setFont("helvetica", "normal");
    yPos += 15;
    
    // Desirability Score
    if (project.dfvDesirabilityScore !== null && project.dfvDesirabilityScore !== undefined) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Desirability (Desejabilidade):", 20, yPos);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(18);
      doc.setTextColor(30, 58, 138); // Azul
      doc.text(`${project.dfvDesirabilityScore}/100`, 120, yPos);
      doc.setTextColor(0, 0, 0);
      yPos += 20;
    }
    
    // Feasibility Score
    if (project.dfvFeasibilityScore !== null && project.dfvFeasibilityScore !== undefined) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Feasibility (Viabilidade Técnica):", 20, yPos);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(18);
      doc.setTextColor(16, 185, 129); // Verde
      doc.text(`${project.dfvFeasibilityScore}/100`, 120, yPos);
      doc.setTextColor(0, 0, 0);
      yPos += 20;
    }
    
    // Viability Score
    if (project.dfvViabilityScore !== null && project.dfvViabilityScore !== undefined) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Viability (Viabilidade de Negócio):", 20, yPos);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(18);
      doc.setTextColor(139, 92, 246); // Roxo
      doc.text(`${project.dfvViabilityScore}/100`, 120, yPos);
      doc.setTextColor(0, 0, 0);
      yPos += 25;
    }
  }

  // Análise detalhada (se existir)
  if (project.dfvAnalysis) {
    const dfvData = project.dfvAnalysis as any;
    
    if (dfvData.desirability) {
      checkPageBreak(40);
      
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Análise de Desirability", 20, yPos);
      doc.setFont("helvetica", "normal");
      yPos += 10;
      
      if (dfvData.desirability.analysis) {
        doc.setFontSize(11);
        const dfvHeight = addWrappedText(dfvData.desirability.analysis, 20, yPos, 170, 11);
        yPos += dfvHeight + 15;
      }
    }

    if (dfvData.feasibility) {
      checkPageBreak(40);
      
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Análise de Feasibility", 20, yPos);
      doc.setFont("helvetica", "normal");
      yPos += 10;
      
      if (dfvData.feasibility.analysis) {
        doc.setFontSize(11);
        const feasHeight = addWrappedText(dfvData.feasibility.analysis, 20, yPos, 170, 11);
        yPos += feasHeight + 15;
      }
    }

    if (dfvData.viability) {
      checkPageBreak(40);
      
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Análise de Viability", 20, yPos);
      doc.setFont("helvetica", "normal");
      yPos += 10;
      
      if (dfvData.viability.analysis) {
        doc.setFontSize(11);
        const viabHeight = addWrappedText(dfvData.viability.analysis, 20, yPos, 170, 11);
        yPos += viabHeight + 15;
      }
    }
  }

  // Recomendações (se existir)
  if (project.dfvFeedback) {
    checkPageBreak(40);
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Recomendações", 20, yPos);
    doc.setFont("helvetica", "normal");
    yPos += 10;
    
    doc.setFontSize(11);
    const feedbackHeight = addWrappedText(project.dfvFeedback, 20, yPos, 170, 11);
    yPos += feedbackHeight + 15;
  }

  const totalPages = doc.getNumberOfPages();
  
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 58, 138);
    doc.text("Design Thinking ", 20, 15);
    
    doc.setTextColor(16, 185, 129);
    doc.text("Tools", 72, 15);
    
    doc.setTextColor(0, 0, 0); 
    doc.setFont("helvetica", "normal");
    
    doc.setFontSize(10);
    doc.setTextColor(37, 99, 235);
    doc.textWithLink("https://www.designthinkingtools.com", 105, 285, { 
      url: "https://www.designthinkingtools.com",
      align: "center"
    });
    
    doc.setTextColor(107, 114, 128);
    doc.text(`Página ${i} de ${totalPages}`, 180, 285);
    
    doc.setTextColor(0, 0, 0);
  }

  return Buffer.from(doc.output("arraybuffer"));
}
