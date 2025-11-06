import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Sparkles, TrendingUp, CheckCircle2, Circle } from "lucide-react";
import { DoubleDiamondWizard } from "@/components/double-diamond/DoubleDiamondWizard";

interface DoubleDiamondProject {
  id: string;
  name: string;
  description: string | null;
  currentPhase: string;
  completionPercentage: number;
  isCompleted: boolean;
  createdAt: Date;
}

export default function DoubleDiamond() {
  const [showWizard, setShowWizard] = useState(false);

  const { data: projects = [], isLoading } = useQuery<DoubleDiamondProject[]>({
    queryKey: ["/api/double-diamond"],
  });

  const getPhaseLabel = (phase: string) => {
    const phases: Record<string, string> = {
      discover: "Descobrir",
      define: "Definir",
      develop: "Desenvolver",
      deliver: "Entregar"
    };
    return phases[phase] || phase;
  };

  const getPhaseColor = (phase: string) => {
    const colors: Record<string, string> = {
      discover: "bg-blue-500",
      define: "bg-purple-500",
      develop: "bg-orange-500",
      deliver: "bg-green-500"
    };
    return colors[phase] || "bg-gray-500";
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Double Diamond</h1>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground">
          Metodologia completa de Design Thinking com automação 100% IA. 
          Input mínimo → Output máximo.
        </p>
      </div>

      {/* CTA criar novo projeto */}
      <Dialog open={showWizard} onOpenChange={setShowWizard}>
        <DialogTrigger asChild>
          <Card className="mb-6 sm:mb-8 cursor-pointer hover:shadow-lg transition-shadow border-2 border-dashed border-primary/50 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
            <CardContent className="p-4 sm:p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className="p-2 sm:p-3 md:p-4 bg-primary rounded-full flex-shrink-0">
                <Plus className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold mb-1.5 sm:mb-2 leading-tight">Criar Novo Projeto Double Diamond</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Preencha 5 campos e a IA gera todo o resto: pain points, POVs, ideias, MVP completo e análise DFV
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm sm:text-base flex-shrink-0 w-full sm:w-auto justify-center">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="font-medium">IA Automática</span>
              </div>
            </CardContent>
          </Card>
        </DialogTrigger>

        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl">Criar Projeto Double Diamond</DialogTitle>
          </DialogHeader>
          <DoubleDiamondWizard onComplete={() => setShowWizard(false)} />
        </DialogContent>
      </Dialog>

      {/* Lista de projetos */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-32 bg-muted" />
            </Card>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-muted rounded-full">
              <TrendingUp className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">Nenhum projeto criado ainda</h3>
            <p className="text-muted-foreground max-w-md">
              Crie seu primeiro projeto Double Diamond e deixe a IA guiar você pelas 4 fases do Design Thinking
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card 
              key={project.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => window.location.href = `/double-diamond/${project.id}`}
              data-testid={`card-double-diamond-${project.id}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="mb-2">{project.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {project.description || "Sem descrição"}
                    </CardDescription>
                  </div>
                  {project.isCompleted && (
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {/* Progresso */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2 text-sm">
                    <span className="text-muted-foreground">Progresso</span>
                    <span className="font-medium">{project.completionPercentage}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all"
                      style={{ width: `${project.completionPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Fase atual */}
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${getPhaseColor(project.currentPhase)}`} />
                  <span className="text-sm text-muted-foreground">
                    Fase: <span className="font-medium text-foreground">{getPhaseLabel(project.currentPhase)}</span>
                  </span>
                </div>

                {/* Indicador de fases */}
                <div className="flex gap-2 mt-4">
                  {["discover", "define", "develop", "deliver"].map((phase, index) => {
                    const isCompleted = ["discover", "define", "develop", "deliver"].indexOf(project.currentPhase) > index;
                    const isCurrent = project.currentPhase === phase;
                    
                    return (
                      <div 
                        key={phase}
                        className={`flex-1 h-1 rounded-full ${
                          isCompleted ? getPhaseColor(phase) : 
                          isCurrent ? `${getPhaseColor(phase)} opacity-50` : 
                          "bg-muted"
                        }`}
                      />
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
