import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Users, Target, Lightbulb, Wrench, TestTube, Star, CheckCircle, Zap, Globe, BookOpen, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import logoHorizontal from "../assets/logo-horizontal.png";
import dttoolsIcon from "../assets/dttools-icon.png";

const phases = [
  {
    id: 1,
    icon: Users,
    name: "Empatizar",
    nameEn: "Empathize",
    description: "Compreenda profundamente seus usuários através de pesquisas, entrevistas e observações.",
    descriptionEn: "Deeply understand your users through research, interviews and observations.",
    bgColor: "#E8F4FA", // Tom suave de #90C5E0
    borderColor: "#90C5E0",
    iconColor: "#5A9FC5",
    textColor: "#2C5F7C"
  },
  {
    id: 2,
    icon: Target,
    name: "Definir",
    nameEn: "Define", 
    description: "Defina claramente o problema e crie declarações de ponto de vista focadas.",
    descriptionEn: "Clearly define the problem and create focused point of view statements.",
    bgColor: "#E2E6ED", // Tom suave de #3A5A7E
    borderColor: "#3A5A7E",
    iconColor: "#2C4560",
    textColor: "#1E2F45"
  },
  {
    id: 3,
    icon: Lightbulb,
    name: "Idear", 
    nameEn: "Ideate",
    description: "Gere uma ampla gama de ideias criativas através de brainstorming estruturado.",
    descriptionEn: "Generate a wide range of creative ideas through structured brainstorming.",
    bgColor: "#FFFBEB", // Tom suave de #FFD700
    borderColor: "#FFD700",
    iconColor: "#D4AF00",
    textColor: "#7A6500"
  },
  {
    id: 4,
    icon: Wrench,
    name: "Prototipar",
    nameEn: "Prototype",
    description: "Construa protótipos rápidos e baratos para testar suas melhores ideias.",
    descriptionEn: "Build quick and inexpensive prototypes to test your best ideas.",
    bgColor: "#FFF2EC", // Tom suave de #FF8C42
    borderColor: "#FF8C42",
    iconColor: "#E07038",
    textColor: "#8C4A1F"
  },
  {
    id: 5,
    icon: TestTube,
    name: "Testar",
    nameEn: "Test",
    description: "Teste seus protótipos com usuários reais e colete feedback valioso.",
    descriptionEn: "Test your prototypes with real users and collect valuable feedback.",
    bgColor: "#E9FAF6", // Tom suave de #76D7C4
    borderColor: "#76D7C4",
    iconColor: "#48A396",
    textColor: "#2D6B5F"
  }
];

const features = [
  {
    icon: Zap,
    title: "Processo Guiado",
    titleEn: "Guided Process",
    description: "Siga um processo estruturado através das 5 fases do Design Thinking",
    descriptionEn: "Follow a structured process through the 5 phases of Design Thinking"
  },
  {
    icon: Users,
    title: "Colaboração em Tempo Real", 
    titleEn: "Real-time Collaboration",
    description: "Trabalhe com sua equipe simultaneamente em projetos complexos",
    descriptionEn: "Work with your team simultaneously on complex projects"
  },
  {
    icon: BookOpen,
    title: "Biblioteca de Conhecimento",
    titleEn: "Knowledge Library", 
    description: "Acesse centenas de artigos, templates e melhores práticas",
    descriptionEn: "Access hundreds of articles, templates and best practices"
  },
  {
    icon: TrendingUp,
    title: "Métricas e Progresso",
    titleEn: "Metrics & Progress",
    description: "Acompanhe o progresso dos projetos com dashboards detalhados",
    descriptionEn: "Track project progress with detailed dashboards"
  },
  {
    icon: Globe,
    title: "Suporte Multi-idioma",
    titleEn: "Multi-language Support", 
    description: "Interface disponível em português, inglês, espanhol e francês",
    descriptionEn: "Interface available in Portuguese, English, Spanish and French"
  },
  {
    icon: CheckCircle,
    title: "Exportação Profissional",
    titleEn: "Professional Export",
    description: "Exporte seus projetos em PDF, PNG e CSV para apresentações",
    descriptionEn: "Export your projects in PDF, PNG and CSV for presentations"
  }
];

