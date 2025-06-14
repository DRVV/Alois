'use client';

import React from 'react';
import { useSpeakerContainer } from '@/components/SpeakerContainer';
import SpeakerContainer from '@/components/SpeakerContainer';
import ChatLog from '@/components/ChatLog';

export default function DemoPage() {
  // Multiple speaker instances with different configurations
  const playerChat = useSpeakerContainer('player1', {
    displayName: 'Alice',
    color: '#007bff',
    defaultDuration: 5000,
    chatContext: 'game'
  });

  const npcChat = useSpeakerContainer('npc-guard', {
    displayName: 'Town Guard',
    color: '#28a745',
    defaultDuration: 8000,
    chatContext: 'dialogue'
  });

  const systemChat = useSpeakerContainer('system', {
    displayName: 'System',
    color: '#6c757d',
    defaultDuration: 3000,
    chatContext: 'notifications'
  });

  const traderChat = useSpeakerContainer('npc-trader', {
    displayName: 'Merchant',
    color: '#ffc107',
    defaultDuration: 6000,
    chatContext: 'trade'
  });

  const innkeeperChat = useSpeakerContainer('npc-innkeeper', {
    displayName: 'Innkeeper',
    color: '#dc3545',
    defaultDuration: 7000,
    chatContext: 'dialogue'
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

  const handleInnkeeperMessage = () => {
    const messages = [
      'Welcome to my inn!',
      'Room for the night?',
      'We serve the best ale in town.',
      'Safe travels, friend.',
      'The beds are clean and warm.',
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    innkeeperChat.addMessage(randomMessage);
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
            
            <button
              onClick={handleInnkeeperMessage}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Innkeeper Message
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 relative min-h-96">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Multi-Speaker Demo Container
          </h2>
          <p className="text-gray-600 mb-4">
            Now each speaker has their own positioned container! Alice appears in the top-right, 
            Town Guard in the top-left, System messages in the bottom-left, and Merchant in the bottom-right.
            Each speaker acts like an independent person with their own chat space.
          </p>
          
          <div className="text-sm text-gray-500 space-y-2">
            <p><strong>Enhanced Speaker-Specific Features:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>✨ <strong>Individual speaker containers</strong> - Each speaker has their own positioned space</li>
              <li>🎯 <strong>Speaker-specific positioning</strong> - Top-left, top-right, bottom-left, bottom-right</li>
              <li>👤 <strong>Speaker avatars and names</strong> - Visual identification for each speaker</li>
              <li>🎨 <strong>Color-coded messages</strong> - Unique colors per speaker</li>
              <li>⏱️ <strong>Speaker-specific durations</strong> - Different message display times</li>
              <li>🏷️ <strong>Chat context support</strong> - Game, dialogue, trade, notifications</li>
              <li>📝 <strong>Centralized logging</strong> - All messages still logged together</li>
              <li>🔍 <strong>Speaker filtering</strong> - Each container only shows its own messages</li>
            </ul>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-800 text-sm">
              <strong>Try it:</strong> Click the buttons above to see messages appear in different corners of the screen. 
              Each speaker now has their own dedicated space, making conversations feel more natural and organized!
            </p>
          </div>
        </div>

        {/* Individual Speaker Containers positioned around the screen */}
        <SpeakerContainer
          speakerId="player1"
          displayName="Alice"
          color="#007bff"
          position="top-right"
          maxMessages={3}
          defaultDuration={5000}
          chatContext="game"
        >
          <div className="text-xs text-blue-600 font-medium">Player</div>
        </SpeakerContainer>

        <SpeakerContainer
          speakerId="npc-guard"
          displayName="Town Guard"
          color="#28a745"
          position="top-left"
          maxMessages={3}
          defaultDuration={8000}
          chatContext="dialogue"
        >
          <div className="text-xs text-green-600 font-medium">NPC</div>
        </SpeakerContainer>

        <SpeakerContainer
          speakerId="system"
          displayName="System"
          color="#6c757d"
          position="bottom-left"
          maxMessages={2}
          defaultDuration={3000}
          chatContext="notifications"
        >
          <div className="text-xs text-gray-600 font-medium">System</div>
        </SpeakerContainer>

        <SpeakerContainer
          speakerId="npc-trader"
          displayName="Merchant"
          color="#ffc107"
          position="bottom-right"
          maxMessages={3}
          defaultDuration={6000}
          chatContext="trade"
        >
          <div className="text-xs text-yellow-600 font-medium">Trader</div>
        </SpeakerContainer>

        {/* Block-Positioned Speaker Test Section */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Block-Positioned Speaker Test
          </h2>
          <p className="text-gray-600 mb-4">
            This section demonstrates a speaker component positioned in normal document flow (not fixed to viewport). 
            The Innkeeper appears as a standard block element within the page content, allowing you to observe 
            how chat balloons behave when the speaker container is part of the document flow.
          </p>
          
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={handleInnkeeperMessage}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Innkeeper Message
            </button>
            <div className="text-sm text-gray-500">
              Click to see where balloons appear for a block-positioned speaker
            </div>
          </div>

          {/* Block-positioned Innkeeper Container */}
          <div className="relative">
            <SpeakerContainer
              speakerId="npc-innkeeper"
              displayName="Innkeeper"
              color="#dc3545"
              maxMessages={3}
              defaultDuration={7000}
              chatContext="dialogue"
              className="block-positioned-speaker"
            />
          </div>
          
          <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-red-800 text-sm">
              <strong>Positioning Test:</strong> Unlike the fixed-positioned speakers in corners, 
              this Innkeeper component flows with the document. Notice how the chat balloons 
              appear relative to this component's position in the page layout.
            </p>
          </div>
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
            New SpeakerContainer Usage Example
          </h3>
          <pre className="bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
{`import { useSpeakerContainer } from '@/components/SpeakerContainer';
import SpeakerContainer from '@/components/SpeakerContainer';
import ChatLog from '@/components/ChatLog';

function MyComponent() {
  // Create speaker-aware chat instances
  const playerChat = useSpeakerContainer('player1', {
    displayName: 'Alice',
    color: '#007bff',
    defaultDuration: 5000,
    chatContext: 'game'
  });

  const npcChat = useSpeakerContainer('npc-guard', {
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
      {/* Each speaker gets their own positioned container */}
      <SpeakerContainer
        speakerId="player1"
        displayName="Alice"
        color="#007bff"
        position="top-right"
        maxMessages={3}
      >
        <div className="text-xs text-blue-600">Player</div>
      </SpeakerContainer>

      <SpeakerContainer
        speakerId="npc-guard"
        displayName="Town Guard"
        color="#28a745"
        position="top-left"
        maxMessages={3}
      >
        <div className="text-xs text-green-600">NPC</div>
      </SpeakerContainer>

      <button onClick={handlePlayerMessage}>
        Player Message
      </button>
      <button onClick={handleNPCMessage}>
        NPC Message
      </button>
      
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
