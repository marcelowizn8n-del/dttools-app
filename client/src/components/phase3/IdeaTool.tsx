import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Edit2, Trash2, Lightbulb, ThumbsUp, Star, TrendingUp, Tag, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertIdeaSchema, type Idea, type InsertIdea } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import EditIdeaDialog from "./EditIdeaDialog";

interface IdeaToolProps {
  projectId: string;
}

function IdeaCard({ idea, projectId }: { idea: Idea; projectId: string }) {
  const { toast } = useToast();
  const [isVoting, setIsVoting] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const deleteIdeaMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/ideas/${idea.id}`);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "ideas"] });
      toast({
        title: "Ideia excluída",
        description: "A ideia foi removida com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a ideia.",
        variant: "destructive",
      });
    },
  });

  const voteIdeaMutation = useMutation({
    mutationFn: async () => {
      const newVotes = (idea.votes || 0) + 1;
      const response = await apiRequest("PUT", `/api/ideas/${idea.id}`, {
        votes: newVotes
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "ideas"] });
      toast({
        title: "Voto registrado!",
        description: "Seu voto foi contabilizado para esta ideia.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível registrar o voto.",
        variant: "destructive",
      });
    },
  });

  const handleVote = () => {
    setIsVoting(true);
    voteIdeaMutation.mutate();
    setTimeout(() => setIsVoting(false), 1000);
  };

  const statusColors = {
    idea: "bg-gray-100 text-gray-800",
    selected: "bg-blue-100 text-blue-800", 
    prototype: "bg-yellow-100 text-yellow-800",
    tested: "bg-green-100 text-green-800"
  };

  const statusLabels = {
    idea: "Ideia",
    selected: "Selecionada",
    prototype: "Protótipo",
    tested: "Testada"
  };

  return (
    <Card className="w-full" data-testid={`card-idea-${idea.id}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge 
                className={`text-xs ${statusColors[idea.status as keyof typeof statusColors]}`}
                data-testid={`badge-status-${idea.id}`}
              >
                {statusLabels[idea.status as keyof typeof statusLabels]}
              </Badge>
              {idea.category && (
                <Badge variant="outline" className="text-xs" data-testid={`badge-category-${idea.id}`}>
                  <Tag className="w-3 h-3 mr-1" />
                  {idea.category}
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg font-bold mb-2" data-testid={`text-idea-title-${idea.id}`}>
              {idea.title}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600">
              Criada em {idea.createdAt ? new Date(idea.createdAt).toLocaleDateString('pt-BR') : 'N/A'}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleVote}
              disabled={isVoting || voteIdeaMutation.isPending}
              data-testid={`button-vote-${idea.id}`}
            >
              <ThumbsUp className="w-4 h-4 mr-1" />
              {isVoting ? "..." : `+1 (${idea.votes || 0})`}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditDialogOpen(true)}
              data-testid={`button-edit-${idea.id}`}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={deleteIdeaMutation.isPending}
                  data-testid={`button-delete-${idea.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    Excluir Ideia
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir a ideia "{idea.title}"? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel data-testid={`button-cancel-delete-${idea.id}`}>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteIdeaMutation.mutate()}
                    className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                    data-testid={`button-confirm-delete-${idea.id}`}
                  >
                    {deleteIdeaMutation.isPending ? "Excluindo..." : "Excluir"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="font-medium text-sm text-gray-700 mb-2 flex items-center gap-1">
            <Lightbulb className="w-4 h-4 text-purple-600" />
            Descrição
          </h4>
          <p className="text-sm text-gray-700" data-testid={`text-idea-description-${idea.id}`}>
            {idea.description}
          </p>
        </div>

        {/* Feasibility and Impact Ratings */}
        {(idea.feasibility || idea.impact) && (
          <div className="grid grid-cols-2 gap-4">
            {idea.feasibility && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="font-medium text-xs text-gray-700 mb-1">Viabilidade</h4>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= (idea.feasibility || 0) 
                          ? "fill-blue-500 text-blue-500" 
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-xs text-gray-600 ml-1">({idea.feasibility}/5)</span>
                </div>
              </div>
            )}
            {idea.impact && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <h4 className="font-medium text-xs text-gray-700 mb-1">Impacto</h4>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TrendingUp
                      key={star}
                      className={`w-4 h-4 ${
                        star <= (idea.impact || 0) 
                          ? "text-green-500" 
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-xs text-gray-600 ml-1">({idea.impact}/5)</span>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <EditIdeaDialog
        idea={idea}
        projectId={projectId}
        isOpen={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </Card>
  );
}

function CreateIdeaDialog({ projectId }: { projectId: string }) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<Omit<InsertIdea, 'projectId'>>({
    resolver: zodResolver(insertIdeaSchema.omit({ 
      projectId: true,
      votes: true,
    })),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      feasibility: undefined,
      impact: undefined,
      status: "idea",
    },
  });

  const createIdeaMutation = useMutation({
    mutationFn: async (data: InsertIdea) => {
      const response = await apiRequest("POST", `/api/projects/${projectId}/ideas`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "ideas"] });
      toast({
        title: "Ideia criada!",
        description: "Sua ideia foi criada com sucesso.",
      });
      setIsOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível criar a ideia.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: Omit<InsertIdea, 'projectId'>) => {
    const submitData: InsertIdea = {
      ...data,
      projectId: projectId,
      votes: 0,
    };
    createIdeaMutation.mutate(submitData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" data-testid="button-create-idea">
          <Plus className="w-4 h-4 mr-2" />
          Nova Ideia
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Criar Nova Ideia</DialogTitle>
          <DialogDescription>
            Registre uma nova ideia gerada durante o brainstorming. Seja criativo e pense fora da caixa!
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título da Ideia</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: App de carona solidária para universitários"
                      {...field}
                      data-testid="input-idea-title"
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
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva sua ideia em detalhes. Como ela funcionaria? Que problemas resolveria?"
                      className="resize-none"
                      rows={4}
                      {...field}
                      data-testid="input-idea-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria (Opcional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Tecnologia, Sustentabilidade, Social, etc."
                      {...field}
                      value={field.value || ""}
                      data-testid="input-idea-category"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="feasibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Viabilidade (Opcional)</FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger data-testid="select-idea-feasibility">
                          <SelectValue placeholder="Avaliar viabilidade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">1 - Muito difícil</SelectItem>
                        <SelectItem value="2">2 - Difícil</SelectItem>
                        <SelectItem value="3">3 - Moderado</SelectItem>
                        <SelectItem value="4">4 - Fácil</SelectItem>
                        <SelectItem value="5">5 - Muito fácil</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="impact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Impacto (Opcional)</FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger data-testid="select-idea-impact">
                          <SelectValue placeholder="Avaliar impacto" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">1 - Baixo impacto</SelectItem>
                        <SelectItem value="2">2 - Impacto menor</SelectItem>
                        <SelectItem value="3">3 - Impacto moderado</SelectItem>
                        <SelectItem value="4">4 - Alto impacto</SelectItem>
                        <SelectItem value="5">5 - Impacto transformador</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                data-testid="button-cancel-create"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createIdeaMutation.isPending}
                data-testid="button-save-create"
              >
                {createIdeaMutation.isPending ? "Criando..." : "Criar Ideia"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function IdeaTool({ projectId }: IdeaToolProps) {
  const { data: ideas, isLoading, error } = useQuery<Idea[]>({
    queryKey: ["/api/projects", projectId, "ideas"],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Geração de Ideias</h2>
            <p className="text-gray-600">Gere e organize ideias criativas para resolver os problemas identificados</p>
          </div>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Geração de Ideias</h2>
            <p className="text-gray-600">Gere e organize ideias criativas para resolver os problemas identificados</p>
          </div>
        </div>
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao carregar ideias</h3>
          <p className="text-gray-600 mb-6">
            Não foi possível carregar as ideias. Verifique sua conexão e tente novamente.
          </p>
          <Button onClick={() => window.location.reload()} data-testid="button-retry-ideas">
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Geração de Ideias</h2>
          <p className="text-gray-600">
            Gere ideias criativas e inovadoras para resolver os problemas identificados
          </p>
        </div>
        <CreateIdeaDialog projectId={projectId} />
      </div>

      {ideas && ideas.length > 0 ? (
        <div className="grid gap-6">
          {ideas
            .sort((a, b) => (b.votes || 0) - (a.votes || 0)) // Sort by votes descending
            .map((idea: Idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              projectId={projectId}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma ideia cadastrada</h3>
          <p className="text-gray-600 mb-6">
            Comece gerando suas primeiras ideias para resolver os problemas identificados nas fases anteriores.
          </p>
          <CreateIdeaDialog projectId={projectId} />
        </div>
      )}
    </div>
  );
}