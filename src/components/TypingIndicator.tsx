
import React from 'react';
import { Bot } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const TypingIndicator = () => {
  const { isDark } = useTheme();
  
  return (
    <div className="flex w-full mb-4 justify-start">
      <div className="flex max-w-[80%] flex-row items-start gap-3">
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
        }`}>
          <Bot size={16} />
        </div>
        <div className={`p-3 rounded-2xl rounded-bl-md shadow-sm ${
          isDark ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-800'
        }`}>
          <div className="flex items-center gap-1">
            <div className="flex gap-1">
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                isDark ? 'bg-gray-400' : 'bg-gray-400'
              }`}></div>
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                isDark ? 'bg-gray-400' : 'bg-gray-400'
              }`} style={{ animationDelay: '0.2s' }}></div>
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                isDark ? 'bg-gray-400' : 'bg-gray-400'
              }`} style={{ animationDelay: '0.4s' }}></div>
            </div>
            <span className={`text-xs ml-2 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>AI is typing...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
