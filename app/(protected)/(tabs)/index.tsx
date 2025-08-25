import React from 'react';
import { View } from 'react-native';
import CustomHeader from '../../../components/CustomHeader';

export default function HomeTab() {
  return (
    <View className="flex-1 bg-[#f3f2f7]">
      <CustomHeader title="Home" />
      {/* Blank content - nothing to display */}
    </View>
  );
}
