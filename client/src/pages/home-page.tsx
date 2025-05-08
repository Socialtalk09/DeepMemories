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
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  UserCircle, 
  Shield, 
  ChevronRight, 
  Clock, 
  BarChart3,
  LucideIcon,
  Bell,
  Sparkles
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function HomePage() {
  const { user } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const isMobile = useIsMobile();
  
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

  const scheduledMessages = messages.filter(m => m.status === "scheduled");
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      <Header />
      
      <main className="flex-1 max-w-7xl w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <WelcomeBanner 
          user={user}
          scheduledMessageCount={scheduledMessages.length}
          onCreateMessage={() => setIsCreateModalOpen(true)}
          onAddRecipient={() => {}}
        />
        
        <Tabs 
          defaultValue="dashboard" 
          className="w-full mb-8"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <div className="flex justify-between items-center mb-6">
            <TabsList className="bg-muted/50 p-1 border border-border/50">
              <TabsTrigger 
                value="dashboard" 
                className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger 
                value="messages" 
                className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Messages
              </TabsTrigger>
              <TabsTrigger 
                value="recipients" 
                className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
              >
                <UserCircle className="h-4 w-4 mr-2" />
                Recipients
              </TabsTrigger>
              <TabsTrigger 
                value="trusted" 
                className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
              >
                <Shield className="h-4 w-4 mr-2" />
                Trusted Contacts
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="dashboard" className="mt-0 space-y-8">
            <StatsCards 
              messageCount={messages.length}
              recipientCount={recipients.length}
              trustedContactCount={trustedContacts.length}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Dashboard Summary Card */}
              <Card className="col-span-1 border-border/40 shadow-card overflow-hidden">
                <div className="h-1.5 w-full bg-gradient-to-r from-primary via-secondary to-accent"></div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-secondary" />
                    Overview
                  </h3>
                  
                  <div className="space-y-4">
                    <DashboardStat 
                      label="Scheduled Messages" 
                      value={scheduledMessages.length} 
                      icon={Clock} 
                      color="text-orange-500" 
                    />
                    <DashboardStat 
                      label="Total Messages" 
                      value={messages.length} 
                      icon={MessageSquare} 
                      color="text-primary" 
                    />
                    <DashboardStat 
                      label="Recipients" 
                      value={recipients.length} 
                      icon={UserCircle} 
                      color="text-secondary" 
                    />
                    <DashboardStat 
                      label="Trusted Contacts" 
                      value={trustedContacts.length} 
                      icon={Shield} 
                      color="text-accent" 
                    />
                  </div>
                </div>
              </Card>
              
              {/* Recent Activity Card */}
              <Card className="col-span-1 lg:col-span-2 border-border/40 shadow-card overflow-hidden">
                <div className="h-1.5 w-full bg-gradient-to-r from-secondary via-primary to-accent"></div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center">
                    <Bell className="h-5 w-5 mr-2 text-primary" />
                    Recent Activity
                  </h3>
                  
                  <div className="space-y-4">
                    {messages.length > 0 ? (
                      <div className="space-y-3">
                        {messages.slice(0, 3).map((message) => (
                          <div 
                            key={message.id} 
                            className="p-3 rounded-lg border border-border/40 bg-white/50 hover:bg-white transition-colors flex items-center justify-between"
                          >
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-primary-50 text-primary flex items-center justify-center mr-3">
                                <MessageSquare className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{message.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  {message.status === "scheduled" ? "Scheduled" : "Draft"} • {new Date(message.lastUpdated).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        ))}
                        
                        <button 
                          className="w-full py-2 text-sm text-primary font-medium hover:text-primary-600 transition-colors"
                          onClick={() => setActiveTab("messages")}
                        >
                          View All Messages
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">No messages yet</p>
                        <button 
                          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition-colors"
                          onClick={() => setIsCreateModalOpen(true)}
                        >
                          Create Your First Message
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Content Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <PreviewCard 
                title="Messages" 
                icon={MessageSquare} 
                count={messages.length} 
                onClick={() => setActiveTab("messages")}
                color="primary"
              />
              
              <PreviewCard 
                title="Recipients" 
                icon={UserCircle} 
                count={recipients.length} 
                onClick={() => setActiveTab("recipients")}
                color="secondary"
              />
              
              <PreviewCard 
                title="Trusted Contacts" 
                icon={Shield} 
                count={trustedContacts.length} 
                onClick={() => setActiveTab("trusted")}
                color="accent"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="messages" className="mt-0">
            <MessageList 
              messages={messages}
              isLoading={isLoadingMessages}
              recipients={recipients}
              onCreateMessage={() => setIsCreateModalOpen(true)}
              showAllMessages={true}
            />
          </TabsContent>
          
          <TabsContent value="recipients" className="mt-0">
            <RecipientList 
              recipients={recipients}
              isLoading={isLoadingRecipients}
              messages={messages}
            />
          </TabsContent>
          
          <TabsContent value="trusted" className="mt-0">
            <TrustedContacts 
              contacts={trustedContacts}
              isLoading={isLoadingContacts}
            />
          </TabsContent>
        </Tabs>
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

interface DashboardStatProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
}

function DashboardStat({ label, value, icon: Icon, color }: DashboardStatProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className={`h-8 w-8 rounded-full bg-white shadow-sm border border-border/30 flex items-center justify-center mr-3 ${color}`}>
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="font-semibold text-lg">{value}</span>
    </div>
  );
}

interface PreviewCardProps {
  title: string;
  icon: LucideIcon;
  count: number;
  onClick: () => void;
  color: "primary" | "secondary" | "accent";
}

function PreviewCard({ title, icon: Icon, count, onClick, color }: PreviewCardProps) {
  const colorClasses = {
    primary: "bg-primary-50 text-primary border-primary-100",
    secondary: "bg-secondary-50 text-secondary border-secondary-100",
    accent: "bg-accent-50 text-accent border-accent-100"
  };
  
  return (
    <Card 
      className="border-border/40 shadow-card hover:shadow-lg transition-all cursor-pointer p-6 group"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`h-12 w-12 rounded-full ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-muted/80 transition-colors">
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      
      <h3 className="font-medium text-lg mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{count} {count === 1 ? title.slice(0, -1) : title.toLowerCase()}</p>
    </Card>
  );
}
