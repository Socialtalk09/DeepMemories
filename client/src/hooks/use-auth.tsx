import { createContext, ReactNode, useContext, useEffect } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { insertUserSchema, User as SelectUser, InsertUser } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<Omit<SelectUser, "password">, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<Omit<SelectUser, "password">, Error, InsertUser>;
  checkAuthStatus: () => void;
};

type LoginData = Pick<InsertUser, "username" | "password">;

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const {
    data: user,
    error,
    isLoading,
    refetch: refetchUser,
  } = useQuery<SelectUser | null, Error>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Function to check authentication status
  const checkAuthStatus = () => {
    refetchUser();
  };

  // Initial check on mount and after any navigation
  useEffect(() => {
    checkAuthStatus();
    
    // Set up periodic session check to maintain authentication
    const intervalId = setInterval(() => {
      checkAuthStatus();
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      console.log("Attempting login with:", credentials);
      const res = await apiRequest("POST", "/api/login", credentials);
      console.log("Login response status:", res.status);
      const result = await res.json();
      console.log("Login response data:", result);
      return result;
    },
    onSuccess: (user: Omit<SelectUser, "password">) => {
      console.log("Login successful, user data:", user);
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.firstName || user.username}!`,
      });
      setLocation("/");
      
      // Refetch user after login to ensure we have the latest data
      setTimeout(() => {
        checkAuthStatus();
      }, 500);
    },
    onError: (error: Error) => {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: InsertUser) => {
      console.log("Attempting registration with:", credentials);
      const res = await apiRequest("POST", "/api/register", credentials);
      console.log("Registration response status:", res.status);
      const result = await res.json();
      console.log("Registration response data:", result);
      return result;
    },
    onSuccess: (user: Omit<SelectUser, "password">) => {
      console.log("Registration successful, user data:", user);
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Registration successful",
        description: `Welcome to Dearly, ${user.firstName || user.username}!`,
      });
      setLocation("/");
      
      // Refetch user after registration to ensure we have the latest data
      setTimeout(() => {
        checkAuthStatus();
      }, 500);
    },
    onError: (error: Error) => {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      setLocation("/auth");
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
