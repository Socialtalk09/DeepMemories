import { Message, Recipient } from "@shared/schema";
import { Loader2, ArrowRight, Mail, Plus, FileText, SendHorizontal, Calendar } from "lucide-react";
import { MessageCard } from "./message-card";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    <section className="mb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1 flex items-center">
            <Mail className="mr-2 h-5 w-5 text-primary" />
            Your Messages
          </h2>
          <p className="text-muted-foreground text-sm">
            Messages you've created to be delivered in the future
          </p>
        </div>
        
        {!showAllMessages && messages.length > 4 && (
          <Link href="/messages" className="text-sm font-medium text-primary hover:text-primary-600 flex items-center group">
            View all messages 
            <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-16 bg-white/50 rounded-xl border border-border/50">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading your messages...</p>
          </div>
        </div>
      ) : displayMessages.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-border/50 shadow-card p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-50 to-primary-100 p-4 inline-flex items-center justify-center mb-6 shadow-sm">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Create your first message</h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Start crafting heartfelt messages for your loved ones that will be delivered in the future or after your passing.
          </p>
          <Button 
            className="px-6 py-2.5 h-11 bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-sm animated-btn"
            onClick={onCreateMessage}
          >
            <SendHorizontal className="mr-2 h-4 w-4" />
            Create Your First Message
          </Button>
          
          <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
            <FeaturePoint icon={<SendHorizontal className="h-4 w-4" />} text="Securely encrypted" />
            <FeaturePoint icon={<Calendar className="h-4 w-4" />} text="Scheduled delivery" />
            <FeaturePoint icon={<FileText className="h-4 w-4" />} text="Multiple formats" />
          </div>
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
            className={cn(
              "group relative bg-gradient-to-br from-primary-50/50 to-primary-100/30 rounded-xl",
              "border border-primary-100/80 shadow-sm p-6 flex flex-col items-center justify-center",
              "cursor-pointer hover:shadow-md transition-all duration-200 overflow-hidden"
            )}
            onClick={onCreateMessage}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZD0iTTAgMGg0djRIMHptMjAgMGg0djRoLTR6bTIwIDBoNHY0aC00ek0wIDIwaDR2NGgtNHptMjAgMGg0djRoLTR6bTIwIDBoNHY0aC00ek0wIDQwaDR2NGgtNHptMjAgMGg0djRoLTR6bTIwIDBoNHY0aC00eiIgZmlsbD0iY3VycmVudENvbG9yIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4KPC9zdmc+')]"></div>
            
            <div className="relative flex flex-col items-center">
              <div className="rounded-full bg-white p-3.5 mb-4 text-primary shadow-sm group-hover:bg-primary-50 transition-all ring-4 ring-white/30">
                <Plus className="h-6 w-6" />
              </div>
              <h3 className="text-primary-700 font-medium mb-2 group-hover:text-primary-800 transition-all">Create New Message</h3>
              <p className="text-primary-600/70 text-sm text-center max-w-[200px]">
                Add a letter, video, or document for your loved ones
              </p>
              
              <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-primary/5 rounded-full filter blur-xl opacity-80 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function FeaturePoint({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="flex items-center">
      <div className="bg-muted rounded-full p-1.5 mr-2">
        {icon}
      </div>
      <span>{text}</span>
    </div>
  );
}
