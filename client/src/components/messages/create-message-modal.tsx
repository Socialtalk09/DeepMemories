import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Recipient } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { MessageSquarePlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CreateMessageForm from "./create-message-form";
import { z } from "zod";
import { formatMessage } from "@/lib/encryption";

interface CreateMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
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

export function CreateMessageModal({ isOpen, onClose, recipients }: CreateMessageModalProps) {
  const { toast } = useToast();
  
  // Create mutation for saving a new message
  const createMessageMutation = useMutation({
    mutationFn: async (data: MessageFormValues) => {
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
        status: "draft",
        recipientIds: data.recipientIds
      };
      
      const res = await apiRequest("POST", "/api/messages", messageData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      toast({
        title: "Message created!",
        description: "Your message has been saved as a draft.",
      });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create message",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Handle form submission
  const onSubmit = (data: MessageFormValues & { notifyAnonymous: boolean; notifyPreview: boolean }) => {
    createMessageMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <MessageSquarePlus className="h-5 w-5 text-primary" />
            <DialogTitle>Create New Message</DialogTitle>
          </div>
          <DialogDescription>
            Create a message to be delivered to your loved ones at a future date or after your passing
          </DialogDescription>
        </DialogHeader>
        
        <CreateMessageForm 
          recipients={recipients}
          onSubmit={onSubmit}
          isPending={createMessageMutation.isPending}
        />
      </DialogContent>
    </Dialog>
  );
}