const testimonials = [
  {
    name: "Maria Silva",
    role: "Head of Innovation",
    company: "TechCorp",
    content: "DTTools transformou completamente nossa forma de inovar. Conseguimos reduzir o tempo de desenvolvimento em 40%.",
    contentEn: "DTTools completely transformed how we innovate. We managed to reduce development time by 40%."
  },
  {
    name: "João Santos", 
    role: "Product Manager",
    company: "StartupXYZ",
    content: "A plataforma mais completa para Design Thinking que já usei. Intuitiva e poderosa.",
    contentEn: "The most complete Design Thinking platform I've ever used. Intuitive and powerful."
  },
  {
    name: "Ana Costa",
    role: "Design Lead", 
    company: "AgencyABC",
    content: "Nossos clientes ficaram impressionados com a qualidade dos insights que conseguimos gerar.",
    contentEn: "Our clients were impressed with the quality of insights we were able to generate."
  }
];

export default function LandingPage() {
  const { t, language } = useLanguage();
  const [hoveredPhase, setHoveredPhase] = useState<number | null>(null);

  const isEnglish = language === 'en';

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative container mx-auto px-6 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Ícone DTTools GRANDE e proeminente */}
            <div className="mb-6">
              <img 
                src={dttoolsIcon} 
                alt="DTTools Icon" 
                className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 mx-auto mb-4 object-contain drop-shadow-lg"
                data-testid="dttools-icon-landing"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {t("landing.hero.title")}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              {t("landing.hero.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/signup">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6">
                  {t("landing.start.free")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-blue-600 text-blue-700 hover:bg-blue-50 bg-white">
                  {t("landing.view.plans")}
                </Button>
              </Link>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              {t("landing.trial.info")}
            </p>
          </div>
        </div>
      </section>

      {/* Design Thinking Process */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("landing.5.phases.title")}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("landing.5.phases.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {phases.map((phase, index) => {
              const Icon = phase.icon;
              const isHovered = hoveredPhase === phase.id;
              
              return (
                <Link href="/login" key={phase.id}>
                  <Card 
                    className="relative transition-all duration-300 cursor-pointer border-2 hover:shadow-lg hover:scale-105"
                    style={{
                      backgroundColor: phase.bgColor,
                      borderColor: isHovered ? phase.borderColor : '#e5e7eb'
                    }}
                    onMouseEnter={() => setHoveredPhase(phase.id)}
                    onMouseLeave={() => setHoveredPhase(null)}
                    data-testid={`card-phase-${phase.id}`}
                  >
                    <CardHeader className="text-center pb-3">
                      <div 
                        className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3"
                        style={{
                          backgroundColor: isHovered ? phase.borderColor : 'white',
                          color: isHovered ? 'white' : phase.iconColor
                        }}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <CardTitle className="text-lg font-semibold">
                        {index + 1}. {isEnglish ? phase.nameEn : phase.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm text-gray-600 leading-relaxed">
                        {isEnglish ? phase.descriptionEn : phase.description}
                      </CardDescription>
                    </CardContent>
                    {index < phases.length - 1 && (
                      <div className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2 z-10">
                        <ArrowRight className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("landing.everything.title")}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("landing.everything.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl font-semibold">
                      {isEnglish ? feature.titleEn : feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {isEnglish ? feature.descriptionEn : feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("landing.trusted.title")}
            </h2>
            <div className="flex justify-center items-center gap-2 mb-8">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-2 text-gray-600 font-medium">
                {t("landing.rating")}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-4 leading-relaxed">
                    "{t(`landing.testimonial.${index + 1}`)}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}, {testimonial.company}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 pb-48 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t("landing.ready.title")}
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {t("landing.ready.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href="/login">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6" data-testid="button-start-trial">
                {t("landing.start.trial")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/library">
              <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-6 bg-transparent" data-testid="button-explore-library">
                📚 Explorar Biblioteca
              </Button>
            </Link>
          </div>
          {/* Visual spacing to ensure buttons are fully visible */}
          <div className="h-16"></div>
        </div>
      </section>
    </div>
  );
}