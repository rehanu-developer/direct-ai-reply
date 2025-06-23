
import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import { useOpenAI } from '@/hooks/useOpenAI';
import { MessageCircle } from 'lucide-react';

const ChatInterface = () => {
  const { messages, isLoading, error, sendMessage } = useOpenAI();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="border-b bg-white p-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <MessageCircle size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">ChatBot</h1>
            <p className="text-sm text-gray-500">Powered by OpenAI</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MessageCircle size={24} className="text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">How can I help you today?</h2>
              <p className="text-gray-500 max-w-md">
                Ask me anything! I'm here to help with questions, provide information, or just have a conversation.
              </p>
            </div>
          )}

          {messages.map((message, index) => (
            <div key={message.id} className="animate-in fade-in duration-500">
              <ChatMessage
                message={message.content}
                isUser={message.role === 'user'}
                timestamp={message.timestamp}
              />
            </div>
          ))}

          {isLoading && (
            <div className="animate-in fade-in duration-300">
              <TypingIndicator />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0">
        <ChatInput onSendMessage={sendMessage} disabled={isLoading} />
      </div>
    </div>
  );
};

export default ChatInterface;
