import { useChatService } from './chatService';
import { useSpeakerRegistration } from '@/hooks/useSpeakerRegistration';
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
  
  // Use shared registration logic
  const registration = useSpeakerRegistration(speakerId, config);
  
  // Get speaker info
  const speakerConfig = chatService.getSpeaker(speakerId);
  const isRegistered = registration.isRegistered;

  // Get speaker-specific messages
  const myMessages = chatService.getMessages({ speakerId });
  const messageCount = myMessages.length;
  const lastMessageTime = myMessages.length > 0 
    ? myMessages[myMessages.length - 1].timestamp 
    : undefined;

  // Core messaging function
  const say = (message: string, options: Omit<MessageOptions, 'speakerDisplayName'> = {}) => {
    chatService.sendMessage(speakerId, message, {
      duration: registration.defaultDuration,
      chatContext: registration.chatContext,
      speakerDisplayName: registration.displayName,
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
    displayName: registration.displayName,
    isRegistered,
    config: speakerConfig,
    
    // State
    messageCount,
    lastMessageTime,
  };
};
