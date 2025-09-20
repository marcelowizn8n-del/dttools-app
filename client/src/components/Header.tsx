import { Link } from "wouter";
import { useState } from "react";
import { 
  Book, 
  Settings, 
  CreditCard, 
  Users,
  BarChart3,
  MessageCircle,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { UserMenu } from "@/components/auth/UserMenu";
import { LanguageSelector } from "@/components/LanguageSelector";
import logoHorizontal from "../assets/logo-horizontal.png";
import dttoolsIcon from "../assets/dttools-icon.png";

export default function Header() {
  const { isAuthenticated, isAdmin } = useAuth();
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-background border-b border-border sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-6 py-3">
        <div className="flex items-center justify-between min-h-[60px] gap-4">
          {/* Logo - Clean and sustainable approach */}
          <div className="logo-container min-w-24 sm:min-w-32 md:min-w-[160px] max-w-[200px] flex-shrink-0">
            <Link href="/" className="block">
              <div className="flex items-center cursor-pointer hover:opacity-80 transition-opacity" data-testid="header-logo">
                {/* Mobile optimized logo sizing */}
                <img 
                  src={logoHorizontal} 
                  alt="DTTools" 
                  className="logo-img h-8 sm:h-12 md:h-16 lg:h-20 w-auto object-contain"
                  data-testid="logo-img"
                />
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

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="mobile-menu-button"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* User Actions - Fixed width to prevent layout shift */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0 min-w-[120px] justify-end">
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div id="mobile-menu" className="lg:hidden border-t border-border bg-background">
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-2">
                <Link href="/projects">
                  <Button variant="ghost" className="w-full justify-start" data-testid="mobile-nav-projects" onClick={() => setIsMobileMenuOpen(false)}>
                    <Users className="mr-2 h-4 w-4" />
                    {t("nav.projects") || "Projects"}
                  </Button>
                </Link>
                <Link href="/library">
                  <Button variant="ghost" className="w-full justify-start" data-testid="mobile-nav-library" onClick={() => setIsMobileMenuOpen(false)}>
                    <Book className="mr-2 h-4 w-4" />
                    {t("nav.library")}
                  </Button>
                </Link>
                {isAuthenticated && (
                  <Link href="/chat">
                    <Button variant="ghost" className="w-full justify-start" data-testid="mobile-nav-chat" onClick={() => setIsMobileMenuOpen(false)}>
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Chat IA
                    </Button>
                  </Link>
                )}
                {isAuthenticated && (
                  <Link href="/dashboard">
                    <Button variant="ghost" className="w-full justify-start" data-testid="mobile-nav-dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                )}
                <Link href="/pricing">
                  <Button variant="ghost" className="w-full justify-start" data-testid="mobile-nav-pricing" onClick={() => setIsMobileMenuOpen(false)}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    {t("nav.pricing")}
                  </Button>
                </Link>
                {isAdmin && (
                  <Link href="/admin">
                    <Button variant="ghost" className="w-full justify-start" data-testid="mobile-nav-admin" onClick={() => setIsMobileMenuOpen(false)}>
                      <Settings className="mr-2 h-4 w-4" />
                      {t("nav.admin")}
                    </Button>
                  </Link>
                )}
                
                {/* Mobile User Actions */}
                <div className="pt-4 border-t border-border">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <LanguageSelector />
                      {!isAuthenticated && (
                        <Link href="/login">
                          <Button size="sm" data-testid="mobile-button-login" onClick={() => setIsMobileMenuOpen(false)}>
                            {t("nav.login")}
                          </Button>
                        </Link>
                      )}
                    </div>
                    {isAuthenticated && (
                      <div className="pt-2">
                        <UserMenu />
                      </div>
                    )}
                  </div>
                </div>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}