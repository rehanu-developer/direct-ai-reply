
import React from 'react';
import { User, Bot } from 'lucide-react';
import MessageActions from './MessageActions';
import { useTheme } from '@/contexts/ThemeContext';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp?: Date;
  onRegenerate?: () => void;
  onDelete?: () => void;
}

const ChatMessage = ({ message, isUser, timestamp, onRegenerate, onDelete }: ChatMessageProps) => {
  const { isDark } = useTheme();
  
  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'} group`}>
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser 
            ? 'bg-blue-500 text-white' 
            : isDark 
              ? 'bg-gray-700 text-gray-300' 
              : 'bg-gray-100 text-gray-600'
        }`}>
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>
        <div className="relative">
          <div className={`p-3 rounded-2xl ${
            isUser 
              ? 'bg-blue-500 text-white rounded-br-md' 
              : isDark
                ? 'bg-gray-700 text-gray-100 rounded-bl-md'
                : 'bg-gray-100 text-gray-800 rounded-bl-md'
          } shadow-sm`}>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
            {timestamp && (
              <p className={`text-xs mt-1 ${
                isUser 
                  ? 'text-blue-100' 
                  : isDark 
                    ? 'text-gray-400' 
                    : 'text-gray-500'
              }`}>
                {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>
          <div className={`absolute top-1 ${isUser ? 'left-1' : 'right-1'}`}>
            <MessageActions
              message={message}
              onRegenerate={onRegenerate}
              onDelete={onDelete}
              isUser={isUser}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
