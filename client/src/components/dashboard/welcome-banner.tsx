import { User } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { UserPlus, Plus } from "lucide-react";

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
  
  return (
    <div className="mb-8 bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Welcome back, {firstName}</h1>
          <p className="text-gray-500 mb-4">
            Your digital legacy is secure. 
            {scheduledMessageCount > 0 
              ? ` You have ${scheduledMessageCount} message${scheduledMessageCount !== 1 ? 's' : ''} waiting to be delivered in the future.`
              : ' Create your first message to begin your digital legacy.'}
          </p>
          <div className="flex space-x-4">
            <Button 
              className="inline-flex items-center shadow-sm"
              onClick={onCreateMessage}
            >
              <Plus className="mr-2 h-4 w-4" /> Create New Message
            </Button>
            <Button 
              variant="outline" 
              className="inline-flex items-center"
              onClick={onAddRecipient}
            >
              <UserPlus className="mr-2 h-4 w-4" /> Add Recipient
            </Button>
          </div>
        </div>
        <div className="hidden md:block ml-8 flex-shrink-0 p-3 bg-primary-50 rounded-full">
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
  );
}
