import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

interface ComplaintCategoryItemProps {
  iconSet: string;
  icon: string;
  label: string;
  onPress: () => void;
}

export default function ComplaintCategoryItem({ iconSet, icon, label, onPress }: ComplaintCategoryItemProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className="flex-row items-center justify-between py-4 bg-white rounded-xl mb-3 px-4"
      onPress={onPress}
    >
      <View className="flex-row items-center">
        <View className="w-8 h-8 bg-black rounded-full justify-center items-center">
          {iconSet === 'Feather' ? (
            <Feather name={icon as any} size={16} color="white" />
          ) : (
            <MaterialCommunityIcons name={icon as any} size={16} color="white" />
          )}
        </View>
        <Text className="ml-3 text-lg font-bold text-black font-okra">{label}</Text>
      </View>
      <Feather name="chevron-right" size={20} color="#000" />
    </TouchableOpacity>
  );
}
