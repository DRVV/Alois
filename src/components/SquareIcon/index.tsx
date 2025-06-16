'use client';

import React from 'react';
import { useSpeakerContainer } from '@/components/SpeakerContainer';
import SpeakerContainer from '@/components/SpeakerContainer';
import ChatOverlay from '@/components/ChatOverlay';
import styles from './SquareIcon.module.css';

export interface SquareIconProps {
  speakerId: string;
  displayName?: string;
  color?: string;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  maxMessages?: number;
}

/**
 * A simple square icon component that demonstrates relative ChatOverlay positioning.
 * The ChatOverlay will appear at the top-center of this icon when messages are sent.
 */
const SquareIcon: React.FC<SquareIconProps> = ({
  speakerId,
  displayName = 'Icon',
  color = '#007bff',
  className = '',
  onClick,
  children,
  maxMessages = 3,
}) => {
  const speaker = useSpeakerContainer(speakerId, {
    displayName,
    color,
    defaultDuration: 5000,
  });

  const handleClick = () => {
    // Send a demo message when clicked
    speaker.say(`Hello from ${displayName}!`);
    
    // Call custom onClick if provided
    if (onClick) {
      onClick();
    }
  };

  return (
    <SpeakerContainer
      speakerId={speakerId}
      displayName={displayName}
      color={color}
      defaultDuration={5000}
      showChatOverlay={false}
      className={styles.container}
    >
      <div 
        className={`${styles.squareIcon} ${className}`}
        onClick={handleClick}
        style={{ '--icon-color': color } as React.CSSProperties}
      >
        {children || (
          <div className={styles.iconContent}>
            <span className={styles.iconText}>
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      
      {/* ChatOverlay with relative positioning */}
      <ChatOverlay 
        maxMessages={maxMessages}
        className={styles.overlayRelative}
        parentWidth={60}
        parentHeight={60}
      />
    </SpeakerContainer>
  );
};

export default SquareIcon;
