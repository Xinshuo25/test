import { useState } from "react";
import ChatMessages from "./ChatMessages";
import MessageInput from "./MessageInput";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Message } from "@shared/schema";

export default function ChatInterface() {
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch messages from the server
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['/api/messages'],
  });

  // Send a message to the server
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest('POST', '/api/messages', { content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
      setInputMessage("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to send message:", error);
    }
  });

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    // Add user message immediately for better UX
    sendMessageMutation.mutate(inputMessage);
    
    // Show typing indicator
    setIsTyping(true);

    // Hide typing indicator after response is received
    setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)] max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <h1 className="font-semibold text-lg">AI Assistant</h1>
              <div className="flex items-center">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs text-gray-500 ml-1.5">Online</span>
              </div>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </header>
      
      {/* Chat messages */}
      <ChatMessages messages={messages} isLoading={isLoading} isTyping={isTyping} />
      
      {/* Message input */}
      <div className="border-t bg-white p-4">
        {sendMessageMutation.isError && (
          <div className="bg-red-50 text-red-500 text-sm p-2 rounded-md mb-2">
            Failed to send message. Please try again.
          </div>
        )}
        
        <MessageInput 
          value={inputMessage}
          onChange={setInputMessage}
          onSend={handleSendMessage}
          disabled={sendMessageMutation.isPending}
        />
      </div>
    </div>
  );
}
