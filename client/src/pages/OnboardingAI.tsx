import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Loader2, Sparkles, CheckCircle2, Rocket, Lightbulb, Building2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import UpgradeModal from "@/components/UpgradeModal";
import type { IndustrySector, SuccessCase } from "@shared/schema";

type WizardStep = 1 | 2 | 3 | 4;

export default function OnboardingAI() {
  const [_, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [selectedSector, setSelectedSector] = useState<IndustrySector | null>(null);
  const [selectedCase, setSelectedCase] = useState<SuccessCase | null>(null);
  const [customInspiration, setCustomInspiration] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [limitError, setLimitError] = useState<any>(null);
  const { toast } = useToast();

  // Fetch sectors
  const { data: sectors = [], isLoading: sectorsLoading } = useQuery<IndustrySector[]>({
    queryKey: ["/api/sectors"],
  });

  // Fetch success cases for selected sector
  const { data: successCases = [], isLoading: casesLoading } = useQuery<SuccessCase[]>({
    queryKey: ["/api/cases/sector", selectedSector?.id],
    enabled: !!selectedSector,
  });

  // AI generation mutation
  const generateMutation = useMutation({
    mutationFn: async (data: { sectorId: string; successCaseId: string; userProblemDescription: string; customInspiration?: string }) => {
      const response = await fetch("/api/ai/generate-project", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
      }
      return response.json();
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setLocation(`/dashboard-ai/${data.project.id}`);
    },
    onError: (error: any) => {
      // Check if it's an AI project limit error
      if (error.code === "AI_PROJECT_LIMIT_REACHED") {
        setLimitError(error);
        setShowUpgradeModal(true);
      } else {
        toast({
          title: "Erro ao gerar projeto",
          description: error.error || "Ocorreu um erro ao tentar gerar o projeto com IA.",
          variant: "destructive",
        });
      }
    },
  });

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as WizardStep);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as WizardStep);
    }
  };

  const handleGenerate = () => {
    // Success case is now optional - user can rely only on custom inspiration
    if (selectedSector && problemDescription.length >= 50 && problemDescription.length <= 500) {
      generateMutation.mutate({
        sectorId: selectedSector.id,
        successCaseId: selectedCase?.id || '', // Empty string if no case selected
        userProblemDescription: problemDescription,
        customInspiration: customInspiration.trim() || undefined,
      });
    }
  };

  const progressPercentage = (currentStep / 4) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Geração Automática de MVP
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Em 5-10 minutos, nossa IA criará um projeto completo de negócio para você
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-3xl mx-auto mb-8">
          <Progress value={progressPercentage} className="h-2" data-testid="progress-wizard" />
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span className={currentStep >= 1 ? "text-purple-600 font-semibold" : ""}>Setor</span>
            <span className={currentStep >= 2 ? "text-purple-600 font-semibold" : ""}>Inspiração</span>
            <span className={currentStep >= 3 ? "text-purple-600 font-semibold" : ""}>Problema</span>
            <span className={currentStep >= 4 ? "text-purple-600 font-semibold" : ""}>Gerar</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          {/* Step 1: Select Industry Sector */}
          {currentStep === 1 && (
            <Card className="shadow-xl border-purple-200" data-testid="card-step-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-6 w-6 text-purple-600" />
                  Escolha o Setor de Indústria
                </CardTitle>
                <CardDescription>
                  Selecione o setor onde seu negócio ou ideia se encaixa
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sectorsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sectors.map((sector) => (
                      <button
                        key={sector.id}
                        onClick={() => setSelectedSector(sector)}
                        className={`relative p-4 rounded-lg border-2 transition-all text-left h-auto ${
                          selectedSector?.id === sector.id
                            ? "border-purple-600 bg-purple-50 dark:bg-purple-900/20"
                            : "border-gray-200 hover:border-purple-300 bg-white dark:bg-gray-800"
                        }`}
                        data-testid={`button-sector-${sector.id}`}
                      >
                        <div className="space-y-3 pr-8">
                          <h3 className="font-semibold text-base text-gray-900 dark:text-white">
                            {sector.namePt}
                          </h3>
                          {sector.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
                              {sector.description}
                            </p>
                          )}
                        </div>
                        {selectedSector?.id === sector.id && (
                          <div className="absolute top-2 right-2">
                            <CheckCircle2 className="h-5 w-5 text-purple-600" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={handleNextStep}
                    disabled={!selectedSector}
                    className="bg-purple-600 hover:bg-purple-700"
                    data-testid="button-next-step-1"
                  >
                    Próximo
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Select Success Case */}
          {currentStep === 2 && (
            <Card className="shadow-xl border-purple-200" data-testid="card-step-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-6 w-6 text-purple-600" />
                  Escolha sua Inspiração
                </CardTitle>
                <CardDescription>
                  Selecione um case de sucesso que inspira seu modelo de negócio, ou pule esta etapa e use apenas inspirações personalizadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {casesLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                  </div>
                ) : successCases.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum case de sucesso disponível para este setor
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {successCases.map((successCase) => (
                      <button
                        key={successCase.id}
                        onClick={() => setSelectedCase(successCase)}
                        className={`p-6 rounded-lg border-2 transition-all text-left ${
                          selectedCase?.id === successCase.id
                            ? "border-purple-600 bg-purple-50 dark:bg-purple-900/20"
                            : "border-gray-200 hover:border-purple-300 bg-white dark:bg-gray-800"
                        }`}
                        data-testid={`button-case-${successCase.id}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-xl">{successCase.name}</h3>
                          {successCase.company && (
                            <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                              {successCase.company}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {successCase.descriptionPt || successCase.descriptionEn}
                        </p>
                        {selectedCase?.id === successCase.id && (
                          <CheckCircle2 className="h-5 w-5 text-purple-600 mt-3" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Custom Inspiration Field */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Inspirações Adicionais (Opcional)
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    Adicione empresas, produtos ou projetos que servem como referência para seu MVP
                  </p>
                  <Textarea
                    placeholder="Ex: Airbnb, Uber, Nubank, iFood..."
                    value={customInspiration}
                    onChange={(e) => setCustomInspiration(e.target.value)}
                    className="min-h-[100px]"
                    maxLength={300}
                    data-testid="input-custom-inspiration"
                  />
                  <div className="mt-1 text-xs text-gray-500 text-right">
                    {customInspiration.length}/300 caracteres
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <Button variant="outline" onClick={handlePreviousStep} data-testid="button-back-step-2">
                    Voltar
                  </Button>
                  <Button
                    onClick={handleNextStep}
                    className="bg-purple-600 hover:bg-purple-700"
                    data-testid="button-next-step-2"
                  >
                    Próximo
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Describe Problem */}
          {currentStep === 3 && (
            <Card className="shadow-xl border-purple-200" data-testid="card-step-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-6 w-6 text-purple-600" />
                  Descreva seu Problema ou Oportunidade
                </CardTitle>
                <CardDescription>
                  Conte-nos qual problema você quer resolver ou oportunidade explorar (50-500 caracteres)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Ex: Quero criar uma plataforma que conecte profissionais de saúde a pacientes em áreas remotas, oferecendo consultas online e diagnósticos rápidos..."
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  className="min-h-[200px] text-lg"
                  maxLength={500}
                  data-testid="input-problem-description"
                />
                <div className="mt-2 text-sm text-gray-500 text-right">
                  {problemDescription.length}/500 caracteres
                </div>
                {problemDescription.length > 0 && problemDescription.length < 50 && (
                  <p className="mt-2 text-sm text-amber-600">
                    Descreva com mais detalhes (mínimo 50 caracteres)
                  </p>
                )}
                <div className="mt-6 flex justify-between">
                  <Button variant="outline" onClick={handlePreviousStep} data-testid="button-back-step-3">
                    Voltar
                  </Button>
                  <Button
                    onClick={handleNextStep}
                    disabled={problemDescription.length < 50 || problemDescription.length > 500}
                    className="bg-purple-600 hover:bg-purple-700"
                    data-testid="button-next-step-3"
                  >
                    Próximo
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Generate MVP */}
          {currentStep === 4 && (
            <Card className="shadow-xl border-purple-200" data-testid="card-step-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                  Gerar MVP Completo
                </CardTitle>
                <CardDescription>
                  Revise suas escolhas e gere seu projeto em poucos minutos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-semibold mb-2">Setor Selecionado:</h4>
                    <p className="text-gray-700 dark:text-gray-300">{selectedSector?.namePt}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-semibold mb-2">Inspiração:</h4>
                    <p className="text-gray-700 dark:text-gray-300">{selectedCase?.name}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-semibold mb-2">Seu Problema/Oportunidade:</h4>
                    <p className="text-gray-700 dark:text-gray-300">{problemDescription}</p>
                  </div>
                </div>

                {generateMutation.isPending ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Gerando seu MVP...</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Isso pode levar 5-10 minutos. Estamos criando:
                    </p>
                    <ul className="mt-4 space-y-2 text-left max-w-md mx-auto">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        Nome e descrição do projeto
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        Logo profissional
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        Personas de usuários
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        Declarações POV
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        Ideias de solução
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        Landing page
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        Estratégia de redes sociais
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        Modelo de negócio
                      </li>
                    </ul>
                  </div>
                ) : generateMutation.isError ? (
                  <div className="text-center py-8">
                    <p className="text-red-600 mb-4">Erro ao gerar projeto. Tente novamente.</p>
                    <Button
                      onClick={handleGenerate}
                      className="bg-purple-600 hover:bg-purple-700"
                      data-testid="button-retry-generate"
                    >
                      Tentar Novamente
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={handlePreviousStep} data-testid="button-back-step-4">
                      Voltar
                    </Button>
                    <Button
                      onClick={handleGenerate}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      data-testid="button-generate-mvp"
                    >
                      <Sparkles className="mr-2 h-5 w-5" />
                      Gerar MVP Agora
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentPlan={limitError?.planName}
        currentUsage={limitError?.currentUsage}
        limit={limitError?.limit}
        message={limitError?.error}
      />
    </div>
  );
}
