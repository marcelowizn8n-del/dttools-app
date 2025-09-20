import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import LandingPage from "@/pages/landing";
import ProjectsPage from "@/pages/projects";
import ProjectsMarketingPage from "@/pages/projects-marketing";
import ProjectDetailPage from "@/pages/project-detail";
import LibraryPage from "@/pages/library";
import ArticleDetailPage from "@/pages/article-detail";
import AdminPage from "@/pages/admin";
import LoginPage from "@/pages/login";
import SignupPage from "@/pages/signup";
import CompleteProfilePage from "@/pages/complete-profile";
import PricingPage from "@/pages/pricing";
import ChatPage from "@/pages/chat";
import ProfilePage from "@/pages/profile";
import NotFound from "@/pages/not-found";
import { useAuth } from "@/contexts/AuthContext";
import DashboardPage from "@/pages/dashboard";

function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return isAuthenticated ? <DashboardPage /> : <LandingPage />;
}

function ProjectsRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return isAuthenticated ? <ProjectsPage /> : <ProjectsMarketingPage />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/projects" component={ProjectsRoute} />
      <Route path="/projects/:id" component={ProjectDetailPage} />
      <Route path="/library" component={LibraryPage} />
      <Route path="/library/article/:id" component={ArticleDetailPage} />
      <Route path="/chat" component={ChatPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/pricing" component={PricingPage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/complete-profile" component={CompleteProfilePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <AuthProvider>
            <div className="min-h-screen bg-background">
              <Header />
              <main className="min-h-0">
                <Router />
              </main>
            </div>
            <Toaster />
          </AuthProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;