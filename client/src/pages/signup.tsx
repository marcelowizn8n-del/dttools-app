import { useState } from "react";
import { useLocation } from "wouter";
import { SignupForm } from "@/components/auth/SignupForm";
import { useAuth } from "@/contexts/AuthContext";

export default function SignupPage() {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate("/");
    return null;
  }

  const handleSignupSuccess = (userData: any) => {
    // Store signup data in localStorage temporarily
    localStorage.setItem('signupData', JSON.stringify(userData));
    // Redirect to complete profile page
    navigate("/complete-profile");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <SignupForm onSuccess={handleSignupSuccess} />
    </div>
  );
}