import React, { useEffect, useRef } from 'react';
import { useOffline } from '../contexts/OfflineContext';

/**
 * Performance monitoring component for offline functionality
 * Tracks offline state changes and logs performance metrics
 */
export const OfflinePerformanceMonitor: React.FC = () => {
  const { isOffline } = useOffline();
  const lastOfflineState = useRef(isOffline);
  const stateChangeCount = useRef(0);
  const lastChangeTime = useRef(Date.now());

  useEffect(() => {
    if (lastOfflineState.current !== isOffline) {
      const now = Date.now();
      const timeSinceLastChange = now - lastChangeTime.current;
      
      stateChangeCount.current += 1;
      lastChangeTime.current = now;
      lastOfflineState.current = isOffline;

      // Performance monitoring - silent in both dev and production
      // Uncomment below lines if you need debugging
      // console.log(`🔄 Offline state changed to: ${isOffline}`);
      // console.log(`📊 Total changes: ${stateChangeCount.current}`);
      // console.log(`⏱️ Time since last change: ${timeSinceLastChange}ms`);
    }
  }, [isOffline]);

  // This component doesn't render anything, it just monitors
  return null;
};
