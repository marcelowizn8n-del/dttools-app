import { useState } from "react";
import { Link } from "wouter";
import { 
  ArrowLeft, 
  BarChart3, 
  Target, 
  TrendingUp, 
  Award, 
  Building, 
  Users, 
  Lightbulb,
  FileText,
  Plus,
  Edit,
  Trash2,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Benchmark } from "@shared/schema";

const industries = [
  { value: "tech", label: "Tecnologia" },
  { value: "healthcare", label: "Saúde" },
  { value: "finance", label: "Finanças" },
  { value: "retail", label: "Varejo" },
  { value: "education", label: "Educação" },
  { value: "manufacturing", label: "Manufatura" },
  { value: "consulting", label: "Consultoria" },
  { value: "other", label: "Outros" }
];

const companySizes = [
  { value: "startup", label: "Startup (1-10)" },
  { value: "small", label: "Pequena (11-50)" },
  { value: "medium", label: "Média (51-200)" },
  { value: "large", label: "Grande (201-1000)" },
  { value: "enterprise", label: "Enterprise (1000+)" }
];

const phases = [
  { id: 1, name: "Empatizar", icon: Users, color: "#E53E3E" },
  { id: 2, name: "Definir", icon: Target, color: "#DD6B20" },
  { id: 3, name: "Idear", icon: Lightbulb, color: "#D69E2E" },
  { id: 4, name: "Prototipar", icon: Building, color: "#3182CE" },
  { id: 5, name: "Testar", icon: BarChart3, color: "#38A169" }
];

