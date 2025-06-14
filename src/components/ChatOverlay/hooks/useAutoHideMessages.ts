import { useCallback, useRef, useState } from 'react';
import { AutoHideMessage, ChatMessage } from '../types';

export const useAutoHideMessages = (defaultDuration: number = 5000) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const generateId = () => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const addAutoHideMessage = useCallback((content: string, duration?: number) => {
    const id = generateId();
    const messageDuration = duration || defaultDuration;
    
    const newMessage: ChatMessage = {
      id,
      content,
      timestamp: new Date(),
      duration: messageDuration,
    };

    // Add message to state
    setMessages(prev => [...prev, newMessage]);

    // Set timeout for auto-removal
    const timeoutId = setTimeout(() => {
      removeMessage(id);
    }, messageDuration);

    // Store timeout reference
    timeoutsRef.current.set(id, timeoutId);
  }, [defaultDuration]);

  const removeMessage = useCallback((id: string) => {
    // Clear timeout if exists
    const timeoutId = timeoutsRef.current.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutsRef.current.delete(id);
    }

    // Remove message from state
    setMessages(prev => prev.filter(msg => msg.id !== id));
  }, []);

  const clearAllMessages = useCallback(() => {
    // Clear all timeouts
    timeoutsRef.current.forEach(timeoutId => clearTimeout(timeoutId));
    timeoutsRef.current.clear();
    
    // Clear all messages
    setMessages([]);
  }, []);

  return {
    messages,
    addAutoHideMessage,
    removeMessage,
    clearAllMessages,
  };
};
