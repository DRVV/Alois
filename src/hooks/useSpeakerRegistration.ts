import React from 'react';
import { useChatService } from '@/services/chatService';

export interface SpeakerRegistrationConfig {
  displayName?: string;
  color?: string;
  avatar?: string;
  defaultDuration?: number;
  chatContext?: string;
}

/**
 * Shared hook for speaker registration logic.
 * Eliminates duplication between different speaker service hooks.
 */
export const useSpeakerRegistration = (
  speakerId: string,
  config: SpeakerRegistrationConfig = {}
) => {
  const chatService = useChatService();
  
  const {
    displayName = speakerId,
    color = '#007bff',
    avatar,
    defaultDuration = 5000,
    chatContext,
  } = config;

  // Auto-register speaker on first use - only if not already registered
  React.useEffect(() => {
    const existingSpeaker = chatService.getSpeaker(speakerId);
    if (!existingSpeaker) {
      chatService.registerSpeaker(speakerId, {
        displayName,
        color,
        avatar,
        defaultDuration,
        isActive: true,
      });
    }
  }, [speakerId, displayName, color, avatar, defaultDuration, chatService]);

  return {
    speakerId,
    displayName,
    color,
    avatar,
    defaultDuration,
    chatContext,
    isRegistered: chatService.getSpeaker(speakerId) !== undefined,
  };
};
