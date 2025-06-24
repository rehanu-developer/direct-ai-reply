
import { useState } from 'react';
import { Message, MediaContent } from '@/types/chat.types';
import { ENV_VARIABLES } from '@/config/env';
import { toast } from '@/components/ui/use-toast';

export const useMultimodalAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMultimodalMessage = async (
    content: string,
    media: MediaContent[] = [],
    conversationHistory: Message[] = []
  ): Promise<Message | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // For now, using Groq API as fallback - MiniMax integration can be added when API key is provided
      const apiKey = ENV_VARIABLES.MINIMAX_API_KEY || ENV_VARIABLES.GROQ_API_KEY;
      const baseUrl = ENV_VARIABLES.MINIMAX_API_KEY 
        ? ENV_VARIABLES.MINIMAX_BASE_URL 
        : 'https://api.groq.com/openai/v1';

      const messages = [
        {
          role: 'system',
          content: 'You are a helpful multimodal assistant. You can process text, images, audio, and video content.',
        },
        ...conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        {
          role: 'user',
          content: media.length > 0 
            ? `${content}\n\n[User has attached ${media.length} media file(s): ${media.map(m => `${m.type} - ${m.name}`).join(', ')}]`
            : content,
        },
      ];

      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: ENV_VARIABLES.MINIMAX_API_KEY ? 'abab6.5-chat' : 'llama3-8b-8192',
          messages,
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.choices[0]?.message?.content || 'Sorry, I could not generate a response.',
        role: 'assistant',
        timestamp: new Date(),
        media: [],
      };

      return assistantMessage;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMultimodalMessage,
    isLoading,
    error,
  };
};
