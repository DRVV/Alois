'use client';

import React, { useState, useMemo } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { ChatLogProps } from './types';
import styles from './ChatLog.module.css';

const ChatLog: React.FC<ChatLogProps> = ({
  className = '',
  maxHeight = '400px',
  showTimestamps = true,
  showSearch = true,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const messages = useChatStore((state) => state.logMessages);
  const clearAllMessages = useChatStore((state) => state.clearAllLogMessages);

  // Filter messages based on search term
  const filteredMessages = useMemo(() => {
    if (!searchTerm.trim()) return messages;
    
    return messages.filter(message =>
      message.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [messages, searchTerm]);

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
    const exportData = messages.map(msg => ({
      timestamp: msg.timestamp.toISOString(),
      content: msg.content,
      duration: msg.duration,
    }));

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `chat-log-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all chat messages? This action cannot be undone.')) {
      clearAllMessages();
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
          filteredMessages.map((message) => (
            <div key={message.id} className={styles.messageItem}>
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
          ))
        )}
      </div>
    </div>
  );
};

export default ChatLog;
export type { ChatLogProps };
