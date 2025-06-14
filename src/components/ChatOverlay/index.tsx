'use client';

import React, { useState } from 'react';
import { useAutoHideMessages } from './hooks/useAutoHideMessages';
import { ChatOverlayProps, ChatMessage } from './types';
import styles from './ChatOverlay.module.css';

interface ChatOverlayInternalProps extends ChatOverlayProps {
  messages: ChatMessage[];
}

const ChatOverlay: React.FC<ChatOverlayInternalProps> = ({
  className = '',
  maxMessages = 5,
  messages,
}) => {
  const [exitingMessages, setExitingMessages] = useState<Set<string>>(new Set());

  // Limit the number of visible messages
  const visibleMessages = messages.slice(-maxMessages);

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
export const useChatOverlay = (duration: number = 5000) => {
  const { messages, addAutoHideMessage, clearAllMessages } = useAutoHideMessages(duration);

  const ChatOverlayComponent: React.FC<ChatOverlayProps> = (props) => (
    <ChatOverlay {...props} messages={messages} />
  );

  return {
    messages,
    addMessage: addAutoHideMessage,
    clearMessages: clearAllMessages,
    ChatOverlay: ChatOverlayComponent,
  };
};

export default ChatOverlay;
export type { ChatOverlayProps, ChatMessage };
