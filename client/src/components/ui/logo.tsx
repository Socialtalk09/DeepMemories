import { Link } from "wouter";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Logo({ showText = true, size = "md", className }: LogoProps) {
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
    sm: "p-2",
    md: "p-3",
    lg: "p-4"
  };

  return (
    <Link href="/">
      <div className={cn("flex items-center cursor-pointer group", className)}>
        <div className={cn("rounded-full bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 group-hover:shadow-md transition-all duration-300", containerClasses[size])}>
          <div className="relative">
            <Heart className={cn("transition-transform group-hover:scale-110", sizeClasses[size])} />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
          </div>
        </div>
        
        {showText && (
          <span className={cn("ml-2 font-semibold text-gray-900 group-hover:text-blue-600 transition-colors", textClasses[size])}>
            Dearly
          </span>
        )}
      </div>
    </Link>
  );
}