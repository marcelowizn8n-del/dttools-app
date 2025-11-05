import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Sparkles, Loader2, CheckCircle2, Circle, Download } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface DoubleDiamondProject {
  id: string;
  name: string;
  description?: string;
  currentPhase: string;
  completionPercentage: number;
  discoverStatus: string;
  defineStatus: string;
  developStatus: string;
  deliverStatus: string;
  discoverPainPoints?: any;
  discoverInsights?: any;
  discoverUserNeeds?: any;
  discoverEmpathyMap?: any;
  definePovStatements?: any;
  defineHmwQuestions?: any;
  defineSelectedPov?: string;
  defineSelectedHmw?: string;
  developIdeas?: any;
  developCrossPollinatedIdeas?: any;
  developSelectedIdeas?: any;
  deliverMvpConcept?: any;
  deliverLogoSuggestions?: any;
  deliverLandingPage?: any;
  deliverSocialMediaLines?: any;
  deliverTestPlan?: any;
  dfvDesirabilityScore?: number;
  dfvFeasibilityScore?: number;
  dfvViabilityScore?: number;
  dfvAnalysis?: any;
  dfvFeedback?: string;
}

export default function DoubleDiamondProject() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string | null>(null);

  // Fetch project
  const { data: project, isLoading, isError, error } = useQuery<DoubleDiamondProject>({
    queryKey: ["/api/double-diamond", id],
    enabled: !!id
  });

  // Set initial active tab based on project's current phase
  if (project && activeTab === null) {
    setActiveTab(project.currentPhase || "discover");
  }

  // Generate Discover Phase
  const generateDiscoverMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/double-diamond/${id}/generate/discover`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/double-diamond", id] });
      toast({
        title: "✨ Fase Discover gerada!",
        description: "Pain points, insights e empathy map criados com sucesso."
      });
      setActiveTab("define");
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao gerar Discover",
        description: error.message || "Tente novamente",
        variant: "destructive"
      });
    }
  });

  // Generate Define Phase
  const generateDefineMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/double-diamond/${id}/generate/define`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/double-diamond", id] });
      toast({
        title: "✨ Fase Define gerada!",
        description: "POV Statements e HMW Questions criados com sucesso."
      });
      setActiveTab("develop");
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao gerar Define",
        description: error.message || "Tente novamente",
        variant: "destructive"
      });
    }
  });

  // Generate Develop Phase
  const generateDevelopMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/double-diamond/${id}/generate/develop`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/double-diamond", id] });
      toast({
        title: "✨ Fase Develop gerada!",
        description: "Ideias e soluções criativas geradas com sucesso."
      });
      setActiveTab("deliver");
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao gerar Develop",
        description: error.message || "Tente novamente",
        variant: "destructive"
      });
    }
  });

  // Generate Deliver Phase
  const generateDeliverMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/double-diamond/${id}/generate/deliver`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/double-diamond", id] });
      toast({
        title: "✨ Fase Deliver gerada!",
        description: "MVP, logo, landing page e plano de testes criados!"
      });
      setActiveTab("dfv");
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao gerar Deliver",
        description: error.message || "Tente novamente",
        variant: "destructive"
      });
    }
  });

  // Generate DFV Analysis
  const generateDFVMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/double-diamond/${id}/generate/dfv`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/double-diamond", id] });
      toast({
        title: "✨ Análise DFV concluída!",
        description: "Desirability, Feasibility e Viability analisados."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao gerar análise DFV",
        description: error.message || "Tente novamente",
        variant: "destructive"
      });
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Erro ao carregar projeto</CardTitle>
            <CardDescription>
              {(error as any)?.message || "Ocorreu um erro ao carregar o projeto. Tente novamente."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/double-diamond", id] })}>
              Tentar Novamente
            </Button>
            <Button variant="outline" onClick={() => setLocation("/double-diamond")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Projeto não encontrado</CardTitle>
            <CardDescription>O projeto Double Diamond que você procura não existe.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation("/double-diamond")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getPhaseIcon = (status: string) => {
    if (status === "completed") return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    if (status === "in_progress") return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
    return <Circle className="h-5 w-5 text-gray-400" />;
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => setLocation("/double-diamond")} className="mb-4" data-testid="button-back">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Projetos
        </Button>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2" data-testid="text-project-name">{project.name}</h1>
            {project.description && (
              <p className="text-muted-foreground mb-4">{project.description}</p>
            )}

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Progresso Geral</span>
                <span className="text-muted-foreground">{project.completionPercentage}%</span>
              </div>
              <Progress value={project.completionPercentage} className="h-2" />
            </div>
          </div>

          <div className="ml-6">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Fase Atual: {project.currentPhase === "discover" ? "Discover" : 
                          project.currentPhase === "define" ? "Define" :
                          project.currentPhase === "develop" ? "Develop" : 
                          project.currentPhase === "deliver" ? "Deliver" : "DFV Analysis"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Phase Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className={activeTab === "discover" ? "border-blue-500" : ""}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">1. Discover</CardTitle>
              {getPhaseIcon(project.discoverStatus)}
            </div>
          </CardHeader>
        </Card>

        <Card className={activeTab === "define" ? "border-blue-500" : ""}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">2. Define</CardTitle>
              {getPhaseIcon(project.defineStatus)}
            </div>
          </CardHeader>
        </Card>

        <Card className={activeTab === "develop" ? "border-blue-500" : ""}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">3. Develop</CardTitle>
              {getPhaseIcon(project.developStatus)}
            </div>
          </CardHeader>
        </Card>

        <Card className={activeTab === "deliver" ? "border-blue-500" : ""}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">4. Deliver</CardTitle>
              {getPhaseIcon(project.deliverStatus)}
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab || "discover"} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="discover" data-testid="tab-discover">Discover</TabsTrigger>
          <TabsTrigger value="define" data-testid="tab-define">Define</TabsTrigger>
          <TabsTrigger value="develop" data-testid="tab-develop">Develop</TabsTrigger>
          <TabsTrigger value="deliver" data-testid="tab-deliver">Deliver</TabsTrigger>
          <TabsTrigger value="dfv" data-testid="tab-dfv">DFV Analysis</TabsTrigger>
        </TabsList>

        {/* DISCOVER TAB */}
        <TabsContent value="discover">
          <Card>
            <CardHeader>
              <CardTitle>Fase 1: Discover (Divergência)</CardTitle>
              <CardDescription>
                Explore amplamente o problema, identifique pain points e gere insights profundos sobre o usuário
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {project.discoverStatus === "pending" ? (
                <div className="text-center py-8">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                  <h3 className="text-lg font-semibold mb-2">Pronto para descobrir!</h3>
                  <p className="text-muted-foreground mb-6">
                    A IA irá gerar automaticamente pain points, insights, user needs e um empathy map completo
                  </p>
                  <Button 
                    onClick={() => generateDiscoverMutation.mutate()}
                    disabled={generateDiscoverMutation.isPending}
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-purple-600"
                    data-testid="button-generate-discover"
                  >
                    {generateDiscoverMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Gerando com IA...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Gerar Fase Discover com IA
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Pain Points */}
                  {project.discoverPainPoints && (
                    <div>
                      <h4 className="font-semibold mb-3">Pain Points Identificados</h4>
                      <div className="grid gap-2">
                        {(project.discoverPainPoints as any[]).map((item: any, idx: number) => (
                          <div key={idx} className="p-3 border rounded-lg bg-red-50 dark:bg-red-950/20">
                            <div className="flex items-start justify-between">
                              <p className="flex-1">{item.text}</p>
                              <Badge variant="outline" className="ml-2">{item.category}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Insights */}
                  {project.discoverInsights && (
                    <div>
                      <h4 className="font-semibold mb-3">Insights Gerados</h4>
                      <div className="grid gap-2">
                        {(project.discoverInsights as any[]).map((item: any, idx: number) => (
                          <div key={idx} className="p-3 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                            <p>{item.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* User Needs */}
                  {project.discoverUserNeeds && (
                    <div>
                      <h4 className="font-semibold mb-3">Necessidades do Usuário</h4>
                      <div className="grid gap-2">
                        {(project.discoverUserNeeds as any[]).map((item: any, idx: number) => (
                          <div key={idx} className="p-3 border rounded-lg bg-green-50 dark:bg-green-950/20">
                            <p>{item.need}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* DEFINE TAB */}
        <TabsContent value="define">
          <Card>
            <CardHeader>
              <CardTitle>Fase 2: Define (Convergência)</CardTitle>
              <CardDescription>
                Sintetize os insights em POV Statements e transforme em How Might We questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {project.defineStatus === "pending" ? (
                <div className="text-center py-8">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 text-purple-500" />
                  <h3 className="text-lg font-semibold mb-2">Defina o problema</h3>
                  <p className="text-muted-foreground mb-6">
                    A IA criará POV Statements e How Might We questions baseados nos insights da fase Discover
                  </p>
                  <Button 
                    onClick={() => generateDefineMutation.mutate()}
                    disabled={generateDefineMutation.isPending || project.discoverStatus !== "completed"}
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-pink-600"
                    data-testid="button-generate-define"
                  >
                    {generateDefineMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Gerando com IA...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Gerar Fase Define com IA
                      </>
                    )}
                  </Button>
                  {project.discoverStatus !== "completed" && (
                    <p className="text-sm text-muted-foreground mt-4">
                      Complete a fase Discover primeiro
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* POV Statements */}
                  {project.definePovStatements && (
                    <div>
                      <h4 className="font-semibold mb-3">POV Statements</h4>
                      <div className="grid gap-3">
                        {(project.definePovStatements as any[]).map((item: any, idx: number) => (
                          <div key={idx} className="p-4 border rounded-lg hover:border-purple-500 cursor-pointer transition-colors">
                            <p className="font-medium">{item.user} precisa {item.need}</p>
                            <p className="text-sm text-muted-foreground mt-1">Insight: {item.insight}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* HMW Questions */}
                  {project.defineHmwQuestions && (
                    <div>
                      <h4 className="font-semibold mb-3">How Might We Questions</h4>
                      <div className="grid gap-2">
                        {(project.defineHmwQuestions as any[]).map((item: any, idx: number) => (
                          <div key={idx} className="p-3 border rounded-lg bg-purple-50 dark:bg-purple-950/20">
                            <p>{item.question}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* DEVELOP TAB */}
        <TabsContent value="develop">
          <Card>
            <CardHeader>
              <CardTitle>Fase 3: Develop (Divergência)</CardTitle>
              <CardDescription>
                Gere múltiplas ideias criativas e soluções inovadoras
              </CardDescription>
            </CardHeader>
            <CardContent>
              {project.developStatus === "pending" ? (
                <div className="text-center py-8">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 text-orange-500" />
                  <h3 className="text-lg font-semibold mb-2">Hora de idear!</h3>
                  <p className="text-muted-foreground mb-6">
                    A IA gerará 20+ ideias criativas e soluções cross-pollinadas
                  </p>
                  <Button 
                    onClick={() => generateDevelopMutation.mutate()}
                    disabled={generateDevelopMutation.isPending || project.defineStatus !== "completed"}
                    size="lg"
                    className="bg-gradient-to-r from-orange-500 to-red-600"
                    data-testid="button-generate-develop"
                  >
                    {generateDevelopMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Gerando com IA...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Gerar Fase Develop com IA
                      </>
                    )}
                  </Button>
                  {project.defineStatus !== "completed" && (
                    <p className="text-sm text-muted-foreground mt-4">
                      Complete a fase Define primeiro
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {project.developIdeas && (
                    <div>
                      <h4 className="font-semibold mb-3">Ideias Geradas</h4>
                      <div className="grid gap-3">
                        {(project.developIdeas as any[]).map((item: any, idx: number) => (
                          <div key={idx} className="p-4 border rounded-lg">
                            <h5 className="font-medium mb-1">{item.title}</h5>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="outline">{item.category}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* DELIVER TAB */}
        <TabsContent value="deliver">
          <Card>
            <CardHeader>
              <CardTitle>Fase 4: Deliver (Convergência)</CardTitle>
              <CardDescription>
                Transforme ideias em MVP concreto com logo, landing page e plano de testes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {project.deliverStatus === "pending" ? (
                <div className="text-center py-8">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <h3 className="text-lg font-semibold mb-2">Entregue o MVP!</h3>
                  <p className="text-muted-foreground mb-6">
                    A IA criará o conceito completo do MVP, sugestões de logo, landing page e plano de testes
                  </p>
                  <Button 
                    onClick={() => generateDeliverMutation.mutate()}
                    disabled={generateDeliverMutation.isPending || project.developStatus !== "completed"}
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-teal-600"
                    data-testid="button-generate-deliver"
                  >
                    {generateDeliverMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Gerando com IA...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Gerar Fase Deliver com IA
                      </>
                    )}
                  </Button>
                  {project.developStatus !== "completed" && (
                    <p className="text-sm text-muted-foreground mt-4">
                      Complete a fase Develop primeiro
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {project.deliverMvpConcept && (
                    <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                      <h4 className="font-semibold mb-2">MVP Concept</h4>
                      <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(project.deliverMvpConcept, null, 2)}</pre>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* DFV ANALYSIS TAB */}
        <TabsContent value="dfv">
          <Card>
            <CardHeader>
              <CardTitle>Análise DFV (Desirability, Feasibility, Viability)</CardTitle>
              <CardDescription>
                Avalie seu projeto nas três dimensões críticas de sucesso
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!project.dfvDesirabilityScore ? (
                <div className="text-center py-8">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 text-indigo-500" />
                  <h3 className="text-lg font-semibold mb-2">Análise Estratégica</h3>
                  <p className="text-muted-foreground mb-6">
                    A IA analisará seu projeto em Desejabilidade, Viabilidade e Exequibilidade
                  </p>
                  <Button 
                    onClick={() => generateDFVMutation.mutate()}
                    disabled={generateDFVMutation.isPending || project.deliverStatus !== "completed"}
                    size="lg"
                    className="bg-gradient-to-r from-indigo-500 to-purple-600"
                    data-testid="button-generate-dfv"
                  >
                    {generateDFVMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Analisando...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Gerar Análise DFV
                      </>
                    )}
                  </Button>
                  {project.deliverStatus !== "completed" && (
                    <p className="text-sm text-muted-foreground mt-4">
                      Complete a fase Deliver primeiro
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Desirability</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-blue-600">{project.dfvDesirabilityScore}/100</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Feasibility</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-green-600">{project.dfvFeasibilityScore}/100</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Viability</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-purple-600">{project.dfvViabilityScore}/100</div>
                      </CardContent>
                    </Card>
                  </div>

                  {project.dfvFeedback && (
                    <div className="p-4 border rounded-lg bg-muted">
                      <h4 className="font-semibold mb-2">Recomendações</h4>
                      <p className="text-sm whitespace-pre-wrap">{project.dfvFeedback}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
