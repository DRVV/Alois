export interface ChatMessage {
  id: string;
  content: string;
  timestamp: Date;
  duration?: number;
  speaker: string;
  speakerDisplayName?: string;
  chatContext?: string;
  isExiting?: boolean;
  animationState?: 'entering' | 'visible' | 'exiting';
}

export interface SpeakerConfig {
  id: string;
  displayName: string;
  color?: string;
  avatar?: string;
  defaultDuration?: number;
  isActive: boolean;
}

export interface MessageOptions {
  duration?: number;
  chatContext?: string;
  speakerDisplayName?: string;
}

export interface SpeakerStats {
  speakerId: string;
  displayName: string;
  messageCount: number;
  lastMessageTime?: Date;
}

export interface ChatOverlayProps {
  className?: string;
  maxMessages?: number;
  messageDuration?: number;
}

export interface AutoHideMessage {
  id: string;
  content: string;
  timeoutId: NodeJS.Timeout;
}
