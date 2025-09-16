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
