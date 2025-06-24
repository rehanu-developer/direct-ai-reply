
import React, { useState, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import MediaUploader from './MediaUploader';
import { MediaContent } from '@/types/chat.types';
import { motion } from 'framer-motion';

interface EnhancedChatInputProps {
  onSendMessage: (message: string, media: MediaContent[]) => void;
  disabled?: boolean;
}

const EnhancedChatInput = ({ onSendMessage, disabled }: EnhancedChatInputProps) => {
  const [message, setMessage] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<MediaContent[]>([]);
  const { isDark } = useTheme();

  const handleSend = () => {
    if ((message.trim() || selectedMedia.length > 0) && !disabled) {
      onSendMessage(message.trim(), selectedMedia);
      setMessage('');
      setSelectedMedia([]);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div 
      className={`border-t p-4 ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-4xl mx-auto space-y-4">
        <MediaUploader
          onMediaSelect={setSelectedMedia}
          disabled={disabled}
        />
        
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Message ChatBot... (with text, images, audio, or video)"
              disabled={disabled}
              className={`w-full p-3 pr-12 border rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] max-h-[200px] ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
              }`}
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
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={handleSend}
              disabled={(!message.trim() && selectedMedia.length === 0) || disabled}
              className="w-10 h-10 rounded-full p-0 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send size={16} />
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedChatInput;
