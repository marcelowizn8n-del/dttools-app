import type { AIProjectAnalysis, Project, Persona, PovStatement, Idea, AiGeneratedAsset } from "@shared/schema";

interface ReportData {
  eventName: string;
  weekNumber: number;
  year: number;
  completionRate: number;
  teamEfficiency: number;
  budgetUsage: number;
  teamMembers: Array<{
    name: string;
    efficiency: number;
    tasksCompleted: number;
    tasksAssigned: number;
  }>;
  insights: Array<{
    type: string;
    title: string;
    description: string;
  }>;
}

interface AIAnalysisReportData {
  project: Project;
  analysis: AIProjectAnalysis;
  generatedAt: Date;
}

export async function generatePDFReport(data: ReportData): Promise<string> {
  // Dynamic import to avoid bundle size issues
  const jsPDF = (await import("jspdf")).default;
  
  const doc = new jsPDF();
  
  // Report Header
  doc.setFontSize(20);
  doc.text("Weekly Progress Report", 20, 30);
  
  doc.setFontSize(12);
  doc.text(`Event: ${data.eventName}`, 20, 45);
  doc.text(`Week ${data.weekNumber}, ${data.year}`, 20, 55);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 65);
  
  // Key Metrics
  doc.setFontSize(16);
  doc.text("Key Metrics", 20, 85);
  
  doc.setFontSize(12);
  doc.text(`Completion Rate: ${data.completionRate}%`, 20, 100);
  doc.text(`Team Efficiency: ${data.teamEfficiency}%`, 20, 110);
  doc.text(`Budget Usage: $${data.budgetUsage.toLocaleString()}`, 20, 120);
  
  // Team Performance
  doc.setFontSize(16);
  doc.text("Team Performance", 20, 140);
  
  let yPos = 155;
  data.teamMembers.forEach((member) => {
    doc.setFontSize(12);
    doc.text(`${member.name}: ${member.efficiency}% (${member.tasksCompleted}/${member.tasksAssigned} tasks)`, 20, yPos);
    yPos += 10;
  });
  
  // AI Insights
  doc.setFontSize(16);
  doc.text("AI Insights", 20, yPos + 15);
  
  yPos += 30;
  data.insights.forEach((insight) => {
    doc.setFontSize(12);
    doc.text(`${insight.title}:`, 20, yPos);
    doc.setFontSize(10);
    
    // Wrap text for description
    const splitDescription = doc.splitTextToSize(insight.description, 170);
    doc.text(splitDescription, 20, yPos + 10);
    yPos += 10 + (splitDescription.length * 5) + 10;
  });
  
  // Generate blob URL
  const pdfBlob = doc.output("blob");
  return URL.createObjectURL(pdfBlob);
}

export async function generateCSVReport(data: ReportData): Promise<string> {
  const csvContent = [
    // Headers
    ["Metric", "Value"],
    ["Event Name", data.eventName],
    ["Week", data.weekNumber],
    ["Year", data.year],
    ["Completion Rate", `${data.completionRate}%`],
    ["Team Efficiency", `${data.teamEfficiency}%`],
    ["Budget Usage", `$${data.budgetUsage}`],
    [""],
    ["Team Member", "Efficiency", "Tasks Completed", "Tasks Assigned"],
    ...data.teamMembers.map(member => [
      member.name,
      `${member.efficiency}%`,
      member.tasksCompleted.toString(),
      member.tasksAssigned.toString()
    ]),
    [""],
    ["Insight Type", "Title", "Description"],
    ...data.insights.map(insight => [
      insight.type,
      insight.title,
      insight.description
    ])
  ];
  
  const csvString = csvContent.map(row => 
    row.map(cell => `"${cell}"`).join(",")
  ).join("\n");
  
  const blob = new Blob([csvString], { type: "text/csv" });
  return URL.createObjectURL(blob);
}

