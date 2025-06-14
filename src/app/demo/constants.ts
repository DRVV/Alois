// Demo message constants
export const DEMO_MESSAGES = {
  player: [
    'Hello! I just entered the town.',
    'Looking for some adventure!',
    'Anyone seen any quests around here?',
    'This place looks interesting.',
    'Time to explore!',
  ],
  npc: [
    'Halt! Who goes there?',
    'Welcome to our town, traveler.',
    'Keep the peace while you\'re here.',
    'The mayor wants to see all visitors.',
    'Be careful after dark.',
  ],
  system: [
    'Quest completed!',
    'Level up! You are now level 5.',
    'New item acquired: Magic Sword',
    'Achievement unlocked: First Steps',
    'Connection restored.',
  ],
  trader: [
    'Welcome to my shop!',
    'I have the finest goods in town.',
    'Special discount for new customers!',
    'Come back anytime!',
    'That\'s a rare item you have there.',
  ],
  innkeeper: [
    'Welcome to my inn!',
    'Room for the night?',
    'We serve the best ale in town.',
    'Safe travels, friend.',
    'The beds are clean and warm.',
  ],
} as const;

// Helper function to get random message
export const getRandomMessage = (messages: readonly string[]): string => {
  return messages[Math.floor(Math.random() * messages.length)];
};

// Speaker configurations
export const SPEAKER_CONFIGS = {
  player: {
    id: 'player1',
    displayName: 'Alice',
    color: '#007bff',
    defaultDuration: 5000,
    chatContext: 'game',
  },
  npc: {
    id: 'npc-guard',
    displayName: 'Town Guard',
    color: '#28a745',
    defaultDuration: 8000,
    chatContext: 'dialogue',
  },
  system: {
    id: 'system',
    displayName: 'System',
    color: '#6c757d',
    defaultDuration: 3000,
    chatContext: 'notifications',
  },
  trader: {
    id: 'npc-trader',
    displayName: 'Merchant',
    color: '#ffc107',
    defaultDuration: 6000,
    chatContext: 'trade',
  },
  innkeeper: {
    id: 'npc-innkeeper',
    displayName: 'Innkeeper',
    color: '#dc3545',
    defaultDuration: 7000,
    chatContext: 'dialogue',
  },
} as const;
