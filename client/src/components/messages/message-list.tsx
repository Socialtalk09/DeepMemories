import { useState } from "react";
import { Message, Recipient } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Clock, Edit, Loader2, MessageSquarePlus, MoreHorizontal, Trash } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

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
  showAllMessages = false,
}: MessageListProps) {
  const [filterValue, setFilterValue] = useState<"all" | "scheduled" | "draft">("all");
  
  const filteredMessages = messages.filter(message => {
    if (filterValue === "all") return true;
    if (filterValue === "scheduled") return message.status === "scheduled";
    if (filterValue === "draft") return message.status === "draft";
    return true;
  });
  
  const getRecipientNames = (messageId: number) => {
    // This would need connection to your getMessage with recipients query or join
    const recipientNames = ["John Doe", "Jane Smith"]; // Placeholder
    return recipientNames.join(", ");
  };
  
  const getMessageStatusBadge = (status: string) => {
    if (status === "scheduled") {
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200">
          <Clock className="h-3 w-3 mr-1" />
          Scheduled
        </Badge>
      );
    } 
    
    if (status === "delivered") {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">
          Delivered
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-200">
        Draft
      </Badge>
    );
  };
  
  const handleEditMessage = (message: Message) => {
    // This would connect to your edit message flow
    console.log("Edit message:", message.id);
  };
  
  const handleDeleteMessage = (message: Message) => {
    // This would connect to your delete message mutation
    console.log("Delete message:", message.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Messages</h2>
          <p className="text-muted-foreground">Manage your scheduled and draft messages</p>
        </div>
        
        <Button onClick={onCreateMessage} className="ml-auto">
          <MessageSquarePlus className="h-4 w-4 mr-2" />
          Create Message
        </Button>
      </div>
      
      <Tabs 
        defaultValue="all" 
        value={filterValue} 
        onValueChange={(v) => setFilterValue(v as "all" | "scheduled" | "draft")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="all">All Messages</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
        </div>
      ) : filteredMessages.length === 0 ? (
        <Card className="bg-muted/40">
          <CardContent className="pt-10 pb-10 flex flex-col items-center justify-center text-center">
            <div className="mb-4 bg-primary/10 p-3 rounded-full">
              <MessageSquarePlus className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No messages found</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              {filterValue === "all" 
                ? "You haven't created any messages yet" 
                : filterValue === "scheduled" 
                  ? "You don't have any scheduled messages" 
                  : "You don't have any draft messages"}
            </p>
            <Button onClick={onCreateMessage}>
              Create Your First Message
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredMessages.map((message) => (
            <Card key={message.id} className="overflow-hidden group relative">
              <CardHeader className="pb-2">
                <div className="absolute top-3 right-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditMessage(message)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDeleteMessage(message)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <CardTitle className="text-xl">{message.title}</CardTitle>
                    {showAllMessages && (
                      <CardDescription className="line-clamp-1 text-sm mt-1">
                        To: {getRecipientNames(message.id)}
                      </CardDescription>
                    )}
                  </div>
                  <div>
                    {getMessageStatusBadge(message.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm line-clamp-2">{message.content}</p>
                  
                  <div className="flex flex-col sm:flex-row gap-2 justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <span>Type: {message.type.charAt(0).toUpperCase() + message.type.slice(1)}</span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span>
                        Delivery: {message.deliveryType.charAt(0).toUpperCase() + message.deliveryType.slice(1)}
                      </span>
                      
                      {message.deliveryDate && (
                        <span>
                          Date: {format(new Date(message.deliveryDate), "PPP")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}