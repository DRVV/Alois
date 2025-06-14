import React from 'react';
import { useChatService } from './chatService';
import { ChatMessage, SpeakerConfig, MessageOptions, SpeakerStats } from '@/components/ChatOverlay/types';

export interface SpeakerServiceConfig {
  displayName?: string;
  color?: string;
  avatar?: string;
  defaultDuration?: number;
  chatContext?: string;
}

export interface SpeakerServiceAPI {
  // Core messaging
  say: (message: string, options?: Omit<MessageOptions, 'speakerDisplayName'>) => void;
  
  // Data access
  getMyMessages: () => ChatMessage[];
  getMyVisibleMessages: (maxMessages?: number) => ChatMessage[];
  getMyStats: () => SpeakerStats | undefined;
  
  // Speaker info
  speakerId: string;
  displayName: string;
  isRegistered: boolean;
  config: SpeakerConfig | undefined;
  
  // State
  messageCount: number;
  lastMessageTime?: Date;
}

/**
 * Speaker-specific service hook - provides encapsulated access to speaker functionality
 * This hook automatically registers the speaker and provides speaker-specific operations
 */
export const useSpeakerService = (
  speakerId: string, 
  config: SpeakerServiceConfig = {}
): SpeakerServiceAPI => {
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
  }, [speakerId, displayName, color, avatar, defaultDuration]);

  // Get speaker info
  const speakerConfig = chatService.getSpeaker(speakerId);
  const isRegistered = speakerConfig !== undefined;

  // Get speaker-specific messages
  const myMessages = chatService.getMessages({ speakerId });
  const messageCount = myMessages.length;
  const lastMessageTime = myMessages.length > 0 
    ? myMessages[myMessages.length - 1].timestamp 
    : undefined;

  // Core messaging function
  const say = (message: string, options: Omit<MessageOptions, 'speakerDisplayName'> = {}) => {
    chatService.sendMessage(speakerId, message, {
      duration: defaultDuration,
      chatContext,
      speakerDisplayName: displayName,
      ...options,
    });
  };

  // Get visible messages for this speaker
  const getMyVisibleMessages = (maxMessages?: number) => {
    return chatService.getVisibleMessages(maxMessages, speakerId);
  };

  // Get all messages for this speaker
  const getMyMessages = () => {
    return chatService.getMessages({ speakerId });
  };

  // Get stats for this speaker
  const getMyStats = (): SpeakerStats | undefined => {
    const allStats = chatService.getSpeakerStats();
    return allStats.find(stat => stat.speakerId === speakerId);
  };

  return {
    // Core messaging
    say,
    
    // Data access
    getMyMessages,
    getMyVisibleMessages,
    getMyStats,
    
    // Speaker info
    speakerId,
    displayName,
    isRegistered,
    config: speakerConfig,
    
    // State
    messageCount,
    lastMessageTime,
  };
};

/**
 * Multi-speaker service hook - manages multiple speakers at once
 * Useful for components that need to handle multiple speakers
 */
export const useMultiSpeakerService = (speakers: Array<{ id: string; config: SpeakerServiceConfig }>) => {
  const chatService = useChatService();
  
  // Register all speakers - only if not already registered
  React.useEffect(() => {
    speakers.forEach(({ id, config }) => {
      const existingSpeaker = chatService.getSpeaker(id);
      if (!existingSpeaker) {
        chatService.registerSpeaker(id, {
          displayName: config.displayName || id,
          color: config.color || '#007bff',
          avatar: config.avatar,
          defaultDuration: config.defaultDuration || 5000,
          isActive: true,
        });
      }
    });
  }, [speakers]);

  // Create speaker services for each speaker
  const speakerServices = React.useMemo(() => {
    return speakers.reduce((acc, { id, config }) => {
      acc[id] = {
        say: (message: string, options?: Omit<MessageOptions, 'speakerDisplayName'>) => {
          chatService.sendMessage(id, message, {
            duration: config.defaultDuration || 5000,
            chatContext: config.chatContext,
            speakerDisplayName: config.displayName || id,
            ...options,
          });
        },
        getMessages: () => chatService.getMessages({ speakerId: id }),
        getVisibleMessages: (maxMessages?: number) => chatService.getVisibleMessages(maxMessages, id),
        getStats: () => {
          const allStats = chatService.getSpeakerStats();
          return allStats.find(stat => stat.speakerId === id);
        },
      };
      return acc;
    }, {} as Record<string, {
      say: (message: string, options?: Omit<MessageOptions, 'speakerDisplayName'>) => void;
      getMessages: () => ChatMessage[];
      getVisibleMessages: (maxMessages?: number) => ChatMessage[];
      getStats: () => SpeakerStats | undefined;
    }>);
  }, [speakers, chatService]);

  return {
    speakers: speakerServices,
    getAllMessages: () => chatService.getMessages(),
    getAllVisibleMessages: (maxMessages?: number) => chatService.getVisibleMessages(maxMessages),
    getAllStats: () => chatService.getSpeakerStats(),
    clearAll: () => chatService.clearChat(),
  };
};

/**
 * Speaker factory - creates speaker service instances
 * Useful for dynamic speaker creation
 */
export const createSpeakerService = (speakerId: string, config: SpeakerServiceConfig = {}) => {
  return {
    id: speakerId,
    config,
    // This would be used with useSpeakerService hook
    useService: () => useSpeakerService(speakerId, config),
  };
};
