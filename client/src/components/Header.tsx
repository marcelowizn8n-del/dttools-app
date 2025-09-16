import { Link } from "wouter";
import logoIcon from "../assets/logo-icon.png";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
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
                <h1 className="text-xl font-bold text-gray-900">DTTools</h1>
                <p className="text-xs text-gray-500">Design Thinking Tools</p>
              </div>
            </div>
          </Link>

          {/* Navigation - opcional para futuras funcionalidades */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/projects">
              <span className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer" data-testid="nav-projects">
                Projetos
              </span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}