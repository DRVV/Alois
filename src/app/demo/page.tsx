'use client';

import React from 'react';
import { useSpeakerContainer } from '@/components/SpeakerContainer';
import { useChatService } from '@/services/chatService';
import SpeakerContainer from '@/components/SpeakerContainer';
import { 
  PositionedSpeaker, 
  SpeakerInfo, 
  SpeakerAvatar, 
  SpeakerName, 
  FixedPositionWrapper 
} from '@/components/SpeakerContainer/helpers';
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

  // Simplified message handlers using constants - updated for new service API
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
            Context-Based Speaker Architecture Demo
          </h2>
          <p className="text-gray-600 mb-4">
            Now using the new context-based architecture! Each speaker creates a context that eliminates prop drilling.
            ChatOverlay components automatically get their speaker context without manual prop passing.
          </p>
          
          <div className="text-sm text-gray-500 space-y-2">
            <p><strong>New Context-Based Features:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>🎯 <strong>Zero prop drilling</strong> - ChatOverlay gets speaker context automatically</li>
              <li>🏗️ <strong>Better composition</strong> - SpeakerProvider + ChatOverlay work together seamlessly</li>
              <li>🔧 <strong>Cleaner architecture</strong> - Clear separation between context and UI</li>
              <li>📦 <strong>Backward compatible</strong> - Existing SpeakerContainer still works</li>
              <li>🎨 <strong>Flexible usage</strong> - Use SpeakerProvider directly or via SpeakerContainer</li>
              <li>⚡ <strong>Better performance</strong> - Context prevents unnecessary re-renders</li>
              <li>🧪 <strong>Easier testing</strong> - Components can be tested in isolation</li>
              <li>🔍 <strong>Implicit filtering</strong> - ChatOverlay automatically filters by context speaker</li>
            </ul>
          </div>
          
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-green-800 text-sm">
              <strong>Architecture Improvement:</strong> The new context-based approach eliminates the prop drilling 
              issue while maintaining clean component boundaries. ChatOverlay no longer needs speaker props!
            </p>
          </div>
        </div>

        {/* Individual Speaker Containers positioned around the screen */}
        <PositionedSpeaker
          speakerId="player1"
          displayName="Alice"
          color="#007bff"
          position="top-right"
          maxMessages={3}
          defaultDuration={5000}
          chatContext="game"
        >
          <SpeakerInfo displayName="Alice" color="#007bff" />
          <div className="text-xs text-blue-600 font-medium">Player</div>
        </PositionedSpeaker>

        <PositionedSpeaker
          speakerId="npc-guard"
          displayName="Town Guard"
          color="#28a745"
          position="top-left"
          maxMessages={3}
          defaultDuration={8000}
          chatContext="dialogue"
        >
          <SpeakerInfo displayName="Town Guard" color="#28a745" />
          <div className="text-xs text-green-600 font-medium">NPC</div>
        </PositionedSpeaker>

        <PositionedSpeaker
          speakerId="system"
          displayName="System"
          color="#6c757d"
          position="bottom-left"
          maxMessages={2}
          defaultDuration={3000}
          chatContext="notifications"
        >
          <SpeakerInfo displayName="System" color="#6c757d" />
          <div className="text-xs text-gray-600 font-medium">System</div>
        </PositionedSpeaker>

        <PositionedSpeaker
          speakerId="npc-trader"
          displayName="Merchant"
          color="#ffc107"
          position="bottom-right"
          maxMessages={3}
          defaultDuration={6000}
          chatContext="trade"
        >
          <SpeakerInfo displayName="Merchant" color="#ffc107" />
          <div className="text-xs text-yellow-600 font-medium">Trader</div>
        </PositionedSpeaker>

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

          {/* Block-positioned Innkeeper Container - completely custom styling */}
          <div className="relative">
            <SpeakerContainer
              speakerId="npc-innkeeper"
              maxMessages={3}
              defaultDuration={7000}
              chatContext="dialogue"
              className="w-full max-w-md mx-auto p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              {/* Custom speaker UI - user has complete control */}
              <div className="flex items-center gap-3 mb-2">
                <SpeakerAvatar displayName="Innkeeper" color="#dc3545" size="large" />
                <div>
                  <SpeakerName>🏠 The Innkeeper</SpeakerName>
                  <div className="text-xs text-red-600">Available for service</div>
                </div>
              </div>
            </SpeakerContainer>
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

        {/* New Context-Based Architecture Demo */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            New Context-Based Architecture Examples
          </h2>
          <p className="text-gray-600 mb-6">
            These examples show the new SpeakerProvider + ChatOverlay pattern that eliminates prop drilling.
            Notice how ChatOverlay doesn't need any speaker-specific props!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Example 1: Direct SpeakerProvider usage */}
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

            {/* Example 2: Multiple components sharing context */}
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
            <h4 className="font-medium text-blue-800 mb-2">🎯 Key Architecture Benefits:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Zero Prop Drilling:</strong> ChatOverlay automatically gets speaker context</li>
              <li>• <strong>Clean Composition:</strong> SpeakerProvider wraps any content you want</li>
              <li>• <strong>Implicit Filtering:</strong> ChatOverlay shows only messages from its context speaker</li>
              <li>• <strong>Better Testing:</strong> Components can be tested independently</li>
              <li>• <strong>Flexible Usage:</strong> Use SpeakerContainer (wrapper) or SpeakerProvider (direct)</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Usage Examples: Before vs After Context Architecture
          </h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-md font-medium text-gray-600 mb-2">1. New Context-Based Pattern (Recommended)</h4>
              <pre className="bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
{`// BEFORE: Prop drilling through SpeakerContainer
<SpeakerContainer 
  speakerId="player1" 
  maxMessages={3}           // ← Passed through to ChatOverlay
  chatOverlayClassName=""   // ← Passed through to ChatOverlay
>
  <MyContent />
</SpeakerContainer>

// AFTER: Context-based, no prop drilling
<SpeakerProvider speakerId="player1" displayName="Alice" color="#007bff">
  <MyContent />
  <ChatOverlay maxMessages={3} />  {/* ← Gets speaker context automatically */}
</SpeakerProvider>`}
              </pre>
            </div>

            <div>
              <h4 className="text-md font-medium text-gray-600 mb-2">2. Using Helper Components (Quick Setup)</h4>
              <pre className="bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
{`import { PositionedSpeaker, SpeakerInfo } from '@/components/SpeakerContainer/helpers';

// Quick positioned speaker with built-in UI
<PositionedSpeaker
  speakerId="player1"
  position="top-right"
  maxMessages={3}
>
  <SpeakerInfo displayName="Alice" color="#007bff" />
</PositionedSpeaker>`}
              </pre>
            </div>

            <div>
              <h4 className="text-md font-medium text-gray-600 mb-2">3. Multiple ChatOverlays in Same Context</h4>
              <pre className="bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
{`<SpeakerProvider speakerId="player1" displayName="Alice" color="#007bff">
  <div className="player-ui">
    <PlayerInfo />
  </div>
  
  {/* Both overlays automatically filter to player1 messages */}
  <ChatOverlay maxMessages={3} className="main-chat" />
  <ChatOverlay maxMessages={1} className="notification-chat" />
</SpeakerProvider>`}
              </pre>
            </div>

            <div>
              <h4 className="text-md font-medium text-gray-600 mb-2">4. Backward Compatible Usage</h4>
              <pre className="bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
{`// Existing SpeakerContainer still works (now uses context internally)
<SpeakerContainer 
  speakerId="player1" 
  displayName="Alice" 
  color="#007bff"
  maxMessages={3}
>
  <MyContent />
</SpeakerContainer>`}
              </pre>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-green-800 text-sm">
              <strong>🎉 Architecture Benefits:</strong> The new context-based approach eliminates prop drilling, 
              provides cleaner component boundaries, and makes testing easier while maintaining full backward compatibility!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
