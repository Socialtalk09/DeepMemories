import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Message, Recipient } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CreateMessageForm from "./create-message-form";
import { z } from "zod";
import { formatMessage, decryptMessage } from "@/lib/encryption";

interface EditMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: Message | null;
  recipients: Recipient[];
}

// Define message schema
const messageSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  content: z.string().min(10, "Message must be at least 10 characters"),
  type: z.enum(["text", "video", "document"]),
  deliveryType: z.enum(["date", "passing"]),
  deliveryDate: z.date().optional().nullable(),
  recipientIds: z.array(z.number()).min(1, "Select at least one recipient"),
});

type MessageFormValues = z.infer<typeof messageSchema>;

export function EditMessageModal({ isOpen, onClose, message, recipients }: EditMessageModalProps) {
  const { toast } = useToast();
  const [decryptedContent, setDecryptedContent] = useState("");
  
  // Decrypt message content when message changes
  useEffect(() => {
    if (message) {
      try {
        const decrypted = decryptMessage(message.content, message.encryptedKey);
        setDecryptedContent(decrypted);
      } catch (error) {
        console.error("Failed to decrypt message:", error);
        setDecryptedContent("[Unable to decrypt message]");
      }
    }
  }, [message]);
  
  // Update mutation for editing a message
  const updateMessageMutation = useMutation({
    mutationFn: async (data: MessageFormValues) => {
      if (!message) throw new Error("No message to update");
      
      // Encrypt the message content
      const { encryptedContent, encryptedKey } = formatMessage(data.content);
      
      // Prepare the message data
      const messageData = {
        title: data.title,
        content: encryptedContent,
        encryptedKey: encryptedKey,
        type: data.type,
        deliveryType: data.deliveryType,
        deliveryDate: data.deliveryDate || null,
        status: data.deliveryType === "passing" ? "scheduled" : "draft",
        recipients: data.recipientIds
      };
      
      const res = await apiRequest("PUT", `/api/messages/${message.id}`, messageData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      toast({
        title: "Message updated!",
        description: "Your message has been successfully updated.",
      });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update message",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Handle form submission
  const onSubmit = (data: MessageFormValues & { notifyAnonymous: boolean; notifyPreview: boolean }) => {
    updateMessageMutation.mutate(data);
  };

  // Get initial form values from message
  const getInitialValues = () => {
    if (!message) return undefined;
    
    return {
      title: message.title,
      content: decryptedContent,
      type: message.type as "text" | "video" | "document",
      deliveryType: message.deliveryType as "date" | "passing",
      deliveryDate: message.deliveryDate ? new Date(message.deliveryDate) : null,
      recipientIds: [], // This will be populated by the form component based on message recipients
    };
  };

  if (!message) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-primary" />
            <DialogTitle>Edit Message</DialogTitle>
          </div>
          <DialogDescription>
            Update your message content, delivery settings, and recipients
          </DialogDescription>
        </DialogHeader>
        
        <CreateMessageForm 
          recipients={recipients}
          onSubmit={onSubmit}
          isPending={updateMessageMutation.isPending}
          initialData={getInitialValues()}
        />
      </DialogContent>
    </Dialog>
  );
}