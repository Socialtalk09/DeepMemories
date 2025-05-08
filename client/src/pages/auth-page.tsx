import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Loader2, Heart, Calendar, CheckCircle, Edit3, User, Lock } from "lucide-react";
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
import { cn } from "@/lib/utils";

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
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
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
      <div className="flex flex-col justify-center p-8 sm:px-12 md:px-16 lg:px-20 bg-white">
        <div className="w-full max-w-md mx-auto">
          <div className="inline-flex items-center mb-8 px-4 py-2 rounded-full bg-blue-50 text-blue-600">
            <Heart className="h-5 w-5 mr-2 text-blue-600" />
            <span className="font-semibold text-xl">Dearly</span>
          </div>
          
          <div className="inline-flex w-full mb-6 rounded-lg overflow-hidden">
            <button
              className={cn(
                "flex-1 py-3 px-4 text-center transition-colors",
                activeTab === "login" 
                  ? "bg-blue-600 text-white font-medium"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
              onClick={() => setActiveTab("login")}
            >
              Sign In
            </button>
            <button
              className={cn(
                "flex-1 py-3 px-4 text-center transition-colors",
                activeTab === "register"
                  ? "bg-blue-600 text-white font-medium"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
              onClick={() => setActiveTab("register")}
            >
              Create Account
            </button>
          </div>

          {activeTab === "login" ? (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
                <p className="text-gray-600 mt-1">Sign in to your account to continue</p>
              </div>

              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Username</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input 
                              placeholder="Your username" 
                              className="pl-10 py-6 bg-gray-50 border-gray-200" 
                              {...field} 
                            />
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
                        <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input 
                              placeholder="Your password" 
                              type="password" 
                              className="pl-10 py-6 bg-gray-50 border-gray-200" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full mt-4 py-6 bg-blue-600 hover:bg-blue-700 text-white font-medium text-base"
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
            </>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create an account</h2>
                <p className="text-gray-600 mt-1">Join Dearly to create your digital legacy</p>
              </div>

              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={registerForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">First Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="John" 
                              className="py-6 bg-gray-50 border-gray-200" 
                              {...field} 
                            />
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
                          <FormLabel className="text-gray-700 font-medium">Last Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Doe" 
                              className="py-6 bg-gray-50 border-gray-200" 
                              {...field} 
                            />
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
                        <FormLabel className="text-gray-700 font-medium">Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="you@example.com" 
                            type="email" 
                            className="py-6 bg-gray-50 border-gray-200" 
                            {...field} 
                          />
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
                        <FormLabel className="text-gray-700 font-medium">Username</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input 
                              placeholder="Choose a username" 
                              className="pl-10 py-6 bg-gray-50 border-gray-200" 
                              {...field} 
                            />
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
                        <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input 
                              placeholder="Create a password" 
                              type="password" 
                              className="pl-10 py-6 bg-gray-50 border-gray-200" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full mt-4 py-6 bg-blue-600 hover:bg-blue-700 text-white font-medium text-base"
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
            </>
          )}
        </div>
      </div>

      {/* Right side - Hero */}
      <div className="hidden md:flex flex-col justify-center items-center relative bg-gradient-to-br from-blue-100 to-purple-100">
        <div className="w-full max-w-md px-8 text-center">
          <div className="bg-white rounded-full inline-flex justify-center items-center p-6 mb-6 shadow-sm">
            <Heart className="h-10 w-10 text-blue-600" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Digital Legacy</h2>
          
          <p className="text-gray-700 mb-10">
            Create heartfelt messages for your loved ones to be delivered after your passing or at a future date of your choosing.
          </p>
          
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-5 shadow-sm text-left flex items-start">
              <div className="mr-4 text-blue-600">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Secure Encryption</h3>
                <p className="text-gray-600 text-sm">Your messages are encrypted and only accessible to intended recipients.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-5 shadow-sm text-left flex items-start">
              <div className="mr-4 text-pink-500">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Future Delivery</h3>
                <p className="text-gray-600 text-sm">Schedule messages to be delivered at specific dates or after your passing.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-5 shadow-sm text-left flex items-start">
              <div className="mr-4 text-purple-500">
                <Edit3 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Multiple Formats</h3>
                <p className="text-gray-600 text-sm">Create messages as text, videos, or documents for your loved ones.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}