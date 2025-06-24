
import React from 'react';
import { User, Bot } from 'lucide-react';
import MessageActions from './MessageActions';
import MediaRenderer from './MediaRenderer';
import { useTheme } from '@/contexts/ThemeContext';
import { Message } from '@/types/chat.types';
import { motion } from 'framer-motion';

interface EnhancedChatMessageProps {
  message: Message;
  onRegenerate?: () => void;
  onDelete?: () => void;
}

const EnhancedChatMessage = ({ message, onRegenerate, onDelete }: EnhancedChatMessageProps) => {
  const { isDark } = useTheme();
  const isUser = message.role === 'user';
  
  return (
    <motion.div 
      className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'} group`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
        <motion.div 
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isUser 
              ? 'bg-blue-500 text-white' 
              : isDark 
                ? 'bg-gray-700 text-gray-300' 
                : 'bg-gray-100 text-gray-600'
          }`}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </motion.div>
        
        <div className="relative">
          <motion.div 
            className={`p-3 rounded-2xl ${
              isUser 
                ? 'bg-blue-500 text-white rounded-br-md' 
                : isDark
                  ? 'bg-gray-700 text-gray-100 rounded-bl-md'
                  : 'bg-gray-100 text-gray-800 rounded-bl-md'
            } shadow-sm`}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            {message.content && (
              <p className="text-sm leading-relaxed whitespace-pre-wrap mb-2">
                {message.content}
              </p>
            )}
            
            {message.media && message.media.length > 0 && (
              <MediaRenderer media={message.media} className="mt-2" />
            )}
            
            <p className={`text-xs mt-1 ${
              isUser 
                ? 'text-blue-100' 
                : isDark 
                  ? 'text-gray-400' 
                  : 'text-gray-500'
            }`}>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </motion.div>
          
          <div className={`absolute top-1 ${isUser ? 'left-1' : 'right-1'}`}>
            <MessageActions
              message={message.content}
              onRegenerate={onRegenerate}
              onDelete={onDelete}
              isUser={isUser}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedChatMessage;
