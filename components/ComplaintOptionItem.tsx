import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Feather, MaterialCommunityIcons, Octicons, SimpleLineIcons, FontAwesome6, Entypo, FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons';

interface ComplaintOptionItemProps {
  option: string;
  isSelected: boolean;
  onPress: () => void;
  getIconForOption: (option: string) => { icon: string; iconSet: string };
}

export default function ComplaintOptionItem({ 
  option, 
  isSelected, 
  onPress, 
  getIconForOption 
}: ComplaintOptionItemProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className={`flex-row items-center justify-between py-4 px-4 mb-3 rounded-xl bg-white ${isSelected ? 'bg-gray-100' : ''}`}
    >
      <View className="flex-row items-center gap-3">
        <View className="bg-black rounded-full w-8 h-8 justify-center items-center">
          {(() => {
            const iconData = getIconForOption(option);
            if (iconData.iconSet === 'MaterialCommunityIcons') {
              return <MaterialCommunityIcons name={iconData.icon as any} size={16} color="white" />;
            } else if (iconData.iconSet === 'Octicons') {
              return <Octicons name={iconData.icon as any} size={16} color="white" />;
            } else if (iconData.iconSet === 'SimpleLineIcons') {
              return <SimpleLineIcons name={iconData.icon as any} size={16} color="white" />;
            } else if (iconData.iconSet === 'FontAwesome6') {
              return <FontAwesome6 name={iconData.icon as any} size={16} color="white" />;
            } else if (iconData.iconSet === 'Entypo') {
              return <Entypo name={iconData.icon as any} size={16} color="white" />;
            } else if (iconData.iconSet === 'FontAwesome5') {
              return <FontAwesome5 name={iconData.icon as any} size={16} color="white" />;
            } else if (iconData.iconSet === 'MaterialIcons') {
              return <MaterialIcons name={iconData.icon as any} size={16} color="white" />;
            } else if (iconData.iconSet === 'Ionicons') {
              return <Ionicons name={iconData.icon as any} size={16} color="white" />;
            } else {
              return <Feather name={iconData.icon as any} size={16} color="white" />;
            }
          })()}
        </View>
        <Text className="text-base font-bold text-black font-okra">{option}</Text>
      </View>
      {isSelected && <Feather name="check" size={20} color="black" />}
    </TouchableOpacity>
  );
}
