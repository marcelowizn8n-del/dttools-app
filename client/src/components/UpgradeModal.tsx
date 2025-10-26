import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, Check } from "lucide-react";
import { useLocation } from "wouter";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: string;
  currentUsage?: number;
  limit?: number;
  message?: string;
}

export default function UpgradeModal({
  isOpen,
  onClose,
  currentPlan = "Básico",
  currentUsage = 1,
  limit = 1,
  message,
}: UpgradeModalProps) {
  const [, setLocation] = useLocation();

  const handleUpgrade = () => {
    setLocation("/pricing");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            <DialogTitle className="text-2xl">Limite Atingido - Hora de Evoluir!</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            {message || `Você atingiu o limite de ${limit} projeto${limit > 1 ? 's' : ''} AI gerado${limit > 1 ? 's' : ''} do plano ${currentPlan}.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Usage */}
          <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                    Uso Atual
                  </p>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {currentUsage} / {limit === null ? "∞" : limit} projetos AI
                  </p>
                </div>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                  Plano {currentPlan}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Upgrade Benefits */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-500" />
              Com o Plano Premium você tem:
            </h3>
            <div className="grid gap-3">
              {[
                "Projetos AI ilimitados por mês",
                "Chat IA ilimitado",
                "Até 5 usuários inclusos (+ R$ 59/usuário adicional)",
                "Workspace compartilhado",
                "Comentários e feedback em tempo real",
                "Exportar em PDF, PNG e CSV",
                "Suporte prioritário 24/7",
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Comparison */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Plano Atual</p>
              <p className="text-2xl font-bold">R$ 29</p>
              <p className="text-xs text-muted-foreground">/mês</p>
              <p className="text-sm mt-2 text-amber-600 font-medium">1 projeto AI/mês</p>
            </div>
            <div className="text-center border-2 border-blue-500 rounded-lg p-3 -m-1">
              <Badge className="mb-2 bg-blue-500">Recomendado</Badge>
              <p className="text-sm text-muted-foreground mb-1">Premium</p>
              <p className="text-2xl font-bold text-blue-600">R$ 299</p>
              <p className="text-xs text-muted-foreground">/mês</p>
              <p className="text-sm mt-2 text-green-600 font-medium">Projetos AI ilimitados</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              data-testid="button-upgrade-later"
            >
              Continuar com o Plano Atual
            </Button>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={handleUpgrade}
              data-testid="button-upgrade-now"
            >
              Ver Planos e Fazer Upgrade
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            💡 Dica: Com o plano Premium, você pode gerar quantos MVPs quiser e colaborar com sua equipe!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
