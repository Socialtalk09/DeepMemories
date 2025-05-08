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
    <div className="group relative bg-white rounded-xl border border-border/40 shadow-card hover:shadow-hover transition-all duration-300 overflow-hidden">
      {/* Top colored line based on status */}
      <div className={`h-1.5 w-full ${message.status === "draft" 
        ? "bg-gradient-to-r from-yellow-400 to-amber-500" 
        : message.status === "scheduled" 
        ? "bg-gradient-to-r from-primary-400 to-primary-600"
        : "bg-gradient-to-r from-green-400 to-teal-500"}`} 
      />
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-5">
          <div>
            <Badge 
              variant="outline" 
              className={`${
                message.status === "draft" 
                  ? "bg-amber-50 text-amber-700 border-amber-200" 
                  : message.status === "scheduled" 
                  ? "bg-primary-50 text-primary-700 border-primary-200"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
              } font-medium px-2.5 py-0.5`}
            >
              <span className="flex items-center">
                {statusBadge.icon}
                {statusBadge.label}
              </span>
            </Badge>
            <h3 className="mt-2.5 text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
              {message.title}
            </h3>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              <DropdownMenuItem className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4" />
                Edit Message
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Eye className="mr-2 h-4 w-4" />
                Preview Content
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="font-serif text-muted-foreground text-sm mb-5 line-clamp-2 leading-relaxed">
          {/* Display first 120 characters of content as preview */}
          {message.content.length > 120
            ? `${message.content.substring(0, 120)}...`
            : message.content}
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
          <div className="flex items-center">
            <div className="flex -space-x-1.5 overflow-hidden mr-2">
              {messageRecipients.map((recipient, index) => (
                <Avatar key={index} className="h-7 w-7 border-2 border-white">
                  <AvatarFallback className="bg-gradient-to-br from-primary-50 to-primary-100 text-primary-700 text-xs font-medium">
                    {recipient.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
              {additionalRecipientCount > 0 && (
                <div className="h-7 w-7 rounded-full border-2 border-white bg-muted flex items-center justify-center text-xs text-muted-foreground font-medium">
                  +{additionalRecipientCount}
                </div>
              )}
            </div>
            <span className="text-muted-foreground">
              {recipients.length === 1 ? "1 recipient" : `${recipients.length} recipients`}
            </span>
          </div>
          
          <div className="text-muted-foreground flex items-center bg-muted/50 px-2.5 py-1.5 rounded-full">
            <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
            <span>Delivery: {formatDate(message.deliveryDate)}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-muted/30 px-6 py-3 flex items-center justify-between border-t border-border/50">
        <div className="flex items-center text-xs">
          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
            message.status === "draft" 
              ? "bg-amber-500" 
              : message.status === "scheduled"
              ? "bg-primary"
              : "bg-emerald-500"
          }`}></span>
          <span className="text-muted-foreground">{getLastUpdatedText()}</span>
        </div>
        
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary hover:bg-primary-50">
            <Edit className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary hover:bg-primary-50">
            <Eye className="h-3.5 w-3.5" />
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
