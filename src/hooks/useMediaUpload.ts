
import { useState, useCallback } from 'react';
import { MEDIA_CONFIG } from '@/config/env';
import { MediaContent } from '@/types/chat.types';
import { toast } from '@/components/ui/use-toast';

export const useMediaUpload = () => {
  const [isUploading, setIsUploading] = useState(false);

  const validateFile = (file: File): boolean => {
    if (file.size > MEDIA_CONFIG.MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 10MB",
        variant: "destructive",
      });
      return false;
    }

    const allSupportedTypes = [
      ...MEDIA_CONFIG.SUPPORTED_IMAGE_TYPES,
      ...MEDIA_CONFIG.SUPPORTED_AUDIO_TYPES,
      ...MEDIA_CONFIG.SUPPORTED_VIDEO_TYPES,
    ];

    if (!allSupportedTypes.includes(file.type)) {
      toast({
        title: "Unsupported file type",
        description: "Please select a valid image, audio, or video file",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const getMediaType = (mimeType: string): 'image' | 'audio' | 'video' => {
    if (MEDIA_CONFIG.SUPPORTED_IMAGE_TYPES.includes(mimeType)) return 'image';
    if (MEDIA_CONFIG.SUPPORTED_AUDIO_TYPES.includes(mimeType)) return 'audio';
    return 'video';
  };

  const uploadFile = useCallback(async (file: File): Promise<MediaContent | null> => {
    if (!validateFile(file)) return null;

    setIsUploading(true);
    try {
      // Convert file to base64 for now (in production, upload to cloud storage)
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      const media: MediaContent = {
        type: getMediaType(file.type),
        url: base64,
        name: file.name,
        size: file.size,
        mimeType: file.type,
      };

      return media;
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to process the file",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  return {
    uploadFile,
    isUploading,
  };
};
