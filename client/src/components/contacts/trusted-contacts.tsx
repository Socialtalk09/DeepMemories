import { useState } from "react";
import { Check, Edit, Loader2, MoreHorizontal, Plus, Shield, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrustedContact } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import TrustedContactForm from "./trusted-contact-form";

interface TrustedContactsProps {
  contacts: TrustedContact[];
  isLoading: boolean;
}

export default function TrustedContacts({ contacts, isLoading }: TrustedContactsProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<TrustedContact | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleAddContact = (data: any) => {
    // This would connect to your createTrustedContact mutation
    console.log("Adding contact:", data);
    setIsPending(true);
    setTimeout(() => {
      setIsPending(false);
      setIsAddDialogOpen(false);
    }, 1000);
  };
  
  const handleEditContact = (data: any) => {
    // This would connect to your updateTrustedContact mutation
    console.log("Editing contact:", data);
    setIsPending(true);
    setTimeout(() => {
      setIsPending(false);
      setIsEditDialogOpen(false);
    }, 1000);
  };
  
  const handleDeleteContact = (contact: TrustedContact) => {
    // This would connect to your deleteTrustedContact mutation
    console.log("Deleting contact:", contact);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Trusted Contacts</h2>
          <p className="text-muted-foreground">Manage people who can help verify your passing</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" /> Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add Trusted Contact</DialogTitle>
              <DialogDescription>
                Add someone who can help verify your passing and facilitate message delivery
              </DialogDescription>
            </DialogHeader>
            <TrustedContactForm 
              onSubmit={handleAddContact} 
              isPending={isPending}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
        </div>
      ) : contacts.length === 0 ? (
        <Card className="bg-muted/40">
          <CardContent className="pt-10 pb-10 flex flex-col items-center justify-center text-center">
            <div className="mb-4 bg-primary/10 p-3 rounded-full">
              <Shield className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No trusted contacts yet</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              Trusted contacts are people who can help verify your passing and facilitate the delivery of your messages
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Add Your First Contact
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map((contact) => (
            <Card key={contact.id} className="overflow-hidden">
              <CardHeader className="pb-3 relative">
                <div className="absolute top-3 right-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => {
                          setSelectedContact(contact);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDeleteContact(contact)}
                      >
                        <Trash className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border">
                    <AvatarFallback className="bg-primary-50 text-primary">
                      {contact.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{contact.name}</CardTitle>
                    <CardDescription className="line-clamp-1">
                      {contact.verified ? (
                        <Badge variant="outline" className="gap-1 mt-1 border-green-200 text-green-600 bg-green-50">
                          <Check className="h-3 w-3" /> Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground mt-1">
                          Pending verification
                        </Badge>
                      )}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{contact.email}</span>
                  </div>
                  {contact.phone && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="font-medium">{contact.phone}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Trusted Contact</DialogTitle>
            <DialogDescription>
              Update contact information
            </DialogDescription>
          </DialogHeader>
          {selectedContact && (
            <TrustedContactForm 
              initialData={selectedContact}
              onSubmit={handleEditContact} 
              isPending={isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ArrowRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}