export async function generateAIAnalysisPDF(data: AIAnalysisReportData): Promise<string> {
  // Dynamic import to avoid bundle size issues
  const jsPDF = (await import("jspdf")).default;
  
  const doc = new jsPDF();
  const { analysis, project, generatedAt } = data;
  let yPos = 20;

  // Helper function to add new page if needed
  const checkPageBreak = (requiredSpace: number) => {
    if (yPos + requiredSpace > 280) {
      doc.addPage();
      yPos = 20;
    }
  };

  // Helper function to wrap text
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 12) => {
    doc.setFontSize(fontSize);
    const splitText = doc.splitTextToSize(text, maxWidth);
    doc.text(splitText, x, y);
    return splitText.length * (fontSize * 0.4); // Height of text block
  };

  // Logo will be added to all pages in the footer section

  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("Análise Inteligente IA", 20, yPos);
  doc.setFont("helvetica", "normal");
  
  yPos += 15;
  doc.setFontSize(16);
  doc.text(`Projeto: ${project.name}`, 20, yPos);
  
  yPos += 10;
  doc.setFontSize(12);
  doc.text(`Gerado em: ${generatedAt.toLocaleDateString('pt-BR')}`, 20, yPos);
  doc.text(`Fase Atual: ${project.currentPhase}/5`, 120, yPos);

  // Executive Summary
  yPos += 20;
  checkPageBreak(40);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Resumo Executivo", 20, yPos);
  doc.setFont("helvetica", "normal");
  
  yPos += 15;
  const summaryHeight = addWrappedText(analysis.executiveSummary, 20, yPos, 170, 12);
  yPos += summaryHeight + 10;

  // Maturity Score Section
  checkPageBreak(50);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Score de Maturidade", 20, yPos);
  doc.setFont("helvetica", "normal");
  
  yPos += 15;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`Score Geral: ${analysis.maturityScore}/10`, 20, yPos);
  doc.setFont("helvetica", "normal");
  
  yPos += 10;
  doc.setFontSize(12);
  const maturityLabel = analysis.maturityScore >= 8 ? 'Projeto Maduro' : 
                       analysis.maturityScore >= 6 ? 'Projeto Desenvolvido' :
                       analysis.maturityScore >= 4 ? 'Projeto em Desenvolvimento' : 'Projeto Inicial';
  doc.text(`Status: ${maturityLabel}`, 20, yPos);
  
  // Draw maturity score bar
  yPos += 15;
  const barWidth = 150;
  const barHeight = 8;
  const fillWidth = (analysis.maturityScore / 10) * barWidth;
  
  // Bar background
  doc.setFillColor(230, 230, 230);
  doc.rect(20, yPos, barWidth, barHeight, 'F');
  
  // Bar fill
  const color = analysis.maturityScore >= 8 ? [34, 197, 94] : 
                analysis.maturityScore >= 6 ? [234, 179, 8] :
                analysis.maturityScore >= 4 ? [249, 115, 22] : [239, 68, 68];
  doc.setFillColor(color[0], color[1], color[2]);
  doc.rect(20, yPos, fillWidth, barHeight, 'F');
  
  yPos += 20;

  // Consistency and Alignment Metrics
  checkPageBreak(40);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Métricas de Qualidade", 20, yPos);
  doc.setFont("helvetica", "normal");
  
  yPos += 15;
  doc.setFontSize(12);
  doc.text(`Consistência: ${analysis.consistency.score}%`, 20, yPos);
  doc.text(`Alinhamento Problema-Solução: ${analysis.alignment.problemSolutionAlignment}%`, 120, yPos);
  
  yPos += 10;
  doc.text(`Alinhamento Research-Insights: ${analysis.alignment.researchInsightsAlignment}%`, 20, yPos);

  // Phase Analysis
  yPos += 20;
  checkPageBreak(80);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Análise por Fases", 20, yPos);
  doc.setFont("helvetica", "normal");
  
  yPos += 15;
  
  analysis.phaseAnalyses.forEach((phase, index) => {
    checkPageBreak(35);
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Fase ${phase.phase}: ${phase.phaseName}`, 20, yPos);
    doc.setFont("helvetica", "normal");
    
    yPos += 10;
    doc.setFontSize(11);
    doc.text(`Completude: ${phase.completeness}%`, 25, yPos);
    doc.text(`Qualidade: ${phase.quality}%`, 80, yPos);
    
    yPos += 8;
    if (phase.strengths.length > 0) {
      doc.text(`✓ Pontos Fortes: ${phase.strengths[0]}`, 25, yPos);
      yPos += 6;
    }
    
    if (phase.gaps.length > 0) {
      doc.text(`⚠ Gaps: ${phase.gaps[0]}`, 25, yPos);
      yPos += 6;
    }
    
    yPos += 8;
  });

  // Overall Insights
  yPos += 10;
  checkPageBreak(50);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Insights Principais", 20, yPos);
  doc.setFont("helvetica", "normal");
  
  yPos += 15;
  doc.setFontSize(12);
  
  analysis.overallInsights.slice(0, 5).forEach((insight) => {
    checkPageBreak(15);
    doc.text("•", 20, yPos);
    const insightHeight = addWrappedText(insight, 27, yPos, 160, 11);
    yPos += Math.max(8, insightHeight + 3);
  });

  // Attention Points
  yPos += 15;
  checkPageBreak(50);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Pontos de Atenção", 20, yPos);
  doc.setFont("helvetica", "normal");
  
  yPos += 15;
  doc.setFontSize(12);
  
  analysis.attentionPoints.slice(0, 5).forEach((point) => {
    checkPageBreak(15);
    doc.text("⚠", 20, yPos);
    const pointHeight = addWrappedText(point, 27, yPos, 160, 11);
    yPos += Math.max(8, pointHeight + 3);
  });

  // Recommendations
  yPos += 15;
  checkPageBreak(80);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Recomendações Estratégicas", 20, yPos);
  doc.setFont("helvetica", "normal");
  
  yPos += 15;
  
  // Immediate actions
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Ações Imediatas", 20, yPos);
  doc.setFont("helvetica", "normal");
  
  yPos += 10;
  doc.setFontSize(11);
  analysis.recommendations.immediate.slice(0, 3).forEach((rec) => {
    checkPageBreak(12);
    doc.text("•", 22, yPos);
    const recHeight = addWrappedText(rec, 27, yPos, 160, 10);
    yPos += Math.max(7, recHeight + 2);
  });

  yPos += 8;
  checkPageBreak(30);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Curto Prazo", 20, yPos);
  doc.setFont("helvetica", "normal");
  
  yPos += 10;
  doc.setFontSize(11);
  analysis.recommendations.shortTerm.slice(0, 3).forEach((rec) => {
    checkPageBreak(12);
    doc.text("•", 22, yPos);
    const recHeight = addWrappedText(rec, 27, yPos, 160, 10);
    yPos += Math.max(7, recHeight + 2);
  });

  yPos += 8;
  checkPageBreak(30);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Longo Prazo", 20, yPos);
  doc.setFont("helvetica", "normal");
  
  yPos += 10;
  doc.setFontSize(11);
  analysis.recommendations.longTerm.slice(0, 3).forEach((rec) => {
    checkPageBreak(12);
    doc.text("•", 22, yPos);
    const recHeight = addWrappedText(rec, 27, yPos, 160, 10);
    yPos += Math.max(7, recHeight + 2);
  });

  // Priority Next Steps
  yPos += 15;
  checkPageBreak(50);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Próximos Passos Prioritários", 20, yPos);
  doc.setFont("helvetica", "normal");
  
  yPos += 15;
  doc.setFontSize(12);
  
  analysis.priorityNextSteps.slice(0, 5).forEach((step, index) => {
    checkPageBreak(15);
    doc.text(`${index + 1}.`, 20, yPos);
    const stepHeight = addWrappedText(step, 30, yPos, 155, 11);
    yPos += Math.max(10, stepHeight + 3);
  });

  // Add logo and footer to all pages (following DTTools brand template)
  const totalPages = doc.getNumberOfPages();
  
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    
    // HEADER: Logo "Design Thinking Tools" no canto superior esquerdo
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 58, 138); // Azul escuro #1E3A8A para "Design Thinking"
    doc.text("Design Thinking ", 20, 15);
    
    doc.setTextColor(16, 185, 129); // Verde #10B981 para "Tools"
    doc.text("Tools", 72, 15);
    
    // Reset colors
    doc.setTextColor(0, 0, 0); 
    doc.setFont("helvetica", "normal");
    
    // FOOTER: Link para o site (centralizado, azul clicável)
    doc.setFontSize(10);
    doc.setTextColor(37, 99, 235); // Azul link #2563EB
    doc.textWithLink("https://www.designthinkingtools.com", 105, 285, { 
      url: "https://www.designthinkingtools.com",
      align: "center"
    });
    
    // Número da página (cinza, à direita)
    doc.setTextColor(107, 114, 128); // Cinza #6B7280
    doc.text(`Página ${i} de ${totalPages}`, 180, 285);
    
    // Reset colors
    doc.setTextColor(0, 0, 0);
  }

  // Generate blob URL
  const pdfBlob = doc.output("blob");
  return URL.createObjectURL(pdfBlob);
}

interface AIMVPExportData {
  project: Project;
  personas: Persona[];
  povStatements: PovStatement[];
  ideas: Idea[];
  aiAssets: AiGeneratedAsset[];
}

export async function generateAIMVPPDF(data: AIMVPExportData): Promise<string> {
  const jsPDF = (await import("jspdf")).default;
  
  const doc = new jsPDF();
  const { project, personas, povStatements, ideas, aiAssets } = data;
  let yPos = 35; // Start lower to give space for logo header

  // Load logo
  let logoDataUrl: string | null = null;
  try {
    const logoResponse = await fetch('/logo-horizontal.png');
    const logoBlob = await logoResponse.blob();
    logoDataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(logoBlob);
    });
  } catch (error) {
    console.error('Failed to load logo:', error);
  }

  // Helper functions
  const checkPageBreak = (requiredSpace: number) => {
    if (yPos + requiredSpace > 270) { // Reduced from 280 to give more bottom margin
      doc.addPage();
      yPos = 35; // Start lower on new pages to account for header
    }
  };

  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 12) => {
    doc.setFontSize(fontSize);
    const splitText = doc.splitTextToSize(text, maxWidth);
    doc.text(splitText, x, y);
    return splitText.length * (fontSize * 0.4);
  };

  // Parse AI assets
  const logoAsset = aiAssets.find(a => a.assetType === "logo");
  const landingPageAsset = aiAssets.find(a => a.assetType === "landing_page");
  const socialMediaAsset = aiAssets.find(a => a.assetType === "social_media");
  const businessModelAsset = aiAssets.find(a => a.assetType === "business_model");

  const logo = logoAsset ? JSON.parse(logoAsset.content as string) : null;
  const landingPage = landingPageAsset ? JSON.parse(landingPageAsset.content as string) : null;
  const socialMedia = socialMediaAsset ? JSON.parse(socialMediaAsset.content as string) : [];
  const businessModel = businessModelAsset ? JSON.parse(businessModelAsset.content as string) : null;

  // Title Page
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text("MVP Completo", 105, 90, { align: "center" });
  
  yPos = 110;
  doc.setFontSize(18);
  doc.setFont("helvetica", "normal");
  doc.text(project.name, 105, yPos, { align: "center" });
  
  yPos += 25;
  doc.setFontSize(12);
  const descHeight = addWrappedText(project.description || "", 105 - 70, yPos, 140, 12);
  
  yPos += descHeight + 35;
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Gerado 100% por IA em ${new Date().toLocaleDateString('pt-BR')}`, 105, yPos, { align: "center" });
  doc.text("Powered by Google Gemini 2.0 Flash", 105, yPos + 8, { align: "center" });
  doc.setTextColor(0, 0, 0);

  // New page for content
  doc.addPage();
  yPos = 35;

  // Project Overview
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("1. Visão Geral do Projeto", 20, yPos);
  doc.setFont("helvetica", "normal");
  
  yPos += 18;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`Nome: ${project.name}`, 20, yPos);
  doc.setFont("helvetica", "normal");
  
  yPos += 12;
  doc.setFontSize(12);
  const projectDescHeight = addWrappedText(project.description || "", 20, yPos, 170, 12);
  yPos += projectDescHeight + 20;

  // Personas Section
  if (personas.length > 0) {
    checkPageBreak(60);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("2. Personas", 20, yPos);
    doc.setFont("helvetica", "normal");
    
    yPos += 18;
    
    personas.forEach((persona, idx) => {
      checkPageBreak(55);
      
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(`  ${idx + 1}. ${persona.name}`, 20, yPos);
      doc.setFont("helvetica", "normal");
      
      yPos += 12;
      doc.setFontSize(11);
      doc.text(`     Idade: ${persona.age || 'N/A'}  |  Ocupação: ${persona.occupation || 'N/A'}`, 20, yPos);
      
      yPos += 10;
      if (persona.goals) {
        doc.setFont("helvetica", "bold");
        doc.text("     Objetivos: ", 20, yPos);
        doc.setFont("helvetica", "normal");
        const goalsHeight = addWrappedText(String(persona.goals), 20, yPos + 5, 160, 10);
        yPos += goalsHeight + 10;
      }
      
      if (persona.frustrations) {
        doc.setFont("helvetica", "bold");
        doc.text("     Frustrações: ", 20, yPos);
        doc.setFont("helvetica", "normal");
        const frustHeight = addWrappedText(String(persona.frustrations), 20, yPos + 5, 160, 10);
        yPos += frustHeight + 10;
      }
      
      yPos += 10;
    });
  }

  // POV Statements
  if (povStatements.length > 0) {
    yPos += 15;
    checkPageBreak(60);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("3. Pontos de Vista (POV)", 20, yPos);
    doc.setFont("helvetica", "normal");
    
    yPos += 18;
    
    povStatements.forEach((pov, idx) => {
      checkPageBreak(35);
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`  POV ${idx + 1}:`, 20, yPos);
      doc.setFont("helvetica", "normal");
      
      yPos += 10;
      doc.setFontSize(11);
      const povHeight = addWrappedText(pov.statement, 25, yPos, 165, 11);
      yPos += povHeight + 15;
    });
  }

  // Ideas
  if (ideas.length > 0) {
    yPos += 15;
    checkPageBreak(60);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("4. Ideias Geradas", 20, yPos);
    doc.setFont("helvetica", "normal");
    
    yPos += 18;
    
    ideas.forEach((idea, idx) => {
      checkPageBreak(35);
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`  ${idx + 1}. ${idea.title}`, 20, yPos);
      doc.setFont("helvetica", "normal");
      
      yPos += 10;
      doc.setFontSize(11);
      const ideaHeight = addWrappedText(idea.description || "", 25, yPos, 165, 10);
      yPos += ideaHeight + 15;
    });
  }

  // Landing Page
  if (landingPage) {
    doc.addPage();
    yPos = 35;
    
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("5. Landing Page", 20, yPos);
    doc.setFont("helvetica", "normal");
    
    yPos += 18;
    
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
    
    if (landingPage.features && landingPage.features.length > 0) {
      checkPageBreak(40);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Recursos Principais:", 20, yPos);
      doc.setFont("helvetica", "normal");
      yPos += 10;
      
      landingPage.features.forEach((feature: any) => {
        checkPageBreak(15);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(`• ${feature.title}`, 25, yPos);
        doc.setFont("helvetica", "normal");
        yPos += 7;
        const featDescHeight = addWrappedText(feature.description, 30, yPos, 160, 10);
        yPos += featDescHeight + 5;
      });
    }
    
    if (landingPage.cta) {
      yPos += 10;
      checkPageBreak(20);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`Call-to-Action: ${landingPage.cta}`, 20, yPos);
      doc.setFont("helvetica", "normal");
      yPos += 10;
    }
  }

  // Social Media Strategy
  if (socialMedia && socialMedia.length > 0) {
    doc.addPage();
    yPos = 35;
    
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("6. Estratégia de Redes Sociais", 20, yPos);
    doc.setFont("helvetica", "normal");
    
    yPos += 18;
    
    socialMedia.forEach((post: any, idx: number) => {
      checkPageBreak(35);
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`Post ${idx + 1} - ${post.platform}`, 25, yPos);
      doc.setFont("helvetica", "normal");
      
      yPos += 8;
      doc.setFontSize(11);
      const postHeight = addWrappedText(post.content, 30, yPos, 160, 10);
      yPos += postHeight + 5;
      
      if (post.hashtags && post.hashtags.length > 0) {
        doc.setTextColor(59, 130, 246);
        doc.text(post.hashtags.join(' '), 30, yPos);
        doc.setTextColor(0, 0, 0);
        yPos += 8;
      }
      
      yPos += 5;
    });
  }

  // Business Model Canvas
  if (businessModel) {
    doc.addPage();
    yPos = 35;
    
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("7. Modelo de Negócio", 20, yPos);
    doc.setFont("helvetica", "normal");
    
    yPos += 18;
    
    const sections = [
      { title: "Proposta de Valor", key: "valueProposition" },
      { title: "Segmentos de Clientes", key: "customerSegments" },
      { title: "Canais", key: "channels" },
      { title: "Relacionamento com Clientes", key: "customerRelationships" },
      { title: "Fontes de Receita", key: "revenueStreams" },
      { title: "Estrutura de Custos", key: "costStructure" },
      { title: "Recursos Chave", key: "keyResources" },
      { title: "Atividades Chave", key: "keyActivities" },
      { title: "Parcerias Chave", key: "keyPartnerships" }
    ];
    
    sections.forEach(section => {
      const content = businessModel[section.key];
      if (content && (Array.isArray(content) ? content.length > 0 : content)) {
        checkPageBreak(35);
        
        doc.setFontSize(13);
        doc.setFont("helvetica", "bold");
        doc.text(section.title, 20, yPos);
        doc.setFont("helvetica", "normal");
        yPos += 12;
        
        doc.setFontSize(11);
        if (Array.isArray(content)) {
          content.forEach((item: string) => {
            checkPageBreak(12);
            const itemHeight = addWrappedText(`• ${item}`, 25, yPos, 165, 10);
            yPos += itemHeight + 5;
          });
        } else {
          const contentHeight = addWrappedText(content, 25, yPos, 165, 10);
          yPos += contentHeight + 8;
        }
        
        yPos += 10;
      }
    });
  }

  // Add header and footer to all pages
  const totalPages = doc.getNumberOfPages();
  
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    
    // Add logo to top-left on all pages
    if (logoDataUrl) {
      try {
        doc.addImage(logoDataUrl, 'PNG', 15, 8, 60, 12); // x, y, width, height
      } catch (error) {
        console.error('Failed to add logo to PDF:', error);
        // Fallback to text if logo fails
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 58, 138);
        doc.text("Design Thinking ", 15, 15);
        doc.setTextColor(16, 185, 129);
        doc.text("Tools", 60, 15);
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");
      }
    } else {
      // Fallback to text if logo not loaded
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 58, 138);
      doc.text("Design Thinking ", 15, 15);
      doc.setTextColor(16, 185, 129);
      doc.text("Tools", 60, 15);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
    }
    
    // Footer with link and page number
    doc.setFontSize(9);
    doc.setTextColor(37, 99, 235);
    doc.textWithLink("www.designthinkingtools.com", 105, 285, { 
      url: "https://www.designthinkingtools.com",
      align: "center"
    });
    
    doc.setTextColor(107, 114, 128);
    doc.text(`Página ${i} de ${totalPages}`, 175, 285);
    doc.setTextColor(0, 0, 0);
  }

  const pdfBlob = doc.output("blob");
  return URL.createObjectURL(pdfBlob);
}
