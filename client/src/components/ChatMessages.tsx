import { useEffect, useRef } from "react";
import { Message } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  isTyping: boolean;
}

export default function ChatMessages({ messages, isLoading, isTyping }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const formatMessageTime = (timestamp: string | Date) => {
    if (!timestamp) return '';
    
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    
    // If message is from today, show time only, otherwise show relative time
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      {isLoading ? (
        // Loading state
        Array(3).fill(0).map((_, i) => (
          <div key={i} className={`flex items-start ${i % 2 === 1 ? 'justify-end' : ''} mb-4`}>
            <div className={`flex flex-col items-${i % 2 === 1 ? 'end' : 'start'}`}>
              <Skeleton className={`h-12 ${i % 2 === 1 ? 'w-52' : 'w-64'} rounded-2xl`} />
              <Skeleton className="h-3 w-16 mt-1 rounded-md" />
            </div>
          </div>
        ))
      ) : (
        messages.length === 0 ? (
          // Empty state
          <div className="text-center text-gray-500 py-8">
            <p>No messages yet. Start chatting!</p>
          </div>
        ) : (
          // Message list
          messages.map((message) => (
            <div key={message.id} className={`flex items-start ${message.sender === 'user' ? 'justify-end' : ''} mb-4`}>
              <div className={`flex flex-col items-${message.sender === 'user' ? 'end' : 'start'}`}>
                <div className={`message-bubble ${message.sender === 'user' ? 'user-message' : 'bot-message'} p-3 px-4`}>
                  <p>{message.content}</p>
                </div>
                <span className={`text-xs text-gray-500 ${message.sender === 'user' ? 'mr-2' : 'ml-2'} mt-1`}>
                  {formatMessageTime(message.createdAt)}
                </span>
              </div>
            </div>
          ))
        )
      )}
      
      {/* Typing indicator */}
      {isTyping && (
        <div className="flex items-start mb-4">
          <div className="flex flex-col items-start">
            <div className="message-bubble bot-message p-3 px-4 typing-indicator">
              <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mr-1 animate-typing-dot"></span>
              <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mr-1 animate-typing-dot" style={{ animationDelay: '0.2s' }}></span>
              <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full animate-typing-dot" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}
