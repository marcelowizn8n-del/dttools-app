import { ArrowLeft, Mail, MessageSquare, Book, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Support() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6" data-testid="button-back">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Central de Ajuda
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Estamos aqui para ajudar! Encontre respostas para suas dúvidas ou entre em contato com nossa equipe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card data-testid="card-email-support">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle>Email de Suporte</CardTitle>
                  <CardDescription>Resposta em até 24 horas</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Para questões técnicas, dúvidas sobre funcionalidades ou problemas com sua conta.
              </p>
              <a 
                href="mailto:support@dttools.app" 
                className="text-blue-600 hover:underline font-medium"
                data-testid="link-email-support"
              >
                support@dttools.app
              </a>
            </CardContent>
          </Card>

          <Card data-testid="card-knowledge-base">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Book className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <CardTitle>Base de Conhecimento</CardTitle>
                  <CardDescription>Artigos e tutoriais</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Acesse nossa biblioteca com guias, tutoriais e artigos sobre Design Thinking.
              </p>
              <Link href="/biblioteca">
                <Button variant="outline" data-testid="button-knowledge-base">
                  Visitar Biblioteca
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card data-testid="card-feedback">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle>Feedback e Sugestões</CardTitle>
                  <CardDescription>Ajude-nos a melhorar</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Tem uma sugestão de melhoria ou feature request? Adoraríamos ouvir!
              </p>
              <a 
                href="mailto:feedback@dttools.app" 
                className="text-blue-600 hover:underline font-medium"
                data-testid="link-feedback"
              >
                feedback@dttools.app
              </a>
            </CardContent>
          </Card>

          <Card data-testid="card-report-issue">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <CardTitle>Reportar Problema</CardTitle>
                  <CardDescription>Bugs e erros técnicos</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Encontrou um bug ou erro? Reporte para que possamos corrigir rapidamente.
              </p>
              <a 
                href="mailto:bugs@dttools.app" 
                className="text-blue-600 hover:underline font-medium"
                data-testid="link-report-bug"
              >
                bugs@dttools.app
              </a>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Perguntas Frequentes (FAQ)
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Como faço para criar um novo projeto?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Acesse o Dashboard e clique em "Novo Projeto". Você será guiado pelas 5 fases do Design Thinking, podendo usar ferramentas específicas em cada etapa.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Posso exportar meus projetos?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Sim! Você pode exportar seus projetos em formato PDF ou compartilhar com sua equipe. Acesse o menu de opções do projeto e selecione "Exportar".
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Qual a diferença entre os planos?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                O plano Gratuito permite até 3 projetos. O plano Pro oferece projetos ilimitados, ferramentas avançadas e exportação. O Enterprise inclui suporte prioritário e customizações.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Como cancelo minha assinatura?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Acesse Configurações {">"} Plano e clique em "Cancelar Assinatura". O acesso continuará até o final do período pago. Você pode reativar a qualquer momento.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Meus dados estão seguros?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Sim! Utilizamos criptografia de ponta, conexões HTTPS e seguimos as melhores práticas de segurança. Leia nossa{" "}
                <Link href="/privacy-policy" className="text-blue-600 hover:underline">
                  Política de Privacidade
                </Link>{" "}
                para mais detalhes.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Posso usar offline?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Atualmente a plataforma requer conexão com internet. Estamos trabalhando em funcionalidades offline para futuras versões.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            Precisa de ajuda empresarial?
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Para soluções Enterprise, treinamentos corporativos ou parcerias estratégicas:
          </p>
          <a 
            href="mailto:enterprise@dttools.app" 
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline font-medium"
            data-testid="link-enterprise"
          >
            <Mail className="mr-2 h-5 w-5" />
            enterprise@dttools.app
          </a>
        </div>
      </div>
    </div>
  );
}
