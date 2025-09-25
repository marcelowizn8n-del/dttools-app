import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import ScreenshotGenerator from "./utils/screenshot-generator";

// Global error handling
window.onerror = (message, source, lineno, colno, error) => {
  console.error("Global Error:", {
    message,
    source,
    line: lineno,
    column: colno,
    error: error?.stack
  });
  
  // Log to monitoring service in production
  if (import.meta.env.PROD) {
    // Send to analytics/monitoring service
    console.warn("Error logged for monitoring:", message);
  }
  
  return false; // Let default error handling continue
};

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error("Unhandled Promise Rejection:", {
    reason: event.reason,
    promise: event.promise
  });
  
  // Log to monitoring service in production
  if (import.meta.env.PROD) {
    console.warn("Promise rejection logged for monitoring:", event.reason);
  }
  
  // Prevent default behavior only in production
  if (import.meta.env.PROD) {
    event.preventDefault();
  }
});

// Global screenshot functions available in any page

// Make screenshot functions globally available
(window as any).captureFullPage = async (filename = 'dttools-page') => {
  const generator = new ScreenshotGenerator();
  await generator.captureCurrentPage(filename, true);
  console.log(`✅ Screenshot saved as: ${filename}.png`);
};

(window as any).captureSection = async (selector: string, filename = 'dttools-section') => {
  const generator = new ScreenshotGenerator();
  await generator.captureSection(selector, filename);
  console.log(`✅ Section screenshot saved as: ${filename}.png`);
};

// Quick capture functions for common sections
(window as any).captureHero = () => (window as any).captureSection('section:first-child', 'dttools-hero');
(window as any).capturePhases = () => (window as any).captureSection('section:nth-child(2)', 'dttools-phases');
(window as any).captureFeatures = () => (window as any).captureSection('section:nth-child(3)', 'dttools-features');
(window as any).captureBenchmarking = () => (window as any).captureSection('section:nth-child(4)', 'dttools-benchmarking');

// Helper to show available commands
(window as any).showScreenshotHelp = () => {
  console.log(`
🎯 DTTOOLS SCREENSHOT COMMANDS:

📸 BÁSICOS:
captureFullPage()           - Captura página completa
captureFullPage('home')     - Captura com nome personalizado

🎨 SEÇÕES (apenas na HOME):
captureHero()              - Hero section com logo
capturePhases()            - 5 fases do Design Thinking  
captureFeatures()          - Features (incluindo Kanban)
captureBenchmarking()      - Sistema DVF

🔧 AVANÇADO:
captureSection('.minha-classe', 'nome')  - Captura elemento específico

💡 COMO USAR:
1. Navegue para qualquer página (/, /pricing, /projects, etc)
2. Pressione F12 para abrir o console
3. Digite um dos comandos acima
4. A imagem será baixada automaticamente!

Exemplo: captureFullPage('home-completa')
  `);
};

// Show help on load
console.log('🎯 DTTools Screenshot System loaded! Type: showScreenshotHelp()');

createRoot(document.getElementById("root")!).render(<App />);
