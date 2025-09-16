import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Users, 
  Target, 
  Lightbulb, 
  Wrench, 
  TestTube, 
  Play, 
  ArrowRight, 
  CheckCircle,
  Star,
  TrendingUp,
  Clock,
  Award,
  Zap,
  BookOpen,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "wouter";
import type { Project } from "@shared/schema";

const phases = [
  {
    id: 1,
    name: "Empatizar",
    nameEn: "Empathize",
    description: "Compreenda profundamente seus usuários",
    descriptionEn: "Deeply understand your users",
    icon: Users,
    color: "hover:shadow-lg transition-all duration-300",
    bgColor: "#90C5E0",
    hoverColor: "#69A1C5",
    iconColor: "text-white",
    completed: false
  },
  {
    id: 2,
    name: "Definir",
    nameEn: "Define",
    description: "Sintetize informações e identifique problemas",
    descriptionEn: "Synthesize information and identify problems",
    icon: Target,
    color: "hover:shadow-lg transition-all duration-300",
    bgColor: "#3A5A7E",
    hoverColor: "#2A4259",
    iconColor: "text-white",
    completed: false
  },
  {
    id: 3,
    name: "Idear",
    nameEn: "Ideate",
    description: "Gere soluções criativas e inovadoras",
    descriptionEn: "Generate creative and innovative solutions",
    icon: Lightbulb,
    color: "hover:shadow-lg transition-all duration-300",
    bgColor: "#FFD700",
    hoverColor: "#E6C200",
    iconColor: "text-black",
    completed: false
  },
  {
    id: 4,
    name: "Prototipar",
    nameEn: "Prototype",
    description: "Torne suas ideias tangíveis",
    descriptionEn: "Make your ideas tangible",
    icon: Wrench,
    color: "hover:shadow-lg transition-all duration-300",
    bgColor: "#FF8C42",
    hoverColor: "#E0773A",
    iconColor: "text-white",
    completed: false
  },
  {
    id: 5,
    name: "Testar",
    nameEn: "Test",
    description: "Valide soluções com usuários reais",
    descriptionEn: "Validate solutions with real users",
    icon: TestTube,
    color: "hover:shadow-lg transition-all duration-300",
    bgColor: "#76D7C4",
    hoverColor: "#48A9A6",
    iconColor: "text-black",
    completed: false
  }
];

const benefits = [
  {
    icon: Users,
    title: "Centrado no Ser Humano",
    titleEn: "Human-Centered",
    description: "Coloque as necessidades e experiências dos usuários no centro do processo de design.",
    descriptionEn: "Put user needs and experiences at the center of the design process."
  },
  {
    icon: TrendingUp,
    title: "Processo Iterativo",
    titleEn: "Iterative Process",
    description: "Refine suas soluções através de ciclos contínuos de teste e aprendizado.",
    descriptionEn: "Refine your solutions through continuous cycles of testing and learning."
  },
  {
    icon: Zap,
    title: "Colaborativo",
    titleEn: "Collaborative",
    description: "Trabalhe em equipe e combine diferentes perspectivas para soluções mais ricas.",
    descriptionEn: "Work as a team and combine different perspectives for richer solutions."
  }
];

const nextSteps = [
  "Comece pela fase Empatizar para entender seus usuários",
  "Explore as ferramentas adicionais no menu Ferramentas",
  "Complete mais ações para conquistar novos badges"
];

const nextStepsEn = [
  "Start with the Empathize phase to understand your users",
  "Explore additional tools in the Tools menu",
  "Complete more actions to earn new badges"
];

