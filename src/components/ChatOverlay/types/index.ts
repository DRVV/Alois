export interface ChatMessage {
  id: string;
  content: string;
  timestamp: Date;
  duration?: number;
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
