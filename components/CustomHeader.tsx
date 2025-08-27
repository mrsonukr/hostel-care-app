import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const insets = useSafeAreaInsets();

  return (
    <>
      <View
        className="bg-white"
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
