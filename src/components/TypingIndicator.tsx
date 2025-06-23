
import React from 'react';
import { Bot } from 'lucide-react';

const TypingIndicator = () => {
  return (
    <div className="flex w-full mb-4 justify-start">
      <div className="flex max-w-[80%] flex-row items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 text-gray-600">
          <Bot size={16} />
        </div>
        <div className="p-3 rounded-2xl bg-gray-100 text-gray-800 rounded-bl-md shadow-sm">
          <div className="flex items-center gap-1">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <span className="text-xs text-gray-500 ml-2">AI is typing...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
