import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Edit2, Trash2, Target, User, Lightbulb, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPovStatementSchema, type PovStatement, type InsertPovStatement } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import EditPovStatementDialog from "./EditPovStatementDialog";
import { ContextualTooltip } from "@/components/ui/contextual-tooltip";

interface PovStatementToolProps {
  projectId: string;
}

function PovStatementCard({ povStatement, projectId }: { povStatement: PovStatement; projectId: string }) {
  const { toast } = useToast();
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const deletePovStatementMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/pov-statements/${povStatement.id}`);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "pov-statements"] });
      toast({
        title: "POV Statement excluído",
        description: "O POV Statement foi removido com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o POV Statement.",
        variant: "destructive",
      });
    },
  });

  const priorityColors = {
    low: "bg-gray-100 text-gray-800",
    medium: "bg-blue-100 text-blue-800", 
    high: "bg-red-100 text-red-800"
  };

  const priorityLabels = {
    low: "Baixa",
    medium: "Média",
    high: "Alta"
  };

  return (
    <Card className="w-full" data-testid={`card-pov-statement-${povStatement.id}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge 
                className={`text-xs ${priorityColors[povStatement.priority as keyof typeof priorityColors]}`}
                data-testid={`badge-priority-${povStatement.id}`}
              >
                Prioridade: {priorityLabels[povStatement.priority as keyof typeof priorityLabels]}
              </Badge>
            </div>
            <CardDescription className="text-sm text-gray-600">
              Criado em {povStatement.createdAt ? new Date(povStatement.createdAt).toLocaleDateString('pt-BR') : 'N/A'}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditDialogOpen(true)}
              data-testid={`button-edit-${povStatement.id}`}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => deletePovStatementMutation.mutate()}
              disabled={deletePovStatementMutation.isPending}
              data-testid={`button-delete-${povStatement.id}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Components of POV Statement */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* User */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-sm text-gray-700 mb-2 flex items-center gap-1">
              <User className="w-4 h-4 text-blue-600" />
              Usuário
            </h4>
            <p className="text-sm text-gray-700" data-testid={`text-pov-user-${povStatement.id}`}>
              {povStatement.user}
            </p>
          </div>

          {/* Need */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-sm text-gray-700 mb-2 flex items-center gap-1">
              <Target className="w-4 h-4 text-green-600" />
              Necessidade
            </h4>
            <p className="text-sm text-gray-700" data-testid={`text-pov-need-${povStatement.id}`}>
              {povStatement.need}
            </p>
          </div>

          {/* Insight */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-sm text-gray-700 mb-2 flex items-center gap-1">
              <Lightbulb className="w-4 h-4 text-yellow-600" />
              Insight
            </h4>
            <p className="text-sm text-gray-700" data-testid={`text-pov-insight-${povStatement.id}`}>
              {povStatement.insight}
            </p>
          </div>
        </div>

        {/* Complete POV Statement */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="font-medium text-sm text-gray-700 mb-2 flex items-center gap-1">
            <Zap className="w-4 h-4 text-purple-600" />
            POV Statement Completo
          </h4>
          <p className="text-sm text-gray-700 font-medium" data-testid={`text-pov-statement-${povStatement.id}`}>
            {povStatement.statement}
          </p>
        </div>
      </CardContent>
      
      <EditPovStatementDialog
        povStatement={povStatement}
        projectId={projectId}
        isOpen={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </Card>
  );
}

function CreatePovStatementDialog({ projectId }: { projectId: string }) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<Omit<InsertPovStatement, 'projectId'>>({
    resolver: zodResolver(insertPovStatementSchema.omit({ projectId: true })),
    defaultValues: {
      user: "",
      need: "",
      insight: "",
      statement: "",
      priority: "medium",
    },
  });

  const createPovStatementMutation = useMutation({
    mutationFn: async (data: InsertPovStatement) => {
      const response = await apiRequest("POST", `/api/projects/${projectId}/pov-statements`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "pov-statements"] });
      toast({
        title: "POV Statement criado!",
        description: "Seu POV Statement foi criado com sucesso.",
      });
      setIsOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível criar o POV Statement.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: Omit<InsertPovStatement, 'projectId'>) => {
    const submitData: InsertPovStatement = {
      ...data,
      projectId: projectId
    };
    createPovStatementMutation.mutate(submitData);
  };

  // Generate the complete POV statement when user types
  const watchedValues = form.watch();
  const autoStatement = watchedValues.user && watchedValues.need && watchedValues.insight
    ? `${watchedValues.user} precisa ${watchedValues.need} porque ${watchedValues.insight}.`
    : "";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" data-testid="button-create-pov-statement">
          <Plus className="w-4 h-4 mr-2" />
          Novo POV Statement
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar POV Statement</DialogTitle>
          <DialogDescription>
            Um POV (Point of View) Statement define claramente quem é o usuário, qual é sua necessidade e por que ela existe.
          </DialogDescription>
        </DialogHeader>

        {/* Dicas de Boas Práticas */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-sm text-green-900 mb-2">💡 Fórmula do POV Statement:</h4>
          <p className="text-xs text-green-800 font-mono bg-white px-3 py-2 rounded border border-green-300">
            [Usuário] <strong>precisa</strong> [Necessidade] <strong>porque</strong> [Insight]
          </p>
          <ul className="text-xs text-green-800 space-y-1 mt-2">
            <li>• <strong>Usuário:</strong> Seja específico (idade, contexto, características relevantes)</li>
            <li>• <strong>Necessidade:</strong> Foque na necessidade real, não na solução desejada</li>
            <li>• <strong>Insight:</strong> Descubra o "porquê" surpreendente que explica a necessidade</li>
          </ul>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="user"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel>Usuário (Quem?)</FormLabel>
                    <ContextualTooltip
                      title="Usuário"
                      content="Descreva quem é o usuário de forma específica. Inclua características demográficas, comportamentais ou contextuais relevantes."
                      examples={[
                        "Uma médica de 42 anos que trabalha em hospital público",
                        "Estudante universitário de 20 anos que mora sozinho",
                        "Empreendedor iniciante sem experiência em tecnologia"
                      ]}
                    />
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: Uma mãe ocupada de 35 anos que trabalha em tempo integral..."
                      className="resize-none"
                      rows={2}
                      {...field}
                      data-testid="input-pov-user"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="need"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel>Necessidade (O que?)</FormLabel>
                    <ContextualTooltip
                      title="Necessidade"
                      content="Descreva o que o usuário precisa alcançar ou realizar. Foque na necessidade, não em uma solução específica."
                      examples={[
                        "de uma forma rápida e confiável de agendar consultas",
                        "de organizar suas finanças sem conhecimento técnico",
                        "de aprender novos conceitos de forma prática e visual"
                      ]}
                    />
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: de economizar tempo nas tarefas domésticas sem comprometer a qualidade..."
                      className="resize-none"
                      rows={2}
                      {...field}
                      data-testid="input-pov-need"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="insight"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel>Insight (Por que?)</FormLabel>
                    <ContextualTooltip
                      title="Insight"
                      content="Explique POR QUE essa necessidade existe. Revele uma verdade surpreendente sobre o comportamento ou motivação do usuário."
                      examples={[
                        "ela se sente culpada quando não consegue cuidar da família",
                        "ele tem medo de parecer incompetente na frente dos colegas",
                        "ela já tentou outras soluções mas todas eram muito complexas"
                      ]}
                    />
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: ela valoriza mais ter tempo com a família do que uma casa perfeitamente limpa..."
                      className="resize-none"
                      rows={2}
                      {...field}
                      data-testid="input-pov-insight"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Auto-generated statement preview */}
            {autoStatement && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-medium text-sm text-gray-700 mb-2">Preview do POV Statement:</h4>
                <p className="text-sm text-purple-800 italic">{autoStatement}</p>
              </div>
            )}

            <FormField
              control={form.control}
              name="statement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>POV Statement Completo</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="O POV Statement completo será gerado automaticamente, mas você pode personalizá-lo..."
                      className="resize-none"
                      rows={3}
                      {...field}
                      value={field.value || autoStatement}
                      data-testid="input-pov-statement"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prioridade</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger data-testid="select-pov-priority">
                        <SelectValue placeholder="Selecione a prioridade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Baixa</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
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
                disabled={createPovStatementMutation.isPending}
                data-testid="button-submit"
              >
                {createPovStatementMutation.isPending ? "Criando..." : "Criar POV Statement"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function PovStatementTool({ projectId }: PovStatementToolProps) {
  const { data: povStatements, isLoading } = useQuery<PovStatement[]>({
    queryKey: ["/api/projects", projectId, "pov-statements"],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">POV Statements</h2>
            <p className="text-gray-600">Defina pontos de vista claros sobre seus usuários e suas necessidades</p>
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">POV Statements</h2>
          <p className="text-gray-600">
            Defina pontos de vista claros sobre seus usuários e suas necessidades
          </p>
        </div>
        <CreatePovStatementDialog projectId={projectId} />
      </div>

      {povStatements && povStatements.length > 0 ? (
        <div className="grid gap-6">
          {povStatements.map((povStatement: PovStatement) => (
            <PovStatementCard
              key={povStatement.id}
              povStatement={povStatement}
              projectId={projectId}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum POV Statement</h3>
          <p className="text-gray-600 mb-6">
            Comece criando seu primeiro POV Statement para definir claramente o ponto de vista sobre seus usuários.
          </p>
          <CreatePovStatementDialog projectId={projectId} />
        </div>
      )}
    </div>
  );
}