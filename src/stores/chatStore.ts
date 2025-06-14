import { create } from 'zustand';
import { ChatMessage } from '@/components/ChatOverlay/types';

interface ChatStore {
  overlayMessages: ChatMessage[];
  logMessages: ChatMessage[];
  timeouts: Map<string, NodeJS.Timeout>;
  addMessage: (content: string, duration?: number) => void;
  removeOverlayMessage: (id: string) => void;
  clearAllOverlayMessages: () => void;
  clearAllLogMessages: () => void;
  getVisibleOverlayMessages: (maxMessages: number) => ChatMessage[];
}

const generateId = () => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const useChatStore = create<ChatStore>((set, get) => ({
  overlayMessages: [],
  logMessages: [],
  timeouts: new Map(),

  addMessage: (content: string, duration: number = 5000) => {
    const id = generateId();
    const newMessage: ChatMessage = {
      id,
      content,
      timestamp: new Date(),
      duration,
    };

    // Add message to both overlay and log
    set((state) => ({
      overlayMessages: [...state.overlayMessages, newMessage],
      logMessages: [...state.logMessages, newMessage],
    }));

    // Set timeout for auto-removal from overlay only (only if duration > 0)
    if (duration > 0) {
      const timeoutId = setTimeout(() => {
        get().removeOverlayMessage(id);
      }, duration);

      // Store timeout reference
      set((state) => ({
        timeouts: new Map(state.timeouts).set(id, timeoutId),
      }));
    }
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
}));
