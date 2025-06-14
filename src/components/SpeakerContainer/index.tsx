'use client';

import React from 'react';
import { SpeakerProvider, SpeakerProviderProps } from './SpeakerContext';
import ChatOverlay from '@/components/ChatOverlay';
import { MessageOptions } from '@/components/ChatOverlay/types';
import { useSpeakerService } from '@/services/speakerService';

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
 * Context-based SpeakerContainer component.
 * Creates a speaker context and optionally renders a ChatOverlay.
 * All child components can access speaker context without prop drilling.
 * 
 * For maximum flexibility, consider using SpeakerProvider + ChatOverlay directly.
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
  return (
    <SpeakerProvider
      speakerId={speakerId}
      displayName={displayName}
      color={color}
      defaultDuration={defaultDuration}
      chatContext={chatContext}
      className={className}
      style={style}
    >
      {children}
      
      {showChatOverlay && (
        <ChatOverlay 
          maxMessages={maxMessages}
          className={chatOverlayClassName}
        />
      )}
    </SpeakerProvider>
  );
};

export default SpeakerContainer;

// Re-export context components for direct usage
export { SpeakerProvider, useSpeakerContext, useSpeakerControls } from './SpeakerContext';
export type { SpeakerProviderProps, SpeakerContextValue } from './SpeakerContext';

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
