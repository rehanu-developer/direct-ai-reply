
import React, { useRef, useState } from 'react';
import { Upload, Camera, Mic, Video, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { useMediaCapture } from '@/hooks/useMediaCapture';
import { MediaContent } from '@/types/chat.types';
import { useTheme } from '@/contexts/ThemeContext';

interface MediaUploaderProps {
  onMediaSelect: (media: MediaContent[]) => void;
  disabled?: boolean;
}

const MediaUploader = ({ onMediaSelect, disabled }: MediaUploaderProps) => {
  const { isDark } = useTheme();
  const { uploadFile, isUploading } = useMediaUpload();
  const { startCamera, startMicrophone, startRecording, stopRecording, stopCapture, isCapturing, stream } = useMediaCapture();
  const [selectedMedia, setSelectedMedia] = useState<MediaContent[]>([]);
  const [recordingType, setRecordingType] = useState<'audio' | 'video' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const uploadedMedia: MediaContent[] = [];

    for (const file of files) {
      const media = await uploadFile(file);
      if (media) {
        uploadedMedia.push(media);
      }
    }

    if (uploadedMedia.length > 0) {
      const newMedia = [...selectedMedia, ...uploadedMedia];
      setSelectedMedia(newMedia);
      onMediaSelect(newMedia);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCameraStart = async () => {
    const mediaStream = await startCamera();
    if (mediaStream && videoPreviewRef.current) {
      videoPreviewRef.current.srcObject = mediaStream;
      setRecordingType('video');
    }
  };

  const handleMicStart = async () => {
    const mediaStream = await startMicrophone();
    if (mediaStream) {
      setRecordingType('audio');
    }
  };

  const handleStartRecording = () => {
    if (stream && recordingType) {
      startRecording(stream, recordingType);
    }
  };

  const handleStopRecording = async () => {
    const recordedMedia = await stopRecording();
    if (recordedMedia) {
      const newMedia = [...selectedMedia, recordedMedia];
      setSelectedMedia(newMedia);
      onMediaSelect(newMedia);
    }
    setRecordingType(null);
  };

  const removeMedia = (index: number) => {
    const newMedia = selectedMedia.filter((_, i) => i !== index);
    setSelectedMedia(newMedia);
    onMediaSelect(newMedia);
  };

  const handleStopCapture = () => {
    stopCapture();
    setRecordingType(null);
  };

  return (
    <div className={`border rounded-lg p-4 ${isDark ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,audio/*,video/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <Button
          size="sm"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
        >
          <Upload size={16} className="mr-1" />
          Upload
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={handleCameraStart}
          disabled={disabled || isCapturing}
        >
          <Camera size={16} className="mr-1" />
          Camera
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={handleMicStart}
          disabled={disabled || isCapturing}
        >
          <Mic size={16} className="mr-1" />
          Audio
        </Button>
      </div>

      {/* Recording Controls */}
      {recordingType && (
        <div className={`border rounded-lg p-3 mb-4 ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              {recordingType === 'video' ? 'Video Recording' : 'Audio Recording'}
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleStopCapture}
            >
              <X size={16} />
            </Button>
          </div>

          {recordingType === 'video' && (
            <video
              ref={videoPreviewRef}
              autoPlay
              muted
              className="w-full h-32 object-cover rounded mb-2 bg-black"
            />
          )}

          <div className="flex gap-2">
            {!isCapturing ? (
              <Button
                size="sm"
                onClick={handleStartRecording}
                className="bg-red-500 hover:bg-red-600"
              >
                <Video size={16} className="mr-1" />
                Start Recording
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleStopRecording}
                className="bg-red-500 hover:bg-red-600 animate-pulse"
              >
                ⏹ Stop Recording
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Selected Media Preview */}
      {selectedMedia.length > 0 && (
        <div className="space-y-2">
          <span className="text-sm font-medium">Selected Media:</span>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {selectedMedia.map((media, index) => (
              <div key={index} className={`relative border rounded-lg overflow-hidden ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeMedia(index)}
                  className="absolute top-1 right-1 h-6 w-6 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full z-10"
                >
                  <X size={12} />
                </Button>

                {media.type === 'image' && (
                  <img src={media.url} alt={media.name} className="w-full h-20 object-cover" />
                )}
                {media.type === 'video' && (
                  <video src={media.url} className="w-full h-20 object-cover" />
                )}
                {media.type === 'audio' && (
                  <div className="w-full h-20 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                    <Mic size={24} />
                  </div>
                )}
                <div className="p-1 text-xs truncate">{media.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaUploader;
