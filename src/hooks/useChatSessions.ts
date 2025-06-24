
import { useState, useEffect } from 'react';
import { ChatSession, Message } from '@/types/chat.types';

const STORAGE_KEY = 'chatbot-sessions';

export const useChatSessions = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Load sessions from localStorage
  useEffect(() => {
    const savedSessions = localStorage.getItem(STORAGE_KEY);
    if (savedSessions) {
      try {
        const parsedSessions = JSON.parse(savedSessions).map((session: any) => ({
          ...session,
          createdAt: new Date(session.createdAt),
          updatedAt: new Date(session.updatedAt),
          messages: session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        }));
        setSessions(parsedSessions);
        
        // Set current session to the most recent one
        if (parsedSessions.length > 0) {
          setCurrentSessionId(parsedSessions[0].id);
        }
      } catch (error) {
        console.error('Failed to load chat sessions:', error);
      }
    }
  }, []);

  // Save sessions to localStorage
  const saveSessions = (updatedSessions: ChatSession[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSessions));
    setSessions(updatedSessions);
  };

  const createNewSession = (): string => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: `Chat ${new Date().toLocaleDateString()}`,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedSessions = [newSession, ...sessions];
    saveSessions(updatedSessions);
    setCurrentSessionId(newSession.id);
    return newSession.id;
  };

  const addMessageToSession = (sessionId: string, message: Message) => {
    const updatedSessions = sessions.map(session => {
      if (session.id === sessionId) {
        const updatedMessages = [...session.messages, message];
        return {
          ...session,
          messages: updatedMessages,
          updatedAt: new Date(),
          title: updatedMessages.length === 1 ? 
            message.content.substring(0, 30) + '...' : 
            session.title,
        };
      }
      return session;
    });

    saveSessions(updatedSessions);
  };

  const deleteSession = (sessionId: string) => {
    const updatedSessions = sessions.filter(s => s.id !== sessionId);
    saveSessions(updatedSessions);
    
    if (currentSessionId === sessionId) {
      setCurrentSessionId(updatedSessions.length > 0 ? updatedSessions[0].id : null);
    }
  };

  const getCurrentSession = (): ChatSession | null => {
    return sessions.find(s => s.id === currentSessionId) || null;
  };

  return {
    sessions,
    currentSessionId,
    setCurrentSessionId,
    createNewSession,
    addMessageToSession,
    deleteSession,
    getCurrentSession,
  };
};
