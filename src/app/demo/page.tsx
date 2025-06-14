'use client';

import React from 'react';
import { useChatOverlay } from '@/components/ChatOverlay';
import ChatLog from '@/components/ChatLog';

export default function DemoPage() {
  // Multiple speaker instances with different configurations
  const playerChat = useChatOverlay('player1', {
    displayName: 'Alice',
    color: '#007bff',
    defaultDuration: 5000,
    chatContext: 'game'
  });

  const npcChat = useChatOverlay('npc-guard', {
    displayName: 'Town Guard',
    color: '#28a745',
    defaultDuration: 8000,
    chatContext: 'dialogue'
  });

  const systemChat = useChatOverlay('system', {
    displayName: 'System',
    color: '#6c757d',
    defaultDuration: 3000,
    chatContext: 'notifications'
  });

  const traderChat = useChatOverlay('npc-trader', {
    displayName: 'Merchant',
    color: '#ffc107',
    defaultDuration: 6000,
    chatContext: 'trade'
  });

  const handlePlayerMessage = () => {
    const messages = [
      'Hello! I just entered the town.',
      'Looking for some adventure!',
      'Anyone seen any quests around here?',
      'This place looks interesting.',
      'Time to explore!',
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    playerChat.addMessage(randomMessage);
  };

  const handleNPCMessage = () => {
    const messages = [
      'Halt! Who goes there?',
      'Welcome to our town, traveler.',
      'Keep the peace while you\'re here.',
      'The mayor wants to see all visitors.',
      'Be careful after dark.',
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    npcChat.addMessage(randomMessage);
  };

  const handleSystemMessage = () => {
    const messages = [
      'Quest completed!',
      'Level up! You are now level 5.',
      'New item acquired: Magic Sword',
      'Achievement unlocked: First Steps',
      'Connection restored.',
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    systemChat.addMessage(randomMessage);
  };

  const handleTraderMessage = () => {
    const messages = [
      'Welcome to my shop!',
      'I have the finest goods in town.',
      'Special discount for new customers!',
      'Come back anytime!',
      'That\'s a rare item you have there.',
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    traderChat.addMessage(randomMessage);
  };

  const handleMultipleSpeakers = () => {
    playerChat.addMessage('Hey, anyone around?');
    setTimeout(() => npcChat.addMessage('I\'m here, what do you need?'), 1000);
    setTimeout(() => traderChat.addMessage('Looking to buy something?'), 2000);
    setTimeout(() => systemChat.addMessage('Multiple conversations detected.'), 3000);
  };

  const handleLongMessage = () => {
    playerChat.addMessage('This is a longer message to test how the chat overlay handles text wrapping and longer content. It should wrap nicely within the bubble and show the speaker name clearly.');
  };

  const handleCustomDuration = () => {
    systemChat.addMessage('This important message will stay visible for 15 seconds!', { duration: 15000 });
  };

  const handlePermanentMessage = () => {
    systemChat.addMessage('This is a permanent message that will stay in the log forever!', { duration: 0 });
  };

  const handleClearMessages = () => {
    playerChat.clearMessages();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Speaker-Aware Chat System Demo
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Multi-Speaker Test Controls
          </h2>
          <p className="text-gray-600 mb-4">
            Each button represents a different speaker with unique colors, durations, and contexts. 
            All speakers share the same centralized state for logging.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <button
              onClick={handlePlayerMessage}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Player Message
            </button>
            
            <button
              onClick={handleNPCMessage}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              NPC Message
            </button>
            
            <button
              onClick={handleSystemMessage}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              System Message
            </button>
            
            <button
              onClick={handleTraderMessage}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Trader Message
            </button>
            
            <button
              onClick={handleMultipleSpeakers}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Multiple Speakers
            </button>
            
            <button
              onClick={handleLongMessage}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
            >
              Long Message
            </button>
            
            <button
              onClick={handleCustomDuration}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              15s Duration
            </button>
            
            <button
              onClick={handlePermanentMessage}
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              Permanent Message
            </button>
            
            <button
              onClick={handleClearMessages}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Clear Messages
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 relative min-h-96">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Demo Container
          </h2>
          <p className="text-gray-600 mb-4">
            This container demonstrates how the chat overlay appears in the top-right corner 
            relative to its parent component. Messages from different speakers appear with 
            unique colors and display names.
          </p>
          
          <div className="text-sm text-gray-500 space-y-2">
            <p><strong>New Speaker-Aware Features:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Speaker identification with display names</li>
              <li>Color-coded messages by speaker</li>
              <li>Speaker-specific message durations</li>
              <li>Chat context support (game, dialogue, trade, etc.)</li>
              <li>Centralized logging across all speakers</li>
              <li>Smart ID generation: speakername-timestamp-random</li>
              <li>Multiple component instances sharing state</li>
              <li>Speaker filtering and search in chat log</li>
            </ul>
          </div>

          {/* Chat Overlay Component - Shows all speakers' messages */}
          <playerChat.ChatOverlay maxMessages={5} />
        </div>

        {/* Chat Log Component */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Chat Log - Full Message History with Speaker Support
          </h2>
          <p className="text-gray-600 mb-4">
            This component shows the complete history of all messages from all speakers, 
            with speaker filtering, search functionality, and export capabilities.
          </p>
          <ChatLog 
            maxHeight="500px"
            showTimestamps={true}
            showSearch={true}
            showSpeakers={true}
          />
        </div>

        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Speaker-Aware Usage Example
          </h3>
          <pre className="bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
{`import { useChatOverlay } from '@/components/ChatOverlay';
import ChatLog from '@/components/ChatLog';

function MyComponent() {
  // Create speaker-aware chat instances
  const playerChat = useChatOverlay('player1', {
    displayName: 'Alice',
    color: '#007bff',
    defaultDuration: 5000,
    chatContext: 'game'
  });

  const npcChat = useChatOverlay('npc-guard', {
    displayName: 'Town Guard', 
    color: '#28a745',
    defaultDuration: 8000,
    chatContext: 'dialogue'
  });
  
  const handlePlayerMessage = () => {
    playerChat.addMessage('Hello World!');
  };

  const handleNPCMessage = () => {
    npcChat.addMessage('Welcome, traveler!');
  };
  
  return (
    <div>
      {/* Overlay shows all speakers' messages */}
      <div style={{ position: 'relative' }}>
        <button onClick={handlePlayerMessage}>
          Player Message
        </button>
        <button onClick={handleNPCMessage}>
          NPC Message
        </button>
        <playerChat.ChatOverlay maxMessages={5} />
      </div>
      
      {/* Full message history with speaker filtering */}
      <ChatLog 
        maxHeight="400px"
        showTimestamps={true}
        showSearch={true}
        showSpeakers={true}
      />
    </div>
  );
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
