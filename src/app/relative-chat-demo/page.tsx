'use client';

import React from 'react';
import SquareIcon from '@/components/SquareIcon';
import { useChatService } from '@/services/chatService';

export default function RelativeChatDemoPage() {
  const chatService = useChatService();

  const handleClearMessages = () => {
    chatService.clearChat('overlay');
  };

  const demoMessages = [
    "Welcome to the demo!",
    "This is a longer message to show how text wrapping works in the chat overlay when positioned relative to the parent component.",
    "Click any icon to see the overlay appear!",
    "Each icon has its own speaker context.",
    "The overlay appears at the top-center of each icon."
  ];

  const getRandomMessage = () => {
    return demoMessages[Math.floor(Math.random() * demoMessages.length)];
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Relative ChatOverlay Demo
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Square Icons with Top-Center ChatOverlay
          </h2>
          <p className="text-gray-600 mb-4">
            Click any square icon to see the ChatOverlay appear at the top-center of the icon.
            Each icon has its own speaker context and color.
          </p>
          
          <div className="flex gap-4 mb-6">
            <button
              onClick={handleClearMessages}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Clear All Messages
            </button>
          </div>
        </div>

        {/* Demo Grid - Icons positioned at different locations */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8 relative min-h-96">
          <h3 className="text-lg font-semibold text-gray-700 mb-6">
            Interactive Demo Area
          </h3>
          
          {/* Top row */}
          <div className="absolute top-16 left-8">
            <SquareIcon
              speakerId="icon-top-left"
              displayName="Alice"
              color="#007bff"
              onClick={() => console.log('Alice clicked')}
            />
          </div>
          
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
            <SquareIcon
              speakerId="icon-top-center"
              displayName="Bob"
              color="#28a745"
              onClick={() => console.log('Bob clicked')}
            />
          </div>
          
          <div className="absolute top-16 right-8">
            <SquareIcon
              speakerId="icon-top-right"
              displayName="Carol"
              color="#dc3545"
              onClick={() => console.log('Carol clicked')}
            />
          </div>
          
          {/* Middle row */}
          <div className="absolute top-1/2 left-8 transform -translate-y-1/2">
            <SquareIcon
              speakerId="icon-middle-left"
              displayName="Dave"
              color="#ffc107"
              onClick={() => console.log('Dave clicked')}
            />
          </div>
          
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <SquareIcon
              speakerId="icon-center"
              displayName="Eve"
              color="#6f42c1"
              onClick={() => console.log('Eve clicked')}
            />
          </div>
          
          <div className="absolute top-1/2 right-8 transform -translate-y-1/2">
            <SquareIcon
              speakerId="icon-middle-right"
              displayName="Frank"
              color="#fd7e14"
              onClick={() => console.log('Frank clicked')}
            />
          </div>
          
          {/* Bottom row */}
          <div className="absolute bottom-16 left-8">
            <SquareIcon
              speakerId="icon-bottom-left"
              displayName="Grace"
              color="#20c997"
              onClick={() => console.log('Grace clicked')}
            />
          </div>
          
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
            <SquareIcon
              speakerId="icon-bottom-center"
              displayName="Henry"
              color="#6c757d"
              onClick={() => console.log('Henry clicked')}
            />
          </div>
          
          <div className="absolute bottom-16 right-8">
            <SquareIcon
              speakerId="icon-bottom-right"
              displayName="Ivy"
              color="#e83e8c"
              onClick={() => console.log('Ivy clicked')}
            />
          </div>
        </div>

        {/* Inline Demo */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Inline Icons Demo
          </h3>
          <p className="text-gray-600 mb-4">
            Icons can also be used inline with text content. The ChatOverlay will still appear 
            at the top-center of each icon, regardless of the surrounding content.
          </p>
          
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-gray-700">Here are some inline icons:</span>
            
            <SquareIcon
              speakerId="inline-1"
              displayName="J"
              color="#17a2b8"
              maxMessages={2}
            />
            
            <span className="text-gray-700">and</span>
            
            <SquareIcon
              speakerId="inline-2"
              displayName="K"
              color="#28a745"
              maxMessages={2}
            />
            
            <span className="text-gray-700">and</span>
            
            <SquareIcon
              speakerId="inline-3"
              displayName="L"
              color="#dc3545"
              maxMessages={2}
            />
            
            <span className="text-gray-700">within this paragraph.</span>
          </div>
        </div>

        {/* Custom Content Demo */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Custom Content Demo
          </h3>
          <p className="text-gray-600 mb-4">
            SquareIcon can also contain custom content instead of just letters.
          </p>
          
          <div className="flex gap-6">
            <SquareIcon
              speakerId="custom-1"
              displayName="Settings"
              color="#6c757d"
            >
              <div className="text-white text-2xl">⚙️</div>
            </SquareIcon>
            
            <SquareIcon
              speakerId="custom-2"
              displayName="Messages"
              color="#007bff"
            >
              <div className="text-white text-2xl">💬</div>
            </SquareIcon>
            
            <SquareIcon
              speakerId="custom-3"
              displayName="Notifications"
              color="#ffc107"
            >
              <div className="text-white text-2xl">🔔</div>
            </SquareIcon>
          </div>
        </div>

        {/* Technical Details */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Technical Implementation
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-md font-medium text-gray-600 mb-2">Key Features:</h4>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li><strong>Relative Positioning:</strong> ChatOverlay appears at top-center of parent icon</li>
                <li><strong>Context-Based:</strong> Each icon has its own speaker context</li>
                <li><strong>Flexible Content:</strong> Icons can contain letters, emojis, or custom content</li>
                <li><strong>Responsive:</strong> Works in different layouts (absolute, inline, flex)</li>
                <li><strong>Customizable:</strong> Colors, messages, and duration can be configured</li>
              </ul>
            </div>

            <div>
              <h4 className="text-md font-medium text-gray-600 mb-2">CSS Implementation:</h4>
              <pre className="bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
{`.overlayRelative {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  /* ... other styles */
}`}
              </pre>
            </div>

            <div>
              <h4 className="text-md font-medium text-gray-600 mb-2">Usage Example:</h4>
              <pre className="bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
{`<SquareIcon
  speakerId="my-icon"
  displayName="My Icon"
  color="#007bff"
  maxMessages={3}
  onClick={() => console.log('Clicked!')}
>
  <div>Custom Content</div>
</SquareIcon>`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
