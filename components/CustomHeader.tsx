import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, StatusBar, Text, TouchableOpacity, View } from 'react-native';

interface CustomHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
}) => {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View
        className={`bg-white ${Platform.OS === 'ios' ? 'pt-11' : 'pt-2'}`}
      >
        <View className="flex-row items-center justify-between h-11 px-4">
          {showBackButton ? (
            <TouchableOpacity
              onPress={onBackPress}
              className="w-8 h-8 justify-center items-start"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="chevron-back" size={24} color="#000000" />
            </TouchableOpacity>
          ) : (
            <View className="w-8 h-8" />
          )}

          <Text
            numberOfLines={1}
            className="flex-1 text-center mx-4 text-lg font-semibold text-black"
          >
            {title}
          </Text>

          <View className="w-8" />
        </View>
      </View>
    </>
  );
};

export default CustomHeader;
