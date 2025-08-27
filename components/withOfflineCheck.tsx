import React from 'react';
import { OfflineScreen } from './OfflineScreen';
import { useOffline } from '../contexts/OfflineContext';

interface WithOfflineCheckProps {
  message?: string;
  title?: string;
  children: React.ReactNode;
}

export const withOfflineCheck = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  defaultMessage?: string,
  defaultTitle?: string
) => {
  return (props: P) => {
    const { isOffline, checkConnection } = useOffline();

    if (isOffline) {
      return (
        <OfflineScreen
          onRetry={checkConnection}
          message={defaultMessage || "You're currently offline. Please check your internet connection and try again."}
          title={defaultTitle || "No Internet Connection"}
        />
      );
    }

    return <WrappedComponent {...props} />;
  };
};

// Hook-based component for inline offline checking
export const OfflineCheck: React.FC<WithOfflineCheckProps> = ({ 
  children, 
  message, 
  title 
}) => {
  const { isOffline, checkConnection } = useOffline();

  if (isOffline) {
    return (
      <OfflineScreen
        onRetry={checkConnection}
        message={message || "You're offline"}
        title={title || "No Internet Connection"}
      />
    );
  }

  return <>{children}</>;
};
