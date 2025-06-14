'use client';

import React from 'react';
import { useSpeakerService } from '@/services/speakerService';
import ChatOverlay from '@/components/ChatOverlay';
import { MessageOptions } from '@/components/ChatOverlay/types';

export interface SpeakerContainerProps {
  speakerId: string;
  maxMessages?: number;
  chatContext?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  
  // Optional chat overlay customization
  showChatOverlay?: boolean;
  chatOverlayClassName?: string;
  
  // Optional speaker service configuration
  displayName?: string;
  color?: string;
  defaultDuration?: number;
}

/**
 * Minimal, unopinionated SpeakerContainer component.
 * Only handles speaker registration and chat overlay - no layout or styling opinions.
 * Users have complete control over positioning, styling, and content.
 */
const SpeakerContainer: React.FC<SpeakerContainerProps> = ({
  speakerId,
  maxMessages = 3,
  chatContext,
  className = '',
  style,
  children,
  showChatOverlay = true,
  chatOverlayClassName = '',
  displayName,
  color,
  defaultDuration,
}) => {
  // Register the speaker with optional configuration
  useSpeakerService(speakerId, {
    displayName: displayName || speakerId,
    color: color || '#007bff',
    defaultDuration: defaultDuration || 5000,
    chatContext,
  });

  return (
    <div className={className} style={style}>
      {children}
      
      {showChatOverlay && (
        <ChatOverlay 
          maxMessages={maxMessages}
          filterBySpeaker={speakerId}
          className={chatOverlayClassName}
        />
      )}
    </div>
  );
};

export default SpeakerContainer;

// Hook to get speaker container controls - now using service layer
export const useSpeakerContainer = (speakerId: string, options: {
  displayName: string;
  color?: string;
  defaultDuration?: number;
  chatContext?: string;
} = { displayName: speakerId }) => {
  const speakerService = useSpeakerService(speakerId, options);
  
  return {
    // Speaker service API
    ...speakerService,
    
    // Add convenience method for adding messages (alias for say)
    say: (message: string, messageOptions?: Omit<MessageOptions, 'speakerDisplayName'>) => {
      speakerService.say(message, messageOptions);
    },
    
    // Additional convenience methods
    sendMessage: (message: string, duration?: number) => {
      speakerService.say(message, duration ? { duration } : undefined);
    },
  };
};
