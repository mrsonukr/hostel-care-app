import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import CustomHeader from '../../../components/CustomHeader';
import ImageSlider from '../../../components/ImageSlider';
import HomeCategoriesBox from '../../../components/HomeCategoriesBox';
import MessTimingsBox from '../../../components/MessTimingsBox';
import HostelEntryTimeBox from '../../../components/HostelEntryTimeBox';
import EmergencyContactsBox from '../../../components/EmergencyContactsBox';
import ImageSliderSkeleton from '../../../components/ImageSliderSkeleton';

function HomeTabContent() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Sample hostel images for the slider
  const hostelImages = [
    {
      id: '1',
      url: 'https://aldf.org/wp-content/uploads/2018/05/lamb-iStock-665494268-16x9-e1559777676675-320x180.jpg'
    },
    {
      id: '2',
      url: 'https://aldf.org/wp-content/uploads/2018/05/lamb-iStock-665494268-16x9-e1559777676675-320x180.jpg'
    },
    {
      id: '3',
      url: 'https://aldf.org/wp-content/uploads/2018/05/lamb-iStock-665494268-16x9-e1559777676675-320x180.jpg'
    },
    {
      id: '4',
      url: 'https://images.unsplash.com/photo-1526779259212-939e64788e3c?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZnJlZSUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D'
    }
  ];

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 bg-[#f4f4f4]">
      <CustomHeader title="Home" isHomeHeader={true} />
      
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Slider */}
        {isLoading ? (
          <ImageSliderSkeleton />
        ) : (
          <ImageSlider 
            images={hostelImages}
            autoPlay={true}
            autoPlayInterval={4000}
            showDots={true}
            showTitles={false}
          />
        )}
        
        {/* Complaint Categories Box */}
        <HomeCategoriesBox />
        
        {/* Mess Timings Box */}
        <MessTimingsBox />
        
        {/* Hostel Entry Time Box */}
        <HostelEntryTimeBox />
        
        {/* Emergency Contacts Box */}
        <EmergencyContactsBox />
      </ScrollView>
    </View>
  );
}

export default HomeTabContent;
