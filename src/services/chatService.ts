import { useChatStore } from '@/stores/chatStore';
import { ChatMessage, SpeakerConfig, MessageOptions, SpeakerStats } from '@/components/ChatOverlay/types';

// Service interfaces for better encapsulation
export interface MessageFilters {
  speakerId?: string;
  searchTerm?: string;
  maxMessages?: number;
}

export interface ChatExportData {
  timestamp: string;
  content: string;
  speaker: string;
  speakerDisplayName?: string;
  duration?: number;
  chatContext?: string;
}

export interface ChatServiceAPI {
  // Message operations
  sendMessage: (speaker: string, content: string, options?: MessageOptions) => void;
  getMessages: (filters?: MessageFilters) => ChatMessage[];
  getVisibleMessages: (maxMessages?: number, speakerId?: string) => ChatMessage[];
  
  // Speaker operations
  registerSpeaker: (speakerId: string, config: Omit<SpeakerConfig, 'id'>) => void;
  getSpeakers: () => SpeakerConfig[];
  getSpeaker: (speakerId: string) => SpeakerConfig | undefined;
  getSpeakerStats: () => SpeakerStats[];
  
  // Management operations
  clearChat: (type?: 'overlay' | 'log' | 'all') => void;
  exportChat: () => void;
  removeMessage: (messageId: string) => void;
  
  // Utility
  cleanup: () => void;
}

/**
 * Main chat service hook - provides encapsulated access to chat functionality
 * This is the primary interface components should use instead of accessing the store directly
 */
export const useChatService = (): ChatServiceAPI => {
  const store = useChatStore();

  const sendMessage = (speaker: string, content: string, options?: MessageOptions) => {
    store.addMessage(speaker, content, options);
  };

  const getMessages = (filters: MessageFilters = {}) => {
    const { speakerId, searchTerm, maxMessages } = filters;
    let messages = store.getAllMessages(speakerId);
    
    // Apply search filter if provided
    if (searchTerm && searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      messages = messages.filter(msg => 
        msg.content.toLowerCase().includes(term) ||
        (msg.speakerDisplayName || msg.speaker).toLowerCase().includes(term)
      );
    }
    
    // Apply message limit if provided
    if (maxMessages && maxMessages > 0) {
      messages = messages.slice(-maxMessages);
    }
    
    return messages;
  };

  const getVisibleMessages = (maxMessages?: number, speakerId?: string) => {
    return store.getVisibleMessages(maxMessages, speakerId);
  };

  const registerSpeaker = (speakerId: string, config: Omit<SpeakerConfig, 'id'>) => {
    store.addSpeaker(speakerId, config);
  };

  const getSpeakers = (): SpeakerConfig[] => {
    const speakers = store.getSpeakerInfo();
    return Array.isArray(speakers) ? speakers : [];
  };

  const getSpeaker = (speakerId: string): SpeakerConfig | undefined => {
    const speaker = store.getSpeakerInfo(speakerId);
    return Array.isArray(speaker) ? undefined : speaker;
  };

  const getSpeakerStats = () => {
    return store.getSpeakerStats();
  };

  const clearChat = (type: 'overlay' | 'log' | 'all' = 'all') => {
    store.clearMessages(type);
  };

  const exportChat = () => {
    const messages = store.getAllMessages();
    const exportData: ChatExportData[] = messages.map(msg => ({
      timestamp: msg.timestamp.toISOString(),
      content: msg.content,
      speaker: msg.speaker,
      speakerDisplayName: msg.speakerDisplayName,
      duration: msg.duration,
      chatContext: msg.chatContext,
    }));

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `chat-log-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const removeMessage = (messageId: string) => {
    store.removeMessage(messageId);
  };

  const cleanup = () => {
    store.cleanup();
  };

  return {
    sendMessage,
    getMessages,
    getVisibleMessages,
    registerSpeaker,
    getSpeakers,
    getSpeaker,
    getSpeakerStats,
    clearChat,
    exportChat,
    removeMessage,
    cleanup,
  };
};

/**
 * Legacy chat service hook for backward compatibility
 * @deprecated Use useChatService instead
 */
export const useLegacyChatService = (defaultDuration: number = 5000) => {
  const store = useChatStore();
  
  console.warn('useLegacyChatService is deprecated. Use useChatService instead.');
  
  return {
    messages: store.getVisibleMessages(),
    addMessage: (content: string, duration?: number) => {
      store.addLegacyMessage(content, duration || defaultDuration);
    },
    clearMessages: () => store.clearMessages('overlay'),
  };
};
