import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar as CalendarIcon, Check, ChevronDown, File, MailCheck, MessageSquare, Video } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import NotificationSettings from "./notification-settings";
import { Badge } from "@/components/ui/badge";
import { Recipient } from "@shared/schema";

const messageSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(100, "Title must be less than 100 characters"),
  content: z.string().min(10, "Message must be at least 10 characters"),
  type: z.enum(["text", "video", "document"]),
  deliveryType: z.enum(["date", "passing"]),
  deliveryDate: z.date().optional().nullable(),
  recipientIds: z.array(z.number()).min(1, "Select at least one recipient"),
});

type MessageFormValues = z.infer<typeof messageSchema>;

interface CreateMessageFormProps {
  recipients: Recipient[];
  onSubmit: (values: MessageFormValues & { notifyAnonymous: boolean; notifyPreview: boolean }) => void;
  isPending: boolean;
}

export default function CreateMessageForm({ recipients, onSubmit, isPending }: CreateMessageFormProps) {
  const [notifyAnonymous, setNotifyAnonymous] = useState(true);
  const [notifyPreview, setNotifyPreview] = useState(false);
  const [selectedRecipients, setSelectedRecipients] = useState<number[]>([]);
  const [commandOpen, setCommandOpen] = useState(false);

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      title: "",
      content: "",
      type: "text",
      deliveryType: "date",
      deliveryDate: null,
      recipientIds: [],
    },
  });

  const deliveryType = form.watch("deliveryType");
  const messageType = form.watch("type");

  function handleSubmit(values: MessageFormValues) {
    onSubmit({
      ...values,
      notifyAnonymous,
      notifyPreview,
    });
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "text":
        return <MessageSquare className="h-5 w-5" />;
      case "video":
        return <Video className="h-5 w-5" />;
      case "document":
        return <File className="h-5 w-5" />;
      default:
        return <MessageSquare className="h-5 w-5" />;
    }
  };

  function toggleRecipient(id: number) {
    if (selectedRecipients.includes(id)) {
      setSelectedRecipients(selectedRecipients.filter(r => r !== id));
      form.setValue("recipientIds", selectedRecipients.filter(r => r !== id));
    } else {
      setSelectedRecipients([...selectedRecipients, id]);
      form.setValue("recipientIds", [...selectedRecipients, id]);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 overflow-y-visible">
        <div className="grid gap-6">
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a title for your message" {...field} />
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
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a message type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="text" className="flex items-center">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-primary" />
                          <span>Text Message</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="video">
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4 text-secondary" />
                          <span>Video Message</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="document">
                        <div className="flex items-center gap-2">
                          <File className="h-4 w-4 text-accent" />
                          <span>Document/Letter</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the type of message you want to send
                  </FormDescription>
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
                    <Textarea 
                      placeholder="Write your message here..." 
                      className="min-h-32 resize-y"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    {messageType === "text" && "Write your personal message"}
                    {messageType === "video" && "Provide a description and upload your video below"}
                    {messageType === "document" && "Provide a description and upload your document below"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {messageType !== "text" && (
              <div className="mt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full py-8 border-dashed border-2 text-muted-foreground hover:text-foreground"
                >
                  {messageType === "video" ? (
                    <>
                      <Video className="h-5 w-5 mr-2" />
                      Upload Video
                    </>
                  ) : (
                    <>
                      <File className="h-5 w-5 mr-2" />
                      Upload Document
                    </>
                  )}
                </Button>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <FormField
                control={form.control}
                name="deliveryType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Trigger</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select delivery method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="date">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-primary" />
                            <span>Specific Date</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="passing">
                          <div className="flex items-center gap-2">
                            <MailCheck className="h-4 w-4 text-secondary" />
                            <span>Upon Passing</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {deliveryType === "date" 
                        ? "Message will be delivered on the selected date" 
                        : "Message will be delivered after death verification"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {deliveryType === "date" && (
                <FormField
                  control={form.control}
                  name="deliveryDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Delivery Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
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
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        The date when the message will be delivered
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <FormField
              control={form.control}
              name="recipientIds"
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormLabel>Recipients</FormLabel>
                  <div className="relative">
                    <Popover open={commandOpen} onOpenChange={setCommandOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={commandOpen}
                            className="w-full justify-between"
                          >
                            {selectedRecipients.length > 0 
                              ? `${selectedRecipients.length} recipient${selectedRecipients.length > 1 ? 's' : ''} selected` 
                              : "Select recipients..."}
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search recipients..." />
                          <CommandList>
                            <CommandEmpty>No recipient found.</CommandEmpty>
                            <CommandGroup>
                              {recipients.map((recipient) => (
                                <CommandItem
                                  key={recipient.id}
                                  value={recipient.id.toString()}
                                  onSelect={() => toggleRecipient(recipient.id)}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedRecipients.includes(recipient.id) ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {recipient.name} ({recipient.email})
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  {selectedRecipients.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedRecipients.map(id => {
                        const recipient = recipients.find(r => r.id === id);
                        return (
                          <Badge 
                            key={id} 
                            variant="secondary"
                            className="px-2 py-1"
                          >
                            {recipient?.name}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 ml-1"
                              onClick={() => toggleRecipient(id)}
                            >
                              ×
                            </Button>
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                  <FormDescription>
                    Choose who will receive this message
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-6">
            <NotificationSettings
              notifyAnonymous={notifyAnonymous}
              notifyPreview={notifyPreview}
              onNotifyAnonymousChange={setNotifyAnonymous}
              onNotifyPreviewChange={setNotifyPreview}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline">Cancel</Button>
          <Button 
            type="submit" 
            disabled={isPending}
            className="gap-2"
          >
            {isPending ? "Creating..." : "Create Message"}
          </Button>
        </div>
      </form>
    </Form>
  );
}