export default function Dashboard() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  // Remove the isEnglish variable, use t() for everything
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const totalProjects = projects.length;
  const avgProgress = totalProjects > 0 
    ? Math.round(projects.reduce((sum, p) => sum + (p.completionRate || 0), 0) / totalProjects)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative container mx-auto px-6 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full shadow-lg flex items-center justify-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <div className="absolute w-6 h-6 bg-yellow-400 rounded-full -top-1 -right-1"></div>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">{t("dashboard.hero.title")}</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              {t("dashboard.hero.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/projects">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6">
                  <Play className="mr-2 h-5 w-5" />
                  {t("dashboard.start.project")}
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-blue-600 text-blue-700 hover:bg-blue-50 bg-white">
                {t("dashboard.explore.phases")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Progress Card */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    <CardTitle className="text-lg">
                      {t("dashboard.your.progress")}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-2">
                      {t("dashboard.beginner")} • 0%
                    </div>
                    <Progress value={avgProgress} className="mb-4" />
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{totalProjects}</div>
                      <p className="text-xs text-gray-600">{t("dashboard.points")}</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{completedProjects}</div>
                      <p className="text-xs text-gray-600">{t("dashboard.badges")}</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-600">0/5</div>
                      <p className="text-xs text-gray-600">{t("dashboard.phases")}</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">0m</div>
                      <p className="text-xs text-gray-600">{t("dashboard.session")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Phase Progress */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    {t("dashboard.progress.by.phase")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {phases.map((phase) => {
                    const Icon = phase.icon;
                    return (
                      <div key={phase.id} className="flex items-center gap-3">
                        <div 
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${phase.iconColor}`}
                          style={{ 
                            backgroundColor: phase.bgColor,
                            opacity: phase.completed ? 1 : 0.7
                          }}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className={`text-sm font-medium ${
                          phase.completed ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {t(`phases.${phase.name.toLowerCase()}`)}
                        </span>
                        {phase.completed && (
                          <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    {t("dashboard.recent.activity")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 text-center py-4">
                    {t("dashboard.no.activity")}
                  </p>
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    {t("dashboard.next.steps")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {[1, 2, 3].map((index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-blue-600 font-bold">•</span>
                        {t(`next.step.${index}`)}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* 5 Phases Section */}
            <section>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {t("dashboard.5.phases.title")}
                </h2>
                <p className="text-lg text-gray-600">
                  {t("dashboard.5.phases.subtitle")}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {phases.map((phase) => {
                  const Icon = phase.icon;
                  const isHovered = selectedPhase === phase.id;
                  
                  return (
                    <Card 
                      key={phase.id}
                      className={`cursor-pointer transition-all duration-300 border-2 ${
                        isHovered ? 'shadow-lg scale-105' : 'shadow-md'
                      }`}
                      style={{
                        backgroundColor: isHovered ? phase.hoverColor : phase.bgColor,
                        borderColor: phase.bgColor,
                        color: phase.iconColor === 'text-black' ? '#000' : '#fff'
                      }}
                      onMouseEnter={() => setSelectedPhase(phase.id)}
                      onMouseLeave={() => setSelectedPhase(null)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-4">
                          <div 
                            className={`w-12 h-12 rounded-lg flex items-center justify-center ${phase.iconColor}`}
                            style={{ 
                              backgroundColor: 'rgba(255,255,255,0.2)',
                              backdropFilter: 'blur(10px)'
                            }}
                          >
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">
                              {phase.id}. {t(`phases.${phase.name.toLowerCase()}`)}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {t(`phases.${phase.name.toLowerCase()}.desc`)}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            </section>

            {/* Why Use Platform */}
            <section>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {t("dashboard.why.platform")}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  
                  return (
                    <Card key={index} className="text-center shadow-lg border-0 hover:shadow-xl transition-shadow">
                      <CardHeader>
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-xl">
                          {t(`benefits.${benefit.title.toLowerCase().replace(/ /g, '.')}`)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-gray-600 leading-relaxed">
                          {t(`benefits.${benefit.title.toLowerCase().replace(/ /g, '.')}.desc`)}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>

            {/* CTA Section */}
            <section className="text-center">
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-xl">
                <CardContent className="py-12">
                  <h2 className="text-3xl font-bold mb-4">
                    {t("dashboard.ready.start")}
                  </h2>
                  <p className="text-xl mb-8 text-blue-100">
                    {t("dashboard.ready.subtitle")}
                  </p>
                  <Link href="/projects">
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6">
                      <Play className="mr-2 h-5 w-5" />
                      {t("dashboard.start.now")}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}