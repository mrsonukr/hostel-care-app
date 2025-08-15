import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNotifications } from '../hooks/useNotifications';

interface NotificationBadgeProps {
  onPress?: () => void;
  showText?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function NotificationBadge({ 
  onPress, 
  showText = false, 
  size = 'medium' 
}: NotificationBadgeProps) {
  const { isEnabled, isDeviceRegistered, isLoading } = useNotifications();

  const getIconSize = () => {
    switch (size) {
      case 'small': return 16;
      case 'large': return 24;
      default: return 20;
    }
  };

  const getStatusColor = () => {
    if (isLoading) return '#9CA3AF'; // Gray
    if (isEnabled && isDeviceRegistered) return '#10B981'; // Green
    if (isEnabled) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  const getStatusText = () => {
    if (isLoading) return 'Loading...';
    if (isEnabled && isDeviceRegistered) return 'Active';
    if (isEnabled) return 'Pending';
    return 'Disabled';
  };

  const getIconName = () => {
    if (isLoading) return 'loading';
    if (isEnabled && isDeviceRegistered) return 'bell-check';
    if (isEnabled) return 'bell-alert';
    return 'bell-off';
  };

  const BadgeContent = () => (
    <View className="flex-row items-center">
      <MaterialCommunityIcons
        name={getIconName() as any}
        size={getIconSize()}
        color={getStatusColor()}
      />
      {showText && (
        <Text 
          className="ml-1 text-xs font-medium"
          style={{ color: getStatusColor() }}
        >
          {getStatusText()}
        </Text>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress}>
        <BadgeContent />
      </TouchableOpacity>
    );
  }

  return <BadgeContent />;
}
