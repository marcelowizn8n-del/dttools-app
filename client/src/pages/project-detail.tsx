import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Users, Target, Lightbulb, Wrench, TestTube, Calendar, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { Project } from "@shared/schema";
import Phase1Tools from "@/components/phase1/Phase1Tools";
import Phase2Tools from "@/components/phase2/Phase2Tools";
import Phase3Tools from "@/components/phase3/Phase3Tools";

const phaseData = {
  1: { 
    icon: Users, 
    title: "Empatizar", 
    description: "Entenda profundamente seus usuários",
    color: "bg-red-100 text-red-700 border-red-200",
    tools: ["Mapa de Empatia", "Personas", "Entrevistas", "Observações"]
  },
  2: { 
    icon: Target, 
    title: "Definir", 
    description: "Defina claramente o problema a resolver",
    color: "bg-orange-100 text-orange-700 border-orange-200",
    tools: ["POV Statements", "How Might We", "Problem Statements"]
  },
  3: { 
    icon: Lightbulb, 
    title: "Idear", 
    description: "Gere ideias criativas para soluções",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    tools: ["Brainstorming", "Categorização", "Priorização"]
  },
  4: { 
    icon: Wrench, 
    title: "Prototipar", 
    description: "Construa versões testáveis das suas ideias",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    tools: ["Protótipos Digitais", "Protótipos Físicos", "Storyboards"]
  },
  5: { 
    icon: TestTube, 
    title: "Testar", 
    description: "Valide suas soluções com usuários reais",
    color: "bg-green-100 text-green-700 border-green-200",
    tools: ["Planos de Teste", "Coleta de Feedback", "Análise de Resultados"]
  },
};

function PhaseCard({ phaseNumber, isActive, isCompleted }: { 
  phaseNumber: number; 
  isActive: boolean; 
  isCompleted: boolean; 
}) {
  const phase = phaseData[phaseNumber as keyof typeof phaseData];
  const Icon = phase.icon;

  return (
    <Card 
      className={`transition-all duration-200 ${
        isActive 
          ? `border-2 ${phase.color} shadow-md` 
          : isCompleted 
          ? "border-green-200 bg-green-50" 
          : "border-gray-200 hover:border-gray-300"
      }`}
      data-testid={`card-phase-${phaseNumber}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${
            isActive 
              ? phase.color 
              : isCompleted 
              ? "bg-green-100 text-green-700" 
              : "bg-gray-100 text-gray-500"
          }`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">
              Fase {phaseNumber}: {phase.title}
            </CardTitle>
            <CardDescription className="text-sm">
              {phase.description}
            </CardDescription>
          </div>
          {isCompleted && (
            <Badge className="bg-green-100 text-green-800">Concluída</Badge>
          )}
          {isActive && (
            <Badge className="bg-blue-100 text-blue-800">Atual</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Ferramentas:</h4>
          <div className="flex flex-wrap gap-1">
            {phase.tools.map((tool) => (
              <Badge 
                key={tool} 
                variant="outline" 
                className="text-xs"
                data-testid={`badge-tool-${tool.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {tool}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id;

  const { data: project, isLoading } = useQuery<Project>({
    queryKey: ["/api/projects", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) throw new Error("Project not found");
      return response.json();
    },
    enabled: !!projectId,
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/projects", projectId, "stats"],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}/stats`);
      if (!response.ok) throw new Error("Stats not found");
      return response.json();
    },
    enabled: !!projectId,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Projeto não encontrado</h2>
          <p className="text-gray-600 mb-6">O projeto que você está procurando não existe ou foi removido.</p>
          <Link href="/projects">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar aos Projetos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/projects">
          <Button variant="ghost" size="sm" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900" data-testid="heading-project-name">
            {project.name}
          </h1>
          {project.description && (
            <p className="text-gray-600 mt-1" data-testid="text-project-description">
              {project.description}
            </p>
          )}
        </div>
        <Badge 
          variant={project.status === "completed" ? "default" : "secondary"}
          className={project.status === "completed" ? "bg-green-100 text-green-800" : ""}
          data-testid="badge-project-status"
        >
          {project.status === "completed" ? "Concluído" : "Em andamento"}
        </Badge>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progresso Geral</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2" data-testid="text-completion-rate">
              {project.completionRate}%
            </div>
            <Progress value={project.completionRate || 0} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fase Atual</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-current-phase">
              Fase {project.currentPhase}
            </div>
            <p className="text-xs text-muted-foreground">
              {project.currentPhase ? phaseData[project.currentPhase as keyof typeof phaseData]?.title : 'N/A'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Criado em</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-created-date">
              {project.createdAt ? new Date(project.createdAt).toLocaleDateString('pt-BR') : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats && `${stats.completedTools}/${stats.totalTools} ferramentas`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Design Thinking Phases */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Fases do Design Thinking</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5].map((phaseNumber) => (
            <PhaseCard
              key={phaseNumber}
              phaseNumber={phaseNumber}
              isActive={(project.currentPhase || 1) === phaseNumber}
              isCompleted={(project.currentPhase || 1) > phaseNumber}
            />
          ))}
        </div>
      </div>

      {/* Phase Tools */}
      {project.currentPhase === 1 ? (
        <Phase1Tools projectId={project.id} />
      ) : project.currentPhase === 2 ? (
        <Phase2Tools projectId={project.id} />
      ) : project.currentPhase === 3 ? (
        <Phase3Tools projectId={project.id} />
      ) : (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">🚀 Em Desenvolvimento</CardTitle>
            <CardDescription className="text-blue-700">
              As ferramentas para esta fase estão sendo desenvolvidas. 
              Complete as fases anteriores para desbloquear as próximas fases!
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}