import { useSpeakerContext } from '@/components/SpeakerContainer/SpeakerContext';
import type { SpeakerContextValue } from '@/components/SpeakerContainer/SpeakerContext';

/**
 * Hook to safely access speaker context without throwing errors.
 * Returns null if not within a SpeakerProvider, making it safe for
 * components that can work with or without speaker context.
 */
export const useOptionalSpeakerContext = (): SpeakerContextValue | null => {
  try {
    return useSpeakerContext();
  } catch {
    return null;
  }
};

/**
 * Hook that checks if component is within a speaker context.
 * Useful for conditional rendering or behavior.
 */
export const useHasSpeakerContext = (): boolean => {
  return useOptionalSpeakerContext() !== null;
};
