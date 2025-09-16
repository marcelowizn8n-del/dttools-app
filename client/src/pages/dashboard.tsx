import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/Sidebar";
import MetricsGrid from "@/components/MetricsGrid";
import ProgressChart from "@/components/ProgressChart";
import TeamPerformance from "@/components/TeamPerformance";
import RecentReports from "@/components/RecentReports";
import AIInsights from "@/components/AIInsights";
import IntegrationStatus from "@/components/IntegrationStatus";
import { Button } from "@/components/ui/button";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Bell } from "lucide-react";

export default function Dashboard() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ["/api/metrics"],
  });

  const { data: unreadInsights } = useQuery({
    queryKey: ["/api/ai-insights/unread"],
  });

  // Log user behavior for AI learning
  useEffect(() => {
    apiRequest("POST", "/api/user-behavior", {
      action: "view_dashboard",
      context: { timestamp: new Date().toISOString() },
      userId: "current_user",
    }).catch(() => {
      // Silently handle errors for analytics
    });
  }, []);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      // Get the first active event for demo purposes
      const eventsResponse = await apiRequest("GET", "/api/events");
      const events = await eventsResponse.json();
      const activeEvent = events.find((event: any) => event.status === "active");
      
      if (!activeEvent) {
        toast({
          title: "No Active Events",
          description: "Please create an active event to generate reports.",
          variant: "destructive",
        });
        return;
      }

      await apiRequest("POST", "/api/reports/generate", {
        eventId: activeEvent.id,
      });

      // Invalidate queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ["/api/reports/recent"] });
      queryClient.invalidateQueries({ queryKey: ["/api/metrics"] });

      // Log user behavior
      await apiRequest("POST", "/api/user-behavior", {
        action: "generate_report",
        context: { eventId: activeEvent.id },
        userId: "current_user",
      });

      toast({
        title: "Report Generated",
        description: "Weekly progress report has been generated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Weekly Progress Dashboard</h1>
              <p className="text-muted-foreground mt-1">Automated insights from your project management tools</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* AI Learning Indicator */}
              <div className="flex items-center space-x-2 bg-accent/50 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-accent-foreground">AI Learning Active</span>
              </div>
              
              <Button 
                onClick={handleGenerateReport}
                disabled={isGenerating}
                data-testid="button-generate-report"
              >
                <Plus className="w-4 h-4 mr-2" />
                {isGenerating ? "Generating..." : "Generate Report"}
              </Button>
              
              <div className="relative">
                <Button variant="ghost" size="icon" data-testid="button-notifications">
                  <Bell className="w-4 h-4" />
                  {unreadInsights && Array.isArray(unreadInsights) && unreadInsights.length > 0 ? (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full text-xs" />
                  ) : null}
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-muted/30">
          <MetricsGrid metrics={metrics as any} isLoading={metricsLoading} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ProgressChart />
            <TeamPerformance />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <RecentReports />
            <AIInsights />
          </div>
          
          <IntegrationStatus />
        </div>
      </main>
    </div>
  );
}
