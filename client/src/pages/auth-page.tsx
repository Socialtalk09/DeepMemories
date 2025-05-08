import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Loader2, Heart, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const { user, loginMutation, registerMutation } = useAuth();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      firstName: "",
      lastName: "",
    },
  });

  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate(data);
  };

  // Redirect if already logged in
  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left side - Form */}
      <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24 bg-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-primary via-secondary to-accent opacity-80"></div>
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary-100 rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-secondary-100 rounded-full filter blur-3xl opacity-30"></div>
        
        <div className="w-full max-w-md mx-auto relative z-10">
          <div className="flex items-center mb-10">
            <div className="bg-primary-50 p-2.5 rounded-lg mr-3">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <h1 className="gradient-heading text-3xl font-bold">Dearly</h1>
          </div>

          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 p-1 bg-muted">
              <TabsTrigger value="login" className="rounded-md text-sm font-medium py-2.5">Sign In</TabsTrigger>
              <TabsTrigger value="register" className="rounded-md text-sm font-medium py-2.5">Create Account</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h2>
                <p className="text-muted-foreground">Sign in to your account to continue</p>
              </div>

              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5">
                  <FormField
                    control={loginForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Username</FormLabel>
                        <FormControl>
                          <div className="form-input-wrapper">
                            <User className="input-icon" />
                            <Input placeholder="Your username" className="pl-10 h-11" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Password</FormLabel>
                        <FormControl>
                          <div className="form-input-wrapper">
                            <Lock className="input-icon" />
                            <Input placeholder="Your password" type="password" className="pl-10 h-11" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full h-11 mt-2 animated-btn bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 transition-all"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing In
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </Form>

              <div className="mt-8 text-center">
                <p className="text-muted-foreground">
                  Don't have an account?{" "}
                  <button
                    onClick={() => setActiveTab("register")}
                    className="text-primary hover:text-primary-700 font-medium transition-colors"
                  >
                    Create one
                  </button>
                </p>
              </div>
            </TabsContent>

            <TabsContent value="register">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Create an account</h2>
                <p className="text-muted-foreground">Join Dearly to create your digital legacy</p>
              </div>

              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={registerForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" className="h-11" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" className="h-11" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Email</FormLabel>
                        <FormControl>
                          <div className="form-input-wrapper">
                            <Mail className="input-icon" />
                            <Input placeholder="you@example.com" type="email" className="pl-10 h-11" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Username</FormLabel>
                        <FormControl>
                          <div className="form-input-wrapper">
                            <User className="input-icon" />
                            <Input placeholder="Choose a username" className="pl-10 h-11" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Password</FormLabel>
                        <FormControl>
                          <div className="form-input-wrapper">
                            <Lock className="input-icon" />
                            <Input placeholder="Create a password" type="password" className="pl-10 h-11" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full h-11 mt-2 animated-btn bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 transition-all"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </Form>

              <div className="mt-8 text-center">
                <p className="text-muted-foreground">
                  Already have an account?{" "}
                  <button
                    onClick={() => setActiveTab("login")}
                    className="text-primary hover:text-primary-700 font-medium transition-colors"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right side - Hero */}
      <div className="hidden md:flex flex-col justify-between gradient-bg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZGVmcz4KICA8cGF0dGVybiBpZD0icGF0dGVybiIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUgNTAgNTApIj4KICAgIDxjaXJjbGUgcj0iMSIgY3g9IjIwIiBjeT0iMjAiIGZpbGw9ImN1cnJlbnRDb2xvciIgLz4KICA8L3BhdHRlcm4+CjwvZGVmcz4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIgb3BhY2l0eT0iMC4xIiAvPgo8L3N2Zz4=')]"></div>
        
        <div className="p-12 flex flex-col justify-center items-center h-full relative z-10">
          <div className="max-w-md mx-auto text-center">
            <div className="mb-8 glass-effect inline-block p-5 rounded-full shadow-soft">
              <Heart className="h-14 w-14 text-primary" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Your Digital Legacy</h2>
            <p className="text-lg text-gray-700 mb-10 leading-relaxed">
              Create heartfelt messages for your loved ones to be delivered after your passing or at a future date of your choosing.
            </p>
            <div className="grid grid-cols-1 gap-5 text-left">
              <div className="glass-effect p-5 rounded-xl hover:shadow-md transition-all duration-300">
                <div className="flex items-start">
                  <div className="bg-primary-50 p-2.5 rounded-lg mr-4 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Secure Encryption</h3>
                    <p className="text-gray-600">Your messages are encrypted and only accessible to intended recipients.</p>
                  </div>
                </div>
              </div>
              <div className="glass-effect p-5 rounded-xl hover:shadow-md transition-all duration-300">
                <div className="flex items-start">
                  <div className="bg-secondary-50 p-2.5 rounded-lg mr-4 text-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Future Delivery</h3>
                    <p className="text-gray-600">Schedule messages to be delivered at specific dates or after your passing.</p>
                  </div>
                </div>
              </div>
              <div className="glass-effect p-5 rounded-xl hover:shadow-md transition-all duration-300">
                <div className="flex items-start">
                  <div className="bg-accent-50 p-2.5 rounded-lg mr-4 text-accent">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Multiple Formats</h3>
                    <p className="text-gray-600">Create messages as text, videos, or documents for your loved ones.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 text-center relative z-10">
          <Separator className="mb-6 bg-white/20" />
          <p className="text-sm text-gray-600">© {new Date().getFullYear()} Dearly. All rights reserved. Your messages are securely encrypted.</p>
        </div>
      </div>
    </div>
  );
}
