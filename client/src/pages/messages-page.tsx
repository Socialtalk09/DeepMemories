import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { CreateMessageModal } from "@/components/messages/create-message-modal";
import MessageList from "@/components/messages/message-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Message, Recipient } from "@shared/schema";

export default function MessagesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const { data: messages = [], isLoading: isLoadingMessages } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
  });
  
  const { data: recipients = [] } = useQuery<Recipient[]>({
    queryKey: ["/api/recipients"],
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-7xl w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Your Messages</h1>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-5 w-5 mr-2" />
            Create New Message
          </Button>
        </div>
        
        <MessageList 
          messages={messages}
          isLoading={isLoadingMessages}
          recipients={recipients}
          onCreateMessage={() => setIsCreateModalOpen(true)}
          showAllMessages
        />
      </main>
      
      <Footer />
      
      <CreateMessageModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        recipients={recipients}
      />
    </div>
  );
}
