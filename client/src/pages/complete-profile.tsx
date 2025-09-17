import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { CompleteProfileForm } from "@/components/auth/CompleteProfileForm";
import { useAuth } from "@/contexts/AuthContext";

export default function CompleteProfilePage() {
  const [, navigate] = useLocation();
  const [signupData, setSignupData] = useState<any>(null);

  useEffect(() => {
    // Get signup data from localStorage
    const storedData = localStorage.getItem('signupData');
    if (!storedData) {
      // If no signup data, redirect to signup
      navigate("/signup");
      return;
    }
    
    try {
      const userData = JSON.parse(storedData);
      setSignupData(userData);
    } catch (error) {
      navigate("/signup");
    }
  }, [navigate]);

  const handleCompleteProfile = async (profileData: any) => {
    try {
      // Combine signup data with profile data
      const completeUserData = {
        ...signupData,
        ...profileData
      };

      // TODO: Send complete user data to API to create account
      console.log('Creating user with data:', completeUserData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Clear stored signup data
      localStorage.removeItem('signupData');
      
      // Show success message and redirect to login
      alert('Conta criada com sucesso! Faça login para continuar.');
      navigate("/login");
      
    } catch (error) {
      console.error('Error creating account:', error);
      alert('Erro ao criar conta. Tente novamente.');
    }
  };

  if (!signupData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <CompleteProfileForm 
        userName={signupData.name}
        onComplete={handleCompleteProfile} 
      />
    </div>
  );
}