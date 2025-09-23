import type { AIProjectAnalysis, Project } from "@shared/schema";

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
  doc.setFont(undefined, "bold");
  doc.text("Análise Inteligente IA", 20, yPos);
  doc.setFont(undefined, "normal");
  
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
  doc.setFont(undefined, "bold");
  doc.text("Resumo Executivo", 20, yPos);
  doc.setFont(undefined, "normal");
  
  yPos += 15;
  const summaryHeight = addWrappedText(analysis.executiveSummary, 20, yPos, 170, 12);
  yPos += summaryHeight + 10;

  // Maturity Score Section
  checkPageBreak(50);
  doc.setFontSize(18);
  doc.setFont(undefined, "bold");
  doc.text("Score de Maturidade", 20, yPos);
  doc.setFont(undefined, "normal");
  
  yPos += 15;
  doc.setFontSize(14);
  doc.setFont(undefined, "bold");
  doc.text(`Score Geral: ${analysis.maturityScore}/10`, 20, yPos);
  doc.setFont(undefined, "normal");
  
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
  doc.setFont(undefined, "bold");
  doc.text("Métricas de Qualidade", 20, yPos);
  doc.setFont(undefined, "normal");
  
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
  doc.setFont(undefined, "bold");
  doc.text("Análise por Fases", 20, yPos);
  doc.setFont(undefined, "normal");
  
  yPos += 15;
  
  analysis.phaseAnalyses.forEach((phase, index) => {
    checkPageBreak(35);
    
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text(`Fase ${phase.phase}: ${phase.phaseName}`, 20, yPos);
    doc.setFont(undefined, "normal");
    
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
  doc.setFont(undefined, "bold");
  doc.text("Insights Principais", 20, yPos);
  doc.setFont(undefined, "normal");
  
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
  doc.setFont(undefined, "bold");
  doc.text("Pontos de Atenção", 20, yPos);
  doc.setFont(undefined, "normal");
  
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
  doc.setFont(undefined, "bold");
  doc.text("Recomendações Estratégicas", 20, yPos);
  doc.setFont(undefined, "normal");
  
  yPos += 15;
  
  // Immediate actions
  doc.setFontSize(14);
  doc.setFont(undefined, "bold");
  doc.text("Ações Imediatas", 20, yPos);
  doc.setFont(undefined, "normal");
  
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
  doc.setFont(undefined, "bold");
  doc.text("Curto Prazo", 20, yPos);
  doc.setFont(undefined, "normal");
  
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
  doc.setFont(undefined, "bold");
  doc.text("Longo Prazo", 20, yPos);
  doc.setFont(undefined, "normal");
  
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
  doc.setFont(undefined, "bold");
  doc.text("Próximos Passos Prioritários", 20, yPos);
  doc.setFont(undefined, "normal");
  
  yPos += 15;
  doc.setFontSize(12);
  
  analysis.priorityNextSteps.slice(0, 5).forEach((step, index) => {
    checkPageBreak(15);
    doc.text(`${index + 1}.`, 20, yPos);
    const stepHeight = addWrappedText(step, 30, yPos, 155, 11);
    yPos += Math.max(10, stepHeight + 3);
  });

  // Footer with logo on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    
    // Add DTTools logo text to each page
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.setTextColor(40, 116, 240); // DTTools blue color
    doc.text("DTTools", 160, 25);
    doc.setTextColor(0, 0, 0); // Reset to black
    doc.setFont(undefined, "normal");
    
    // Footer text
    doc.setFontSize(10);
    doc.text(`Página ${i} de ${totalPages}`, 170, 290);
    doc.text("Gerado por DT Tools - Análise IA", 20, 290);
  }

  // Generate blob URL
  const pdfBlob = doc.output("blob");
  return URL.createObjectURL(pdfBlob);
}
