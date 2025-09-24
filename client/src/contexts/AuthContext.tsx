import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { User } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface AuthState {
  user: Omit<User, "password"> | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Initialize auth state by checking server session
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check server session first
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });
        
        if (response.ok) {
          // Verify response is JSON before parsing
          const contentType = response.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            console.warn("Auth check received non-JSON response, treating as unauthenticated");
            throw new Error("Non-JSON response from server");
          }
          
          const { user } = await response.json();
          // Sync localStorage with server session
          localStorage.setItem("auth_user", JSON.stringify(user));
          setState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          // Server session invalid, clear localStorage
          localStorage.removeItem("auth_user");
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        // On error, clear localStorage and set unauthenticated
        localStorage.removeItem("auth_user");
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const response = await apiRequest("POST", "/api/auth/login", { username, password });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Login failed");
      }

      const { user } = await response.json();
      
      // Store user in localStorage
      localStorage.setItem("auth_user", JSON.stringify(user));
      
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      }));
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Call logout endpoint (even if it fails, we still log out locally)
      await apiRequest("POST", "/api/auth/logout");
    } catch {
      // Ignore logout API errors
    }

    // Clear local storage and state
    localStorage.removeItem("auth_user");
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    
    // Force complete navigation reset for Safari compatibility
    setTimeout(() => {
      window.location.href = window.location.origin;
    }, 100);
  };

  const isAdmin = state.user?.role === "admin";

  const contextValue: AuthContextType = {
    ...state,
    login,
    logout,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Protected Route component
interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
  fallback?: ReactNode;
}

export function ProtectedRoute({ 
  children, 
  adminOnly = false, 
  fallback = <div>Access denied</div> 
}: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return fallback;
  }

  if (adminOnly && !isAdmin) {
    return fallback;
  }

  return <>{children}</>;
}