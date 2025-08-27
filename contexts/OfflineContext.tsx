import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import NetInfo from '@react-native-community/netinfo';

interface OfflineContextType {
  isOffline: boolean;
  checkConnection: () => Promise<void>;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (context === undefined) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};

interface OfflineProviderProps {
  children: ReactNode;
}

export const OfflineProvider: React.FC<OfflineProviderProps> = ({ children }) => {
  const [isOffline, setIsOffline] = useState(false);

  const checkConnection = async () => {
    const state = await NetInfo.fetch();
    const offline = !state.isConnected || !state.isInternetReachable;
    setIsOffline(offline);
  };

  useEffect(() => {
    // Initial check
    checkConnection();

    // Listen for network changes
    const unsubscribe = NetInfo.addEventListener(state => {
      const offline = !state.isConnected || !state.isInternetReachable;
      setIsOffline(offline);
    });

    return () => unsubscribe();
  }, []);

  return (
    <OfflineContext.Provider value={{ isOffline, checkConnection }}>
      {children}
    </OfflineContext.Provider>
  );
};
