import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

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

createRoot(document.getElementById("root")!).render(<App />);
