import React from 'react';

/**
 * Performance optimization utilities for the chat system
 */

// Memoized message filtering function
export const filterMessages = (messages: any[], filters: {
  speakerId?: string;
  searchTerm?: string;
  maxMessages?: number;
}) => {
  let filtered = messages;
  
  // Apply speaker filter
  if (filters.speakerId) {
    filtered = filtered.filter(msg => msg.speaker === filters.speakerId);
  }
  
  // Apply search filter
  if (filters.searchTerm && filters.searchTerm.trim()) {
    const term = filters.searchTerm.toLowerCase();
    filtered = filtered.filter(msg => 
      msg.content.toLowerCase().includes(term) ||
      (msg.speakerDisplayName || msg.speaker).toLowerCase().includes(term)
    );
  }
  
  // Apply message limit
  if (filters.maxMessages && filters.maxMessages > 0) {
    filtered = filtered.slice(-filters.maxMessages);
  }
  
  return filtered;
};

// Hook version for use in components
export const useMessageFilter = () => {
  return filterMessages;
};

// Debounced function creator
export const createDebounced = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T => {
  let timeoutId: NodeJS.Timeout;
  
  return ((...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
};

// Throttled function creator
export const createThrottled = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): T => {
  let inThrottle: boolean;
  
  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }) as T;
};

// Memoized component creator with display name
export const createMemoizedComponent = <P extends object>(
  Component: React.ComponentType<P>,
  displayName: string,
  areEqual?: (prevProps: P, nextProps: P) => boolean
) => {
  const MemoizedComponent = React.memo(Component, areEqual);
  MemoizedComponent.displayName = displayName;
  return MemoizedComponent;
};

// Hook for expensive calculations
export const useExpensiveCalculation = <T>(
  calculate: () => T,
  dependencies: React.DependencyList
): T => {
  return React.useMemo(calculate, dependencies);
};

// Hook for stable callback references
export const useStableCallback = <T extends (...args: any[]) => any>(
  callback: T,
  dependencies: React.DependencyList
): T => {
  return React.useCallback(callback, dependencies);
};

// Performance monitoring hook
export const usePerformanceMonitor = (componentName: string) => {
  const renderCount = React.useRef(0);
  const startTime = React.useRef<number>();
  
  React.useEffect(() => {
    renderCount.current += 1;
    startTime.current = performance.now();
    
    return () => {
      if (startTime.current) {
        const duration = performance.now() - startTime.current;
        if (duration > 16) { // More than one frame (60fps)
          console.warn(`${componentName} render took ${duration.toFixed(2)}ms (render #${renderCount.current})`);
        }
      }
    };
  }, [componentName]);
  
  const logPerformance = React.useCallback(() => {
    console.log(`${componentName} has rendered ${renderCount.current} times`);
  }, [componentName, renderCount]);
  
  return {
    renderCount: renderCount.current,
    logPerformance
  };
};
