import { Link } from "wouter";
import { Heart, Sparkles, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Logo({ showText = false, size = "md", className }: LogoProps) {
  // Size mapping
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  };
  
  const textClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };
  
  const containerClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10", 
    lg: "h-12 w-12"
  };

  return (
    <Link href="/">
      <div className={cn("flex items-center cursor-pointer group gap-2", className)}>
        <div className={cn("relative rounded-md overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-500 to-purple-600 flex items-center justify-center group-hover:shadow-lg transition-all duration-300", containerClasses[size])}>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 opacity-50"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_70%)]"></div>
          
          {/* Animated pulse effect */}
          <div className="absolute inset-0 bg-white/10 rounded-full scale-0 animate-ping-slow opacity-0 group-hover:opacity-40"></div>
          
          <div className="relative flex items-center justify-center">
            <Heart 
              className={cn("text-white transition-transform group-hover:scale-110 z-10", sizeClasses[size])} 
              fill="white"
            />
            <div className="absolute -top-1 -right-1 z-20 animate-sparkle">
              <Sparkles 
                className={cn("text-yellow-300 opacity-70 group-hover:opacity-100 transition-all",
                  size === "lg" ? "h-3.5 w-3.5" : size === "sm" ? "h-2 w-2" : "h-3 w-3"
                )} 
              />
            </div>
          </div>
          
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/5 to-transparent opacity-40"></div>
          <div className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-300 to-transparent opacity-40 group-hover:opacity-70 transition-opacity"></div>
        </div>
        
        {showText && (
          <span className={cn(
            "font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:from-indigo-500 group-hover:to-purple-500 transition-colors",
            textClasses[size]
          )}>
            Dearly
          </span>
        )}
      </div>
    </Link>
  );
}