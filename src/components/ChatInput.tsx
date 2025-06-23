
import React, { useState, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSendMessage, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t bg-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Message ChatBot..."
              disabled={disabled}
              className="w-full p-3 pr-12 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] max-h-[200px]"
              rows={1}
              style={{
                height: 'auto',
                minHeight: '44px',
                maxHeight: '200px',
                overflowY: message.split('\n').length > 3 ? 'auto' : 'hidden'
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 200) + 'px';
              }}
            />
          </div>
          <Button
            onClick={handleSend}
            disabled={!message.trim() || disabled}
            className="w-10 h-10 rounded-full p-0 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
