import { Message, Recipient, TrustedContact, User } from "@shared/schema";

// Extend Message type to include relationships with other entities
export interface MessageWithRecipients extends Message {
  recipients: Recipient[];
}

// Message type with additional fields for the frontend display
export interface MessageDisplay extends Message {
  relativeDeliveryDate?: string;
  formattedDate?: string;
  statusText: string;
  statusColor: string;
}

// Form data for message creation/editing
export interface MessageFormData {
  title: string;
  content: string;
  type: "text" | "video" | "document";
  deliveryType: "date" | "passing";
  deliveryDate?: Date | null;
  recipientIds: number[];
  notifyAnonymous: boolean;
  notifyPreview: boolean;
}

// Settings form data
export interface UserSettingsFormData {
  firstName?: string;
  lastName?: string;
  email: string;
  username: string;
}

// User profile with extended information
export interface UserProfile extends User {
  messageCount: number;
  recipientCount: number;
  trustedContactCount: number;
}

// Tracking the state of notification preferences
export interface NotificationPreferences {
  notifyAnonymous: boolean;
  notifyPreview: boolean;
}

// Application search context
export interface SearchContext {
  query: string;
  setQuery: (query: string) => void;
  results: Array<Message | Recipient | TrustedContact>;
  loading: boolean;
}

// Dashboard stats for the user
export interface DashboardStats {
  totalMessages: number;
  scheduledMessages: number;
  recipients: number;
  trustedContacts: number;
}

// Custom theme colors
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}
