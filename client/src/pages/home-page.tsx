import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import WelcomeBanner from "@/components/dashboard/welcome-banner";
import StatsCards from "@/components/dashboard/stats-cards";
import MessageList from "@/components/messages/message-list";
import RecipientList from "@/components/recipients/recipient-list";
import TrustedContacts from "@/components/contacts/trusted-contacts";
import { useAuth } from "@/hooks/use-auth";
import { CreateMessageModal } from "@/components/messages/create-message-modal";
import { useState } from "react";
import { Message, Recipient, TrustedContact } from "@shared/schema";

export default function HomePage() {
  const { user } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const { data: messages = [], isLoading: isLoadingMessages } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
    enabled: !!user,
  });
  
  const { data: recipients = [], isLoading: isLoadingRecipients } = useQuery<Recipient[]>({
    queryKey: ["/api/recipients"],
    enabled: !!user,
  });
  
  const { data: trustedContacts = [], isLoading: isLoadingContacts } = useQuery<TrustedContact[]>({
    queryKey: ["/api/trusted-contacts"],
    enabled: !!user,
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-7xl w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <WelcomeBanner 
          user={user}
          scheduledMessageCount={messages.filter(m => m.status === "scheduled").length}
          onCreateMessage={() => setIsCreateModalOpen(true)}
          onAddRecipient={() => {}}
        />
        
        <StatsCards 
          messageCount={messages.length}
          recipientCount={recipients.length}
          trustedContactCount={trustedContacts.length}
        />
        
        <MessageList 
          messages={messages}
          isLoading={isLoadingMessages}
          recipients={recipients}
          onCreateMessage={() => setIsCreateModalOpen(true)}
        />
        
        <RecipientList 
          recipients={recipients}
          isLoading={isLoadingRecipients}
          messages={messages}
        />
        
        <TrustedContacts 
          contacts={trustedContacts}
          isLoading={isLoadingContacts}
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
