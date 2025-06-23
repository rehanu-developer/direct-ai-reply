
import React from 'react';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp?: Date;
}

const ChatMessage = ({ message, isUser, timestamp }: ChatMessageProps) => {
  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
        }`}>
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>
        <div className={`p-3 rounded-2xl ${
          isUser 
            ? 'bg-blue-500 text-white rounded-br-md' 
            : 'bg-gray-100 text-gray-800 rounded-bl-md'
        } shadow-sm`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
          {timestamp && (
            <p className={`text-xs mt-1 ${
              isUser ? 'text-blue-100' : 'text-gray-500'
            }`}>
              {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
