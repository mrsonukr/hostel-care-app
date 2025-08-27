import React from 'react';
import { View } from 'react-native';
import CustomHeader from '../../../components/CustomHeader';
import ImageSlider from '../../../components/ImageSlider';


function HomeTabContent() {
  // Sample hostel images for the slider
  const hostelImages = [
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&h=600&fit=crop'
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1521783988139-89397d761dce?w=800&h=600&fit=crop'
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
    },
    {
      id: '4',
      url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'
    }
  ];

  return (
    <View className="flex-1 bg-[#f3f2f7]">
      <CustomHeader title="Home" />
      
      {/* Image Slider */}
      <ImageSlider 
        images={hostelImages}
        autoPlay={true}
        autoPlayInterval={4000}
        showDots={true}
        showTitles={false}
        showCounter={false}
      />
    </View>
  );
}

export default HomeTabContent;
