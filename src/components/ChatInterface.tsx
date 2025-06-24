
import React, { useEffect, useRef, useState } from 'react';
import EnhancedChatMessage from './EnhancedChatMessage';
import EnhancedChatInput from './EnhancedChatInput';
import ChatHeader from './ChatHeader';
import ChatSidebar from './ChatSidebar';
import TypingIndicator from './TypingIndicator';
import { useMultimodalAI } from '@/hooks/useMultimodalAI';
import { useChatSessions } from '@/hooks/useChatSessions';
import { useTheme } from '@/contexts/ThemeContext';
import { MessageCircle, Menu } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { MediaContent, Message } from '@/types/chat.types';
import { motion, AnimatePresence } from 'framer-motion';

const ChatInterface = () => {
  const { sendMultimodalMessage, isLoading, error } = useMultimodalAI();
  const {
    sessions,
    currentSessionId,
    setCurrentSessionId,
    createNewSession,
    addMessageToSession,
    deleteSession,
    getCurrentSession,
  } = useChatSessions();
  
  const { isDark } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentSession = getCurrentSession();
  const messages = currentSession?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (content: string, media: MediaContent[] = []) => {
    if (!content.trim() && media.length === 0) return;

    let sessionId = currentSessionId;
    if (!sessionId) {
      sessionId = createNewSession();
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date(),
      media: media,
    };

    addMessageToSession(sessionId, userMessage);

    // Get AI response
    const assistantMessage = await sendMultimodalMessage(content, media, messages);
    if (assistantMessage) {
      addMessageToSession(sessionId, assistantMessage);
    }
  };

  const handleExportChat = () => {
    if (messages.length === 0) {
      toast({
        title: "No messages to export",
        description: "Start a conversation first",
      });
      return;
    }

    const chatText = messages.map(msg => 
      `${msg.role === 'user' ? 'You' : 'ChatBot'} (${msg.timestamp.toLocaleString()}):\n${msg.content}${
        msg.media && msg.media.length > 0 ? `\n[Media: ${msg.media.map(m => m.name).join(', ')}]` : ''
      }\n`
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

  const handleClearChat = () => {
    if (currentSessionId) {
      deleteSession(currentSessionId);
      toast({
        title: "Chat cleared",
        description: "Current session has been deleted",
      });
    }
  };

  const handleNewSession = () => {
    createNewSession();
    setSidebarOpen(false);
  };

  const handleSelectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setSidebarOpen(false);
  };

  const regenerateResponse = async (messageId: string) => {
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) return;

    const userMessage = messages[messageIndex - 1];
    if (!userMessage || userMessage.role !== 'user') return;

    // Remove the assistant message we're regenerating
    const updatedMessages = messages.filter(msg => msg.id !== messageId);
    
    // Send request again
    const assistantMessage = await sendMultimodalMessage(
      userMessage.content, 
      userMessage.media || [], 
      updatedMessages
    );
    
    if (assistantMessage && currentSessionId) {
      addMessageToSession(currentSessionId, assistantMessage);
    }
  };

  const deleteMessage = (messageId: string) => {
    if (currentSessionId) {
      const updatedMessages = messages.filter(msg => msg.id !== messageId);
      // Update the session with filtered messages
      // This would need to be implemented in useChatSessions hook
    }
  };

  return (
    <div className={`flex h-screen ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <ChatSidebar
        isOpen={sidebarOpen}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onNewSession={handleNewSession}
        onSelectSession={handleSelectSession}
        onDeleteSession={deleteSession}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex flex-col flex-1">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden m-2"
          >
            <Menu size={20} />
          </Button>
          
          <div className="flex-1">
            <ChatHeader 
              onExportChat={handleExportChat}
              onClearChat={handleClearChat}
              messageCount={messages.length}
            />
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-4">
            <AnimatePresence>
              {messages.length === 0 && (
                <motion.div 
                  className="flex flex-col items-center justify-center h-full text-center py-12"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div 
                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                      isDark ? 'bg-gray-800' : 'bg-gray-100'
                    }`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <MessageCircle size={24} className={isDark ? 'text-gray-400' : 'text-gray-400'} />
                  </motion.div>
                  <h2 className={`text-2xl font-semibold mb-2 ${
                    isDark ? 'text-gray-100' : 'text-gray-800'
                  }`}>
                    Multimodal ChatBot
                  </h2>
                  <p className={`max-w-md ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Send text, images, audio, or video. I can help with anything!
                  </p>
                </motion.div>
              )}

              {messages.map((message) => (
                <EnhancedChatMessage
                  key={message.id}
                  message={message}
                  onRegenerate={message.role === 'assistant' ? () => regenerateResponse(message.id) : undefined}
                  onDelete={() => deleteMessage(message.id)}
                />
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TypingIndicator />
              </motion.div>
            )}

            {error && (
              <motion.div 
                className={`border rounded-lg p-3 mb-4 ${
                  isDark 
                    ? 'bg-red-900/20 border-red-800 text-red-200' 
                    : 'bg-red-50 border-red-200 text-red-600'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-sm">{error}</p>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0">
          <EnhancedChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
