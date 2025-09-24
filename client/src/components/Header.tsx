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
// Use direct path to logo in public root
const logoHorizontal = "/logo-horizontal.png";

export default function Header() {
  const { isAuthenticated, isAdmin } = useAuth();
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-background border-b border-border">
      <div className="container mx-auto px-4 md:px-6 py-3">
        <div className="flex items-center justify-between min-h-[60px] gap-1 sm:gap-2 md:gap-4">
          {/* Logo - Container reserves space to prevent layout shifts */}
          <div className="flex-shrink-0">
            <Link href="/" className="block">
              <div className="flex items-center cursor-pointer hover:opacity-80 transition-opacity" data-testid="header-logo">
                {/* Full logo for all screen sizes */}
                <img 
                  src={logoHorizontal}
                  alt="DTTools" 
                  className="object-contain shrink-0 h-8 w-auto sm:h-10 md:h-14 lg:h-16"
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

          {/* User Actions & Mobile Menu */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Mobile: Menu Button Only */}
            <div className="lg:hidden relative z-20">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                data-testid="mobile-menu-button"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
                className="p-2 relative z-20"
              >
                {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>

            {/* Desktop: Full User Actions */}
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
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div id="mobile-menu" className="lg:hidden border-t border-border bg-background relative z-10">
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
                  <div className="flex flex-col space-y-3">
                    <div className="flex justify-center">
                      <LanguageSelector />
                    </div>
                    {isAuthenticated ? (
                      <div className="flex justify-center">
                        <UserMenu />
                      </div>
                    ) : (
                      <Link href="/login">
                        <Button className="w-full" data-testid="mobile-button-login" onClick={() => setIsMobileMenuOpen(false)}>
                          {t("nav.login")}
                        </Button>
                      </Link>
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