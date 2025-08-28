import React, { useEffect } from 'react';
import { View, Platform, StatusBar, AppState } from 'react-native';

const StatusBarArea: React.FC = () => {
  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const apply = () => {
      try {
        // For Android builds, ensure status bar is properly configured
        StatusBar.setBackgroundColor('white');
        StatusBar.setBarStyle('dark-content');
        StatusBar.setTranslucent(false);
        StatusBar.setHidden(false);
        // Ensure no extra spacing is added
        StatusBar.setBarStyle('dark-content', true);
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

  // For Android builds, don't render extra View to prevent duplicate spacing
  // The system status bar will handle the spacing automatically
  if (Platform.OS === 'android') {
    return null;
  }

  // iOS: Don't render extra View since CustomHeader handles safe area insets
  // This prevents duplicate spacing that was causing the gap issue
  return null;
};

export default StatusBarArea;
