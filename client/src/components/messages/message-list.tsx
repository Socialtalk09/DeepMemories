import { Message, Recipient } from "@shared/schema";
import { Loader2, ArrowRight } from "lucide-react";
import { MessageCard } from "./message-card";
import { Link } from "wouter";

interface MessageListProps {
  messages: Message[];
  recipients: Recipient[];
  isLoading: boolean;
  onCreateMessage: () => void;
  showAllMessages?: boolean;
}

export default function MessageList({ 
  messages, 
  recipients, 
  isLoading, 
  onCreateMessage,
  showAllMessages = false
}: MessageListProps) {
  // For the dashboard, just show a few messages
  const displayMessages = showAllMessages ? messages : messages.slice(0, 4);
  
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Your Messages</h2>
        {!showAllMessages && messages.length > 4 && (
          <Link href="/messages" className="text-sm font-medium text-primary hover:text-primary-600 flex items-center">
            View all <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : displayMessages.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="rounded-full bg-primary-50 p-3 inline-flex mb-4">
            <MailIcon className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Create your first message</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Start crafting heartfelt messages for your loved ones that will be delivered in the future or after your passing.
          </p>
          <button 
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all"
            onClick={onCreateMessage}
          >
            Create Your First Message
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {displayMessages.map((message) => (
            <MessageCard 
              key={message.id}
              message={message}
              recipients={recipients}
            />
          ))}
          
          {/* Create New Card */}
          <div 
            className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-all group"
            onClick={onCreateMessage}
          >
            <div className="rounded-full bg-white p-3 mb-3 text-primary shadow-sm group-hover:bg-primary-50 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </div>
            <h3 className="text-gray-600 font-medium mb-1 group-hover:text-primary-600 transition-all">Create New Message</h3>
            <p className="text-gray-400 text-sm text-center">Add a letter, video, or document for your loved ones</p>
          </div>
        </div>
      )}
    </section>
  );
}

function MailIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  );
}
