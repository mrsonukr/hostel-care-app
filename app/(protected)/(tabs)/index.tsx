import React from 'react';
import { View, ScrollView } from 'react-native';
import CustomHeader from '../../../components/CustomHeader';
import ImageSlider from '../../../components/ImageSlider';


function HomeTabContent() {
  // Sample hostel images for the slider
  const hostelImages = [
    {
      id: '1',
      url: 'https://api.mmumullana.org/uploads/img_mb/L1_1_4_68248.webp'
    },
    {
      id: '2',
      url: 'https://api.mmumullana.org/uploads/img_mb/L1_1_4_68248.webp'
    },
    {
      id: '3',
      url: 'https://api.mmumullana.org/uploads/img_mb/L1_1_4_68248.webp'
    },
    {
      id: '4',
      url: 'https://api.mmumullana.org/uploads/img_mb/L1_1_4_68248.webp'
    }
  ];

  return (
    <View className="flex-1 bg-[#f4f4f4]">
      <CustomHeader title="Home" isHomeHeader={true} />
      
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Slider */}
        <ImageSlider 
          images={hostelImages}
          autoPlay={true}
          autoPlayInterval={4000}
          showDots={true}
          showTitles={false}
        />
      </ScrollView>
    </View>
  );
}

export default HomeTabContent;
