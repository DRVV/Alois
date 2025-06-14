'use client';

import React from 'react';
import { useChatService } from '@/services/chatService';
import { useSpeakerService } from '@/services/speakerService';
import { useOptionalSpeakerContext } from '@/hooks/useOptionalSpeakerContext';
import { ChatOverlayProps, ChatMessage, MessageOptions } from './types';
import styles from './ChatOverlay.module.css';

/**
 * Modern context-based ChatOverlay that requires speaker context.
 * No backward compatibility - use within SpeakerProvider only.
 */
const ChatOverlay: React.FC<ChatOverlayProps> = React.memo(({
  className = '',
  maxMessages = 5,
}) => {
  // Always use context - no fallback needed
  const speakerContext = useOptionalSpeakerContext();
  const chatService = useChatService();
  
  // Get messages filtered by speaker context
  const visibleMessages = React.useMemo(() => {
    if (speakerContext?.speakerId) {
      return chatService.getVisibleMessages(maxMessages, speakerContext.speakerId);
    }
    return chatService.getVisibleMessages(maxMessages);
  }, [chatService, maxMessages, speakerContext?.speakerId]);

  const speakers = chatService.getSpeakers();

  if (visibleMessages.length === 0) {
    return null;
  }

  const getSpeakerColor = (speakerId: string) => {
    const speaker = speakers.find(s => s.id === speakerId);
    return speaker?.color || '#007bff';
  };

  const getAnimationClass = (message: ChatMessage) => {
    switch (message.animationState) {
      case 'entering':
        return styles.entering;
      case 'exiting':
        return styles.exiting;
      case 'visible':
      default:
        return '';
    }
  };

  return (
    <div className={`${styles.overlay} ${className}`}>
      {visibleMessages.map((message) => (
        <div
          key={message.id}
          className={`${styles.messageContainer} ${getAnimationClass(message)}`}
        >
          <div 
            className={styles.messageBubble}
            data-speaker={message.speaker}
            style={{
              '--speaker-color': getSpeakerColor(message.speaker),
              background: getSpeakerColor(message.speaker),
            } as React.CSSProperties}
          >
            <div 
              className={styles.speakerName}
              style={{ color: 'rgba(255, 255, 255, 0.9)' }}
            >
              {message.speakerDisplayName || message.speaker}
            </div>
            <div className={styles.messageContent}>
              {message.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

ChatOverlay.displayName = 'ChatOverlay';

// Speaker-aware hook for controlling the overlay - now using service layer
export const useChatOverlay = (speakerId: string, options: {
  defaultDuration?: number;
  displayName?: string;
  color?: string;
  chatContext?: string;
} = {}) => {
  const speakerService = useSpeakerService(speakerId, options);
  const chatService = useChatService();

  const ChatOverlayComponent: React.FC<ChatOverlayProps> = (props) => (
    <ChatOverlay {...props} />
  );

  return {
    messages: chatService.getVisibleMessages(),
    speakerMessages: speakerService.getMyMessages(),
    addMessage: (content: string, messageOptions?: Omit<MessageOptions, 'speakerDisplayName'>) => 
      speakerService.say(content, messageOptions),
    clearMessages: () => chatService.clearChat('overlay'),
    ChatOverlay: ChatOverlayComponent,
  };
};

export default ChatOverlay;
export type { ChatOverlayProps, ChatMessage };
