import { Message, Recipient } from "@shared/schema";
import { formatDistance } from "date-fns";
import { CalendarIcon, Clock, MoreHorizontal, Edit, Eye } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface MessageCardProps {
  message: Message;
  recipients: Recipient[];
}

export function MessageCard({ message, recipients }: MessageCardProps) {
  const messageRecipients = recipients.slice(0, 3); // Just show up to 3 recipients visually
  const additionalRecipientCount = Math.max(0, recipients.length - 3);
  
  // Get status badge configuration
  const getStatusBadge = () => {
    switch (message.status) {
      case "draft":
        return {
          label: "Draft",
          icon: <Clock className="mr-1 h-3 w-3" />,
          className: "bg-yellow-100 text-yellow-800",
        };
      case "scheduled":
        return {
          label: "Scheduled",
          icon: <CalendarIcon className="mr-1 h-3 w-3" />,
          className: "bg-green-100 text-green-800",
        };
      case "delivered":
        return {
          label: "Delivered",
          icon: <CheckIcon className="mr-1 h-3 w-3" />,
          className: "bg-blue-100 text-blue-800",
        };
      default:
        return {
          label: message.type.charAt(0).toUpperCase() + message.type.slice(1),
          icon: message.type === "video" ? (
            <VideoIcon className="mr-1 h-3 w-3" />
          ) : (
            <FileIcon className="mr-1 h-3 w-3" />
          ),
          className: "bg-primary-100 text-primary-800",
        };
    }
  };

  const statusBadge = getStatusBadge();
  
  // Format the date for display
  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "Not scheduled";
    return new Date(date).toLocaleDateString();
  };
  
  // Get last updated time in relative format
  const getLastUpdatedText = () => {
    if (!message.lastUpdated) return "Never updated";
    return `Last updated: ${formatDistance(new Date(message.lastUpdated), new Date(), { addSuffix: true })}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 transition-all hover:shadow-md group">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <Badge variant="outline" className={statusBadge.className}>
              <span className="flex items-center">
                {statusBadge.icon}
                {statusBadge.label}
              </span>
            </Badge>
            <h3 className="mt-2 text-lg font-medium text-gray-900 group-hover:text-primary transition-colors">
              {message.title}
            </h3>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="font-serif text-gray-600 mb-4 line-clamp-2">
          {/* Display first 120 characters of content as preview */}
          {message.content.length > 120
            ? `${message.content.substring(0, 120)}...`
            : message.content}
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-500">
            <div className="flex -space-x-1 overflow-hidden mr-2">
              {messageRecipients.map((recipient, index) => (
                <Avatar key={index} className="h-6 w-6 border-2 border-white">
                  <AvatarFallback className="bg-primary-100 text-primary-700 text-xs">
                    {recipient.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
              {additionalRecipientCount > 0 && (
                <div className="h-6 w-6 rounded-full border-2 border-white bg-primary-200 flex items-center justify-center text-xs text-primary-600 font-medium">
                  +{additionalRecipientCount}
                </div>
              )}
            </div>
            {recipients.length === 1 ? "1 recipient" : `${recipients.length} recipients`}
          </div>
          
          <div className="text-gray-500 flex items-center">
            <CalendarIcon className="mr-1 h-4 w-4" />
            <span>Delivery: {formatDate(message.deliveryDate)}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center text-sm">
          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
            message.status === "draft" ? "bg-yellow-500" : "bg-green-500"
          }`}></span>
          <span className="text-gray-600">{getLastUpdatedText()}</span>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Edit className="h-4 w-4 text-gray-500 hover:text-primary-500" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Eye className="h-4 w-4 text-gray-500 hover:text-primary-500" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function VideoIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <polygon points="23 7 16 12 23 17 23 7"></polygon>
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
    </svg>
  );
}

function FileIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}
