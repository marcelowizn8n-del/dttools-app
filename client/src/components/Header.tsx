import { Link } from "wouter";
import { Book, Settings, CreditCard } from "lucide-react";
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
          <Link href="/projects">
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
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/projects">
              <Button variant="ghost" data-testid="nav-projects">
                {t("nav.projects")}
              </Button>
            </Link>
            <Link href="/library">
              <Button variant="ghost" data-testid="nav-library">
                <Book className="mr-2 h-4 w-4" />
                {t("nav.library")}
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="ghost" data-testid="nav-pricing">
                <CreditCard className="mr-2 h-4 w-4" />
                {t("nav.pricing")}
              </Button>
            </Link>
            {isAdmin && (
              <Link href="/admin">
                <Button variant="ghost" data-testid="nav-admin">
                  <Settings className="mr-2 h-4 w-4" />
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