import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertRecipientSchema, insertMessageSchema, insertMessageRecipientSchema, insertTrustedContactSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes (/api/register, /api/login, /api/logout, /api/user)
  setupAuth(app);

  // Recipients API
  app.get("/api/recipients", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const recipients = await storage.getRecipientsByUserId(req.user.id);
      res.json(recipients);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recipients" });
    }
  });

  app.post("/api/recipients", async (req, res) => {
    console.log("Session ID:", req.sessionID);
    console.log("Session data:", req.session);
    console.log("User authenticated:", req.isAuthenticated());
    console.log("User data:", req.user);
    
    if (!req.isAuthenticated()) {
      console.log("Authentication failed - returning 401");
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      console.log("Creating recipient for user:", req.user.id);
      console.log("Request body:", req.body);
      
      const validatedData = insertRecipientSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      console.log("Validated data:", validatedData);
      
      const recipient = await storage.createRecipient(validatedData);
      console.log("Created recipient:", recipient);
      
      res.status(201).json(recipient);
    } catch (error) {
      console.error("Error creating recipient:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid recipient data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create recipient" });
    }
  });

  app.put("/api/recipients/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const recipientId = parseInt(req.params.id);
      const existingRecipient = await storage.getRecipientById(recipientId);
      
      if (!existingRecipient) {
        return res.status(404).json({ message: "Recipient not found" });
      }
      
      if (existingRecipient.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const validatedData = insertRecipientSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const updatedRecipient = await storage.updateRecipient(recipientId, validatedData);
      res.json(updatedRecipient);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid recipient data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update recipient" });
    }
  });

  app.delete("/api/recipients/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const recipientId = parseInt(req.params.id);
      const existingRecipient = await storage.getRecipientById(recipientId);
      
      if (!existingRecipient) {
        return res.status(404).json({ message: "Recipient not found" });
      }
      
      if (existingRecipient.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      await storage.deleteRecipient(recipientId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete recipient" });
    }
  });

  // Messages API
  app.get("/api/messages", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const messages = await storage.getMessagesByUserId(req.user.id);
      
      // Get recipients for each message
      const messagesWithRecipients = await Promise.all(
        messages.map(async (message) => {
          const messageRecipients = await storage.getMessageRecipientsByMessageId(message.id);
          const recipientIds = messageRecipients.map(mr => mr.recipientId);
          const recipients = await storage.getRecipientsByIds(recipientIds);
          
          return {
            ...message,
            recipients
          };
        })
      );
      
      res.json(messagesWithRecipients);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.get("/api/messages/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const messageId = parseInt(req.params.id);
      const message = await storage.getMessageById(messageId);
      
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }
      
      if (message.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const messageRecipients = await storage.getMessageRecipientsByMessageId(messageId);
      const recipientIds = messageRecipients.map(mr => mr.recipientId);
      const recipients = await storage.getRecipientsByIds(recipientIds);
      
      res.json({
        ...message,
        recipients
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch message" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      console.log("Creating message for user:", req.user.id);
      console.log("Request body:", req.body);
      
      const { recipients: recipientIds, ...messageData } = req.body;
      
      // Import encryption utilities
      const { formatMessage } = await import("./encryption.js");
      
      // Encrypt the message content
      const { encryptedContent, encryptedKey } = formatMessage(messageData.content || "");
      
      // Prepare message data with all required fields
      const messageToValidate = {
        title: messageData.title || "",
        content: encryptedContent,
        type: messageData.type || "text",
        encryptedKey: encryptedKey,
        status: messageData.status || "draft",
        deliveryType: messageData.deliveryType || "date",
        deliveryDate: messageData.deliveryDate ? new Date(messageData.deliveryDate) : null,
        userId: req.user.id
      };
      
      console.log("Data to validate:", messageToValidate);
      
      const validatedData = insertMessageSchema.parse(messageToValidate);
      
      console.log("Validated data:", validatedData);
      
      const message = await storage.createMessage(validatedData);
      
      // Add recipients to message
      if (Array.isArray(recipientIds) && recipientIds.length > 0) {
        await Promise.all(
          recipientIds.map(async (recipientId) => {
            const data = {
              messageId: message.id,
              recipientId
            };
            await storage.createMessageRecipient(data);
          })
        );
      }
      
      console.log("Created message:", message);
      res.status(201).json(message);
    } catch (error) {
      console.error("Message creation error:", error);
      if (error instanceof z.ZodError) {
        console.error("Validation errors:", error.errors);
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create message" });
    }
  });

  app.put("/api/messages/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const messageId = parseInt(req.params.id);
      const existingMessage = await storage.getMessageById(messageId);
      
      if (!existingMessage) {
        return res.status(404).json({ message: "Message not found" });
      }
      
      if (existingMessage.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const { recipients: recipientIds, ...messageData } = req.body;
      
      const validatedData = insertMessageSchema.parse({
        ...messageData,
        userId: req.user.id
      });
      
      const updatedMessage = await storage.updateMessage(messageId, validatedData);
      
      // Update recipients if provided
      if (Array.isArray(recipientIds)) {
        // Remove existing recipients
        await storage.deleteMessageRecipientsByMessageId(messageId);
        
        // Add new recipients
        if (recipientIds.length > 0) {
          await Promise.all(
            recipientIds.map(async (recipientId) => {
              const data = {
                messageId,
                recipientId
              };
              await storage.createMessageRecipient(data);
            })
          );
        }
      }
      
      res.json(updatedMessage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update message" });
    }
  });

  app.delete("/api/messages/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const messageId = parseInt(req.params.id);
      const existingMessage = await storage.getMessageById(messageId);
      
      if (!existingMessage) {
        return res.status(404).json({ message: "Message not found" });
      }
      
      if (existingMessage.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Delete message recipients first
      await storage.deleteMessageRecipientsByMessageId(messageId);
      
      // Delete message
      await storage.deleteMessage(messageId);
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete message" });
    }
  });

  // Trusted Contacts API
  app.get("/api/trusted-contacts", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const trustedContacts = await storage.getTrustedContactsByUserId(req.user.id);
      res.json(trustedContacts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trusted contacts" });
    }
  });

  app.post("/api/trusted-contacts", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const validatedData = insertTrustedContactSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const trustedContact = await storage.createTrustedContact(validatedData);
      res.status(201).json(trustedContact);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid trusted contact data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create trusted contact" });
    }
  });

  app.put("/api/trusted-contacts/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const contactId = parseInt(req.params.id);
      const existingContact = await storage.getTrustedContactById(contactId);
      
      if (!existingContact) {
        return res.status(404).json({ message: "Trusted contact not found" });
      }
      
      if (existingContact.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const validatedData = insertTrustedContactSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const updatedContact = await storage.updateTrustedContact(contactId, validatedData);
      res.json(updatedContact);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid trusted contact data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update trusted contact" });
    }
  });

  app.delete("/api/trusted-contacts/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const contactId = parseInt(req.params.id);
      const existingContact = await storage.getTrustedContactById(contactId);
      
      if (!existingContact) {
        return res.status(404).json({ message: "Trusted contact not found" });
      }
      
      if (existingContact.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      await storage.deleteTrustedContact(contactId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete trusted contact" });
    }
  });

  // Create the HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
