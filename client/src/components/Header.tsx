import { Link } from "wouter";
import { 
  Book, 
  Settings, 
  CreditCard, 
  Users,
  BarChart3,
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
    <header className="bg-background border-b border-border sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-6 py-3">
        <div className="flex items-center justify-between min-h-[60px] gap-4">
          {/* Logo - Clean and sustainable approach */}
          <div className="logo-container min-w-24 sm:min-w-[140px] md:min-w-[160px] max-w-[200px]">
            <Link href="/" className="block">
              <div className="flex items-center cursor-pointer hover:opacity-80 transition-opacity" data-testid="header-logo">
                <img 
                  src={logoIcon} 
                  alt="DTTools" 
                  className="logo-img w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 mr-2 sm:mr-3"
                  data-testid="logo-img"
                />
                <div className="flex flex-col min-w-0 flex-1">
                  <h1 className="text-base sm:text-lg md:text-xl font-bold whitespace-nowrap text-foreground overflow-hidden text-ellipsis">
                    DTTools
                  </h1>
                  <p className="text-xs text-muted-foreground whitespace-nowrap hidden sm:block overflow-hidden text-ellipsis">Design Thinking Tools</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation - Center section with responsive sizing */}
          <nav className="hidden lg:flex items-center gap-2 xl:gap-4 flex-1 justify-center max-w-3xl">
            <Link href="/projects">
              <Button variant="ghost" className="text-sm" data-testid="nav-projects">
                <Users className="mr-1 h-4 w-4" />
                {t("nav.projects") || "Projects"}
              </Button>
            </Link>
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
            {isAuthenticated && (
              <Link href="/dashboard">
                <Button variant="ghost" className="text-sm" data-testid="nav-dashboard">
                  <BarChart3 className="mr-1 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            )}
            <Link href="/pricing">
              <Button variant="ghost" className="text-sm" data-testid="nav-pricing">
                <CreditCard className="mr-1 h-4 w-4" />
                {t("nav.pricing")}
              </Button>
            </Link>
            {isAdmin && (
              <Link href="/admin">
                <Button variant="ghost" className="text-sm" data-testid="nav-admin">
                  <Settings className="mr-1 h-4 w-4" />
                  {t("nav.admin")}
                </Button>
              </Link>
            )}
          </nav>

          {/* User Actions - Fixed width to prevent layout shift */}
          <div className="flex items-center gap-2 flex-shrink-0 min-w-[120px] justify-end">
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