import { create } from 'zustand';
import { ChatMessage, SpeakerConfig, MessageOptions, SpeakerStats } from '@/components/ChatOverlay/types';

// Public API Interface - Only these methods should be used by components
interface ChatStorePublicAPI {
  // Core operations
  addMessage: (speaker: string, content: string, options?: MessageOptions) => void;
  addSpeaker: (speakerId: string, config: Omit<SpeakerConfig, 'id'>) => void;
  
  // Query operations
  getVisibleMessages: (maxMessages?: number, speakerId?: string) => ChatMessage[];
  getAllMessages: (speakerId?: string) => ChatMessage[];
  getSpeakerInfo: (speakerId?: string) => SpeakerConfig | SpeakerConfig[] | undefined;
  getSpeakerStats: () => SpeakerStats[];
  
  // Management operations
  removeMessage: (messageId: string) => void;
  clearMessages: (type?: 'overlay' | 'log' | 'all') => void;
  cleanup: () => void;
  
  // Legacy support (deprecated)
  addLegacyMessage: (content: string, duration?: number) => void;
}

// Internal state interface - not exposed
interface ChatStoreState {
  overlayMessages: ChatMessage[];
  logMessages: ChatMessage[];
  timeouts: Map<string, NodeJS.Timeout>;
  speakers: Map<string, SpeakerConfig>;
  activeSpeakers: Set<string>;
}

// Internal methods interface - not exposed
interface ChatStoreInternalAPI {
  ensureSpeakerRegistered: (speaker: string, speakerDisplayName?: string, duration?: number) => void;
  createMessage: (id: string, speaker: string, content: string, duration: number, chatContext?: string, speakerDisplayName?: string) => ChatMessage;
  addMessageToStores: (message: ChatMessage) => void;
  scheduleAnimationUpdate: (id: string) => void;
  scheduleMessageRemoval: (id: string, duration: number) => void;
  startMessageExit: (id: string) => void;
  clearTimeoutsForMessage: (id: string) => void;
  validateInput: (speaker: string, content: string) => { isValid: boolean; error?: string };
  generateMessageId: (speaker: string) => string;
}

// Combined internal interface
type ChatStoreInternal = ChatStoreState & ChatStoreInternalAPI & ChatStorePublicAPI;

// Input validation helper
const validateMessageInput = (speaker: string, content: string): { isValid: boolean; error?: string } => {
  if (!speaker || typeof speaker !== 'string' || speaker.trim().length === 0) {
    return { isValid: false, error: 'Speaker ID must be a non-empty string' };
  }
  
  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return { isValid: false, error: 'Message content must be a non-empty string' };
  }
  
  if (speaker.length > 50) {
    return { isValid: false, error: 'Speaker ID must be 50 characters or less' };
  }
  
  if (content.length > 1000) {
    return { isValid: false, error: 'Message content must be 1000 characters or less' };
  }
  
  return { isValid: true };
};

// ID generation helper
const generateSpeakerBasedId = (speaker: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `${speaker}-${timestamp}-${random}`;
};

