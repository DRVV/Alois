/**
 * Standardized prop interfaces for consistent component APIs
 */

// Base props that all components should support
export interface BaseComponentProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

// Speaker-related props
export interface SpeakerProps {
  speakerId: string;
  displayName?: string;
  color?: string;
  defaultDuration?: number;
  chatContext?: string;
}

// Chat overlay specific props
export interface ChatOverlayConfigProps {
  maxMessages?: number;
  showSpeakerNames?: boolean;
  showTimestamps?: boolean;
}

// Positioning props
export interface PositionProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
}

// Combined interfaces for common use cases
export interface SpeakerContainerProps extends BaseComponentProps, SpeakerProps, ChatOverlayConfigProps {
  showChatOverlay?: boolean;
  chatOverlayClassName?: string;
}

export interface PositionedSpeakerProps extends SpeakerContainerProps, PositionProps {}

// Message-related props
export interface MessageProps {
  content: string;
  duration?: number;
  priority?: 'low' | 'normal' | 'high';
}

// Service configuration props
export interface ServiceConfigProps {
  autoCleanup?: boolean;
  debugMode?: boolean;
  maxStoredMessages?: number;
}
