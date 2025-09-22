import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Linking,
  Alert,
} from 'react-native';
import { Banner } from '../utils/bannerApi';

const { width } = Dimensions.get('window');

interface BannerSliderProps {
  banners: Banner[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  height?: number;
}

export default function BannerSlider({
  banners,
  autoPlay = true,
  autoPlayInterval = 4000,
  showDots = true,
  height = 180,
}: BannerSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);

  // one Animated.Value per dot
  const animations = useRef(banners.map(() => new Animated.Value(0))).current;

  // keep a ref for interval so we can pause/resume
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // mark first dot active on mount / banners change
  useEffect(() => {
    if (!banners || banners.length === 0) {
      setIsLoading(false);
      return;
    }
    
    // Simulate loading time for skeleton
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    animations.forEach((a, i) => a.setValue(i === 0 ? 1 : 0));
    setCurrentIndex(0);
    // scroll to first slide if banners changed
    scrollViewRef.current?.scrollTo({ x: 0, animated: false });
    
    return () => clearTimeout(timer);
  }, [banners]);

  // autoplay
  useEffect(() => {
    if (!autoPlay || banners.length <= 1) return;

    startAuto();
    return stopAuto;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, autoPlay, autoPlayInterval, banners.length]);

  const startAuto = () => {
    stopAuto();
    intervalRef.current = setInterval(() => {
      const nextIndex = (currentIndex + 1) % banners.length;
      goToSlide(nextIndex); // this also animates dots
    }, autoPlayInterval);
  };

  const stopAuto = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const animateToIndex = (index: number) => {
    animations.forEach((anim, i) => {
      Animated.timing(anim, {
        toValue: i === index ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    });
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    scrollViewRef.current?.scrollTo({ x: index * width, animated: true });
    animateToIndex(index);
  };

  // ✅ IMPORTANT: trigger animation after manual swipe settles
  const handleMomentumScrollEnd = (
    e: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round(x / width);
    if (index !== currentIndex) {
      setCurrentIndex(index);
      animateToIndex(index);
    }
    // resume autoplay after manual swipe finishes
    if (autoPlay) startAuto();
  };

  // pause autoplay while user is touching
  const handleTouchStart = () => {
    if (autoPlay) stopAuto();
  };

  const handleBannerPress = async (banner: Banner) => {
    if (!banner.link || banner.link.trim() === '') {
      console.log('No link available for this banner');
      return;
    }

    try {
      // Clean the link - remove @ symbol if present
      let cleanLink = banner.link.replace(/^@/, '').trim();
      
      // Ensure the link has proper protocol
      if (!cleanLink.startsWith('http://') && !cleanLink.startsWith('https://')) {
        cleanLink = `https://${cleanLink}`;
      }
      
      console.log('Attempting to open link:', cleanLink);
      
      // Check if the URL can be opened
      const supported = await Linking.canOpenURL(cleanLink);
      console.log('Can open URL:', supported);
      
      if (supported) {
        await Linking.openURL(cleanLink);
        console.log('Link opened successfully');
      } else {
        console.log('Cannot open URL, trying anyway...');
        // Sometimes canOpenURL returns false even for valid URLs, so try anyway
        try {
          await Linking.openURL(cleanLink);
        } catch (openError) {
          console.error('Failed to open URL:', openError);
          Alert.alert('Error', 'Cannot open this link. Please check if the URL is valid.');
        }
      }
    } catch (error) {
      console.error('Error opening banner link:', error);
      Alert.alert('Error', 'Failed to open link: ' + error.message);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { height }]}>
        <View style={[styles.slide, { height }]}>
          <View style={[styles.image, { height, backgroundColor: '#f0f0f0' }]} />
        </View>
      </View>
    );
  }

  if (!banners || banners.length === 0) {
    return (
      <View style={[styles.container, { height }]}>
        <View style={[styles.placeholder, { height }]}>
          <Text style={styles.placeholderText}>No banners available</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        onTouchStart={handleTouchStart}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {banners.map((banner) => (
          <TouchableOpacity
            key={banner.id}
            style={[styles.slide, { height }]}
            onPress={() => handleBannerPress(banner)}
            activeOpacity={banner.link ? 0.8 : 1}
          >
            <Image 
              source={{ uri: banner.img_url }} 
              style={[styles.image, { height }]}
              resizeMode="cover"
              onLoad={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {showDots && banners.length > 1 && (
        <View style={styles.pagination}>
          {banners.map((_, index) => {
            const widthAnim = animations[index].interpolate({
              inputRange: [0, 1],
              outputRange: [6, 16], // circle → pill
            });
            const bgAnim = animations[index].interpolate({
              inputRange: [0, 1],
              outputRange: ['rgba(255,255,255,0.5)', 'white'],
            });

            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  // tapping a dot should pause then resume autoplay smoothly
                  handleTouchStart();
                  goToSlide(index);
                }}
              >
                <Animated.View
                  style={[
                    styles.dot,
                    {
                      width: widthAnim,
                      backgroundColor: bgAnim,
                    },
                  ]}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: width,
    position: 'relative',
  },
  image: {
    width: '100%',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 5,
    left: 0,
    right: 0,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
  },
});
