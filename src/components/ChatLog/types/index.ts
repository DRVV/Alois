export interface ChatLogProps {
  className?: string;
  maxHeight?: string;
  showTimestamps?: boolean;
  showSearch?: boolean;
}

export interface ChatLogMessage {
  id: string;
  content: string;
  timestamp: Date;
  duration?: number;
}
