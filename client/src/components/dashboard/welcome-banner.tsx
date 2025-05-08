import { User } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { UserPlus, Plus, Clock, Calendar, Heart } from "lucide-react";

interface WelcomeBannerProps {
  user: User | null;
  scheduledMessageCount: number;
  onCreateMessage: () => void;
  onAddRecipient: () => void;
}

export default function WelcomeBanner({
  user,
  scheduledMessageCount,
  onCreateMessage,
  onAddRecipient
}: WelcomeBannerProps) {
  const firstName = user?.firstName || user?.username?.split(' ')[0] || 'there';
  const timeOfDay = getTimeOfDay();
  
  return (
    <div className="mb-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-50 rounded-full translate-x-1/2 -translate-y-1/2 opacity-50 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary-50 rounded-full -translate-x-1/2 translate-y-1/2 opacity-50 blur-3xl"></div>
      
      <div className="relative bg-white/80 backdrop-blur-sm rounded-xl shadow-card border border-border/50 overflow-hidden">
        {/* Top gradient bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-primary via-secondary to-accent"></div>
        
        <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center">
          <div className="flex-1">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold mb-1.5 bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Good {timeOfDay}, {firstName}
              </h1>
              <div className="animate-bounce-slow ml-2 hidden sm:block">
                <Heart className="h-6 w-6 text-secondary" fill="currentColor" />
              </div>
            </div>
            
            <div className="flex items-center mb-6">
              <p className="text-muted-foreground">
                Your digital legacy is secure and private. 
              </p>
              {scheduledMessageCount > 0 && (
                <div className="ml-2 flex items-center text-sm font-medium text-primary px-2.5 py-0.5 rounded-full bg-primary-50 border border-primary-100">
                  <Clock className="mr-1 h-3.5 w-3.5" /> 
                  {scheduledMessageCount} scheduled message{scheduledMessageCount !== 1 ? 's' : ''}
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                className="inline-flex items-center shadow-sm bg-primary hover:bg-primary-600 transition-colors"
                onClick={onCreateMessage}
                size="lg"
              >
                <Plus className="mr-2 h-4 w-4" /> Create New Message
              </Button>
              <Button 
                variant="outline" 
                className="inline-flex items-center border-primary/20 text-primary hover:bg-primary-50 hover:text-primary-600 hover:border-primary/30 transition-colors"
                onClick={onAddRecipient}
                size="lg"
              >
                <UserPlus className="mr-2 h-4 w-4" /> Add Recipient
              </Button>
            </div>
          </div>
          
          <div className="hidden md:flex ml-8 flex-shrink-0 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-4 shadow-soft items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZD0iTTIwIDQwYzExLjA0NiAwIDIwLTguOTU0IDIwLTIwUzMxLjA0NiAwIDIwIDBTMCA4Ljk1NCAwIDIwczguOTU0IDIwIDIwIDIweiIgZmlsbD0iY3VycmVudENvbG9yIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4KPC9zdmc+')]"></div>
            
            <div className="relative p-3">
              <div className="absolute -top-2 -right-2 bg-white p-1.5 shadow-sm rounded-full border border-border">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-20 w-20 text-primary" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
          </div>
        </div>
        
        {scheduledMessageCount === 0 && (
          <div className="px-8 py-3 border-t border-border/50 bg-muted/20">
            <p className="text-sm text-muted-foreground flex items-center">
              <span className="mr-2">💡</span>
              <span>Tip: Create your first message to begin your digital legacy. Your messages are securely encrypted.</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}
