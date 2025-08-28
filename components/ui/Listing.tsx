import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';

export interface InfoItem {
  label: string;
  icon?: React.ReactNode;
  value?: string;
  subtitle?: string;
  showArrow?: boolean;
  onPress?: () => void;
}

interface ListingProps {
  title: string;
  data: InfoItem[];
}

const Listing: React.FC<ListingProps> = ({ title, data }) => {
  const [pressedIndex, setPressedIndex] = useState<number | null>(null);

  return (
    <View className="bg-white rounded-xl mb-5 overflow-hidden">
      <Text className="text-[16px] font-semibold font-okra text-black px-5 pt-5 pb-3">{title}</Text>

      {data.map((item, index) => (
        <TouchableOpacity
          key={item.label}
          disabled={!item.onPress}
          onPress={() => {
            item.onPress?.();
          }}
          activeOpacity={1}
          onPressIn={() => item.onPress && setPressedIndex(index)}
          onPressOut={() => setPressedIndex(null)}
        >
          <View className={`flex-row items-center px-5 py-4 ${pressedIndex === index && item.onPress ? 'bg-gray-200' : 'bg-white'}`}>
            {item.icon}
            <View className="ml-3 flex-1">
              <Text className="text-[16px] text-black font-okra">{item.label}</Text>
              {item.subtitle && (
                <Text className="text-[12px] text-[#666] font-okra mt-1">{item.subtitle}</Text>
              )}
            </View>

            {item.showArrow ? (
              <Feather name="chevron-right" size={18} color="#C7C7CC" />
            ) : (
              item.value && <Text className="text-[16px] text-[#666] font-okra">{item.value}</Text>
            )}
          </View>

          {index !== data.length - 1 && <View className="h-[1px] ml-[50px] bg-[#E5E5EA]" />}
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Listing;
