import React from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import CustomHeader from '../../../components/CustomHeader';

const complaintCategories = [
  {
    iconSet: 'Feather',
    icon: 'zap', // electricity
    label: 'Electricity Issues',
  },
  {
    iconSet: 'Feather',
    icon: 'droplet', // plumbing/water
    label: 'Plumbing Concerns',
  },
  {
    iconSet: 'MaterialCommunityIcons',
    icon: 'broom', // cleaning
    label: 'Cleaning Services',
  },
  {
    iconSet: 'MaterialCommunityIcons',
    icon: 'bed-double-outline', // furniture/room
    label: 'Room & Facilities Requests',
  },
];

export default function ComplaintTab() {
  return (
    <>
      <CustomHeader title="Complaint" />
      <ScrollView className="flex-1 bg-white" contentContainerStyle={{ padding: 20 }}>
        <View>
          {complaintCategories.map(({ iconSet, icon, label }, idx) => (
            <TouchableOpacity
              key={idx}
              className="flex-row items-center justify-between py-5"
              onPress={() => Alert.alert('Selected Category', label)}
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-black rounded-full justify-center items-center">
                  {iconSet === 'Feather' ? (
                    <Feather name={icon as any} size={20} color="white" />
                  ) : (
                    <MaterialCommunityIcons name={icon as any} size={20} color="white" />
                  )}
                </View>
                <Text className="ml-4 text-lg text-black font-okra">{label}</Text>
              </View>
              <Feather name="chevron-right" size={22} color="#000" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </>
  );
}
