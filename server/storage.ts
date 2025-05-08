import { users, type User, type InsertUser, recipients, type Recipient, type InsertRecipient, messages, type Message, type InsertMessage, messageRecipients, type MessageRecipient, type InsertMessageRecipient, trustedContacts, type TrustedContact, type InsertTrustedContact } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Recipient methods
  getRecipientById(id: number): Promise<Recipient | undefined>;
  getRecipientsByUserId(userId: number): Promise<Recipient[]>;
  getRecipientsByIds(ids: number[]): Promise<Recipient[]>;
  createRecipient(recipient: InsertRecipient): Promise<Recipient>;
  updateRecipient(id: number, recipient: InsertRecipient): Promise<Recipient>;
  deleteRecipient(id: number): Promise<void>;
  
  // Message methods
  getMessageById(id: number): Promise<Message | undefined>;
  getMessagesByUserId(userId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  updateMessage(id: number, message: InsertMessage): Promise<Message>;
  deleteMessage(id: number): Promise<void>;
  
  // MessageRecipient methods
  getMessageRecipientsByMessageId(messageId: number): Promise<MessageRecipient[]>;
  createMessageRecipient(messageRecipient: InsertMessageRecipient): Promise<MessageRecipient>;
  deleteMessageRecipientsByMessageId(messageId: number): Promise<void>;
  
  // TrustedContact methods
  getTrustedContactById(id: number): Promise<TrustedContact | undefined>;
  getTrustedContactsByUserId(userId: number): Promise<TrustedContact[]>;
  createTrustedContact(trustedContact: InsertTrustedContact): Promise<TrustedContact>;
  updateTrustedContact(id: number, trustedContact: InsertTrustedContact): Promise<TrustedContact>;
  deleteTrustedContact(id: number): Promise<void>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private recipients: Map<number, Recipient>;
  private messages: Map<number, Message>;
  private messageRecipients: Map<number, MessageRecipient>;
  private trustedContacts: Map<number, TrustedContact>;
  
  sessionStore: session.SessionStore;
  
  private userIdCounter: number;
  private recipientIdCounter: number;
  private messageIdCounter: number;
  private messageRecipientIdCounter: number;
  private trustedContactIdCounter: number;

  constructor() {
    this.users = new Map();
    this.recipients = new Map();
    this.messages = new Map();
    this.messageRecipients = new Map();
    this.trustedContacts = new Map();
    
    this.userIdCounter = 1;
    this.recipientIdCounter = 1;
    this.messageIdCounter = 1;
    this.messageRecipientIdCounter = 1;
    this.trustedContactIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // clear expired sessions every 24h
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Recipient methods
  async getRecipientById(id: number): Promise<Recipient | undefined> {
    return this.recipients.get(id);
  }
  
  async getRecipientsByUserId(userId: number): Promise<Recipient[]> {
    return Array.from(this.recipients.values()).filter(
      (recipient) => recipient.userId === userId
    );
  }
  
  async getRecipientsByIds(ids: number[]): Promise<Recipient[]> {
    return Array.from(this.recipients.values()).filter(
      (recipient) => ids.includes(recipient.id)
    );
  }
  
  async createRecipient(insertRecipient: InsertRecipient): Promise<Recipient> {
    const id = this.recipientIdCounter++;
    const recipient: Recipient = { ...insertRecipient, id };
    this.recipients.set(id, recipient);
    return recipient;
  }
  
  async updateRecipient(id: number, insertRecipient: InsertRecipient): Promise<Recipient> {
    const recipient: Recipient = { ...insertRecipient, id };
    this.recipients.set(id, recipient);
    return recipient;
  }
  
  async deleteRecipient(id: number): Promise<void> {
    this.recipients.delete(id);
  }
  
  // Message methods
  async getMessageById(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }
  
  async getMessagesByUserId(userId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      (message) => message.userId === userId
    );
  }
  
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageIdCounter++;
    const lastUpdated = new Date();
    const message: Message = { ...insertMessage, id, lastUpdated };
    this.messages.set(id, message);
    return message;
  }
  
  async updateMessage(id: number, insertMessage: InsertMessage): Promise<Message> {
    const lastUpdated = new Date();
    const message: Message = { ...insertMessage, id, lastUpdated };
    this.messages.set(id, message);
    return message;
  }
  
  async deleteMessage(id: number): Promise<void> {
    this.messages.delete(id);
  }
  
  // MessageRecipient methods
  async getMessageRecipientsByMessageId(messageId: number): Promise<MessageRecipient[]> {
    return Array.from(this.messageRecipients.values()).filter(
      (mr) => mr.messageId === messageId
    );
  }
  
  async createMessageRecipient(insertMessageRecipient: InsertMessageRecipient): Promise<MessageRecipient> {
    const id = this.messageRecipientIdCounter++;
    const notificationSent = false;
    const delivered = false;
    const messageRecipient: MessageRecipient = { 
      ...insertMessageRecipient, 
      id, 
      notificationSent, 
      delivered 
    };
    this.messageRecipients.set(id, messageRecipient);
    return messageRecipient;
  }
  
  async deleteMessageRecipientsByMessageId(messageId: number): Promise<void> {
    const messageRecipientsToDelete = Array.from(this.messageRecipients.entries())
      .filter(([_, mr]) => mr.messageId === messageId);
    
    for (const [id] of messageRecipientsToDelete) {
      this.messageRecipients.delete(id);
    }
  }
  
  // TrustedContact methods
  async getTrustedContactById(id: number): Promise<TrustedContact | undefined> {
    return this.trustedContacts.get(id);
  }
  
  async getTrustedContactsByUserId(userId: number): Promise<TrustedContact[]> {
    return Array.from(this.trustedContacts.values()).filter(
      (contact) => contact.userId === userId
    );
  }
  
  async createTrustedContact(insertTrustedContact: InsertTrustedContact): Promise<TrustedContact> {
    const id = this.trustedContactIdCounter++;
    const verified = false;
    const trustedContact: TrustedContact = { ...insertTrustedContact, id, verified };
    this.trustedContacts.set(id, trustedContact);
    return trustedContact;
  }
  
  async updateTrustedContact(id: number, insertTrustedContact: InsertTrustedContact): Promise<TrustedContact> {
    const existingContact = this.trustedContacts.get(id);
    const verified = existingContact ? existingContact.verified : false;
    const trustedContact: TrustedContact = { ...insertTrustedContact, id, verified };
    this.trustedContacts.set(id, trustedContact);
    return trustedContact;
  }
  
  async deleteTrustedContact(id: number): Promise<void> {
    this.trustedContacts.delete(id);
  }
}

export const storage = new MemStorage();
