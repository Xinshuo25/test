import { db } from "@db";
import { messages, insertMessageSchema, InsertMessage, Message } from "@shared/schema";
import { eq } from "drizzle-orm";

export const storage = {
  // Get all messages
  async getAllMessages(): Promise<Message[]> {
    try {
      return await db.query.messages.findMany({
        orderBy: (messages, { asc }) => [asc(messages.createdAt)]
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  },

  // Insert a new message
  async insertMessage(messageData: InsertMessage): Promise<Message> {
    try {
      const validatedData = insertMessageSchema.parse(messageData);
      const [newMessage] = await db.insert(messages).values(validatedData).returning();
      return newMessage;
    } catch (error) {
      console.error("Error inserting message:", error);
      throw error;
    }
  },

  // Get a message by id
  async getMessageById(id: number): Promise<Message | null> {
    try {
      return await db.query.messages.findFirst({
        where: eq(messages.id, id)
      });
    } catch (error) {
      console.error("Error fetching message by id:", error);
      throw error;
    }
  }
};
