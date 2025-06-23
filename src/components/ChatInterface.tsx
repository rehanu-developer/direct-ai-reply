
import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ChatHeader from './ChatHeader';
import TypingIndicator from './TypingIndicator';
import { useOpenAI } from '@/hooks/useOpenAI';
import { useTheme } from '@/contexts/ThemeContext';
import { MessageCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const ChatInterface = () => {
  const { messages, isLoading, error, sendMessage, clearMessages, deleteMessage, regenerateResponse } = useOpenAI();
  const { isDark } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleExportChat = () => {
    if (messages.length === 0) {
      toast({
        title: "No messages to export",
        description: "Start a conversation first",
      });
      return;
    }

    const chatText = messages.map(msg => 
      `${msg.role === 'user' ? 'You' : 'ChatBot'} (${msg.timestamp.toLocaleString()}):\n${msg.content}\n`
    ).join('\n');

    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chatbot-conversation-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Chat exported",
      description: "Conversation saved to your downloads",
    });
  };

  return (
    <div className={`flex flex-col h-screen ${
      isDark ? 'bg-gray-900' : 'bg-white'
    }`}>
      <ChatHeader 
        onExportChat={handleExportChat}
        onClearChat={clearMessages}
        messageCount={messages.length}
      />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                isDark ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <MessageCircle size={24} className={isDark ? 'text-gray-400' : 'text-gray-400'} />
              </div>
              <h2 className={`text-2xl font-semibold mb-2 ${
                isDark ? 'text-gray-100' : 'text-gray-800'
              }`}>How can I help you today?</h2>
              <p className={`max-w-md ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
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
                onRegenerate={message.role === 'assistant' ? () => regenerateResponse(message.id) : undefined}
                onDelete={() => deleteMessage(message.id)}
              />
            </div>
          ))}

          {isLoading && (
            <div className="animate-in fade-in duration-300">
              <TypingIndicator />
            </div>
          )}

          {error && (
            <div className={`border rounded-lg p-3 mb-4 ${
              isDark 
                ? 'bg-red-900/20 border-red-800 text-red-200' 
                : 'bg-red-50 border-red-200 text-red-600'
            }`}>
              <p className="text-sm">{error}</p>
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
