
import React from 'react';
import { MediaContent } from '@/types/chat.types';
import { useTheme } from '@/contexts/ThemeContext';

interface MediaRendererProps {
  media: MediaContent[];
  className?: string;
}

const MediaRenderer = ({ media, className = '' }: MediaRendererProps) => {
  const { isDark } = useTheme();

  if (!media || media.length === 0) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      {media.map((item, index) => (
        <div key={index} className={`rounded-lg overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
          {item.type === 'image' && (
            <img
              src={item.url}
              alt={item.name}
              className="max-w-full h-auto max-h-64 object-contain rounded-lg"
            />
          )}
          
          {item.type === 'video' && (
            <video
              src={item.url}
              controls
              className="max-w-full h-auto max-h-64 rounded-lg"
              preload="metadata"
            >
              Your browser does not support video playback.
            </video>
          )}
          
          {item.type === 'audio' && (
            <div className="p-3">
              <audio
                src={item.url}
                controls
                className="w-full"
                preload="metadata"
              >
                Your browser does not support audio playback.
              </audio>
              <p className="text-xs mt-1 text-gray-500">{item.name}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MediaRenderer;
