
import { useState, useRef } from 'react';
import { MediaContent } from '@/types/chat.types';
import { toast } from '@/components/ui/use-toast';

export const useMediaCapture = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startCamera = async (): Promise<MediaStream | null> => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);
      return mediaStream;
    } catch (error) {
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to record video",
        variant: "destructive",
      });
      return null;
    }
  };

  const startMicrophone = async (): Promise<MediaStream | null> => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      setStream(mediaStream);
      return mediaStream;
    } catch (error) {
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to record audio",
        variant: "destructive",
      });
      return null;
    }
  };

  const startRecording = (mediaStream: MediaStream, type: 'audio' | 'video') => {
    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(mediaStream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorder.start();
    setIsCapturing(true);
  };

  const stopRecording = (): Promise<MediaContent | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current) {
        resolve(null);
        return;
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: chunksRef.current[0]?.type || 'video/webm',
        });
        
        const url = URL.createObjectURL(blob);
        const isVideo = blob.type.startsWith('video');
        
        const media: MediaContent = {
          type: isVideo ? 'video' : 'audio',
          url,
          name: `recorded_${isVideo ? 'video' : 'audio'}_${Date.now()}`,
          size: blob.size,
          mimeType: blob.type,
        };

        resolve(media);
        setIsCapturing(false);
        
        // Stop all tracks
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
        }
      };

      mediaRecorderRef.current.stop();
    });
  };

  const stopCapture = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCapturing(false);
  };

  return {
    startCamera,
    startMicrophone,
    startRecording,
    stopRecording,
    stopCapture,
    isCapturing,
    stream,
  };
};
