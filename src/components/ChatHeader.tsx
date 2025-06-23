
import React from 'react';
import { MessageCircle, Moon, Sun, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from '@/components/ui/use-toast';

interface ChatHeaderProps {
  onExportChat: () => void;
  onClearChat: () => void;
  messageCount: number;
}

const ChatHeader = ({ onExportChat, onClearChat, messageCount }: ChatHeaderProps) => {
  const { isDark, toggleTheme } = useTheme();

  const handleClearChat = () => {
    if (messageCount > 0) {
      onClearChat();
      toast({
        title: "Chat cleared",
        description: "All messages have been deleted",
      });
    }
  };

  return (
    <div className={`border-b p-4 flex-shrink-0 ${
      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <MessageCircle size={16} className="text-white" />
          </div>
          <div>
            <h1 className={`text-xl font-semibold ${
              isDark ? 'text-gray-100' : 'text-gray-800'
            }`}>ChatBot</h1>
            <p className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>Powered by Groq</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={toggleTheme}
            className="h-8 w-8 p-0"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </Button>
          
          {messageCount > 0 && (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={onExportChat}
                className="h-8 w-8 p-0"
              >
                <Download size={16} />
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={handleClearChat}
                className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
              >
                <Trash2 size={16} />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
