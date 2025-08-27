import { useOffline } from '../contexts/OfflineContext';
import { useMemo } from 'react';

/**
 * Optimized hook for offline checking
 * Prevents unnecessary re-renders and provides consistent offline state
 */
export const useOfflineCheck = () => {
  const { isOffline, checkConnection } = useOffline();
  
  // Memoize the offline state to prevent unnecessary re-renders
  const offlineState = useMemo(() => ({
    isOffline,
    checkConnection,
    // Pre-computed values for common use cases
    shouldShowOffline: isOffline,
    canRetry: !isOffline, // Only show retry when not offline
  }), [isOffline, checkConnection]);

  return offlineState;
};
