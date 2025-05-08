import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  HelpCircle,
  Bold,
  Italic,
  Underline,
  Link as LinkIcon,
  Image,
  X,
  Loader2,
  CalendarIcon,
  FileText,
  Video,
  File,
  Search,
} from "lucide-react";
import { formatMessage } from "@/lib/encryption";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Recipient, InsertMessage } from "@shared/schema";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";

interface CreateMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipients: Recipient[];
}

// Form validation schema
const messageSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Message content is required"),
  type: z.enum(["text", "video", "document"], {
    required_error: "Please select a message type",
  }),
  deliveryType: z.enum(["date", "passing"], {
    required_error: "Please select a delivery trigger",
  }),
  deliveryDate: z.date().optional().nullable(),
  selectedRecipients: z.array(z.number()).min(1, "Please select at least one recipient"),
  notifyAnonymous: z.boolean().default(false),
  notifyPreview: z.boolean().default(false),
});

type MessageFormValues = z.infer<typeof messageSchema>;

export function CreateMessageModal({ isOpen, onClose, recipients }: CreateMessageModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messageType, setMessageType] = useState<"text" | "video" | "document">("text");
  const [searchQuery, setSearchQuery] = useState("");
  
  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      title: "",
      content: "",
      type: "text",
      deliveryType: "date",
      deliveryDate: null,
      selectedRecipients: [],
      notifyAnonymous: false,
      notifyPreview: false,
    },
  });
  
  // Filter recipients based on search query
  const filteredRecipients = recipients.filter(recipient => 
    recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipient.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Create message mutation
  const createMessageMutation = useMutation({
    mutationFn: async (data: MessageFormValues) => {
      if (!user) throw new Error("You must be logged in to create a message");

      // Process the message data
      const { encryptedContent, encryptedKey } = formatMessage(data.content);
      
      const messageData: InsertMessage = {
        userId: user.id,
        title: data.title,
        content: encryptedContent,
        encryptedKey,
        type: data.type,
        status: data.deliveryDate ? "scheduled" : "draft",
        deliveryType: data.deliveryType,
        deliveryDate: data.deliveryDate,
      };

      // Create the message with recipients
      const res = await apiRequest("POST", "/api/messages", {
        ...messageData,
        recipients: data.selectedRecipients,
      });
      
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Message created",
        description: "Your message has been successfully created",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      form.reset();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: MessageFormValues) => {
    if (data.deliveryType === "date" && !data.deliveryDate) {
      form.setError("deliveryDate", {
        type: "manual",
        message: "Please select a delivery date",
      });
      return;
    }
    
    createMessageMutation.mutate(data);
  };

  const handleDraftSave = () => {
    const data = form.getValues();
    // Set status to draft and submit
    createMessageMutation.mutate({
      ...data,
      deliveryDate: null,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center">
            Create New Message
            <Button variant="ghost" size="sm" className="ml-auto" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Give your message a title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message Type</FormLabel>
                  <div className="grid grid-cols-3 gap-4">
                    <div 
                      className={`border ${field.value === "text" ? "border-primary" : "border-gray-300"} 
                                hover:border-primary rounded-md p-4 cursor-pointer flex flex-col items-center group transition-all`}
                      onClick={() => {
                        field.onChange("text");
                        setMessageType("text");
                      }}
                    >
                      <div className={`h-10 w-10 rounded-full ${field.value === "text" ? "bg-primary-200" : "bg-primary-100"} 
                                    flex items-center justify-center text-primary-600 mb-2 group-hover:bg-primary-200 transition-colors`}>
                        <FileText className="h-5 w-5" />
                      </div>
                      <span className={`text-sm font-medium ${field.value === "text" ? "text-primary-600" : "text-gray-700"} group-hover:text-primary-600`}>
                        Text
                      </span>
                    </div>
                    
                    <div 
                      className={`border ${field.value === "video" ? "border-primary" : "border-gray-300"} 
                                hover:border-primary rounded-md p-4 cursor-pointer flex flex-col items-center group transition-all`}
                      onClick={() => {
                        field.onChange("video");
                        setMessageType("video");
                      }}
                    >
                      <div className={`h-10 w-10 rounded-full ${field.value === "video" ? "bg-primary-200" : "bg-primary-100"} 
                                    flex items-center justify-center text-primary-600 mb-2 group-hover:bg-primary-200 transition-colors`}>
                        <Video className="h-5 w-5" />
                      </div>
                      <span className={`text-sm font-medium ${field.value === "video" ? "text-primary-600" : "text-gray-700"} group-hover:text-primary-600`}>
                        Video
                      </span>
                    </div>
                    
                    <div 
                      className={`border ${field.value === "document" ? "border-primary" : "border-gray-300"} 
                                hover:border-primary rounded-md p-4 cursor-pointer flex flex-col items-center group transition-all`}
                      onClick={() => {
                        field.onChange("document");
                        setMessageType("document");
                      }}
                    >
                      <div className={`h-10 w-10 rounded-full ${field.value === "document" ? "bg-primary-200" : "bg-primary-100"} 
                                    flex items-center justify-center text-primary-600 mb-2 group-hover:bg-primary-200 transition-colors`}>
                        <File className="h-5 w-5" />
                      </div>
                      <span className={`text-sm font-medium ${field.value === "document" ? "text-primary-600" : "text-gray-700"} group-hover:text-primary-600`}>
                        Document
                      </span>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message Content</FormLabel>
                  <FormControl>
                    <div className="border border-gray-300 rounded-md shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                      {messageType === "text" && (
                        <>
                          <div className="border-b border-gray-300 px-3 py-2 flex space-x-2 bg-gray-50">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" type="button">
                              <Bold className="h-4 w-4 text-gray-500" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" type="button">
                              <Italic className="h-4 w-4 text-gray-500" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" type="button">
                              <Underline className="h-4 w-4 text-gray-500" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" type="button">
                              <LinkIcon className="h-4 w-4 text-gray-500" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" type="button">
                              <Image className="h-4 w-4 text-gray-500" />
                            </Button>
                          </div>
                          <Textarea 
                            className="border-none resize-none focus-visible:ring-0 focus-visible:ring-offset-0" 
                            placeholder="Write your message here..." 
                            rows={6}
                            {...field}
                          />
                        </>
                      )}
                      
                      {messageType === "video" && (
                        <div className="p-6 flex flex-col items-center">
                          <Video className="h-12 w-12 text-gray-400 mb-3" />
                          <p className="text-gray-700 mb-2">Upload a video message</p>
                          <p className="text-sm text-gray-500 mb-4">MP4, WebM or MOV up to 100MB</p>
                          <Button type="button">Select Video</Button>
                          <input type="hidden" {...field} />
                        </div>
                      )}
                      
                      {messageType === "document" && (
                        <div className="p-6 flex flex-col items-center">
                          <File className="h-12 w-12 text-gray-400 mb-3" />
                          <p className="text-gray-700 mb-2">Upload a document</p>
                          <p className="text-sm text-gray-500 mb-4">PDF, DOCX or TXT up to 25MB</p>
                          <Button type="button">Select Document</Button>
                          <input type="hidden" {...field} />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Your message is securely encrypted and only your recipients will be able to read it.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="selectedRecipients"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipients</FormLabel>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="Search recipients..." 
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    
                    <div className="max-h-[200px] overflow-y-auto border rounded-md">
                      {filteredRecipients.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          No recipients found
                        </div>
                      ) : (
                        filteredRecipients.map((recipient) => (
                          <div 
                            key={recipient.id}
                            className="flex items-center justify-between py-2 px-3 hover:bg-gray-50"
                          >
                            <div className="flex items-center">
                              <Checkbox 
                                id={`recipient-${recipient.id}`} 
                                checked={field.value.includes(recipient.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...field.value, recipient.id]);
                                  } else {
                                    field.onChange(field.value.filter(id => id !== recipient.id));
                                  }
                                }}
                              />
                              <label htmlFor={`recipient-${recipient.id}`} className="ml-3 flex items-center cursor-pointer">
                                <Avatar className="h-6 w-6 mr-2">
                                  <AvatarFallback className="bg-primary-100 text-primary-700 text-xs">
                                    {recipient.name.slice(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm text-gray-700">{recipient.name}</span>
                              </label>
                            </div>
                            <span className="text-xs text-gray-500">{recipient.email}</span>
                          </div>
                        ))
                      )}
                    </div>
                    {recipients.length === 0 && (
                      <div className="text-center p-4 bg-gray-50 rounded-md">
                        <p className="text-sm text-gray-500">
                          You haven't added any recipients yet.
                        </p>
                        <Button 
                          variant="link" 
                          type="button" 
                          className="text-primary p-0 h-auto"
                        >
                          Add your first recipient
                        </Button>
                      </div>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="deliveryType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Delivery Settings</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="bg-gray-50 border border-gray-300 rounded-md p-4 space-y-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="date" id="date" />
                        <Label htmlFor="date" className="font-medium">Specific date</Label>
                      </div>
                      
                      {field.value === "date" && (
                        <div className="ml-7">
                          <FormField
                            control={form.control}
                            name="deliveryDate"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant="outline"
                                        className={`w-full pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}
                                      >
                                        {field.value ? (
                                          format(field.value, "PPP")
                                        ) : (
                                          <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={field.value || undefined}
                                      onSelect={field.onChange}
                                      disabled={(date) => date < new Date()}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="passing" id="passing" />
                        <Label htmlFor="passing" className="font-medium">After confirmation of passing</Label>
                      </div>
                      
                      {field.value === "passing" && (
                        <div className="ml-7">
                          <p className="text-xs text-gray-500">
                            Your trusted contacts will be asked to confirm before messages are delivered. 
                            We handle this with utmost care and sensitivity.
                          </p>
                        </div>
                      )}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-3">
              <FormLabel>Notification Settings</FormLabel>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="notifyAnonymous"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="notify-anonymous"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel htmlFor="notify-anonymous" className="text-sm font-normal">
                          Send anonymous notification to recipients
                        </FormLabel>
                        <FormDescription>
                          Recipients will be notified that a message awaits but won't see content or sender until delivery.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="notifyPreview"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="notify-preview"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel htmlFor="notify-preview" className="text-sm font-normal">
                          Allow recipients to know you've created a message
                        </FormLabel>
                        <FormDescription>
                          Recipients will be able to see that you've written them but can't access content until delivery.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <DialogFooter className="flex justify-between items-center pt-4 border-t mt-8">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleDraftSave}
                disabled={createMessageMutation.isPending}
              >
                Save as Draft
              </Button>
              <div className="flex space-x-3">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={createMessageMutation.isPending}
                >
                  {createMessageMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Message"
                  )}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
