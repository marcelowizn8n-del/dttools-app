import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Edit, Trash2, Star, Globe, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertTestimonialSchema, type Testimonial } from "@shared/schema";

const testimonialFormSchema = insertTestimonialSchema.extend({
  name: z.string().min(1, "Nome é obrigatório"),
  role: z.string().min(1, "Cargo é obrigatório"),
  company: z.string().min(1, "Empresa é obrigatória"),
  testimonialPt: z.string().min(1, "Depoimento em português é obrigatório"),
  testimonialEn: z.string().optional(),
  testimonialEs: z.string().optional(),
  testimonialFr: z.string().optional(),
  avatarUrl: z.string().optional(),
  rating: z.number().min(1).max(5).default(5),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
});

type TestimonialFormData = z.infer<typeof testimonialFormSchema>;

export default function TestimonialsTab() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [languageTab, setLanguageTab] = useState("pt");
  const { toast } = useToast();

  const { data: testimonials = [], isLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/admin/testimonials"],
  });

  const form = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: {
      name: "",
      role: "",
      company: "",
      testimonialPt: "",
      testimonialEn: "",
      testimonialEs: "",
      testimonialFr: "",
      avatarUrl: "",
      rating: 5,
      order: 0,
      isActive: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: TestimonialFormData) => {
      const response = await apiRequest("POST", "/api/admin/testimonials", data);
      if (!response.ok) throw new Error("Failed to create testimonial");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      toast({ title: "Depoimento criado com sucesso" });
      closeEditor();
    },
    onError: () => {
      toast({ title: "Erro ao criar depoimento", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: TestimonialFormData & { id: string }) => {
      const response = await apiRequest("PUT", `/api/admin/testimonials/${data.id}`, data);
      if (!response.ok) throw new Error("Failed to update testimonial");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      toast({ title: "Depoimento atualizado com sucesso" });
      closeEditor();
    },
    onError: () => {
      toast({ title: "Erro ao atualizar depoimento", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/admin/testimonials/${id}`, {});
      if (!response.ok) throw new Error("Failed to delete testimonial");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      toast({ title: "Depoimento excluído com sucesso" });
    },
    onError: () => {
      toast({ title: "Erro ao excluir depoimento", variant: "destructive" });
    },
  });

  const openEditor = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      form.reset({
        name: testimonial.name,
        role: testimonial.role,
        company: testimonial.company,
        testimonialPt: testimonial.testimonialPt,
        testimonialEn: testimonial.testimonialEn || "",
        testimonialEs: testimonial.testimonialEs || "",
        testimonialFr: testimonial.testimonialFr || "",
        avatarUrl: testimonial.avatarUrl || "",
        rating: testimonial.rating || 5,
        order: testimonial.order || 0,
        isActive: testimonial.isActive ?? true,
      });
    } else {
      setEditingTestimonial(null);
      form.reset({
        name: "",
        role: "",
        company: "",
        testimonialPt: "",
        testimonialEn: "",
        testimonialEs: "",
        testimonialFr: "",
        avatarUrl: "",
        rating: 5,
        order: 0,
        isActive: true,
      });
    }
    setLanguageTab("pt");
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditingTestimonial(null);
    form.reset();
  };

  const onSubmit = (data: TestimonialFormData) => {
    if (editingTestimonial) {
      updateMutation.mutate({ ...data, id: editingTestimonial.id });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este depoimento?")) {
      deleteMutation.mutate(id);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gerenciar Depoimentos</h2>
          <p className="text-muted-foreground">
            Adicione e gerencie depoimentos de clientes em múltiplos idiomas
          </p>
        </div>
        <Button onClick={() => openEditor()} data-testid="button-add-testimonial">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Depoimento
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Carregando depoimentos...</div>
      ) : testimonials.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Nenhum depoimento cadastrado. Clique em "Adicionar Depoimento" para começar.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {testimonial.avatarUrl && (
                      <img
                        src={testimonial.avatarUrl}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <CardDescription>
                        {testimonial.role} • {testimonial.company}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={testimonial.isActive ? "default" : "secondary"}>
                      {testimonial.isActive ? (
                        <><CheckCircle2 className="mr-1 h-3 w-3" /> Ativo</>
                      ) : (
                        <><XCircle className="mr-1 h-3 w-3" /> Inativo</>
                      )}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditor(testimonial)}
                      data-testid={`button-edit-testimonial-${testimonial.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(testimonial.id)}
                      data-testid={`button-delete-testimonial-${testimonial.id}`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-1">
                  {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {testimonial.testimonialPt}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Ordem: {testimonial.order || 0}</span>
                  {testimonial.testimonialEn && <Badge variant="outline">EN</Badge>}
                  {testimonial.testimonialEs && <Badge variant="outline">ES</Badge>}
                  {testimonial.testimonialFr && <Badge variant="outline">FR</Badge>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Editor Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={closeEditor}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTestimonial ? "Editar Depoimento" : "Adicionar Depoimento"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados do depoimento. Adicione traduções para outros idiomas.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="João Silva" {...field} data-testid="input-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Empresa</FormLabel>
                      <FormControl>
                        <Input placeholder="Empresa XYZ" {...field} data-testid="input-company" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cargo</FormLabel>
                      <FormControl>
                        <Input placeholder="CEO" {...field} data-testid="input-role" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="avatarUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL do Avatar (opcional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://..."
                          {...field}
                          value={field.value ?? ""}
                          data-testid="input-avatar-url"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Avaliação (1-5)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={5}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                          data-testid="input-rating"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ordem de Exibição</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                          data-testid="input-order"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Ativo</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Depoimentos inativos não aparecem no site
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value ?? true}
                        onCheckedChange={field.onChange}
                        data-testid="switch-is-active"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Multilingual Testimonials */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <FormLabel className="text-base font-semibold">Depoimento Multilíngue</FormLabel>
                </div>

                <Tabs value={languageTab} onValueChange={setLanguageTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="pt">🇧🇷 PT</TabsTrigger>
                    <TabsTrigger value="en">🇺🇸 EN</TabsTrigger>
                    <TabsTrigger value="es">🇪🇸 ES</TabsTrigger>
                    <TabsTrigger value="fr">🇫🇷 FR</TabsTrigger>
                  </TabsList>

                  <TabsContent value="pt">
                    <FormField
                      control={form.control}
                      name="testimonialPt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Depoimento (Português)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Digite o depoimento em português..."
                              className="min-h-[120px]"
                              {...field}
                              data-testid="textarea-testimonial-pt"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  <TabsContent value="en">
                    <FormField
                      control={form.control}
                      name="testimonialEn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Testimonial (English)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter the testimonial in English..."
                              className="min-h-[120px]"
                              {...field}
                              value={field.value ?? ""}
                              data-testid="textarea-testimonial-en"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  <TabsContent value="es">
                    <FormField
                      control={form.control}
                      name="testimonialEs"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Testimonio (Español)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Ingrese el testimonio en español..."
                              className="min-h-[120px]"
                              {...field}
                              value={field.value ?? ""}
                              data-testid="textarea-testimonial-es"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  <TabsContent value="fr">
                    <FormField
                      control={form.control}
                      name="testimonialFr"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Témoignage (Français)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Entrez le témoignage en français..."
                              className="min-h-[120px]"
                              {...field}
                              value={field.value ?? ""}
                              data-testid="textarea-testimonial-fr"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                </Tabs>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting} data-testid="button-save-testimonial">
                  {isSubmitting ? "Salvando..." : "Salvar"}
                </Button>
                <Button type="button" variant="outline" onClick={closeEditor} disabled={isSubmitting}>
                  Cancelar
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
