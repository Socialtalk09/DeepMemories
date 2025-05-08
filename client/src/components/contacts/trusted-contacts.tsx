import { TrustedContact } from "@shared/schema";
import { ShieldCheck, PlusCircle, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface TrustedContactsProps {
  contacts: TrustedContact[];
  isLoading: boolean;
}

export default function TrustedContacts({ contacts, isLoading }: TrustedContactsProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Trusted Contacts</h2>
        <Link href="/settings" className="text-sm font-medium text-primary hover:text-primary-600 flex items-center">
          Manage contacts <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 mb-4">Trusted contacts can confirm delivery triggers for your messages when the time comes.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contacts.length === 0 ? (
              <div className="md:col-span-2 p-6 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <ShieldCheck className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <h3 className="text-base font-medium text-gray-700 mb-1">No trusted contacts yet</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Add someone you trust to help with message delivery after your passing.
                </p>
                <Link href="/settings">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all">
                    Add Trusted Contact
                  </button>
                </Link>
              </div>
            ) : (
              <>
                {contacts.map((contact) => (
                  <div 
                    key={contact.id} 
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-200 transition-all"
                  >
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarFallback className="bg-primary-100 text-primary-700">
                        {contact.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{contact.name}</h4>
                      <p className="text-sm text-gray-500">{contact.email}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={contact.verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                    >
                      {contact.verified ? "Verified" : "Pending"}
                    </Badge>
                  </div>
                ))}
                
                {/* Add Trusted Contact Card */}
                <div 
                  className="flex items-center p-4 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-primary-300 hover:bg-gray-50 transition-all"
                  onClick={() => window.location.href = "/settings"}
                >
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-primary mr-4">
                    <PlusCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Add Trusted Contact</h4>
                    <p className="text-xs text-gray-500">Add someone you trust to help with message delivery</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

function ArrowRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  );
}
