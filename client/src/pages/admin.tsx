import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Eye, Search, Filter, Users, BarChart3, FolderOpen, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth, ProtectedRoute } from "@/contexts/AuthContext";
import { apiRequest, queryClient } from "@/lib/queryClient";
import ArticleEditor from "@/components/admin/ArticleEditor";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";
import type { Article, User, Project, InsertUser } from "@shared/schema";

function ArticlesTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  const deleteArticleMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest(`/api/articles/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete article");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({
        title: "Artigo deletado",
        description: "O artigo foi removido com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao deletar artigo",
        description: "Ocorreu um erro ao tentar deletar o artigo.",
        variant: "destructive",
      });
    },
  });

  const categories = [
    { id: "all", label: "Todas as categorias" },
    { id: "empathize", label: "Empatizar" },
    { id: "define", label: "Definir" },
    { id: "ideate", label: "Idear" },
    { id: "prototype", label: "Prototipar" },
    { id: "test", label: "Testar" },
  ];

  const getCategoryLabel = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.label || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      empathize: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      define: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300", 
      ideate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      prototype: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      test: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };
    return colors[category] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || article.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(date));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold" data-testid="articles-title">
            Gerenciar Artigos
          </h2>
          <p className="text-muted-foreground">
            Crie, edite e gerencie os artigos da biblioteca
          </p>
        </div>
        <Button onClick={() => {
          setEditingArticle(null); // Limpa qualquer artigo em edição
          setIsCreating(true);
        }} data-testid="button-create-article">
          <Plus className="mr-2 h-4 w-4" />
          Novo Artigo
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar artigos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="input-search-articles"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48" data-testid="select-category-filter">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Articles Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/5" />
                  <Skeleton className="h-8 w-24" />
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Autor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArticles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <p className="text-muted-foreground" data-testid="no-articles-message">
                        {searchTerm || categoryFilter !== "all" 
                          ? "Nenhum artigo encontrado com os filtros aplicados."
                          : "Nenhum artigo encontrado. Crie o primeiro artigo!"
                        }
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredArticles.map((article) => (
                    <TableRow key={article.id} data-testid={`row-article-${article.id}`}>
                      <TableCell className="font-medium max-w-xs">
                        <div className="truncate" title={article.title}>
                          {article.title}
                        </div>
                        {article.description && (
                          <div className="text-sm text-muted-foreground truncate" title={article.description}>
                            {article.description}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(article.category)}>
                          {getCategoryLabel(article.category)}
                        </Badge>
                      </TableCell>
                      <TableCell>{article.author}</TableCell>
                      <TableCell>{formatDate(article.createdAt)}</TableCell>
                      <TableCell>
                        <Badge variant={article.published ? "default" : "secondary"}>
                          {article.published ? "Publicado" : "Rascunho"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`/library/article/${article.id}`, '_blank')}
                            data-testid={`button-view-${article.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingArticle(article)}
                            data-testid={`button-edit-${article.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                data-testid={`button-delete-${article.id}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Deletar artigo</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja deletar o artigo "{article.title}"? 
                                  Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteArticleMutation.mutate(article.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Deletar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Article Editor Dialog */}
      <ArticleEditor
        article={editingArticle}
        isOpen={!!editingArticle || isCreating}
        onClose={() => {
          setEditingArticle(null);
          setIsCreating(false);
        }}
      />
    </div>
  );
}

// Enhanced User Form Schema
const userFormSchema = insertUserSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

function UsersTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isCreating, setIsCreating] = useState(false);
  const [editingUser, setEditingUser] = useState<Omit<User, 'password'> | null>(null);
  const { toast } = useToast();

  const { data: users = [], isLoading } = useQuery<Omit<User, 'password'>[]>({
    queryKey: ["/api/users"],
  });

  const createUserMutation = useMutation({
    mutationFn: async (userData: z.infer<typeof userFormSchema>) => {
      const { confirmPassword, ...userDataWithoutConfirm } = userData;
      const response = await apiRequest("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userDataWithoutConfirm),
      });
      if (!response.ok) {
        throw new Error("Failed to create user");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setIsCreating(false);
      toast({
        title: "Usuário criado",
        description: "O usuário foi criado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao criar usuário",
        description: "Ocorreu um erro ao tentar criar o usuário.",
        variant: "destructive",
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      const response = await apiRequest(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!response.ok) {
        throw new Error("Failed to update user");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Usuário atualizado",
        description: "O papel do usuário foi atualizado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar usuário",
        description: "Ocorreu um erro ao tentar atualizar o usuário.",
        variant: "destructive",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest(`/api/users/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Usuário excluído",
        description: "O usuário foi removido com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao excluir usuário",
        description: "Ocorreu um erro ao tentar excluir o usuário.",
        variant: "destructive",
      });
    },
  });

  const toggleUserRole = (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    updateUserMutation.mutate({ id: userId, role: newRole });
  };

  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold" data-testid="users-title">
            Gerenciar Usuários
          </h2>
          <p className="text-muted-foreground">
            Crie, edite e gerencie os usuários do sistema
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} data-testid="button-create-user">
          <UserPlus className="mr-2 h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar usuários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="input-search-users"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-40" data-testid="select-role-filter">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os papéis</SelectItem>
            <SelectItem value="admin">Administradores</SelectItem>
            <SelectItem value="user">Usuários</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/5" />
                  <Skeleton className="h-8 w-24" />
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Data de Criação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <p className="text-muted-foreground" data-testid="no-users-message">
                        {searchTerm || roleFilter !== "all" 
                          ? "Nenhum usuário encontrado com os filtros aplicados."
                          : "Nenhum usuário encontrado."
                        }
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} data-testid={`row-user-${user.id}`}>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                          {user.role === "admin" ? "Administrador" : "Usuário"}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleUserRole(user.id, user.role)}
                            disabled={updateUserMutation.isPending}
                            data-testid={`button-toggle-role-${user.id}`}
                          >
                            <Edit className="mr-1 h-3 w-3" />
                            {user.role === "admin" ? "Tornar Usuário" : "Tornar Admin"}
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                data-testid={`button-delete-${user.id}`}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir o usuário "{user.username}"? 
                                  Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteUserMutation.mutate(user.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create User Dialog */}
      <UserCreateDialog 
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        onSubmit={(data) => createUserMutation.mutate(data)}
        isSubmitting={createUserMutation.isPending}
      />
    </div>
  );
}

// User Creation Dialog Component
function UserCreateDialog({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isSubmitting 
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: z.infer<typeof userFormSchema>) => void;
  isSubmitting: boolean;
}) {
  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      role: "user",
    },
  });

  const handleSubmit = (data: z.infer<typeof userFormSchema>) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]" data-testid="dialog-create-user">
        <DialogHeader>
          <DialogTitle>Criar Novo Usuário</DialogTitle>
          <DialogDescription>
            Preencha os dados para criar um novo usuário no sistema.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} data-testid="input-username" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} data-testid="input-password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Senha</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} data-testid="input-confirm-password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Papel</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-user-role">
                        <SelectValue placeholder="Selecione o papel" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="user">Usuário</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                data-testid="button-cancel"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                data-testid="button-submit"
              >
                {isSubmitting ? "Criando..." : "Criar Usuário"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// Projects Management Tab Component
function ProjectsTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [phaseFilter, setPhaseFilter] = useState("all");
  const { toast } = useToast();

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest(`/api/projects/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete project");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Projeto excluído",
        description: "O projeto foi removido com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao excluir projeto",
        description: "Ocorreu um erro ao tentar excluir o projeto.",
        variant: "destructive",
      });
    },
  });

  const getStatusLabel = (status: string) => {
    return status === "completed" ? "Concluído" : "Em Progresso";
  };

  const getStatusColor = (status: string) => {
    return status === "completed" 
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
  };

  const getPhaseLabel = (phase: number) => {
    const phases = ["Empatizar", "Definir", "Idear", "Prototipar", "Testar"];
    return phases[phase - 1] || `Fase ${phase}`;
  };

  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(date));
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    const matchesPhase = phaseFilter === "all" || project.currentPhase.toString() === phaseFilter;
    return matchesSearch && matchesStatus && matchesPhase;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold" data-testid="projects-title">
            Gerenciar Projetos
          </h2>
          <p className="text-muted-foreground">
            Visualize e gerencie todos os projetos do sistema
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar projetos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="input-search-projects"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40" data-testid="select-status-filter">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="in_progress">Em Progresso</SelectItem>
            <SelectItem value="completed">Concluído</SelectItem>
          </SelectContent>
        </Select>
        <Select value={phaseFilter} onValueChange={setPhaseFilter}>
          <SelectTrigger className="w-40" data-testid="select-phase-filter">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as fases</SelectItem>
            <SelectItem value="1">Fase 1 - Empatizar</SelectItem>
            <SelectItem value="2">Fase 2 - Definir</SelectItem>
            <SelectItem value="3">Fase 3 - Idear</SelectItem>
            <SelectItem value="4">Fase 4 - Prototipar</SelectItem>
            <SelectItem value="5">Fase 5 - Testar</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Projects Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/5" />
                  <Skeleton className="h-8 w-24" />
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Projeto</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Fase Atual</TableHead>
                  <TableHead>Progresso</TableHead>
                  <TableHead>Data de Criação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <p className="text-muted-foreground" data-testid="no-projects-message">
                        {searchTerm || statusFilter !== "all" || phaseFilter !== "all"
                          ? "Nenhum projeto encontrado com os filtros aplicados."
                          : "Nenhum projeto encontrado."
                        }
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProjects.map((project) => (
                    <TableRow key={project.id} data-testid={`row-project-${project.id}`}>
                      <TableCell className="font-medium max-w-xs">
                        <div className="truncate" title={project.name}>
                          {project.name}
                        </div>
                        {project.description && (
                          <div className="text-sm text-muted-foreground truncate" title={project.description}>
                            {project.description}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(project.status)}>
                          {getStatusLabel(project.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getPhaseLabel(project.currentPhase)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 transition-all duration-300"
                              style={{ width: `${project.completionRate}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {Math.round(project.completionRate)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(project.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`/project/${project.id}`, '_blank')}
                            data-testid={`button-view-${project.id}`}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                data-testid={`button-delete-project-${project.id}`}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir o projeto "{project.name}"? 
                                  Esta ação não pode ser desfeita e removerá todos os dados associados.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteProjectMutation.mutate(project.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Admin Dashboard Tab Component
function DashboardTab() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Dashboard Administrativo</h2>
          <p className="text-muted-foreground">
            Visão geral do sistema e métricas de uso
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-8 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Dashboard Administrativo</h2>
          <p className="text-muted-foreground">
            Erro ao carregar estatísticas do sistema
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold" data-testid="dashboard-title">
          Dashboard Administrativo
        </h2>
        <p className="text-muted-foreground">
          Visão geral do sistema e métricas de uso
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card data-testid="card-total-users">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-blue-600" />
              <h3 className="ml-2 text-sm font-medium text-muted-foreground">
                Total de Usuários
              </h3>
            </div>
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
          </CardContent>
        </Card>

        <Card data-testid="card-total-projects">
          <CardContent className="p-6">
            <div className="flex items-center">
              <FolderOpen className="h-4 w-4 text-green-600" />
              <h3 className="ml-2 text-sm font-medium text-muted-foreground">
                Total de Projetos
              </h3>
            </div>
            <p className="text-2xl font-bold">{stats.totalProjects}</p>
          </CardContent>
        </Card>

        <Card data-testid="card-total-articles">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Eye className="h-4 w-4 text-purple-600" />
              <h3 className="ml-2 text-sm font-medium text-muted-foreground">
                Total de Artigos
              </h3>
            </div>
            <p className="text-2xl font-bold">{stats.totalArticles}</p>
          </CardContent>
        </Card>

        <Card data-testid="card-active-projects">
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-4 w-4 text-orange-600" />
              <h3 className="ml-2 text-sm font-medium text-muted-foreground">
                Projetos Ativos
              </h3>
            </div>
            <p className="text-2xl font-bold">{stats.projectsByStatus.in_progress}</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Projects by Phase */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Projetos por Fase
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.projectsByPhase).map(([phase, count]) => {
                const phaseLabels = {
                  phase1: "Fase 1 - Empatizar",
                  phase2: "Fase 2 - Definir", 
                  phase3: "Fase 3 - Idear",
                  phase4: "Fase 4 - Prototipar",
                  phase5: "Fase 5 - Testar"
                };
                const percentage = stats.totalProjects > 0 ? (count as number / stats.totalProjects * 100) : 0;
                
                return (
                  <div key={phase} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{phaseLabels[phase as keyof typeof phaseLabels]}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-8">{count as number}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Users by Role */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Usuários por Papel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Administradores</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ 
                        width: `${stats.totalUsers > 0 ? (stats.usersByRole.admin / stats.totalUsers * 100) : 0}%` 
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">{stats.usersByRole.admin}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Usuários</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 transition-all duration-300"
                      style={{ 
                        width: `${stats.totalUsers > 0 ? (stats.usersByRole.user / stats.totalUsers * 100) : 0}%` 
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">{stats.usersByRole.user}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Articles by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="mr-2 h-5 w-5" />
              Artigos por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.articlesByCategory).map(([category, count]) => {
                const categoryLabels = {
                  empathize: "Empatizar",
                  define: "Definir",
                  ideate: "Idear",
                  prototype: "Prototipar",
                  test: "Testar"
                };
                const percentage = stats.totalArticles > 0 ? (count as number / stats.totalArticles * 100) : 0;
                
                return (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{categoryLabels[category as keyof typeof categoryLabels]}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-500 transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-8">{count as number}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Project Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FolderOpen className="mr-2 h-5 w-5" />
              Status dos Projetos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Em Progresso</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ 
                        width: `${stats.totalProjects > 0 ? (stats.projectsByStatus.in_progress / stats.totalProjects * 100) : 0}%` 
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">{stats.projectsByStatus.in_progress}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Concluídos</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 transition-all duration-300"
                      style={{ 
                        width: `${stats.totalProjects > 0 ? (stats.projectsByStatus.completed / stats.totalProjects * 100) : 0}%` 
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">{stats.projectsByStatus.completed}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { isAdmin } = useAuth();

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2" data-testid="admin-title">
              Administração
            </h1>
            <p className="text-muted-foreground">
              Gerencie artigos, usuários, projetos e configurações do sistema
            </p>
          </div>

          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dashboard" data-testid="tab-dashboard">
                <BarChart3 className="mr-2 h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="users" data-testid="tab-users">
                <Users className="mr-2 h-4 w-4" />
                Usuários
              </TabsTrigger>
              <TabsTrigger value="projects" data-testid="tab-projects">
                <FolderOpen className="mr-2 h-4 w-4" />
                Projetos
              </TabsTrigger>
              <TabsTrigger value="articles" data-testid="tab-articles">
                <Eye className="mr-2 h-4 w-4" />
                Artigos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <DashboardTab />
            </TabsContent>

            <TabsContent value="users">
              <UsersTab />
            </TabsContent>

            <TabsContent value="projects">
              <ProjectsTab />
            </TabsContent>

            <TabsContent value="articles">
              <ArticlesTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
}