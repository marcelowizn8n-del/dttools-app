import { Link } from "wouter";
import { 
  Book, 
  Settings, 
  CreditCard, 
  Users,
  Target,
  Lightbulb,
  Wrench,
  TestTube,
  BarChart3,
  Star,
  MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { UserMenu } from "@/components/auth/UserMenu";
import { LanguageSelector } from "@/components/LanguageSelector";
import logoIcon from "../assets/logo-icon.png";

export default function Header() {
  const { isAuthenticated, isAdmin } = useAuth();
  const { t } = useLanguage();

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center cursor-pointer hover:opacity-80 transition-opacity" data-testid="header-logo">
              <img 
                src={logoIcon} 
                alt="DTTools" 
                className="w-10 h-10 mr-3"
              />
              <div className="flex flex-col">
                <h1 className="text-xl font-bold">DTTools</h1>
                <p className="text-xs text-muted-foreground">Design Thinking Tools</p>
              </div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/projects">
              <Button 
                variant="ghost" 
                className="text-sm text-white hover:opacity-80" 
                style={{ backgroundColor: '#90C5E0' }}
                data-testid="nav-empathize"
              >
                <Users className="mr-1 h-4 w-4" />
                {t("phases.empathize")}
              </Button>
            </Link>
            <Link href="/projects">
              <Button 
                variant="ghost" 
                className="text-sm text-white hover:opacity-80" 
                style={{ backgroundColor: '#3A5A7E' }}
                data-testid="nav-define"
              >
                <Target className="mr-1 h-4 w-4" />
                {t("phases.define")}
              </Button>
            </Link>
            <Link href="/projects">
              <Button 
                variant="ghost" 
                className="text-sm text-black hover:opacity-80" 
                style={{ backgroundColor: '#FFD700' }}
                data-testid="nav-ideate"
              >
                <Lightbulb className="mr-1 h-4 w-4" />
                {t("phases.ideate")}
              </Button>
            </Link>
            <Link href="/projects">
              <Button 
                variant="ghost" 
                className="text-sm text-white hover:opacity-80" 
                style={{ backgroundColor: '#FF8C42' }}
                data-testid="nav-prototype"
              >
                <Wrench className="mr-1 h-4 w-4" />
                {t("phases.prototype")}
              </Button>
            </Link>
            <Link href="/projects">
              <Button 
                variant="ghost" 
                className="text-sm text-black hover:opacity-80" 
                style={{ backgroundColor: '#76D7C4' }}
                data-testid="nav-test"
              >
                <TestTube className="mr-1 h-4 w-4" />
                {t("phases.test")}
              </Button>
            </Link>
            <div className="h-6 w-px bg-gray-300 mx-2"></div>
            <Link href="/library">
              <Button variant="ghost" className="text-sm" data-testid="nav-library">
                <Book className="mr-1 h-4 w-4" />
                {t("nav.library")}
              </Button>
            </Link>
            {isAuthenticated && (
              <Link href="/chat">
                <Button variant="ghost" className="text-sm" data-testid="nav-chat">
                  <MessageCircle className="mr-1 h-4 w-4" />
                  Chat IA
                </Button>
              </Link>
            )}
            <Link href="/dashboard">
              <Button variant="ghost" className="text-sm" data-testid="nav-dashboard">
                <BarChart3 className="mr-1 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="ghost" className="text-sm" data-testid="nav-pricing">
                <CreditCard className="mr-1 h-4 w-4" />
                {t("nav.pricing")}
              </Button>
            </Link>
            {isAuthenticated && (
              <Link href="/subscription">
                <Button variant="ghost" className="text-sm" data-testid="nav-subscription">
                  <Star className="mr-1 h-4 w-4" />
                  Assinatura
                </Button>
              </Link>
            )}
            {isAdmin && (
              <Link href="/admin">
                <Button variant="ghost" className="text-sm" data-testid="nav-admin">
                  <Settings className="mr-1 h-4 w-4" />
                  {t("nav.admin")}
                </Button>
              </Link>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-2">
            <LanguageSelector />
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <Link href="/login">
                <Button data-testid="button-login">
                  {t("nav.login")}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}