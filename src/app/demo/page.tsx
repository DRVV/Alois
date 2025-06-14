'use client';

import React from 'react';
import { useSpeakerContainer } from '@/components/SpeakerContainer';
import { useChatService } from '@/services/chatService';
import SpeakerContainer from '@/components/SpeakerContainer';

import ChatLog from '@/components/ChatLog';
import { DEMO_MESSAGES, getRandomMessage, SPEAKER_CONFIGS } from './constants';

export default function DemoPage() {
  // Chat service for global operations
  const chatService = useChatService();
  
  // Multiple speaker instances with different configurations
  const playerChat = useSpeakerContainer(SPEAKER_CONFIGS.player.id, {
    displayName: SPEAKER_CONFIGS.player.displayName,
    color: SPEAKER_CONFIGS.player.color,
    defaultDuration: SPEAKER_CONFIGS.player.defaultDuration,
    chatContext: SPEAKER_CONFIGS.player.chatContext,
  });

  const npcChat = useSpeakerContainer(SPEAKER_CONFIGS.npc.id, {
    displayName: SPEAKER_CONFIGS.npc.displayName,
    color: SPEAKER_CONFIGS.npc.color,
    defaultDuration: SPEAKER_CONFIGS.npc.defaultDuration,
    chatContext: SPEAKER_CONFIGS.npc.chatContext,
  });

  const systemChat = useSpeakerContainer(SPEAKER_CONFIGS.system.id, {
    displayName: SPEAKER_CONFIGS.system.displayName,
    color: SPEAKER_CONFIGS.system.color,
    defaultDuration: SPEAKER_CONFIGS.system.defaultDuration,
    chatContext: SPEAKER_CONFIGS.system.chatContext,
  });

  const traderChat = useSpeakerContainer(SPEAKER_CONFIGS.trader.id, {
    displayName: SPEAKER_CONFIGS.trader.displayName,
    color: SPEAKER_CONFIGS.trader.color,
    defaultDuration: SPEAKER_CONFIGS.trader.defaultDuration,
    chatContext: SPEAKER_CONFIGS.trader.chatContext,
  });

  const innkeeperChat = useSpeakerContainer(SPEAKER_CONFIGS.innkeeper.id, {
    displayName: SPEAKER_CONFIGS.innkeeper.displayName,
    color: SPEAKER_CONFIGS.innkeeper.color,
    defaultDuration: SPEAKER_CONFIGS.innkeeper.defaultDuration,
    chatContext: SPEAKER_CONFIGS.innkeeper.chatContext,
  });

  // Context demo speakers
  const contextDemoChat = useSpeakerContainer('context-demo-1', {
    displayName: 'Context Demo',
    color: '#8b5cf6'
  });

  const sharedContextChat = useSpeakerContainer('shared-context', {
    displayName: 'Shared Speaker',
    color: '#10b981'
  });

  // Message handlers
  const handlePlayerMessage = () => {
    playerChat.say(getRandomMessage(DEMO_MESSAGES.player));
  };

  const handleNPCMessage = () => {
    npcChat.say(getRandomMessage(DEMO_MESSAGES.npc));
  };

  const handleSystemMessage = () => {
    systemChat.say(getRandomMessage(DEMO_MESSAGES.system));
  };

  const handleTraderMessage = () => {
    traderChat.say(getRandomMessage(DEMO_MESSAGES.trader));
  };

  const handleInnkeeperMessage = () => {
    innkeeperChat.say(getRandomMessage(DEMO_MESSAGES.innkeeper));
  };

  const handleMultipleSpeakers = () => {
    playerChat.say('Hey, anyone around?');
    setTimeout(() => npcChat.say('I&apos;m here, what do you need?'), 1000);
    setTimeout(() => traderChat.say('Looking to buy something?'), 2000);
    setTimeout(() => systemChat.say('Multiple conversations detected.'), 3000);
  };

  const handleLongMessage = () => {
    playerChat.say('This is a longer message to test how the chat overlay handles text wrapping and longer content. It should wrap nicely within the bubble and show the speaker name clearly.');
  };

  const handleCustomDuration = () => {
    systemChat.say('This important message will stay visible for 15 seconds!', { duration: 15000 });
  };

  const handlePermanentMessage = () => {
    systemChat.say('This is a permanent message that will stay in the log forever!', { duration: 0 });
  };

  const handleClearMessages = () => {
    chatService.clearChat('overlay');
  };

  const handleContextDemoMessage = () => {
    contextDemoChat.say('Context-based messaging works!');
  };

  const handleSharedContextMessage = () => {
    sharedContextChat.say('All components in my context see this!');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Modern Speaker-Aware Chat System Demo
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
            Modern Context-Based Architecture
          </h2>
          <p className="text-gray-600 mb-4">
            Clean, modern architecture with zero prop drilling. Each speaker creates a context that 
            ChatOverlay components automatically consume.
          </p>
          
          <div className="text-sm text-gray-500 space-y-2">
            <p><strong>Modern Features:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>🎯 <strong>Zero prop drilling</strong> - ChatOverlay gets speaker context automatically</li>
              <li>🏗️ <strong>Clean composition</strong> - SpeakerContainer + ChatOverlay work seamlessly</li>
              <li>🔧 <strong>Simple architecture</strong> - Clear separation between context and UI</li>
              <li>⚡ <strong>Better performance</strong> - Context prevents unnecessary re-renders</li>
              <li>🧪 <strong>Easier testing</strong> - Components can be tested in isolation</li>
              <li>🔍 <strong>Implicit filtering</strong> - ChatOverlay automatically filters by context speaker</li>
            </ul>
          </div>
        </div>

        {/* Modern positioned speakers using CSS classes directly */}
        <SpeakerContainer
          speakerId="player1"
          displayName="Alice"
          color="#007bff"
          maxMessages={5}
          defaultDuration={5000}
          chatContext="game"
          className="fixed top-5 right-5 z-50 p-4 bg-white rounded-lg shadow-lg border border-blue-200"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
            <div>
              <div className="font-medium text-blue-800">Alice</div>
              <div className="text-xs text-blue-600">Player</div>
            </div>
          </div>
          
        </SpeakerContainer>

        <SpeakerContainer
          speakerId="npc-guard"
          displayName="Town Guard"
          color="#28a745"
          maxMessages={3}
          defaultDuration={8000}
          chatContext="dialogue"
          className="fixed top-5 left-5 z-50 p-4 bg-white rounded-lg shadow-lg border border-green-200"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
              G
            </div>
            <div>
              <div className="font-medium text-green-800">Town Guard</div>
              <div className="text-xs text-green-600">NPC</div>
            </div>
          </div>
          
        </SpeakerContainer>

        <SpeakerContainer
          speakerId="system"
          displayName="System"
          color="#6c757d"
          maxMessages={2}
          defaultDuration={3000}
          chatContext="notifications"
          className="fixed bottom-5 left-5 z-50 p-4 bg-white rounded-lg shadow-lg border border-gray-200"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold">
              S
            </div>
            <div>
              <div className="font-medium text-gray-800">System</div>
              <div className="text-xs text-gray-600">System</div>
            </div>
          </div>
          
        </SpeakerContainer>

        <SpeakerContainer
          speakerId="npc-trader"
          displayName="Merchant"
          color="#ffc107"
          maxMessages={3}
          defaultDuration={6000}
          chatContext="trade"
          className="fixed bottom-5 right-5 z-50 p-4 bg-white rounded-lg shadow-lg border border-yellow-200"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
              M
            </div>
            <div>
              <div className="font-medium text-yellow-800">Merchant</div>
              <div className="text-xs text-yellow-600">Trader</div>
            </div>
          </div>
          
        </SpeakerContainer>

        {/* Block-Positioned Speaker Test Section */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Block-Positioned Speaker Test
          </h2>
          <p className="text-gray-600 mb-4">
            This demonstrates a speaker component positioned in normal document flow. 
            The Innkeeper appears as a standard block element within the page content.
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

          <div className="relative">
            <SpeakerContainer
              speakerId="npc-innkeeper"
              displayName="Innkeeper"
              color="#dc3545"
              maxMessages={3}
              defaultDuration={7000}
              chatContext="dialogue"
              className="w-full max-w-md mx-auto p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  🏠
                </div>
                <div>
                  <div className="font-medium text-red-800">The Innkeeper</div>
                  <div className="text-xs text-red-600">Available for service</div>
                </div>
              </div>
          
            </SpeakerContainer>
          </div>
        </div>

        {/* Chat Log Component */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Chat Log - Full Message History
          </h2>
          <p className="text-gray-600 mb-4">
            Complete history of all messages from all speakers with filtering and search.
          </p>
          <ChatLog 
            maxHeight="500px"
            showTimestamps={true}
            showSearch={true}
            showSpeakers={true}
          />
        </div>

        {/* Context-Based Architecture Demo */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Context-Based Architecture Examples
          </h2>
          <p className="text-gray-600 mb-6">
            These examples show the modern SpeakerContainer + ChatOverlay pattern.
            Notice how ChatOverlay doesn&apos;t need any speaker-specific props!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-3">Context-Based Composition</h4>
              <div className="bg-gray-50 p-3 rounded border mb-3">
                <SpeakerContainer
                  speakerId="context-demo-1"
                  displayName="Context Demo"
                  color="#8b5cf6"
                  className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg"
                >
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    CD
                  </div>
                  <div>
                    <div className="font-medium text-purple-800">Context Demo</div>
                    <div className="text-xs text-purple-600">No prop drilling!</div>
                  </div>
          
                </SpeakerContainer>
              </div>
              <button
                onClick={handleContextDemoMessage}
                className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
              >
                Send Context Message
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-3">Shared Context Example</h4>
              <div className="bg-gray-50 p-3 rounded border mb-3">
                <SpeakerContainer
                  speakerId="shared-context"
                  displayName="Shared Speaker"
                  color="#10b981"
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      S
                    </div>
                    <span className="text-green-800 font-medium">Shared Speaker</span>
                  </div>
                  <div className="text-xs text-green-600 pl-10">
                    Multiple UI components can share the same speaker context
                  </div>
          
                </SpeakerContainer>
              </div>
              <button
                onClick={handleSharedContextMessage}
                className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
              >
                Send Shared Message
              </button>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2">🎯 Modern Architecture Benefits:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Zero Prop Drilling:</strong> ChatOverlay automatically gets speaker context</li>
              <li>• <strong>Clean Composition:</strong> SpeakerContainer wraps any content you want</li>
              <li>• <strong>Implicit Filtering:</strong> ChatOverlay shows only messages from its context speaker</li>
              <li>• <strong>Better Testing:</strong> Components can be tested independently</li>
              <li>• <strong>Full Control:</strong> Use className and style for complete customization</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Modern Usage Pattern
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-md font-medium text-gray-600 mb-2">Context-Based Pattern (Current)</h4>
              <pre className="bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
{`// Modern: Context-based, no prop drilling
<SpeakerContainer speakerId="player1" displayName="Alice" color="#007bff">
  <MyCustomUI />
  <ChatOverlay maxMessages={3} />  {/* Gets speaker context automatically */}
</SpeakerContainer>`}
              </pre>
            </div>

            <div>
              <h4 className="text-md font-medium text-gray-600 mb-2">Multiple ChatOverlays in Same Context</h4>
              <pre className="bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
{`<SpeakerContainer speakerId="player1" displayName="Alice" color="#007bff">
  <div className="player-ui">
    <PlayerInfo />
  </div>
  
  {/* Both overlays automatically filter to player1 messages */}
  <ChatOverlay maxMessages={3} className="main-chat" />
  <ChatOverlay maxMessages={1} className="notification-chat" />
</SpeakerContainer>`}
              </pre>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-green-800 text-sm">
              <strong>🎉 Clean Architecture:</strong> The modern context-based approach eliminates prop drilling, 
              provides cleaner component boundaries, and makes testing easier!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
