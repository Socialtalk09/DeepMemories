import { users, type User, type InsertUser, recipients, type Recipient, type InsertRecipient, messages, type Message, type InsertMessage, messageRecipients, type MessageRecipient, type InsertMessageRecipient, trustedContacts, type TrustedContact, type InsertTrustedContact } from "@shared/schema";
import session from "express-session";
import MemoryStore from "memorystore";
import { db } from "./db";
import { eq, or, inArray } from "drizzle-orm";

const MemStore = MemoryStore(session);

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
  sessionStore: any; // Using any type to resolve TypeScript error with session.SessionStore
}

export class DatabaseStorage implements IStorage {
  sessionStore: any; // Using any type to resolve TypeScript error
  
  constructor() {
    this.sessionStore = new MemStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }
  
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  async getRecipientById(id: number): Promise<Recipient | undefined> {
    const [recipient] = await db.select().from(recipients).where(eq(recipients.id, id));
    return recipient;
  }
  
  async getRecipientsByUserId(userId: number): Promise<Recipient[]> {
    return await db.select().from(recipients).where(eq(recipients.userId, userId));
  }
  
  async getRecipientsByIds(ids: number[]): Promise<Recipient[]> {
    if (ids.length === 0) return [];
    return await db.select().from(recipients).where(inArray(recipients.id, ids));
  }
  
  async createRecipient(insertRecipient: InsertRecipient): Promise<Recipient> {
    const [recipient] = await db.insert(recipients).values(insertRecipient).returning();
    return recipient;
  }
  
  async updateRecipient(id: number, insertRecipient: InsertRecipient): Promise<Recipient> {
    const [recipient] = await db
      .update(recipients)
      .set(insertRecipient)
      .where(eq(recipients.id, id))
      .returning();
    return recipient;
  }
  
  async deleteRecipient(id: number): Promise<void> {
    await db.delete(recipients).where(eq(recipients.id, id));
  }
  
  async getMessageById(id: number): Promise<Message | undefined> {
    const [message] = await db.select().from(messages).where(eq(messages.id, id));
    return message;
  }
  
  async getMessagesByUserId(userId: number): Promise<Message[]> {
    return await db.select().from(messages).where(eq(messages.userId, userId));
  }
  
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const lastUpdated = new Date();
    const [message] = await db
      .insert(messages)
      .values({ ...insertMessage, lastUpdated })
      .returning();
    return message;
  }
  
  async updateMessage(id: number, insertMessage: InsertMessage): Promise<Message> {
    const lastUpdated = new Date();
    const [message] = await db
      .update(messages)
      .set({ ...insertMessage, lastUpdated })
      .where(eq(messages.id, id))
      .returning();
    return message;
  }
  
  async deleteMessage(id: number): Promise<void> {
    await db.delete(messages).where(eq(messages.id, id));
    await this.deleteMessageRecipientsByMessageId(id);
  }
  
  async getMessageRecipientsByMessageId(messageId: number): Promise<MessageRecipient[]> {
    return await db
      .select()
      .from(messageRecipients)
      .where(eq(messageRecipients.messageId, messageId));
  }
  
  async createMessageRecipient(insertMessageRecipient: InsertMessageRecipient): Promise<MessageRecipient> {
    const [messageRecipient] = await db
      .insert(messageRecipients)
      .values(insertMessageRecipient)
      .returning();
    return messageRecipient;
  }
  
  async deleteMessageRecipientsByMessageId(messageId: number): Promise<void> {
    await db
      .delete(messageRecipients)
      .where(eq(messageRecipients.messageId, messageId));
  }
  
  async getTrustedContactById(id: number): Promise<TrustedContact | undefined> {
    const [trustedContact] = await db
      .select()
      .from(trustedContacts)
      .where(eq(trustedContacts.id, id));
    return trustedContact;
  }
  
  async getTrustedContactsByUserId(userId: number): Promise<TrustedContact[]> {
    return await db
      .select()
      .from(trustedContacts)
      .where(eq(trustedContacts.userId, userId));
  }
  
  async createTrustedContact(insertTrustedContact: InsertTrustedContact): Promise<TrustedContact> {
    const verified = false; // New trusted contacts are not verified by default
    const [trustedContact] = await db
      .insert(trustedContacts)
      .values({ ...insertTrustedContact, verified })
      .returning();
    return trustedContact;
  }
  
  async updateTrustedContact(id: number, insertTrustedContact: InsertTrustedContact): Promise<TrustedContact> {
    // Preserve the verified status when updating
    const [existingContact] = await db
      .select()
      .from(trustedContacts)
      .where(eq(trustedContacts.id, id));
    
    const verified = existingContact ? existingContact.verified : false;
    
    const [trustedContact] = await db
      .update(trustedContacts)
      .set({ ...insertTrustedContact, verified })
      .where(eq(trustedContacts.id, id))
      .returning();
    
    return trustedContact;
  }
  
  async deleteTrustedContact(id: number): Promise<void> {
    await db.delete(trustedContacts).where(eq(trustedContacts.id, id));
  }
}

export const storage = new DatabaseStorage();