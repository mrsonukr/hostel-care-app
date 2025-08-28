import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Button } from 'react-native-paper';

interface CategoryItemProps {
  iconSet: string;
  icon: string;
  label: string;
  onPress: () => void;
}

function CategoryItem({ iconSet, icon, label, onPress }: CategoryItemProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className="flex-1 bg-white rounded-xl p-4 mx-1 items-center justify-center"
      onPress={onPress}
    >
      <View className="w-12 h-12 bg-black rounded-full justify-center items-center mb-2">
        {iconSet === 'Feather' ? (
          <Feather name={icon as any} size={24} color="white" />
        ) : (
          <MaterialCommunityIcons name={icon as any} size={24} color="white" />
        )}
      </View>
      <Text className="text-xs font-semibold text-gray-700 text-center font-okra" numberOfLines={2}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function HomeCategoriesBox() {
  const router = useRouter();

  const categories = [
    {
      iconSet: 'Feather',
      icon: 'zap',
      label: 'Electricity Issues',
    },
    {
      iconSet: 'Feather',
      icon: 'droplet',
      label: 'Plumbing Concerns',
    },
    {
      iconSet: 'MaterialCommunityIcons',
      icon: 'broom',
      label: 'Cleaning Services',
    },
    {
      iconSet: 'MaterialCommunityIcons',
      icon: 'bed-double-outline',
      label: 'Room & Facilities Requests',
    },
  ];

  const handleCategoryPress = (category: string) => {
    router.push({
      pathname: '/(protected)/(tabs)/ComplaintScreen',
      params: { category }
    });
  };

  return (
    <View className="mx-4 mt-4 mb-6">
      <View className="bg-white rounded-2xl p-4 ">
        <Text className="text-lg font-bold text-gray-800 mb-2 font-okra">
          Raise New Complaint
        </Text>

        <View className="flex-row">
          {categories.map((category, index) => (
            <CategoryItem
              key={index}
              iconSet={category.iconSet}
              icon={category.icon}
              label={category.label}
              onPress={() => handleCategoryPress(category.label)}
            />
          ))}
        </View>

        <Button
          mode="contained"
          onPress={() => router.push({
            pathname: '/(protected)/(tabs)/ComplaintScreen',
            params: { activeTab: 'status' }
          })}
          style={{
            backgroundColor: '#0D0D0D',
            marginTop: 4,
            borderRadius: 10
          }}
          contentStyle={{ height: 40 }}
          labelStyle={{ fontSize: 14, fontWeight: '600', color: 'white' }}
        >
          View Complaint Status
        </Button>
      </View>
    </View>
  );
}
