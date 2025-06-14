'use client';

import React from 'react';
import { useChatOverlay } from '@/components/ChatOverlay';

export default function DemoPage() {
  const { addMessage, clearMessages, ChatOverlay } = useChatOverlay(5000);

  const handleSendMessage = () => {
    const messages = [
      'Hello! This is a test message.',
      'This message will auto-disappear in 5 seconds.',
      'You can send multiple messages!',
      'Each message slides up and fades in.',
      'Then slides up and fades out automatically.',
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    addMessage(randomMessage);
  };

  const handleSendMultiple = () => {
    addMessage('First message');
    setTimeout(() => addMessage('Second message'), 500);
    setTimeout(() => addMessage('Third message'), 1000);
    setTimeout(() => addMessage('Fourth message'), 1500);
  };

  const handleSendLongMessage = () => {
    addMessage('This is a longer message to test how the chat overlay handles text wrapping and longer content. It should wrap nicely within the bubble.');
  };

  const handleCustomDuration = () => {
    addMessage('This message will disappear in 10 seconds!', 10000);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Chat Overlay Demo
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Test Controls
          </h2>
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Send Random Message
            </button>
            
            <button
              onClick={handleSendMultiple}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Send Multiple Messages
            </button>
            
            <button
              onClick={handleSendLongMessage}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Send Long Message
            </button>
            
            <button
              onClick={handleCustomDuration}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Send 10s Message
            </button>
            
            <button
              onClick={clearMessages}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Clear All Messages
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 relative min-h-96">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Demo Container
          </h2>
          <p className="text-gray-600 mb-4">
            This container demonstrates how the chat overlay appears in the top-right corner 
            relative to its parent component. Click the buttons above to test different scenarios.
          </p>
          
          <div className="text-sm text-gray-500 space-y-2">
            <p><strong>Features demonstrated:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Auto-disappearing messages (5 second default)</li>
              <li>Slide up + fade in/out animations</li>
              <li>Multiple message stacking</li>
              <li>Text wrapping for long messages</li>
              <li>Custom message duration</li>
              <li>Top-right positioning relative to parent</li>
              <li>Responsive design</li>
            </ul>
          </div>

          {/* Chat Overlay Component */}
          <ChatOverlay maxMessages={5} />
        </div>

        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Usage Example
          </h3>
          <pre className="bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
{`import { useChatOverlay } from '@/components/ChatOverlay';

function MyComponent() {
  const { addMessage, ChatOverlay } = useChatOverlay(5000);
  
  const handleSendMessage = () => {
    addMessage('Hello World!');
  };
  
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={handleSendMessage}>
        Send Message
      </button>
      <ChatOverlay maxMessages={5} />
    </div>
  );
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
