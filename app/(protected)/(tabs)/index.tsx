import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../../../components/CustomHeader';
import ImageSlider from '../../../components/ImageSlider';
import BannerSlider from '../../../components/BannerSlider';
import HomeCategoriesBox from '../../../components/HomeCategoriesBox';
import MessTimingsBox from '../../../components/MessTimingsBox';
import HostelEntryTimeBox from '../../../components/HostelEntryTimeBox';
import EmergencyContactsBox from '../../../components/EmergencyContactsBox';
import ImageSliderSkeleton from '../../../components/ImageSliderSkeleton';
import { fetchBanners, Banner } from '../../../utils/bannerApi';

function HomeTabContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [bannersLoading, setBannersLoading] = useState(true);
  
  // Sample hostel images for the slider - replace with actual hostel images
  const hostelImages = [
    {
      id: '1',
      url: 'https://blog.mmumullana.org/wp-content/uploads/2018/09/Major-Highlights-of-UniversuMM-2018-A-Jamboree-of-fun-and-frolic-1.jpg'
    },
    {
      id: '2',
      url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeZEucUuX-18959G03c8PCkw3p_fxS1TVFdQ&s'
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZnJlZSUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D'
    }
  ];

  // Fetch banners for the current hostel
  const fetchBannersData = async () => {
    try {
      const studentData = await AsyncStorage.getItem('student');
      if (studentData) {
        const student = JSON.parse(studentData);
        const hostelName = student.hostel_no;
        
        if (hostelName) {
          const bannerData = await fetchBanners(hostelName);
          setBanners(bannerData.banners);
        }
      } else {
        console.log('No student data found');
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
      setBanners([]);
    } finally {
      setBannersLoading(false);
    }
  };

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    // Fetch banners
    fetchBannersData();
    
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
        {/* Banner Slider - Only show if banners are available */}
        {banners.length > 0 && (
          <BannerSlider 
            banners={banners}
            autoPlay={true}
            autoPlayInterval={4000}
            showDots={false}
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
