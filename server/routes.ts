import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertMessageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // GET all messages
  app.get('/api/messages', async (req, res) => {
    try {
      const messages = await storage.getAllMessages();
      return res.json(messages);
    } catch (error) {
      console.error('Error getting messages:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // POST a new message
  app.post('/api/messages', async (req, res) => {
    try {
      // Validate request body
      const messageData = {
        content: req.body.content,
        sender: 'user'
      };
      
      const validatedData = insertMessageSchema.parse(messageData);
      
      // Save user message to database
      const userMessage = await storage.insertMessage(validatedData);

      // Generate and save bot response
      const botResponseData = {
        content: await generateBotResponse(validatedData.content),
        sender: 'bot'
      };
      
      const botMessage = await storage.insertMessage(botResponseData);
      
      return res.status(201).json(userMessage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error('Error creating message:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Helper function to generate bot responses
  async function generateBotResponse(userMessage: string): Promise<string> {
    // Simple response generation logic
    const responses = [
      "I'm happy to help! What else would you like to know?",
      "That's an interesting question. Let me provide some details based on what I know.",
      "I understand your request. Is there anything specific you'd like me to elaborate on?",
      "Thank you for your message. Let me think about how I can assist you with that.",
      `I see you mentioned "${userMessage.substring(0, 20)}${userMessage.length > 20 ? '...' : ''}". Let me help you with that.`
    ];
    
    // Simulate thinking time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  const httpServer = createServer(app);
  return httpServer;
}
