'use client';

import React from 'react';
import { useChatService } from '@/services/chatService';
import { useSpeakerService } from '@/services/speakerService';
import { useSpeakerContext } from '@/components/SpeakerContainer/SpeakerContext';
import { ChatOverlayProps, ChatMessage, MessageOptions } from './types';
import styles from './ChatOverlay.module.css';

interface ExtendedChatOverlayProps extends ChatOverlayProps {
  speakerId?: string;
  showSpeakerNames?: boolean;
  filterBySpeaker?: string;
}

/**
 * Context-aware ChatOverlay that automatically uses speaker context when available.
 * Falls back to prop-based configuration for backward compatibility.
 */
const ChatOverlay: React.FC<ExtendedChatOverlayProps> = React.memo(({
  className = '',
  maxMessages = 5,
  showSpeakerNames = true,
  filterBySpeaker,
}) => {
  // Try to get speaker context, fall back to props if not available
  let speakerContext = null;
  try {
    speakerContext = useSpeakerContext();
  } catch {
    // Not within a SpeakerProvider, use props instead
  }

  // Use context speaker ID if available, otherwise use filterBySpeaker prop
  const effectiveFilterBySpeaker = speakerContext?.speakerId || filterBySpeaker;
  const chatService = useChatService();
  
  // Get messages - use filtered approach for better encapsulation
  const visibleMessages = React.useMemo(() => {
    if (effectiveFilterBySpeaker) {
      return chatService.getVisibleMessages(maxMessages, effectiveFilterBySpeaker);
    }
    return chatService.getVisibleMessages(maxMessages);
  }, [chatService, maxMessages, effectiveFilterBySpeaker]);

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

  const ChatOverlayComponent: React.FC<ExtendedChatOverlayProps> = (props) => (
    <ChatOverlay {...props} speakerId={speakerId} />
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

// Legacy hook for backward compatibility
export const useLegacyChatOverlay = (defaultDuration: number = 5000) => {
  const chatService = useChatService();

  const ChatOverlayComponent: React.FC<ChatOverlayProps> = (props) => (
    <ChatOverlay {...props} showSpeakerNames={false} />
  );

  return {
    messages: chatService.getVisibleMessages(),
    addMessage: (content: string, duration?: number) => {
      console.warn('useLegacyChatOverlay is deprecated. Use useChatOverlay instead.');
      chatService.sendMessage('unknown', content, { 
        duration: duration || defaultDuration, 
        speakerDisplayName: 'Unknown' 
      });
    },
    clearMessages: () => chatService.clearChat('overlay'),
    ChatOverlay: ChatOverlayComponent,
  };
};

export default ChatOverlay;
export type { ChatOverlayProps, ChatMessage, ExtendedChatOverlayProps };
