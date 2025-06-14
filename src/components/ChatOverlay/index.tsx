'use client';

import React, { useState } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { ChatOverlayProps, ChatMessage } from './types';
import styles from './ChatOverlay.module.css';

const ChatOverlay: React.FC<ChatOverlayProps> = ({
  className = '',
  maxMessages = 5,
}) => {
  const [exitingMessages, setExitingMessages] = useState<Set<string>>(new Set());
  const getVisibleOverlayMessages = useChatStore((state) => state.getVisibleOverlayMessages);
  
  // Get only the messages that should be visible in the overlay
  const visibleMessages = getVisibleOverlayMessages(maxMessages);

  if (visibleMessages.length === 0) {
    return null;
  }

  return (
    <div className={`${styles.overlay} ${className}`}>
      {visibleMessages.map((message) => (
        <div
          key={message.id}
          className={`${styles.messageContainer} ${
            exitingMessages.has(message.id) ? styles.exiting : ''
          }`}
        >
          <div className={styles.messageBubble}>
            {message.content}
          </div>
        </div>
      ))}
    </div>
  );
};

// Create a hook to control the overlay from parent components
export const useChatOverlay = (defaultDuration: number = 5000) => {
  const addMessage = useChatStore((state) => state.addMessage);
  const clearMessages = useChatStore((state) => state.clearAllOverlayMessages);
  const messages = useChatStore((state) => state.overlayMessages);

  const ChatOverlayComponent: React.FC<ChatOverlayProps> = (props) => (
    <ChatOverlay {...props} />
  );

  return {
    messages,
    addMessage: (content: string, duration?: number) => addMessage(content, duration || defaultDuration),
    clearMessages,
    ChatOverlay: ChatOverlayComponent,
  };
};

export default ChatOverlay;
export type { ChatOverlayProps, ChatMessage };
