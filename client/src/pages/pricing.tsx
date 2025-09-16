import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Check, X, ArrowRight, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import type { SubscriptionPlan } from "@shared/schema";

interface PricingCardProps {
  plan: SubscriptionPlan;
  isYearly: boolean;
  isPopular?: boolean;
  onSelectPlan: (planId: string, billingPeriod: "monthly" | "yearly") => void;
  isLoading?: boolean;
}

function PricingCard({ plan, isYearly, isPopular, onSelectPlan, isLoading }: PricingCardProps) {
  const price = isYearly ? plan.priceYearly : plan.priceMonthly;
  const displayPrice = price / 100; // Convert from cents to reais
  const yearlyDiscount = isYearly && plan.priceMonthly > 0 ? 
    Math.round((1 - (plan.priceYearly / 12) / plan.priceMonthly) * 100) : 0;

  const getButtonText = () => {
    if (plan.name === "free") return "Começar Grátis";
    if (plan.name === "enterprise") return "Falar com Vendas";
    return "Começar Teste Grátis";
  };

  const getButtonVariant = () => {
    if (isPopular) return "default";
    if (plan.name === "free") return "outline";
    return "outline";
  };

  return (
    <Card 
      className={`relative h-full ${isPopular ? 'border-blue-500 shadow-lg scale-105' : 'border-gray-200'}`}
      data-testid={`card-plan-${plan.name}`}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-blue-500 text-white px-3 py-1">
            <Star className="w-3 h-3 mr-1" />
            Mais Popular
          </Badge>
        </div>
      )}
      
      <CardHeader className="text-center pb-4">
        {plan.name === "team" && (
          <Badge variant="secondary" className="mx-auto w-fit mb-2">
            Equipes
          </Badge>
        )}
        {plan.name === "enterprise" && (
          <Badge variant="secondary" className="mx-auto w-fit mb-2">
            Corporativo
          </Badge>
        )}
        
        <CardTitle className="text-2xl font-bold" data-testid={`text-plan-name-${plan.name}`}>
          {plan.displayName}
        </CardTitle>
        
        <div className="mt-4">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-bold" data-testid={`text-price-${plan.name}`}>
              R$ {displayPrice.toFixed(0)}
            </span>
            <span className="text-gray-500">
              /{isYearly ? "ano" : "mês"}
            </span>
          </div>
          {yearlyDiscount > 0 && (
            <div className="text-sm text-green-600 font-medium mt-1">
              Economize {yearlyDiscount}% anualmente
            </div>
          )}
        </div>
        
        <CardDescription className="mt-3 text-base">
          {plan.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex flex-col h-full">
        <div className="flex-1">
          <ul className="space-y-3 mb-8">
            {(plan.features as string[]).map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
          
          {/* Additional features for higher tier plans */}
          {plan.name !== "free" && (
            <div className="mb-4 text-sm text-blue-600 font-medium">
              +{plan.name === "pro" ? "7" : plan.name === "team" ? "6" : "6"} funcionalidades adicionais
            </div>
          )}
        </div>
        
        <Button
          onClick={() => onSelectPlan(plan.id, isYearly ? "yearly" : "monthly")}
          variant={getButtonVariant()}
          className={`w-full ${isPopular ? 'bg-blue-500 hover:bg-blue-600' : ''}`}
          disabled={isLoading}
          data-testid={`button-select-${plan.name}`}
        >
          {isLoading ? "Processando..." : getButtonText()}
          {plan.name !== "free" && plan.name !== "enterprise" && (
            <ArrowRight className="w-4 h-4 ml-2" />
          )}
        </Button>
        
        {(plan.name === "pro" || plan.name === "team") && (
          <div className="text-center mt-2">
            <span className="text-xs text-gray-500">
              7 dias grátis • Sem cartão de crédito
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ["/api/subscription-plans"],
  });

  const createCheckoutMutation = useMutation({
    mutationFn: async ({ planId, billingPeriod }: { planId: string; billingPeriod: "monthly" | "yearly" }) => {
      const response = await apiRequest("/api/create-checkout-session", "POST", {
        planId,
        billingPeriod,
      });
      return response;
    },
    onSuccess: (data) => {
      if ((data as any).url) {
        // Redirect to Stripe Checkout
        window.location.href = (data as any).url;
      } else if ((data as any).subscription) {
        // Free plan subscription created
        toast({
          title: "Plano ativado!",
          description: "Seu plano gratuito foi ativado com sucesso.",
        });
        setLocation("/dashboard");
      }
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao processar a assinatura. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleSelectPlan = (planId: string, billingPeriod: "monthly" | "yearly") => {
    createCheckoutMutation.mutate({ planId, billingPeriod });
  };

  // Sort plans by order
  const sortedPlans = (plans as SubscriptionPlan[]).sort((a, b) => (a.order || 0) - (b.order || 0));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-lg">Carregando planos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="text-center pt-16 pb-12 px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Escolha o Plano Ideal para Você
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Transforme suas ideias em soluções inovadoras com as ferramentas mais avançadas 
          de Design Thinking. Comece grátis e evolua conforme suas necessidades.
        </p>
        
        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <Label htmlFor="billing-toggle" className={`text-lg ${!isYearly ? 'font-semibold' : ''}`}>
            Mensal
          </Label>
          <Switch
            id="billing-toggle"
            checked={isYearly}
            onCheckedChange={setIsYearly}
            data-testid="switch-billing"
          />
          <Label htmlFor="billing-toggle" className={`text-lg ${isYearly ? 'font-semibold' : ''}`}>
            Anual
            <Badge variant="secondary" className="ml-2 text-xs">
              Economize até 10%
            </Badge>
          </Label>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sortedPlans.map((plan: SubscriptionPlan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              isYearly={isYearly}
              isPopular={plan.name === "pro"}
              onSelectPlan={handleSelectPlan}
              isLoading={createCheckoutMutation.isPending}
            />
          ))}
        </div>
      </div>

      {/* Detailed Comparison */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Comparação Detalhada
          </h2>
          <p className="text-lg text-gray-600">
            Veja todas as funcionalidades de cada plano
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 uppercase tracking-wider">
                    Funcionalidade
                  </th>
                  {sortedPlans.map((plan: SubscriptionPlan) => (
                    <th key={plan.id} className="px-6 py-4 text-center text-sm font-medium text-gray-900 uppercase tracking-wider">
                      {plan.displayName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Projetos simultâneos</td>
                  {sortedPlans.map((plan: SubscriptionPlan) => (
                    <td key={plan.id} className="px-6 py-4 text-center text-sm text-gray-700">
                      {plan.maxProjects ? plan.maxProjects : "Ilimitado"}
                    </td>
                  ))}
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Personas por projeto</td>
                  {sortedPlans.map((plan: SubscriptionPlan) => (
                    <td key={plan.id} className="px-6 py-4 text-center text-sm text-gray-700">
                      {plan.maxPersonasPerProject ? plan.maxPersonasPerProject : "Ilimitado"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Chat IA por mês</td>
                  {sortedPlans.map((plan: SubscriptionPlan) => (
                    <td key={plan.id} className="px-6 py-4 text-center text-sm text-gray-700">
                      {plan.aiChatLimit ? plan.aiChatLimit : "Ilimitado"}
                    </td>
                  ))}
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Usuários na equipe</td>
                  {sortedPlans.map((plan: SubscriptionPlan) => (
                    <td key={plan.id} className="px-6 py-4 text-center text-sm text-gray-700">
                      {plan.maxUsersPerTeam ? plan.maxUsersPerTeam : 
                       plan.name === "free" || plan.name === "pro" ? "1" : "Ilimitado"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Colaboração em tempo real</td>
                  {sortedPlans.map((plan: SubscriptionPlan) => (
                    <td key={plan.id} className="px-6 py-4 text-center">
                      {plan.hasCollaboration ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-400 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">SSO (Single Sign-On)</td>
                  {sortedPlans.map((plan: SubscriptionPlan) => (
                    <td key={plan.id} className="px-6 py-4 text-center">
                      {plan.hasSso ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-400 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Suporte 24/7</td>
                  {sortedPlans.map((plan: SubscriptionPlan) => (
                    <td key={plan.id} className="px-6 py-4 text-center">
                      {plan.has24x7Support ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-400 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Perguntas Frequentes
          </h2>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Posso cancelar minha assinatura a qualquer momento?</h3>
            <p className="text-gray-600">
              Sim! Você pode cancelar sua assinatura a qualquer momento. Ao cancelar, você continuará tendo acesso 
              aos recursos até o final do período de billing atual.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Como funciona o período de teste grátis?</h3>
            <p className="text-gray-600">
              O teste grátis de 7 dias dá acesso completo a todas as funcionalidades do plano escolhido. 
              Não é necessário cartão de crédito para começar.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Posso fazer upgrade ou downgrade do meu plano?</h3>
            <p className="text-gray-600">
              Claro! Você pode alterar seu plano a qualquer momento. As mudanças são aplicadas 
              imediatamente e o valor é ajustado proporcionalmente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}