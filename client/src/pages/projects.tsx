import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Search, Clock, CheckCircle, BarChart3, Users, Target, Lightbulb, Wrench, TestTube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProjectSchema, type Project, type InsertProject } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";

const phaseIcons = {
  1: { icon: Users, label: "Empatizar", color: "bg-red-100 text-red-700" },
  2: { icon: Target, label: "Definir", color: "bg-orange-100 text-orange-700" },
  3: { icon: Lightbulb, label: "Idear", color: "bg-yellow-100 text-yellow-700" },
  4: { icon: Wrench, label: "Prototipar", color: "bg-blue-100 text-blue-700" },
  5: { icon: TestTube, label: "Testar", color: "bg-green-100 text-green-700" },
};

function ProjectCard({ project }: { project: Project }) {
  const currentPhase = phaseIcons[project.currentPhase as keyof typeof phaseIcons] || phaseIcons[1];
  const Icon = currentPhase.icon;

  return (
    <Link href={`/projects/${project.id}`}>
      <Card 
        className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
        data-testid={`card-project-${project.id}`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-gray-900" data-testid={`text-project-name-${project.id}`}>
                {project.name}
              </CardTitle>
              <CardDescription className="mt-1 text-sm text-gray-600">
                {project.description || "Sem descrição"}
              </CardDescription>
            </div>
            <Badge 
              variant={project.status === "completed" ? "default" : "secondary"}
              className={project.status === "completed" ? "bg-green-100 text-green-800" : ""}
              data-testid={`badge-status-${project.id}`}
            >
              {project.status === "completed" ? "Concluído" : "Em andamento"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Current Phase */}
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-full ${currentPhase.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-gray-700" data-testid={`text-phase-${project.id}`}>
                Fase {project.currentPhase}: {currentPhase.label}
              </span>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progresso</span>
                <span className="font-medium" data-testid={`text-progress-${project.id}`}>
                  {project.completionRate}%
                </span>
              </div>
              <Progress value={project.completionRate || 0} className="h-2" />
            </div>

            {/* Created Date */}
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>
                Criado em {project.createdAt ? new Date(project.createdAt).toLocaleDateString('pt-BR') : 'N/A'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function CreateProjectDialog() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<InsertProject>({
    resolver: zodResolver(insertProjectSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: async (data: InsertProject) => {
      const response = await apiRequest("POST", "/api/projects", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Projeto criado!",
        description: "Seu novo projeto de Design Thinking foi criado com sucesso.",
      });
      setIsOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível criar o projeto. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertProject) => {
    createProjectMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700" data-testid="button-create-project">
          <Plus className="w-4 h-4 mr-2" />
          Novo Projeto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Projeto</DialogTitle>
          <DialogDescription>
            Comece um novo projeto de Design Thinking. Você poderá adicionar ferramentas e acompanhar o progresso através das 5 fases.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Projeto</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: App de Delivery Sustentável" 
                      {...field} 
                      data-testid="input-project-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (opcional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva brevemente o objetivo do seu projeto..."
                      className="resize-none"
                      rows={3}
                      {...field}
                      value={field.value || ""}
                      data-testid="input-project-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                data-testid="button-cancel"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={createProjectMutation.isPending}
                data-testid="button-submit"
              >
                {createProjectMutation.isPending ? "Criando..." : "Criar Projeto"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const activeProjects = projects.filter(p => p.status === "in_progress").length;
  const completedProjects = projects.filter(p => p.status === "completed").length;
  const avgCompletion = projects.length > 0 
    ? Math.round(projects.reduce((sum, p) => sum + (p.completionRate || 0), 0) / projects.length)
    : 0;

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" data-testid="heading-projects">
            Projetos de Design Thinking
          </h1>
          <p className="text-gray-600 mt-1">
            Gerencie seus projetos através das 5 fases do Design Thinking
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/benchmarking">
            <Button variant="outline" className="border-blue-600 text-blue-700 hover:bg-blue-50" data-testid="button-benchmarking">
              <BarChart3 className="w-4 h-4 mr-2" />
              Benchmarking
            </Button>
          </Link>
          <CreateProjectDialog />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-active-projects">{activeProjects}</div>
            <p className="text-xs text-muted-foreground">em andamento</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projetos Concluídos</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-completed-projects">{completedProjects}</div>
            <p className="text-xs text-muted-foreground">finalizados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progresso Médio</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-average-completion">{avgCompletion}%</div>
            <p className="text-xs text-muted-foreground">conclusão média</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar projetos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
          data-testid="input-search-projects"
        />
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Lightbulb className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {projects.length === 0 ? "Nenhum projeto criado" : "Nenhum projeto encontrado"}
          </h3>
          <p className="text-gray-600 mb-6">
            {projects.length === 0 
              ? "Comece criando seu primeiro projeto de Design Thinking"
              : "Tente ajustar sua busca ou criar um novo projeto"
            }
          </p>
          {projects.length === 0 && <CreateProjectDialog />}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}