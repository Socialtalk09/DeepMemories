import { Message, Recipient } from "@shared/schema";
import { UserPlus, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface RecipientListProps {
  recipients: Recipient[];
  messages: Message[];
  isLoading: boolean;
}

export default function RecipientList({ recipients, messages, isLoading }: RecipientListProps) {
  // Helper function to count messages for a recipient
  const getMessageCount = (recipientId: number): number => {
    // In a real app, this would access the messageRecipients table
    // For simplicity, we'll assume all messages are for all recipients
    return messages.length;
  };

  // Only show up to 4 recipients on the dashboard
  const displayedRecipients = recipients.slice(0, 4);

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Your Recipients</h2>
        <Link href="/recipients" className="text-sm font-medium text-primary hover:text-primary-600 flex items-center">
          Manage recipients <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : recipients.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="rounded-full bg-primary-50 p-3 inline-flex mb-4">
            <UserPlus className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Add your first recipient</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Start by adding people you'd like to send messages to. You can add family members, friends, or anyone important to you.
          </p>
          <Link href="/recipients">
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all">
              Add Your First Recipient
            </button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {displayedRecipients.map((recipient) => (
              <li key={recipient.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-all">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary-100 text-primary-700">
                      {recipient.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">{recipient.name}</h4>
                    <p className="text-sm text-gray-500">{recipient.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant="outline" className={getMessageCount(recipient.id) > 0 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                    {getMessageCount(recipient.id) === 1 
                      ? "1 message" 
                      : `${getMessageCount(recipient.id)} messages`}
                  </Badge>
                  <button className="text-gray-400 hover:text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                    </svg>
                  </button>
                </div>
              </li>
            ))}
            <li className="px-6 py-4 flex items-center text-primary hover:bg-gray-50 cursor-pointer transition-all">
              <Link href="/recipients" className="flex items-center w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
                <span className="font-medium">Add new recipient</span>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </section>
  );
}
