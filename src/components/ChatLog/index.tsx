'use client';

import React, { useState, useMemo } from 'react';
import { useChatService } from '@/services/chatService';
import { ChatLogProps } from './types';
import styles from './ChatLog.module.css';

interface ExtendedChatLogProps extends ChatLogProps {
  showSpeakers?: boolean;
  filterBySpeaker?: string;
}

const ChatLog: React.FC<ExtendedChatLogProps> = ({
  className = '',
  maxHeight = '400px',
  showTimestamps = true,
  showSearch = true,
  showSpeakers = true,
  filterBySpeaker,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpeaker, setSelectedSpeaker] = useState<string>(filterBySpeaker || '');
  
  const chatService = useChatService();
  
  // Get data using service layer
  const messages = chatService.getMessages();
  const speakers = chatService.getSpeakers();

  // Get unique speakers from messages for the dropdown
  const availableSpeakers = useMemo(() => {
    const speakerSet = new Set(messages.map(msg => msg.speaker));
    return Array.from(speakerSet).map(speakerId => {
      const speakerConfig = speakers.find(s => s.id === speakerId);
      return {
        id: speakerId,
        displayName: speakerConfig?.displayName || speakerId,
        color: speakerConfig?.color || '#007bff',
      };
    });
  }, [messages, speakers]);

  // Filter messages using service layer
  const filteredMessages = useMemo(() => {
    return chatService.getMessages({
      speakerId: selectedSpeaker || undefined,
      searchTerm: searchTerm.trim() || undefined,
    });
  }, [chatService, selectedSpeaker, searchTerm]);

  // Highlight search terms in message content
  const highlightSearchTerm = (content: string, term: string) => {
    if (!term.trim()) return content;
    
    const regex = new RegExp(`(${term})`, 'gi');
    const parts = content.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className={styles.searchHighlight}>
          {part}
        </span>
      ) : part
    );
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      month: 'short',
      day: 'numeric',
    }).format(timestamp);
  };

  const formatDuration = (duration?: number) => {
    if (!duration || duration <= 0) return 'Permanent';
    if (duration < 1000) return `${duration}ms`;
    return `${duration / 1000}s`;
  };

  const handleExport = () => {
    chatService.exportChat();
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all chat messages? This action cannot be undone.')) {
      chatService.clearChat('log');
      setSearchTerm('');
    }
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h3 className={styles.title}>Chat Log</h3>
          <span className={styles.messageCount}>
            {filteredMessages.length} {filteredMessages.length === 1 ? 'message' : 'messages'}
          </span>
        </div>
        
        <div className={styles.controls}>
          {showSpeakers && availableSpeakers.length > 1 && (
            <select
              value={selectedSpeaker}
              onChange={(e) => setSelectedSpeaker(e.target.value)}
              className={styles.speakerFilter}
            >
              <option value="">All Speakers</option>
              {availableSpeakers.map(speaker => (
                <option key={speaker.id} value={speaker.id}>
                  {speaker.displayName}
                </option>
              ))}
            </select>
          )}
          
          {showSearch && (
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          )}
          
          <button
            onClick={handleExport}
            className={styles.exportButton}
            disabled={messages.length === 0}
            title="Export chat log as JSON"
          >
            Export
          </button>
          
          <button
            onClick={handleClearAll}
            className={styles.clearButton}
            disabled={messages.length === 0}
            title="Clear all messages"
          >
            Clear All
          </button>
        </div>
      </div>

      <div 
        className={styles.messagesList}
        style={{ maxHeight }}
      >
        {filteredMessages.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>💬</div>
            <div className={styles.emptyText}>
              {messages.length === 0 ? 'No messages yet' : 'No messages match your search'}
            </div>
            <div className={styles.emptySubtext}>
              {messages.length === 0 
                ? 'Messages will appear here as they are sent'
                : 'Try adjusting your search terms'
              }
            </div>
          </div>
        ) : (
          filteredMessages.map((message) => {
            const speaker = availableSpeakers.find(s => s.id === message.speaker);
            return (
              <div key={message.id} className={styles.messageItem}>
                {showSpeakers && (
                  <div className={styles.messageSpeaker}>
                    <span 
                      className={styles.speakerName}
                      style={{ color: speaker?.color || '#007bff' }}
                    >
                      {message.speakerDisplayName || message.speaker}
                    </span>
                    {message.chatContext && (
                      <span className={styles.chatContext}>
                        [{message.chatContext}]
                      </span>
                    )}
                  </div>
                )}
                <div className={styles.messageContent}>
                  {highlightSearchTerm(message.content, searchTerm)}
                </div>
                {showTimestamps && (
                  <div className={styles.messageTimestamp}>
                    <span>{formatTimestamp(message.timestamp)}</span>
                    <span className={styles.messageDuration}>
                      {formatDuration(message.duration)}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatLog;
export type { ChatLogProps };
