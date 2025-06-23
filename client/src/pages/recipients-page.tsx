import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, UserX, MessageCircle, Edit, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Recipient, InsertRecipient, Message } from "@shared/schema";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const recipientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  relationship: z.string().optional()
});

type RecipientFormValues = z.infer<typeof recipientSchema>;

export default function RecipientsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState<Recipient | null>(null);
  const { toast } = useToast();
  
  const { data: recipients = [], isLoading: isLoadingRecipients } = useQuery<Recipient[]>({
    queryKey: ["/api/recipients"],
  });
  
  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
  });
  
  const form = useForm<RecipientFormValues>({
    resolver: zodResolver(recipientSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      relationship: ""
    }
  });
  
  const createRecipientMutation = useMutation({
    mutationFn: async (data: RecipientFormValues) => {
      console.log("Adding recipient:", data);
      try {
        const res = await apiRequest("POST", "/api/recipients", data);
        console.log("API request completed, status:", res.status);
        const result = await res.json();
        console.log("Recipient creation response:", result);
        return result;
      } catch (error) {
        console.error("API request failed:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("Recipient created successfully:", data);
      toast({
        title: "Recipient created",
        description: "The recipient has been successfully created."
      });
      queryClient.invalidateQueries({ queryKey: ["/api/recipients"] });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      console.error("Error creating recipient:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  const updateRecipientMutation = useMutation({
    mutationFn: async (data: { id: number; recipient: RecipientFormValues }) => {
      const res = await apiRequest("PUT", `/api/recipients/${data.id}`, data.recipient);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Recipient updated",
        description: "The recipient has been successfully updated."
      });
      queryClient.invalidateQueries({ queryKey: ["/api/recipients"] });
      setIsDialogOpen(false);
      setEditingRecipient(null);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  const deleteRecipientMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/recipients/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Recipient deleted",
        description: "The recipient has been successfully deleted."
      });
      queryClient.invalidateQueries({ queryKey: ["/api/recipients"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  const onSubmit = (data: RecipientFormValues) => {
    console.log("Form submitted with data:", data);
    console.log("Editing recipient:", editingRecipient);
    
    if (editingRecipient) {
      console.log("Triggering update mutation");
      updateRecipientMutation.mutate({ id: editingRecipient.id, recipient: data });
    } else {
      console.log("Triggering create mutation");
      createRecipientMutation.mutate(data);
    }
  };
  
  const openEditDialog = (recipient: Recipient) => {
    setEditingRecipient(recipient);
    form.reset({
      name: recipient.name,
      email: recipient.email,
      phone: recipient.phone || "",
      relationship: recipient.relationship || ""
    });
    setIsDialogOpen(true);
  };
  
  const openCreateDialog = () => {
    setEditingRecipient(null);
    form.reset({
      name: "",
      email: "",
      phone: "",
      relationship: ""
    });
    setIsDialogOpen(true);
  };
  
  const getMessageCountForRecipient = (recipientId: number) => {
    let count = 0;
    
    messages.forEach(message => {
      // In a real app this would check the messageRecipients table,
      // but for now we'll just assume all messages are for all recipients
      count++;
    });
    
    return count;
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-7xl w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Recipients</h1>
          <Button onClick={openCreateDialog}>
            <Plus className="h-5 w-5 mr-2" />
            Add Recipient
          </Button>
        </div>
        
        {isLoadingRecipients ? (
          <div className="flex justify-center my-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : recipients.length === 0 ? (
          <Card className="text-center p-12">
            <CardContent className="pt-6">
              <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <UserX className="h-6 w-6 text-gray-400" />
              </div>
              <CardTitle className="text-xl mb-2">No recipients yet</CardTitle>
              <CardDescription className="mb-4">
                Add your first recipient to start creating messages for them.
              </CardDescription>
              <Button onClick={openCreateDialog}>
                <Plus className="h-5 w-5 mr-2" />
                Add Your First Recipient
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipients.map((recipient) => (
              <Card key={recipient.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <Avatar className="mr-3 h-10 w-10">
                        <AvatarFallback className="bg-primary-100 text-primary-700">
                          {recipient.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{recipient.name}</CardTitle>
                        <CardDescription className="text-sm">{recipient.email}</CardDescription>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => openEditDialog(recipient)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      <span>{getMessageCountForRecipient(recipient.id)} messages</span>
                    </div>
                    {recipient.relationship && (
                      <Badge variant="outline">{recipient.relationship}</Badge>
                    )}
                  </div>
                  <div className="mt-4 flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${recipient.name}?`)) {
                          deleteRecipientMutation.mutate(recipient.id);
                        }
                      }}
                      className="text-destructive border-destructive hover:bg-destructive/10"
                    >
                      Delete
                    </Button>
                    <Button size="sm" variant="ghost" className="flex items-center">
                      View Messages <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Add New Recipient Card */}
            <Card 
              className="border-2 border-dashed flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-gray-50 transition-all"
              onClick={openCreateDialog}
            >
              <div className="rounded-full bg-primary-50 p-3 mb-3 text-primary">
                <Plus className="h-6 w-6" />
              </div>
              <h3 className="text-base font-medium text-gray-700 mb-1">Add New Recipient</h3>
              <p className="text-sm text-gray-500 text-center">Add someone to send your messages to</p>
            </Card>
          </div>
        )}
      </main>
      
      <Footer />
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingRecipient ? "Edit Recipient" : "Add New Recipient"}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email address" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="relationship"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relationship (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Family, Friend, Partner" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingRecipient(null);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={createRecipientMutation.isPending || updateRecipientMutation.isPending}
                >
                  {(createRecipientMutation.isPending || updateRecipientMutation.isPending) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving
                    </>
                  ) : (
                    editingRecipient ? "Update" : "Create"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
