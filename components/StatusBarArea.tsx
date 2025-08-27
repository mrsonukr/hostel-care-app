import React, { useEffect } from 'react';
import { View, Platform, StatusBar, AppState } from 'react-native';

const StatusBarArea: React.FC = () => {
  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const apply = () => {
      try {
        StatusBar.setBackgroundColor('white');
        StatusBar.setBarStyle('dark-content');
        StatusBar.setTranslucent(false);
      } catch (_err) {}
    };

    apply();
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        apply();
      }
    });
    return () => {
      sub.remove();
    };
  }, []);

  return (
    <View style={{ 
      height: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 44, 
      backgroundColor: 'white',
      zIndex: 9999
    }} />
  );
};

export default StatusBarArea;
