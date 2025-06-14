'use client';

import React from 'react';
import { useChatOverlay } from '@/components/ChatOverlay';
import styles from './SpeakerContainer.module.css';

export interface SpeakerContainerProps {
  speakerId: string;
  displayName: string;
  color?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center-left' | 'center-right';
  defaultDuration?: number;
  chatContext?: string;
  maxMessages?: number;
  className?: string;
  children?: React.ReactNode;
}

const SpeakerContainer: React.FC<SpeakerContainerProps> = ({
  speakerId,
  displayName,
  color = '#007bff',
  position = 'top-right',
  defaultDuration = 5000,
  chatContext,
  maxMessages = 3,
  className = '',
  children,
}) => {
  const speakerChat = useChatOverlay(speakerId, {
    displayName,
    color,
    defaultDuration,
    chatContext,
  });

  const positionClass = styles[position.replace('-', '')]; // Convert 'top-left' to 'topleft'

  return (
    <div className={`${styles.speakerContainer} ${positionClass} ${className}`}>
      {children && (
        <div className={styles.speakerInfo}>
          <div 
            className={styles.speakerAvatar}
            style={{ backgroundColor: color }}
          >
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className={styles.speakerName}>
            {displayName}
          </div>
        </div>
      )}
      
      {/* Speaker-specific overlay that only shows this speaker's messages */}
      <speakerChat.ChatOverlay 
        maxMessages={maxMessages}
        filterBySpeaker={speakerId}
        className={styles.speakerOverlay}
      />
      
      {children}
    </div>
  );
};

export default SpeakerContainer;

// Hook to get speaker chat controls
export const useSpeakerContainer = (speakerId: string, options: {
  displayName: string;
  color?: string;
  defaultDuration?: number;
  chatContext?: string;
} = { displayName: speakerId }) => {
  const speakerChat = useChatOverlay(speakerId, options);
  
  return {
    ...speakerChat,
    // Add convenience method for adding messages
    say: (message: string, duration?: number) => {
      speakerChat.addMessage(message, duration ? { duration } : undefined);
    },
  };
};
