import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email").notNull().unique(),
});

export const recipients = pgTable("recipients", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  relationship: text("relationship"),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull().default("text"), // text, video, document
  encryptedKey: text("encrypted_key").notNull(), // encrypted symmetric key
  status: text("status").notNull().default("draft"), // draft, scheduled, delivered
  deliveryType: text("delivery_type").notNull().default("date"), // date, passing
  deliveryDate: timestamp("delivery_date"),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

export const messageRecipients = pgTable("message_recipients", {
  id: serial("id").primaryKey(),
  messageId: integer("message_id").notNull().references(() => messages.id),
  recipientId: integer("recipient_id").notNull().references(() => recipients.id),
  notificationSent: boolean("notification_sent").notNull().default(false),
  delivered: boolean("delivered").notNull().default(false),
});

export const trustedContacts = pgTable("trusted_contacts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  verified: boolean("verified").notNull().default(false),
});

// Insertion schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  firstName: true,
  lastName: true,
});

export const insertRecipientSchema = createInsertSchema(recipients).omit({
  id: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  lastUpdated: true,
});

export const insertMessageRecipientSchema = createInsertSchema(messageRecipients).omit({
  id: true,
  notificationSent: true,
  delivered: true,
});

export const insertTrustedContactSchema = createInsertSchema(trustedContacts).omit({
  id: true,
  verified: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertRecipient = z.infer<typeof insertRecipientSchema>;
export type Recipient = typeof recipients.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type InsertMessageRecipient = z.infer<typeof insertMessageRecipientSchema>;
export type MessageRecipient = typeof messageRecipients.$inferSelect;

export type InsertTrustedContact = z.infer<typeof insertTrustedContactSchema>;
export type TrustedContact = typeof trustedContacts.$inferSelect;
