import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPersonaSchema, type Persona, type InsertPersona } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";

interface EditPersonaDialogProps {
  persona: Persona;
  projectId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

interface PersonaFormData {
  name: string;
  age: number;
  occupation: string;
  bio: string;
  goals: string;
  frustrations: string;
}

export default function EditPersonaDialog({ persona, projectId, isOpen, onOpenChange }: EditPersonaDialogProps) {
  const { toast } = useToast();

  const form = useForm<PersonaFormData>({
    resolver: zodResolver(insertPersonaSchema.pick({
      name: true,
      age: true,
      occupation: true,
      bio: true,
    }).extend({
      goals: insertPersonaSchema.shape.name,
      frustrations: insertPersonaSchema.shape.name,
    })),
    defaultValues: {
      name: persona.name || "",
      age: persona.age || 0,
      occupation: persona.occupation || "",
      bio: persona.bio || "",
      goals: typeof persona.goals === 'string' ? persona.goals : "",
      frustrations: typeof persona.frustrations === 'string' ? persona.frustrations : "",
    },
  });

  const updatePersonaMutation = useMutation({
    mutationFn: async (data: Partial<InsertPersona>) => {
      const response = await apiRequest("PUT", `/api/personas/${persona.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "personas"] });
      toast({
        title: "Persona atualizada!",
        description: "As alterações foram salvas com sucesso.",
      });
      onOpenChange(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a persona.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PersonaFormData) => {
    const updateData: Partial<InsertPersona> = {
      name: data.name,
      age: data.age,
      occupation: data.occupation,
      bio: data.bio,
      goals: data.goals,
      frustrations: data.frustrations,
    };
    updatePersonaMutation.mutate(updateData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Persona</DialogTitle>
          <DialogDescription>
            Atualize as informações da persona.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nome da persona"
                        {...field}
                        data-testid="input-edit-persona-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Idade</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Idade"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        data-testid="input-edit-persona-age"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ocupação</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ocupação da persona"
                      {...field}
                      data-testid="input-edit-persona-occupation"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biografia</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva a biografia da persona..."
                      className="resize-none"
                      rows={3}
                      {...field}
                      data-testid="input-edit-persona-bio"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="goals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Objetivos</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Quais são os objetivos da persona..."
                      className="resize-none"
                      rows={3}
                      {...field}
                      data-testid="input-edit-persona-goals"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="frustrations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frustrações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Quais são as principais frustrações..."
                      className="resize-none"
                      rows={3}
                      {...field}
                      data-testid="input-edit-persona-frustrations"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                data-testid="button-cancel-edit"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={updatePersonaMutation.isPending}
                data-testid="button-save-edit"
              >
                {updatePersonaMutation.isPending ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}