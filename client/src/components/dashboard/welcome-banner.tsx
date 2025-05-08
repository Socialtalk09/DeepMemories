import { MessageSquarePlus, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@shared/schema";

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
  const timeOfDay = getTimeOfDay();
  const firstName = user?.firstName || user?.username?.split(/[ ._]/)[0] || "there";
  
  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 p-8 shadow-md">
      <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,#ffffff10,#ffffff80)]" />
      
      <div className="relative">
        <div className="mb-1 text-md font-medium text-blue-100">
          {timeOfDay}
        </div>
        <h1 className="text-3xl font-bold text-white">
          Welcome back, {firstName}!
        </h1>
        
        <div className="mt-4 max-w-lg">
          <p className="text-blue-100">
            {scheduledMessageCount > 0 
              ? `You have ${scheduledMessageCount} message${scheduledMessageCount > 1 ? "s" : ""} scheduled for delivery.` 
              : "Start creating messages for your loved ones."}
          </p>
        </div>
        
        <div className="mt-6 flex flex-wrap gap-3">
          <Button 
            onClick={onCreateMessage} 
            className="bg-white text-blue-700 hover:bg-blue-50"
          >
            <MessageSquarePlus className="mr-2 h-4 w-4" />
            Create Message
          </Button>
          
          <Button 
            onClick={onAddRecipient} 
            variant="outline" 
            className="bg-blue-700/20 text-white border-blue-400/30 hover:bg-blue-700/30 hover:border-blue-400/40"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add Recipient
          </Button>
        </div>
      </div>
      
      <div className="absolute right-6 -top-20 hidden lg:block">
        <div className="w-64 h-64 rounded-full bg-blue-500/30 blur-3xl" />
      </div>
      <div className="absolute -bottom-16 -right-16">
        <div className="w-40 h-40 rounded-full bg-indigo-500/20 blur-2xl" />
      </div>
    </div>
  );
}

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}