import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { X, Save, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertArticleSchema, type Article } from "@shared/schema";

const articleFormSchema = insertArticleSchema.extend({
  tags: z.string().optional().default(""),
  category: z.string().min(1, "Categoria é obrigatória"),
  title: z.string().min(1, "Título é obrigatório"),
  author: z.string().min(1, "Autor é obrigatório"),
  content: z.string().min(1, "Conteúdo é obrigatório"),
});

type ArticleFormData = z.infer<typeof articleFormSchema>;

interface ArticleEditorProps {
  article?: Article | null;
  isOpen: boolean;
  onClose: () => void;
}

// Simple markdown renderer for preview
function MarkdownPreview({ content }: { content: string }) {
  const processMarkdown = (text: string) => {
    let processed = text
      // Headers
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-6 mb-4">$1</h1>')
      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      // Lists
      .replace(/^- (.*$)/gm, '<li class="ml-4 list-disc">$1</li>')
      // Wrap consecutive list items
      .replace(/(<li.*?<\/li>\s*)+/g, '<ul class="space-y-1 mb-4">$&</ul>')
      // Paragraphs
      .replace(/\n\n/g, '</p><p class="mb-4">')
      // Line breaks
      .replace(/\n/g, '<br>');

    return `<div class="prose prose-sm prose-neutral dark:prose-invert max-w-none"><p class="mb-4">${processed}</p></div>`;
  };

  return (
    <div 
      className="p-4 border rounded-lg bg-muted/50 min-h-[400px]"
      dangerouslySetInnerHTML={{ __html: processMarkdown(content || '') }}
    />
  );
}

