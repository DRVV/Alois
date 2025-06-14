'use client';

import React, { useState } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { ChatOverlayProps, ChatMessage, MessageOptions } from './types';
import styles from './ChatOverlay.module.css';

interface ExtendedChatOverlayProps extends ChatOverlayProps {
  speakerId?: string;
  showSpeakerNames?: boolean;
  filterBySpeaker?: string;
}

const ChatOverlay: React.FC<ExtendedChatOverlayProps> = ({
  className = '',
  maxMessages = 5,
  speakerId,
  showSpeakerNames = true,
  filterBySpeaker,
}) => {
  const [exitingMessages, setExitingMessages] = useState<Set<string>>(new Set());
  const getVisibleOverlayMessages = useChatStore((state) => state.getVisibleOverlayMessages);
  const speakers = useChatStore((state) => state.speakers);
  
  // Get only the messages that should be visible in the overlay
  let visibleMessages = getVisibleOverlayMessages(maxMessages);
  
  // Filter by speaker if specified
  if (filterBySpeaker) {
    visibleMessages = visibleMessages.filter(msg => msg.speaker === filterBySpeaker);
  }

  if (visibleMessages.length === 0) {
    return null;
  }

  const getSpeakerColor = (speakerId: string) => {
    const speaker = speakers.get(speakerId);
    return speaker?.color || '#007bff';
  };

  return (
    <div className={`${styles.overlay} ${className}`}>
      {visibleMessages.map((message) => (
        <div
          key={message.id}
          className={`${styles.messageContainer} ${
            exitingMessages.has(message.id) ? styles.exiting : ''
          }`}
        >
          <div 
            className={styles.messageBubble}
            data-speaker={message.speaker}
            style={{
              '--speaker-color': getSpeakerColor(message.speaker),
              background: getSpeakerColor(message.speaker),
            } as React.CSSProperties}
          >
            {showSpeakerNames && (
              <div 
                className={styles.speakerName}
                style={{ color: 'rgba(255, 255, 255, 0.9)' }}
              >
                {message.speakerDisplayName || message.speaker}
              </div>
            )}
            <div className={styles.messageContent}>
              {message.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Speaker-aware hook for controlling the overlay
export const useChatOverlay = (speakerId: string, options: {
  defaultDuration?: number;
  displayName?: string;
  color?: string;
  chatContext?: string;
} = {}) => {
  const { defaultDuration = 5000, displayName, color, chatContext } = options;
  
  const addMessage = useChatStore((state) => state.addMessage);
  const addSpeaker = useChatStore((state) => state.addSpeaker);
  const clearMessages = useChatStore((state) => state.clearAllOverlayMessages);
  const getMessagesBySpeaker = useChatStore((state) => state.getMessagesBySpeaker);
  const messages = useChatStore((state) => state.overlayMessages);

  // Auto-register speaker on first use
  React.useEffect(() => {
    addSpeaker(speakerId, {
      displayName: displayName || speakerId,
      defaultDuration,
      isActive: true,
      color,
    });
  }, [speakerId, displayName, defaultDuration, color, addSpeaker]);

  const ChatOverlayComponent: React.FC<ExtendedChatOverlayProps> = (props) => (
    <ChatOverlay {...props} speakerId={speakerId} />
  );

  return {
    messages,
    speakerMessages: getMessagesBySpeaker(speakerId),
    addMessage: (content: string, messageOptions?: Omit<MessageOptions, 'speakerDisplayName'>) => 
      addMessage(speakerId, content, { 
        duration: defaultDuration, 
        chatContext,
        speakerDisplayName: displayName,
        ...messageOptions 
      }),
    clearMessages,
    ChatOverlay: ChatOverlayComponent,
  };
};

// Legacy hook for backward compatibility
export const useLegacyChatOverlay = (defaultDuration: number = 5000) => {
  const addLegacyMessage = useChatStore((state) => state.addLegacyMessage);
  const clearMessages = useChatStore((state) => state.clearAllOverlayMessages);
  const messages = useChatStore((state) => state.overlayMessages);

  const ChatOverlayComponent: React.FC<ChatOverlayProps> = (props) => (
    <ChatOverlay {...props} showSpeakerNames={false} />
  );

  return {
    messages,
    addMessage: (content: string, duration?: number) => addLegacyMessage(content, duration || defaultDuration),
    clearMessages,
    ChatOverlay: ChatOverlayComponent,
  };
};

export default ChatOverlay;
export type { ChatOverlayProps, ChatMessage, ExtendedChatOverlayProps };