// Create the store with proper encapsulation
export const useChatStore = create<ChatStoreInternal>((set, get) => ({
  // State
  overlayMessages: [],
  logMessages: [],
  timeouts: new Map(),
  speakers: new Map(),
  activeSpeakers: new Set(),

  // PUBLIC API METHODS
  
  addMessage: (speaker: string, content: string, options: MessageOptions = {}) => {
    const validation = get().validateInput(speaker, content);
    if (!validation.isValid) {
      console.error('ChatStore: Invalid input -', validation.error);
      return;
    }

    const { duration = 5000, chatContext, speakerDisplayName } = options;
    const validDuration = typeof duration === 'number' && duration >= 0 ? duration : 5000;
    
    try {
      const id = get().generateMessageId(speaker);
      
      get().ensureSpeakerRegistered(speaker, speakerDisplayName, validDuration);
      const newMessage = get().createMessage(id, speaker, content, validDuration, chatContext, speakerDisplayName);
      get().addMessageToStores(newMessage);
      get().scheduleAnimationUpdate(id);
      
      if (validDuration > 0) {
        get().scheduleMessageRemoval(id, validDuration);
      }
    } catch (error) {
      console.error('ChatStore: Error adding message:', error);
    }
  },

  addSpeaker: (speakerId: string, config: Omit<SpeakerConfig, 'id'>) => {
    if (!speakerId || typeof speakerId !== 'string') {
      console.error('ChatStore: Invalid speaker ID provided');
      return;
    }

    const { speakers } = get();
    
    // Only add if speaker doesn't already exist to prevent infinite loops
    if (speakers.has(speakerId)) {
      return;
    }

    set((state) => ({
      speakers: new Map(state.speakers).set(speakerId, {
        id: speakerId,
        ...config,
      }),
    }));
  },

  getVisibleMessages: (maxMessages: number = 5, speakerId?: string) => {
    const { overlayMessages } = get();
    
    if (speakerId) {
      const speakerMessages = overlayMessages.filter(msg => msg.speaker === speakerId);
      return speakerMessages.slice(-maxMessages);
    }
    
    return overlayMessages.slice(-maxMessages);
  },

  getAllMessages: (speakerId?: string) => {
    const { logMessages } = get();
    
    if (speakerId) {
      return logMessages.filter(msg => msg.speaker === speakerId);
    }
    
    return [...logMessages];
  },

  getSpeakerInfo: (speakerId?: string) => {
    const { speakers } = get();
    
    if (speakerId) {
      const speaker = speakers.get(speakerId);
      if (!speaker) {
        console.warn(`ChatStore: Speaker '${speakerId}' not found`);
        return undefined;
      }
      return { ...speaker };
    }
    
    return Array.from(speakers.values()).map(speaker => ({ ...speaker }));
  },

  getSpeakerStats: () => {
    const { logMessages, speakers } = get();
    const stats = new Map<string, { count: number; lastMessage?: Date }>();
    
    logMessages.forEach(msg => {
      const current = stats.get(msg.speaker) || { count: 0 };
      stats.set(msg.speaker, {
        count: current.count + 1,
        lastMessage: !current.lastMessage || msg.timestamp > current.lastMessage 
          ? msg.timestamp 
          : current.lastMessage,
      });
    });

    return Array.from(stats.entries()).map(([speakerId, data]) => ({
      speakerId,
      displayName: speakers.get(speakerId)?.displayName || speakerId,
      messageCount: data.count,
      lastMessageTime: data.lastMessage,
    }));
  },

  removeMessage: (messageId: string) => {
    if (!messageId || typeof messageId !== 'string') {
      console.error('ChatStore: Invalid message ID provided');
      return;
    }

    get().clearTimeoutsForMessage(messageId);
    
    set((state) => ({
      overlayMessages: state.overlayMessages.filter(msg => msg.id !== messageId),
    }));
  },

  clearMessages: (type: 'overlay' | 'log' | 'all' = 'all') => {
    const { timeouts } = get();
    
    switch (type) {
      case 'overlay':
        timeouts.forEach(timeoutId => clearTimeout(timeoutId));
        set({
          overlayMessages: [],
          timeouts: new Map(),
        });
        break;
        
      case 'log':
        set({
          logMessages: [],
        });
        break;
        
      case 'all':
      default:
        timeouts.forEach(timeoutId => clearTimeout(timeoutId));
        set({
          overlayMessages: [],
          logMessages: [],
          timeouts: new Map(),
        });
        break;
    }
  },

  cleanup: () => {
    const { timeouts } = get();
    
    timeouts.forEach(timeoutId => clearTimeout(timeoutId));
    
    set({
      overlayMessages: [],
      logMessages: [],
      timeouts: new Map(),
      speakers: new Map(),
      activeSpeakers: new Set(),
    });
  },

  // Legacy support (deprecated)
  addLegacyMessage: (content: string, duration: number = 5000) => {
    console.warn('ChatStore: addLegacyMessage is deprecated. Use addMessage instead.');
    get().addMessage('unknown', content, { duration, speakerDisplayName: 'Unknown' });
  },

  // PRIVATE INTERNAL METHODS
  
  validateInput: validateMessageInput,
  
  generateMessageId: (speaker: string) => generateSpeakerBasedId(speaker),

  ensureSpeakerRegistered: (speaker: string, speakerDisplayName?: string, duration?: number) => {
    const { speakers } = get();
    if (!speakers.has(speaker)) {
      get().addSpeaker(speaker, {
        displayName: speakerDisplayName || speaker,
        defaultDuration: duration || 5000,
        isActive: true,
      });
    }
  },

  createMessage: (id: string, speaker: string, content: string, duration: number, chatContext?: string, speakerDisplayName?: string): ChatMessage => {
    const { speakers } = get();
    return {
      id,
      content,
      timestamp: new Date(),
      duration,
      speaker,
      speakerDisplayName: speakerDisplayName || speakers.get(speaker)?.displayName || speaker,
      chatContext,
      animationState: 'entering',
    };
  },

  addMessageToStores: (message: ChatMessage) => {
    set((state) => ({
      overlayMessages: [...state.overlayMessages, message],
      logMessages: [...state.logMessages, message],
      activeSpeakers: new Set(state.activeSpeakers).add(message.speaker),
    }));
  },

  scheduleAnimationUpdate: (id: string) => {
    setTimeout(() => {
      set((state) => ({
        overlayMessages: state.overlayMessages.map(msg => 
          msg.id === id ? { ...msg, animationState: 'visible' } : msg
        ),
      }));
    }, 50);
  },

  scheduleMessageRemoval: (id: string, duration: number) => {
    const timeoutId = setTimeout(() => {
      get().startMessageExit(id);
    }, duration);

    set((state) => ({
      timeouts: new Map(state.timeouts).set(id, timeoutId),
    }));
  },

  startMessageExit: (id: string) => {
    set((state) => ({
      overlayMessages: state.overlayMessages.map(msg => 
        msg.id === id ? { ...msg, animationState: 'exiting', isExiting: true } : msg
      ),
    }));

    setTimeout(() => {
      get().removeMessage(id);
    }, 300);
  },

  clearTimeoutsForMessage: (id: string) => {
    const { timeouts } = get();
    const timeoutId = timeouts.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      const newTimeouts = new Map(timeouts);
      newTimeouts.delete(id);
      set({ timeouts: newTimeouts });
    }
  },
}));

// Export only the public API type for external use
export type ChatStore = ChatStorePublicAPI;

// Export a typed selector hook for better type safety
export const useChatStoreSelector = <T>(selector: (state: ChatStorePublicAPI) => T): T => {
  return useChatStore(selector as unknown as (state: ChatStoreInternal) => T);
};
