import ChatInterface from "@/components/ChatInterface";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    document.title = "AI Assistant Chat";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <ChatInterface />
    </div>
  );
}
