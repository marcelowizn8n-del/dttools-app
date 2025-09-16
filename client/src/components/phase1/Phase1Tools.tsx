import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, User, MessageCircle, Eye } from "lucide-react";
import EmpathyMapTool from "./EmpathyMapTool";
import PersonaTool from "./PersonaTool";
import InterviewTool from "./InterviewTool";
import ObservationTool from "./ObservationTool";

interface Phase1ToolsProps {
  projectId: string;
}

export default function Phase1Tools({ projectId }: Phase1ToolsProps) {
  const [activeTab, setActiveTab] = useState("empathy-maps");

  const tools = [
    {
      id: "empathy-maps",
      label: "Mapas de Empatia",
      icon: Users,
      color: "text-red-600",
      component: <EmpathyMapTool projectId={projectId} />
    },
    {
      id: "personas",
      label: "Personas",
      icon: User,
      color: "text-blue-600",
      component: <PersonaTool projectId={projectId} />
    },
    {
      id: "interviews",
      label: "Entrevistas",
      icon: MessageCircle,
      color: "text-green-600",
      component: <InterviewTool projectId={projectId} />
    },
    {
      id: "observations",
      label: "Observações",
      icon: Eye,
      color: "text-purple-600",
      component: <ObservationTool projectId={projectId} />
    }
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Fase 1: Empatizar</h2>
            <p className="text-gray-600">
              Entenda profundamente seus usuários através de pesquisa e observação
            </p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <TabsTrigger
                key={tool.id}
                value={tool.id}
                className="flex items-center gap-2"
                data-testid={`tab-${tool.id}`}
              >
                <Icon className={`w-4 h-4 ${tool.color}`} />
                <span className="hidden sm:inline">{tool.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {tools.map((tool) => (
          <TabsContent 
            key={tool.id} 
            value={tool.id} 
            className="mt-6"
            data-testid={`content-${tool.id}`}
          >
            {tool.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}