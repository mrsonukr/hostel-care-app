import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import React from 'react';

export interface InfoItem {
  label: string;
  icon?: React.ReactNode;
  value?: string;
  showArrow?: boolean;
  onPress?: () => void;
}

interface ListingProps {
  title: string;
  data: InfoItem[];
}

const Listing: React.FC<ListingProps> = ({ title, data }) => {
  return (
    <View className="bg-white rounded-xl mb-5 overflow-hidden">
      <Text className="text-[16px] font-semibold font-okra text-black px-5 pt-5 pb-3">{title}</Text>

      {data.map((item, index) => (
        <TouchableOpacity
          key={item.label}
          disabled={!item.onPress}
          onPress={item.onPress}
          activeOpacity={item.onPress ? 0.7 : 1}
        >
          <View className="flex-row items-center px-5 py-4 bg-white">
            {item.icon}
            <Text className="text-[16px] text-black font-okra ml-3 flex-1">{item.label}</Text>

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
