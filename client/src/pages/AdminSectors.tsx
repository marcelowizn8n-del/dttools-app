import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { IndustrySector } from "@shared/schema";

export default function AdminSectors() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingSector, setEditingSector] = useState<IndustrySector | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    namePt: "",
    nameEn: "",
    nameEs: "",
    nameFr: "",
    description: "",
    icon: "🏢",
  });
  const { toast } = useToast();

  const { data: sectors = [], isLoading } = useQuery<IndustrySector[]>({
    queryKey: ["/api/admin/sectors"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/admin/sectors", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/sectors"] });
      toast({
        title: "Setor criado",
        description: "O setor foi criado com sucesso.",
      });
      setIsCreating(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Erro ao criar setor",
        description: "Ocorreu um erro ao tentar criar o setor.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const response = await apiRequest("PUT", `/api/admin/sectors/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/sectors"] });
      toast({
        title: "Setor atualizado",
        description: "O setor foi atualizado com sucesso.",
      });
      setEditingSector(null);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar setor",
        description: "Ocorreu um erro ao tentar atualizar o setor.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/admin/sectors/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/sectors"] });
      toast({
        title: "Setor deletado",
        description: "O setor foi removido com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao deletar setor",
        description: "Ocorreu um erro ao tentar deletar o setor.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      namePt: "",
      nameEn: "",
      nameEs: "",
      nameFr: "",
      description: "",
      icon: "🏢",
    });
  };

  const handleEdit = (sector: IndustrySector) => {
    setEditingSector(sector);
    setFormData({
      name: sector.name || "",
      namePt: sector.namePt,
      nameEn: sector.nameEn || "",
      nameEs: sector.nameEs || "",
      nameFr: sector.nameFr || "",
      description: sector.description || "",
      icon: sector.icon || "🏢",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSector) {
      updateMutation.mutate({ id: editingSector.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingSector(null);
    resetForm();
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Setores</h1>
          <p className="text-muted-foreground mt-1">
            Adicione e gerencie setores industriais para geração de MVPs
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} data-testid="button-create-sector">
          <Plus className="mr-2 h-4 w-4" />
          Novo Setor
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-8 w-24" />
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Ícone</TableHead>
                  <TableHead>Nome (PT)</TableHead>
                  <TableHead>Nome (EN)</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sectors.map((sector) => (
                  <TableRow key={sector.id}>
                    <TableCell className="text-2xl">{sector.icon}</TableCell>
                    <TableCell className="font-medium">{sector.namePt}</TableCell>
                    <TableCell>{sector.nameEn}</TableCell>
                    <TableCell className="max-w-md truncate">
                      {sector.description || "Sem descrição"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(sector)}
                          data-testid={`button-edit-sector-${sector.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              data-testid={`button-delete-sector-${sector.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja deletar o setor "{sector.namePt}"? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMutation.mutate(sector.id)}
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
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isCreating || !!editingSector} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSector ? "Editar Setor" : "Novo Setor"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Ícone</label>
                <Input
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="🏢"
                  className="text-2xl"
                  required
                  data-testid="input-sector-icon"
                />
                <p className="text-xs text-muted-foreground">
                  Cole um emoji para representar este setor
                </p>
              </div>

              <Tabs defaultValue="pt" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="pt">PT 🇧🇷</TabsTrigger>
                  <TabsTrigger value="en">EN 🇺🇸</TabsTrigger>
                  <TabsTrigger value="es">ES 🇪🇸</TabsTrigger>
                  <TabsTrigger value="fr">FR 🇫🇷</TabsTrigger>
                </TabsList>
                <TabsContent value="pt" className="space-y-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Nome (Português)</label>
                    <Input
                      value={formData.namePt}
                      onChange={(e) => setFormData({ ...formData, namePt: e.target.value })}
                      placeholder="Ex: Varejo e E-commerce"
                      required
                      data-testid="input-sector-name-pt"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="en" className="space-y-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Name (English)</label>
                    <Input
                      value={formData.nameEn}
                      onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                      placeholder="Ex: Retail and E-commerce"
                      data-testid="input-sector-name-en"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="es" className="space-y-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Nombre (Español)</label>
                    <Input
                      value={formData.nameEs}
                      onChange={(e) => setFormData({ ...formData, nameEs: e.target.value })}
                      placeholder="Ej: Comercio minorista y comercio electrónico"
                      data-testid="input-sector-name-es"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="fr" className="space-y-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Nom (Français)</label>
                    <Input
                      value={formData.nameFr}
                      onChange={(e) => setFormData({ ...formData, nameFr: e.target.value })}
                      placeholder="Ex: Commerce de détail et commerce électronique"
                      data-testid="input-sector-name-fr"
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Descrição</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva o setor (opcional)..."
                  rows={3}
                  data-testid="input-sector-description"
                />
                <p className="text-xs text-muted-foreground">
                  Descrição única em qualquer idioma
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                data-testid="button-cancel-sector"
              >
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                data-testid="button-save-sector"
              >
                <Save className="mr-2 h-4 w-4" />
                {editingSector ? "Salvar" : "Criar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
