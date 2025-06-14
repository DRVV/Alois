import { create } from 'zustand';
import { ChatMessage, SpeakerConfig, MessageOptions, SpeakerStats } from '@/components/ChatOverlay/types';

interface ChatStore {
  overlayMessages: ChatMessage[];
  logMessages: ChatMessage[];
  timeouts: Map<string, NodeJS.Timeout>;
  speakers: Map<string, SpeakerConfig>;
  activeSpeakers: Set<string>;
  
  // Enhanced methods
  addMessage: (speaker: string, content: string, options?: MessageOptions) => void;
  addSpeaker: (speakerId: string, config: Omit<SpeakerConfig, 'id'>) => void;
  removeOverlayMessage: (id: string) => void;
  startMessageExit: (id: string) => void;
  clearAllOverlayMessages: () => void;
  clearAllLogMessages: () => void;
  getVisibleOverlayMessages: (maxMessages: number) => ChatMessage[];
  getVisibleOverlayMessagesBySpeaker: (speakerId: string, maxMessages: number) => ChatMessage[];
  getMessagesBySpeaker: (speakerId: string) => ChatMessage[];
  getSpeakerStats: () => SpeakerStats[];
  
  // Helper methods for addMessage
  ensureSpeakerRegistered: (speaker: string, speakerDisplayName?: string, duration?: number) => void;
  createMessage: (id: string, speaker: string, content: string, duration: number, chatContext?: string, speakerDisplayName?: string) => ChatMessage;
  addMessageToStores: (message: ChatMessage) => void;
  scheduleAnimationUpdate: (id: string) => void;
  scheduleMessageRemoval: (id: string, duration: number) => void;
  
  // Cleanup methods
  cleanup: () => void;
  clearTimeoutsForMessage: (id: string) => void;
  
  // Legacy method for backward compatibility
  addLegacyMessage: (content: string, duration?: number) => void;
}

const generateSpeakerBasedId = (speaker: string) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `${speaker}-${timestamp}-${random}`;
};

const generateLegacyId = () => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const useChatStore = create<ChatStore>((set, get) => ({
  overlayMessages: [],
  logMessages: [],
  timeouts: new Map(),
  speakers: new Map(),
  activeSpeakers: new Set(),

  addMessage: (speaker: string, content: string, options: MessageOptions = {}) => {
    // Input validation
    if (!speaker || typeof speaker !== 'string') {
      console.warn('ChatStore: Invalid speaker ID provided');
      return;
    }
    
    if (!content || typeof content !== 'string') {
      console.warn('ChatStore: Invalid message content provided');
      return;
    }

    const { duration = 5000, chatContext, speakerDisplayName } = options;
    
    // Validate duration
    const validDuration = typeof duration === 'number' && duration >= 0 ? duration : 5000;
    
    try {
      const id = generateSpeakerBasedId(speaker);
      
      // Ensure speaker is registered
      get().ensureSpeakerRegistered(speaker, speakerDisplayName, validDuration);
      
      // Create and add the message
      const newMessage = get().createMessage(id, speaker, content, validDuration, chatContext, speakerDisplayName);
      get().addMessageToStores(newMessage);
      
      // Handle animations and timeouts
      get().scheduleAnimationUpdate(id);
      if (validDuration > 0) {
        get().scheduleMessageRemoval(id, validDuration);
      }
    } catch (error) {
      console.error('ChatStore: Error adding message:', error);
    }
  },

  // Helper methods for addMessage
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

  addSpeaker: (speakerId: string, config: Omit<SpeakerConfig, 'id'>) => {
    set((state) => ({
      speakers: new Map(state.speakers).set(speakerId, {
        id: speakerId,
        ...config,
      }),
    }));
  },

  startMessageExit: (id: string) => {
    // Set message to exiting state
    set((state) => ({
      overlayMessages: state.overlayMessages.map(msg => 
        msg.id === id ? { ...msg, animationState: 'exiting', isExiting: true } : msg
      ),
    }));

    // Remove message after exit animation completes
    setTimeout(() => {
      get().removeOverlayMessage(id);
    }, 300); // Animation duration
  },

  removeOverlayMessage: (id: string) => {
    const { timeouts } = get();
    
    // Clear timeout if exists
    const timeoutId = timeouts.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      const newTimeouts = new Map(timeouts);
      newTimeouts.delete(id);
      
      set((state) => ({
        timeouts: newTimeouts,
        overlayMessages: state.overlayMessages.filter(msg => msg.id !== id),
      }));
    } else {
      // Just remove message from overlay if no timeout
      set((state) => ({
        overlayMessages: state.overlayMessages.filter(msg => msg.id !== id),
      }));
    }
  },

  clearAllOverlayMessages: () => {
    const { timeouts } = get();
    
    // Clear all timeouts
    timeouts.forEach(timeoutId => clearTimeout(timeoutId));
    
    set({
      overlayMessages: [],
      timeouts: new Map(),
    });
  },

  clearAllLogMessages: () => {
    set({
      logMessages: [],
    });
  },

  getVisibleOverlayMessages: (maxMessages: number) => {
    const { overlayMessages } = get();
    return overlayMessages.slice(-maxMessages);
  },

  getVisibleOverlayMessagesBySpeaker: (speakerId: string, maxMessages: number) => {
    const { overlayMessages } = get();
    const speakerMessages = overlayMessages.filter(msg => msg.speaker === speakerId);
    return speakerMessages.slice(-maxMessages);
  },

  getMessagesBySpeaker: (speakerId: string) => {
    const { logMessages } = get();
    return logMessages.filter(msg => msg.speaker === speakerId);
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

  // Cleanup methods
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

  cleanup: () => {
    const { timeouts } = get();
    
    // Clear all active timeouts
    timeouts.forEach(timeoutId => clearTimeout(timeoutId));
    
    // Reset store to initial state
    set({
      overlayMessages: [],
      logMessages: [],
      timeouts: new Map(),
      speakers: new Map(),
      activeSpeakers: new Set(),
    });
  },

  // Legacy method for backward compatibility
  addLegacyMessage: (content: string, duration: number = 5000) => {
    get().addMessage('unknown', content, { duration, speakerDisplayName: 'Unknown' });
  },
}));
