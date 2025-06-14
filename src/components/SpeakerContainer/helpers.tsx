'use client';

import React from 'react';
import SpeakerContainer, { SpeakerContainerProps } from './index';
import styles from './SpeakerContainer.module.css';

// Position mapping for CSS classes
const POSITION_CLASS_MAP: Record<string, string> = {
  'top-left': 'topleft',
  'top-right': 'topright',
  'bottom-left': 'bottomleft',
  'bottom-right': 'bottomright',
  'center-left': 'centerleft',
  'center-right': 'centerright',
};

export interface PositionedSpeakerProps extends Omit<SpeakerContainerProps, 'className'> {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center-left' | 'center-right';
  className?: string;
}

/**
 * Helper component that provides the old positioning functionality.
 * This is optional - users can use SpeakerContainer directly for full control.
 */
export const PositionedSpeaker: React.FC<PositionedSpeakerProps> = ({
  position = 'top-right',
  className = '',
  ...props
}) => {
  const positionClass = POSITION_CLASS_MAP[position] ? styles[POSITION_CLASS_MAP[position]] : '';
  const isBlockPositioned = className.includes('block-positioned-speaker');
  const containerClass = isBlockPositioned 
    ? styles.blockPositioned 
    : `${styles.speakerContainer} ${positionClass}`;

  return (
    <SpeakerContainer
      {...props}
      className={`${containerClass} ${className}`}
    />
  );
};

export interface SpeakerAvatarProps {
  displayName: string;
  color?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

/**
 * Optional speaker avatar component
 */
export const SpeakerAvatar: React.FC<SpeakerAvatarProps> = ({
  displayName,
  color = '#007bff',
  size = 'medium',
  className = '',
}) => {
  const sizeClass = {
    small: styles.avatarSmall,
    medium: styles.avatarMedium,
    large: styles.avatarLarge,
  }[size];

  return (
    <div 
      className={`${styles.speakerAvatar} ${sizeClass} ${className}`}
      style={{ backgroundColor: color }}
    >
      {displayName.charAt(0).toUpperCase()}
    </div>
  );
};

export interface SpeakerNameProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Optional speaker name component
 */
export const SpeakerName: React.FC<SpeakerNameProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`${styles.speakerName} ${className}`}>
      {children}
    </div>
  );
};

export interface SpeakerInfoProps {
  displayName: string;
  color?: string;
  avatarSize?: 'small' | 'medium' | 'large';
  className?: string;
}

/**
 * Optional combined speaker info component (avatar + name)
 */
export const SpeakerInfo: React.FC<SpeakerInfoProps> = ({
  displayName,
  color = '#007bff',
  avatarSize = 'medium',
  className = '',
}) => {
  return (
    <div className={`${styles.speakerInfo} ${className}`}>
      <SpeakerAvatar 
        displayName={displayName} 
        color={color} 
        size={avatarSize}
      />
      <SpeakerName>{displayName}</SpeakerName>
    </div>
  );
};

export interface FixedPositionWrapperProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center-left' | 'center-right';
  className?: string;
  children: React.ReactNode;
}

/**
 * Pure positioning wrapper - can be used with any content
 */
export const FixedPositionWrapper: React.FC<FixedPositionWrapperProps> = ({
  position,
  className = '',
  children,
}) => {
  const positionClass = POSITION_CLASS_MAP[position] ? styles[POSITION_CLASS_MAP[position]] : '';
  
  return (
    <div className={`${styles.speakerContainer} ${positionClass} ${className}`}>
      {children}
    </div>
  );
};