export default function ArticleEditor({ article, isOpen, onClose }: ArticleEditorProps) {
  const [activeTab, setActiveTab] = useState("edit");
  const [customCategory, setCustomCategory] = useState("");
  const [isCustomCategorySelected, setIsCustomCategorySelected] = useState(false);
  const { toast } = useToast();

  // Solid default values - never undefined
  const defaultFormValues: ArticleFormData = {
    title: "",
    author: "",
    category: "design-thinking", // Default category - never empty!
    description: "",
    content: "",
    tags: "",
    published: true,
  };

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: defaultFormValues,
  });

  const contentValue = form.watch("content") || "";

  // Single useEffect for form initialization - controlled sequencing
  useEffect(() => {
    if (isOpen) {
      if (article) {
        // Editing existing article - populate with data
        form.reset({
          title: article.title || "",
          author: article.author || "",
          category: article.category || "design-thinking", // Never empty!
          description: article.description || "",
          content: article.content || "",
          tags: Array.isArray(article.tags) ? article.tags.join(", ") : "",
          published: article.published ?? true,
        });
      } else {
        // Creating new article - use defaults
        form.reset(defaultFormValues);
        setIsCustomCategorySelected(false);
        setCustomCategory("");
      }
      setActiveTab("edit");
    } else {
      // Modal closed - reset everything
      setActiveTab("edit");
      setIsCustomCategorySelected(false);
      setCustomCategory("");
      form.reset(defaultFormValues);
    }
  }, [isOpen, article]); // Removed form from deps to prevent loops

  const createArticleMutation = useMutation({
    mutationFn: async (data: ArticleFormData) => {
      const payload = {
        ...data,
        tags: data.tags ? data.tags.split(",").map(tag => tag.trim()).filter(Boolean) : [],
      };

      const response = await apiRequest("POST", "/api/articles", payload);
      if (!response.ok) {
        throw new Error("Failed to create article");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({
        title: "Artigo criado",
        description: "O artigo foi criado com sucesso.",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Erro ao criar artigo",
        description: "Ocorreu um erro ao criar o artigo.",
        variant: "destructive",
      });
    },
  });

  const updateArticleMutation = useMutation({
    mutationFn: async (data: ArticleFormData) => {
      const payload = {
        ...data,
        tags: data.tags ? data.tags.split(",").map(tag => tag.trim()).filter(Boolean) : [],
      };

      const response = await apiRequest("PUT", `/api/articles/${article?.id}`, payload);
      if (!response.ok) {
        throw new Error("Failed to update article");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({
        title: "Artigo atualizado",
        description: "O artigo foi atualizado com sucesso.",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar artigo",
        description: "Ocorreu um erro ao atualizar o artigo.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ArticleFormData) => {
    if (article) {
      updateArticleMutation.mutate(data);
    } else {
      createArticleMutation.mutate(data);
    }
  };

  const isLoading = createArticleMutation.isPending || updateArticleMutation.isPending;

  const categories = [
    { value: "empathize", label: "Empatizar" },
    { value: "define", label: "Definir" },
    { value: "ideate", label: "Idear" },
    { value: "prototype", label: "Prototipar" },
    { value: "test", label: "Testar" },
    { value: "design-thinking", label: "Design Thinking" },
    { value: "creativity", label: "Criatividade" },
    { value: "ux-ui", label: "UX/UI" },
    { value: "custom", label: "📝 Categoria Personalizada" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-3xl lg:max-w-5xl h-[100svh] sm:h-[95vh] max-h-[100svh] sm:max-h-[95vh] p-0 gap-0 overflow-hidden flex flex-col">
        <DialogDescription className="sr-only">
          {article ? "Editar artigo existente" : "Criar novo artigo para a biblioteca"}
        </DialogDescription>
        
        {/* Header fixo */}
        <DialogHeader className="flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4 border-b bg-background">
          <DialogTitle data-testid="editor-title" className="text-lg sm:text-xl font-semibold">
            {article ? "Editar Artigo" : "Criar Novo Artigo"}
          </DialogTitle>
        </DialogHeader>

        {/* Conteúdo principal com scroll */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3 sm:py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite o título do artigo"
                            data-testid="input-title"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Autor</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nome do autor"
                            data-testid="input-author"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            if (value === "custom") {
                              setIsCustomCategorySelected(true);
                              field.onChange("custom"); // Keep "custom" as value, never empty!
                            } else {
                              setIsCustomCategorySelected(false);
                              setCustomCategory("");
                              field.onChange(value);
                            }
                          }} 
                          value={field.value || "design-thinking"}
                        >
                          <FormControl>
                            <SelectTrigger data-testid="select-category">
                              <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {isCustomCategorySelected && (
                          <FormControl className="mt-2">
                            <Input
                              placeholder="Digite uma categoria personalizada"
                              value={customCategory}
                              onChange={(e) => {
                                setCustomCategory(e.target.value);
                                field.onChange(e.target.value);
                              }}
                              data-testid="input-custom-category"
                            />
                          </FormControl>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="published"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Publicado</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            O artigo será visível na biblioteca
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value ?? true}
                            onCheckedChange={field.onChange}
                            data-testid="switch-published"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição (opcional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Breve descrição do artigo"
                          data-testid="textarea-description"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags (opcional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite as tags separadas por vírgula"
                          data-testid="input-tags"
                          {...field}
                        />
                      </FormControl>
                      <div className="text-sm text-muted-foreground">
                        Exemplo: empatia, pesquisa, usuários
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Content Editor with Preview */}
                <div className="space-y-4">
                  <Label>Conteúdo</Label>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="edit" data-testid="tab-edit">
                        Editar
                      </TabsTrigger>
                      <TabsTrigger value="preview" data-testid="tab-preview">
                        Visualizar
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="edit" className="space-y-2">
                      <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                placeholder="Escreva o conteúdo do artigo em Markdown..."
                                className="min-h-[250px] sm:min-h-[400px] resize-none font-mono text-sm"
                                data-testid="textarea-content"
                                {...field}
                              />
                            </FormControl>
                            <div className="text-xs sm:text-sm text-muted-foreground">
                              Use Markdown: **negrito**, *itálico*, # títulos
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>

                    <TabsContent value="preview">
                      <MarkdownPreview content={contentValue} />
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Footer com botões - dentro do scroll para mobile */}
                <div className="sticky bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur-sm px-4 sm:px-6 py-3 sm:py-4 mt-6 -mx-4 sm:-mx-6 -mb-3 sm:-mb-4">
                  <div className="flex flex-col gap-2 sm:gap-3">
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setActiveTab("preview")}
                        data-testid="button-preview"
                        disabled={isLoading}
                        className="w-full sm:w-auto sm:flex-1"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Visualizar
                      </Button>

                      <Button
                        type="submit"
                        disabled={isLoading}
                        data-testid="button-save"
                        onClick={form.handleSubmit(onSubmit)}
                        className="w-full sm:w-auto sm:flex-1"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        {isLoading ? "Salvando..." : "Salvar"}
                      </Button>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      data-testid="button-cancel"
                      disabled={isLoading}
                      className="w-full"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}