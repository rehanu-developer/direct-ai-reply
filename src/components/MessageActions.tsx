
import React from 'react';
import { Copy, RotateCcw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface MessageActionsProps {
  message: string;
  onRegenerate?: () => void;
  onDelete?: () => void;
  isUser: boolean;
}

const MessageActions = ({ message, onRegenerate, onDelete, isUser }: MessageActionsProps) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      toast({
        title: "Copied to clipboard",
        description: "Message copied successfully",
      });
    } catch (err) {
      console.error('Failed to copy:', err);
      toast({
        title: "Copy failed",
        description: "Failed to copy message to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button
        size="sm"
        variant="ghost"
        onClick={handleCopy}
        className="h-6 w-6 p-0"
      >
        <Copy size={12} />
      </Button>
      {!isUser && onRegenerate && (
        <Button
          size="sm"
          variant="ghost"
          onClick={onRegenerate}
          className="h-6 w-6 p-0"
        >
          <RotateCcw size={12} />
        </Button>
      )}
      {onDelete && (
        <Button
          size="sm"
          variant="ghost"
          onClick={onDelete}
          className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
        >
          <Trash2 size={12} />
        </Button>
      )}
    </div>
  );
};

export default MessageActions;
