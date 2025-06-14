'use client';

import React, { createContext, useContext } from 'react';
import { useSpeakerService } from '@/services/speakerService';

export interface SpeakerContextValue {
  speakerId: string;
  displayName: string;
  color: string;
  defaultDuration: number;
  chatContext?: string;
}

export interface SpeakerProviderProps {
  speakerId: string;
  displayName?: string;
  color?: string;
  defaultDuration?: number;
  chatContext?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

const SpeakerContext = createContext<SpeakerContextValue | null>(null);

/**
 * Hook to access speaker context. Must be used within a SpeakerProvider.
 */
export const useSpeakerContext = (): SpeakerContextValue => {
  const context = useContext(SpeakerContext);
  if (!context) {
    throw new Error('useSpeakerContext must be used within a SpeakerProvider');
  }
  return context;
};

/**
 * Provider component that creates a speaker context and handles speaker registration.
 * All speaker-related components within this provider will share the same speaker context.
 */
export const SpeakerProvider: React.FC<SpeakerProviderProps> = ({
  speakerId,
  displayName = speakerId,
  color = '#007bff',
  defaultDuration = 5000,
  chatContext,
  className = '',
  style,
  children,
}) => {
  // Register the speaker with the service
  useSpeakerService(speakerId, {
    displayName,
    color,
    defaultDuration,
    chatContext,
  });

  const contextValue: SpeakerContextValue = {
    speakerId,
    displayName,
    color,
    defaultDuration,
    chatContext,
  };

  return (
    <SpeakerContext.Provider value={contextValue}>
      <div className={className} style={style}>
        {children}
      </div>
    </SpeakerContext.Provider>
  );
};

/**
 * Hook to get speaker controls within a speaker context.
 * Provides the same API as useSpeakerContainer but uses context for speaker info.
 */
export const useSpeakerControls = () => {
  const context = useSpeakerContext();
  const speakerService = useSpeakerService(context.speakerId, {
    displayName: context.displayName,
    color: context.color,
    defaultDuration: context.defaultDuration,
    chatContext: context.chatContext,
  });

  return {
    ...speakerService,
    // Context information
    speakerId: context.speakerId,
    displayName: context.displayName,
    color: context.color,
    defaultDuration: context.defaultDuration,
    chatContext: context.chatContext,
  };
};
