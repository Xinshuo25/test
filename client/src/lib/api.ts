import { apiRequest } from "./queryClient";
import { Message } from "@shared/schema";

// API function to get all messages
export const getMessages = async (): Promise<Message[]> => {
  const response = await apiRequest("GET", "/api/messages", undefined);
  return response.json();
};

// API function to send a new message
export const sendMessage = async (content: string): Promise<Message> => {
  const response = await apiRequest("POST", "/api/messages", { content });
  return response.json();
};

// API function to get bot response
export const getBotResponse = async (messageId: number): Promise<Message> => {
  const response = await apiRequest("GET", `/api/messages/${messageId}/response`, undefined);
  return response.json();
};
