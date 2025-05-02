import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export default function MessageInput({ value, onChange, onSend, disabled = false }: MessageInputProps) {
  const [charCount, setCharCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const maxLength = 500;

  useEffect(() => {
    setCharCount(value.length);
    
    // Auto resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && value.trim()) {
        onSend();
      }
    }
  };

  return (
    <div className="flex items-end space-x-2">
      <div className="flex-1 relative">
        <Textarea 
          ref={textareaRef}
          id="messageInput"
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here..."
          maxLength={maxLength}
          rows={1}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none min-h-[44px] max-h-[120px]"
        />
        <div className="absolute bottom-2 right-2 text-xs text-gray-400">
          {charCount}/{maxLength}
        </div>
      </div>
      <Button
        type="button"
        onClick={onSend}
        disabled={disabled || !value.trim()}
        size="icon"
        className="rounded-full h-10 w-10 bg-primary hover:bg-indigo-700 text-white flex items-center justify-center flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
      >
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
}
