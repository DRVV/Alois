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
    const { duration = 5000, chatContext, speakerDisplayName } = options;
    const id = generateSpeakerBasedId(speaker);
    
    // Auto-register speaker if not exists
    const { speakers } = get();
    if (!speakers.has(speaker)) {
      get().addSpeaker(speaker, {
        displayName: speakerDisplayName || speaker,
        defaultDuration: duration,
        isActive: true,
      });
    }

    const newMessage: ChatMessage = {
      id,
      content,
      timestamp: new Date(),
      duration,
      speaker,
      speakerDisplayName: speakerDisplayName || speakers.get(speaker)?.displayName || speaker,
      chatContext,
      animationState: 'entering',
    };

    // Add message to both overlay and log
    set((state) => ({
      overlayMessages: [...state.overlayMessages, newMessage],
      logMessages: [...state.logMessages, newMessage],
      activeSpeakers: new Set(state.activeSpeakers).add(speaker),
    }));

    // Set animation state to visible after a brief delay
    setTimeout(() => {
      set((state) => ({
        overlayMessages: state.overlayMessages.map(msg => 
          msg.id === id ? { ...msg, animationState: 'visible' } : msg
        ),
      }));
    }, 50);

    // Set timeout for auto-removal from overlay only (only if duration > 0)
    if (duration > 0) {
      const timeoutId = setTimeout(() => {
        get().startMessageExit(id);
      }, duration);

      // Store timeout reference
      set((state) => ({
        timeouts: new Map(state.timeouts).set(id, timeoutId),
      }));
    }
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

  // Legacy method for backward compatibility
  addLegacyMessage: (content: string, duration: number = 5000) => {
    get().addMessage('unknown', content, { duration, speakerDisplayName: 'Unknown' });
  },
}));
