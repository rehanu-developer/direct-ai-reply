
// Environment variables configuration
export const ENV_VARIABLES = {
  MINIMAX_API_KEY: import.meta.env.VITE_MINIMAX_API_KEY || '',
  MINIMAX_BASE_URL: import.meta.env.VITE_MINIMAX_BASE_URL || 'https://api.minimax.chat/v1',
  GROQ_API_KEY: import.meta.env.VITE_GROQ_API_KEY || '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',
};

// Media upload configuration
export const MEDIA_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  SUPPORTED_AUDIO_TYPES: ['audio/mp3', 'audio/wav', 'audio/mpeg'],
  SUPPORTED_VIDEO_TYPES: ['video/mp4', 'video/webm'],
};
