import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AtSign, Phone, Shield, User } from "lucide-react";
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TrustedContact } from "@shared/schema";

// Extended schema to add relationship and notes fields that aren't in the database schema
const trustedContactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").nullable(),
  relationship: z.string().min(1, "Please select a relationship"),
  notes: z.string().optional(),
  userId: z.number().optional(),
});

type TrustedContactFormValues = z.infer<typeof trustedContactSchema>;

interface TrustedContactFormProps {
  onSubmit: (values: TrustedContactFormValues) => void;
  initialData?: TrustedContact;
  isPending: boolean;
}

export default function TrustedContactForm({ 
  onSubmit, 
  initialData, 
  isPending 
}: TrustedContactFormProps) {
  const form = useForm<TrustedContactFormValues>({
    resolver: zodResolver(trustedContactSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      email: initialData.email,
      phone: initialData.phone || "",
      relationship: "family", // Default value since it's not in the DB schema
      notes: "",
      userId: initialData.userId
    } : {
      name: "",
      email: "",
      phone: "",
      relationship: "",
      notes: "",
      userId: undefined
    }
  });

  function handleSubmit(values: TrustedContactFormValues) {
    onSubmit(values);
  }

  const relationshipOptions = [
    { value: "family", label: "Family Member" },
    { value: "friend", label: "Friend" },
    { value: "spouse", label: "Spouse/Partner" },
    { value: "legal", label: "Legal Representative" },
    { value: "other", label: "Other" },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Enter full name" 
                      className="pl-10" 
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <AtSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="email@example.com" 
                        type="email" 
                        className="pl-10" 
                        {...field} 
                      />
                    </div>
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
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="(123) 456-7890" 
                        className="pl-10" 
                        {...field} 
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="relationship"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Relationship</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {relationshipOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  How this person is connected to you
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Notes</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Add any additional information about this contact..."
                    className="min-h-24 resize-y"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Optional - add any details about this trusted contact
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="bg-muted/40 p-4 rounded-lg flex items-start gap-3">
          <Shield className="h-5 w-5 text-primary mt-1" />
          <div className="text-sm">
            <p className="font-medium text-foreground">What is a trusted contact?</p>
            <p className="text-muted-foreground mt-1">
              Trusted contacts can help verify your passing and facilitate the delivery of your messages. They will be contacted as part of our verification process when needed.
            </p>
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline">Cancel</Button>
          <Button 
            type="submit" 
            disabled={isPending}
            className="gap-2"
          >
            {initialData ? (isPending ? "Updating..." : "Update Contact") : (isPending ? "Adding..." : "Add Contact")}
          </Button>
        </div>
      </form>
    </Form>
  );
}