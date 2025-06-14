export interface ChatLogProps {
  className?: string;
  maxHeight?: string;
  showTimestamps?: boolean;
  showSearch?: boolean;
  showSpeakers?: boolean;
  filterBySpeaker?: string;
}

export interface ChatLogMessage {
  id: string;
  content: string;
  timestamp: Date;
  duration?: number;
  speaker: string;
  speakerDisplayName?: string;
  chatContext?: string;
}