export default function BenchmarkingPage() {
  const { toast } = useToast();
  const [selectedProject, setSelectedProject] = useState<string>("sample-project");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBenchmark, setNewBenchmark] = useState({
    name: "",
    description: "",
    industry: "tech",
    companySize: "medium",
    benchmarkType: "industry"
  });

  // Fetch benchmarks for selected project
  const { data: benchmarks = [], isLoading } = useQuery({
    queryKey: ['/api/benchmarks', selectedProject],
    enabled: !!selectedProject
  });

  // Create benchmark mutation
  const createBenchmarkMutation = useMutation({
    mutationFn: (data: any) => apiRequest(`/api/benchmarks`, "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/benchmarks'] });
      setShowCreateForm(false);
      setNewBenchmark({
        name: "",
        description: "",
        industry: "tech",
        companySize: "medium",
        benchmarkType: "industry"
      });
      toast({
        title: "Sucesso!",
        description: "Benchmark criado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao criar benchmark.",
        variant: "destructive",
      });
    },
  });

  const handleCreateBenchmark = () => {
    createBenchmarkMutation.mutate({
      ...newBenchmark,
      projectId: selectedProject,
      maturityScores: {
        empatizar: 3,
        definir: 3,
        idear: 3,
        prototipar: 3,
        testar: 3
      },
      targetScores: {
        empatizar: 5,
        definir: 5,
        idear: 5,
        prototipar: 5,
        testar: 5
      },
      improvementAreas: [],
      recommendations: []
    });
  };

  // Sample industry benchmarks data
  const industryBenchmarks = {
    tech: { empatizar: 4.2, definir: 3.8, idear: 4.5, prototipar: 4.1, testar: 3.9 },
    healthcare: { empatizar: 4.0, definir: 4.2, idear: 3.5, prototipar: 3.8, testar: 4.3 },
    finance: { empatizar: 3.5, definir: 4.0, idear: 3.2, prototipar: 3.5, testar: 4.1 },
    retail: { empatizar: 4.1, definir: 3.7, idear: 4.0, prototipar: 3.9, testar: 3.8 }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/projects">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Projetos
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Benchmarking</h1>
          <p className="text-gray-600">
            Compare sua maturidade em Design Thinking com benchmarks da indústria
          </p>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score Global</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">3.8/5.0</div>
            <p className="text-xs text-muted-foreground">
              +0.3 vs. último benchmark
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Posição Indústria</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Top 25%</div>
            <p className="text-xs text-muted-foreground">
              Acima da média do setor
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Áreas de Melhoria</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">2</div>
            <p className="text-xs text-muted-foreground">
              Fases com potencial
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progressão</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">+15%</div>
            <p className="text-xs text-muted-foreground">
              Crescimento em 6 meses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Phases Performance Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Performance por Fase
          </CardTitle>
          <CardDescription>
            Compare seu desempenho atual com benchmarks da indústria de tecnologia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {phases.map((phase) => {
              const currentScore = 3.8; // Sample score
              const industryAverage = industryBenchmarks.tech[phase.name.toLowerCase() as keyof typeof industryBenchmarks.tech] || 4.0;
              const Icon = phase.icon;
              
              return (
                <div key={phase.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${phase.color}20`, color: phase.color }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{phase.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-600">
                        Atual: <strong>{currentScore}/5</strong>
                      </span>
                      <span className="text-gray-600">
                        Indústria: <strong>{industryAverage}/5</strong>
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="flex-1">
                      <Progress 
                        value={(currentScore / 5) * 100} 
                        className="h-3" 
                        style={{ 
                          '--progress-background': phase.color 
                        } as React.CSSProperties}
                      />
                    </div>
                    <div className="w-20 text-right">
                      <Badge 
                        variant={currentScore >= industryAverage ? "default" : "secondary"}
                        className={currentScore >= industryAverage ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}
                      >
                        {currentScore >= industryAverage ? "Acima" : "Abaixo"}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Benchmarks List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Seus Benchmarks</CardTitle>
              <CardDescription>
                Gerencie e compare diferentes benchmarks de maturidade
              </CardDescription>
            </div>
            <Button onClick={() => setShowCreateForm(true)} data-testid="button-create-benchmark">
              <Plus className="h-4 w-4 mr-2" />
              Criar Benchmark
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Carregando benchmarks...</p>
            </div>
          ) : benchmarks.length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum benchmark criado</h3>
              <p className="text-gray-600 mb-4">
                Crie seu primeiro benchmark para começar a comparar sua maturidade
              </p>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Benchmark
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benchmarks.map((benchmark: Benchmark) => (
                <Card key={benchmark.id} className="border-2 hover:border-blue-200 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{benchmark.name}</CardTitle>
                        <CardDescription>{benchmark.description}</CardDescription>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Indústria:</span>
                        <Badge variant="outline">
                          {industries.find(i => i.value === benchmark.industry)?.label}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Empresa:</span>
                        <Badge variant="outline">
                          {companySizes.find(s => s.value === benchmark.companySize)?.label}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tipo:</span>
                        <Badge>
                          {benchmark.benchmarkType === "industry" ? "Indústria" : "Personalizado"}
                        </Badge>
                      </div>
                      <div className="pt-2">
                        <Button className="w-full" variant="outline">
                          <FileText className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Benchmark Form */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg mx-4">
            <CardHeader>
              <CardTitle>Criar Novo Benchmark</CardTitle>
              <CardDescription>
                Configure um novo benchmark para comparar sua maturidade em Design Thinking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nome do Benchmark</label>
                <input
                  type="text"
                  value={newBenchmark.name}
                  onChange={(e) => setNewBenchmark({...newBenchmark, name: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  placeholder="Ex: Benchmark Q4 2024"
                  data-testid="input-benchmark-name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Descrição</label>
                <textarea
                  value={newBenchmark.description}
                  onChange={(e) => setNewBenchmark({...newBenchmark, description: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  rows={3}
                  placeholder="Descreva o objetivo deste benchmark..."
                  data-testid="input-benchmark-description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Indústria</label>
                  <select
                    value={newBenchmark.industry}
                    onChange={(e) => setNewBenchmark({...newBenchmark, industry: e.target.value})}
                    className="w-full p-2 border rounded-md"
                    data-testid="select-benchmark-industry"
                  >
                    {industries.map(industry => (
                      <option key={industry.value} value={industry.value}>
                        {industry.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tamanho da Empresa</label>
                  <select
                    value={newBenchmark.companySize}
                    onChange={(e) => setNewBenchmark({...newBenchmark, companySize: e.target.value})}
                    className="w-full p-2 border rounded-md"
                    data-testid="select-benchmark-company-size"
                  >
                    {companySizes.map(size => (
                      <option key={size.value} value={size.value}>
                        {size.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleCreateBenchmark}
                  disabled={!newBenchmark.name || createBenchmarkMutation.isPending}
                  className="flex-1"
                  data-testid="button-save-benchmark"
                >
                  {createBenchmarkMutation.isPending ? "Criando..." : "Criar Benchmark"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1"
                  data-testid="button-cancel-benchmark"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}