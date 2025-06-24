
import React from 'react';
import { Plus, MessageCircle, Trash2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { ChatSession } from '@/types/chat.types';

interface ChatSidebarProps {
  isOpen: boolean;
  sessions: ChatSession[];
  currentSessionId: string | null;
  onNewSession: () => void;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onClose: () => void;
}

const ChatSidebar = ({
  isOpen,
  sessions,
  currentSessionId,
  onNewSession,
  onSelectSession,
  onDeleteSession,
  onClose,
}: ChatSidebarProps) => {
  const { isDark } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:relative lg:inset-auto">
      {/* Mobile backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 lg:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar content */}
      <div className={`fixed left-0 top-0 h-full w-80 lg:relative lg:w-full transition-transform transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r z-50`}>
        
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <Button
            onClick={onNewSession}
            className="w-full"
            size="sm"
          >
            <Plus size={16} className="mr-2" />
            New Chat
          </Button>
        </div>

        <div className="overflow-y-auto h-full pb-20">
          <div className="p-2">
            {sessions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No chat sessions yet</p>
              </div>
            ) : (
              <div className="space-y-1">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`group relative rounded-lg p-3 cursor-pointer transition-colors ${
                      currentSessionId === session.id
                        ? isDark ? 'bg-gray-700' : 'bg-blue-50'
                        : isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => onSelectSession(session.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-sm font-medium truncate ${
                          isDark ? 'text-gray-100' : 'text-gray-900'
                        }`}>
                          {session.title}
                        </h3>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <Calendar size={12} className="mr-1" />
                          {session.updatedAt.toLocaleDateString()}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {session.messages.length} messages
                        </p>
                      </div>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSession(session.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 text-red-500 hover:text-red-600"
                      >
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
