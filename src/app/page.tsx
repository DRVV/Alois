'use client';

import React from 'react';
import Link from "next/link";
import { SpeakerProvider, useSpeakerControls } from '@/components/SpeakerContainer/SpeakerContext';
import ChatOverlay from '@/components/ChatOverlay';

// Demo component that uses the new context-based architecture
const WelcomeDemo: React.FC = () => {
  const speakerControls = useSpeakerControls();

  const handleWelcomeMessage = () => {
    speakerControls.say('Welcome to the new context-based chat system! 🎉');
  };

  const handleFeatureMessage = () => {
    speakerControls.say('No more prop drilling - ChatOverlay gets context automatically!', { duration: 6000 });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <button
          onClick={handleWelcomeMessage}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
        >
          Welcome Message
        </button>
        <button
          onClick={handleFeatureMessage}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
        >
          Feature Demo
        </button>
      </div>
      
      <div className="text-xs text-gray-500">
        Try the buttons above to see context-based messaging in action!
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Speaker-Aware Chat System
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          A React component system that provides context-based chat overlays with speaker awareness.
          Features zero prop drilling, clean architecture, and seamless component composition.
        </p>
        
        {/* Live Demo Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Live Context Demo
          </h2>
          <p className="text-gray-600 mb-4 text-sm">
            This demo uses the new SpeakerProvider + ChatOverlay pattern.
            Notice how ChatOverlay doesn&apos;t need any speaker-specific props!
          </p>
          
          <SpeakerProvider 
            speakerId="welcome-demo" 
            displayName="System" 
            color="#10b981"
            className="relative"
          >
            <div className="flex items-center justify-center gap-3 p-4 bg-green-50 rounded-lg mb-4">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                S
              </div>
              <div>
                <div className="font-medium text-green-800">System Demo</div>
                <div className="text-xs text-green-600">Context-based messaging</div>
              </div>
            </div>
            
            <WelcomeDemo />
            
            {/* ChatOverlay automatically gets speaker context */}
            <ChatOverlay maxMessages={2} />
          </SpeakerProvider>
        </div>
        
        <div className="space-y-6">
          <Link
            href="/demo"
            className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            View Full Demo
          </Link>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3">🏗️ Architecture Features</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <strong>Zero Prop Drilling</strong> - Context-based communication</li>
                <li>• <strong>Clean Composition</strong> - SpeakerProvider + ChatOverlay</li>
                <li>• <strong>Better Testing</strong> - Components work in isolation</li>
                <li>• <strong>Backward Compatible</strong> - Existing code still works</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3">✨ Chat Features</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <strong>Speaker Awareness</strong> - Multi-speaker support</li>
                <li>• <strong>Auto-disappearing</strong> - Configurable message duration</li>
                <li>• <strong>Smooth Animations</strong> - Slide up + fade effects</li>
                <li>• <strong>Flexible Positioning</strong> - Any layout system</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-3">🎯 New Context-Based Pattern</h3>
            <div className="text-left">
              <pre className="bg-blue-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto">
{`// Clean, context-based architecture
<SpeakerProvider speakerId="player1" displayName="Alice" color="#007bff">
  <MyCustomUI />
  <ChatOverlay maxMessages={3} />  {/* Gets context automatically */}
</SpeakerProvider>`}
              </pre>
              <p className="text-blue-700 text-sm mt-3">
                <strong>No more prop drilling!</strong> ChatOverlay automatically receives speaker context,
                creating cleaner component boundaries and better maintainability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
