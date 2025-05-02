import { db } from "./index";
import { messages } from "@shared/schema";

async function seed() {
  try {
    // Check if we already have messages
    const existingMessages = await db.query.messages.findMany({
      limit: 1
    });

    // Only seed if we have no messages
    if (existingMessages.length === 0) {
      console.log("Seeding initial messages...");
      
      // Initial welcome message from the bot
      await db.insert(messages).values({
        content: "Hello! I'm your AI assistant. How can I help you today?",
        sender: "bot",
        createdAt: new Date()
      });

      console.log("Seed completed successfully");
    } else {
      console.log("Database already has messages, skipping seed");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
