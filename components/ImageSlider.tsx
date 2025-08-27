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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface ImageItem {
  id: string;
  url: string;
  title?: string;
  description?: string;
}

interface ImageSliderProps {
  images: Array<ImageItem>;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showTitles?: boolean;
}

export default function ImageSlider({
  images,
  autoPlay = true,
  autoPlayInterval = 3000,
  showDots = true,
  showTitles = true,
}: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  // one Animated.Value per dot
  const animations = useRef(images.map(() => new Animated.Value(0))).current;

  // keep a ref for interval so we can pause/resume
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // mark first dot active on mount / images change
  useEffect(() => {
    if (!images || images.length === 0) return;
    animations.forEach((a, i) => a.setValue(i === 0 ? 1 : 0));
    setCurrentIndex(0);
    // scroll to first slide if images changed
    scrollViewRef.current?.scrollTo({ x: 0, animated: false });
  }, [images]);

  // autoplay
  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;

    startAuto();
    return stopAuto;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, autoPlay, autoPlayInterval, images.length]);

  const startAuto = () => {
    stopAuto();
    intervalRef.current = setInterval(() => {
      const nextIndex = (currentIndex + 1) % images.length;
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

  if (!images || images.length === 0) {
    return (
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>No images available</Text>
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
        // we rely on momentum end to know final page
        onMomentumScrollEnd={handleMomentumScrollEnd}
        onTouchStart={handleTouchStart}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {images.map((image) => (
          <View key={image.id} style={styles.slide}>
            <Image source={{ uri: image.url }} style={styles.image} />
            {showTitles && (image.title || image.description) && (
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={styles.overlay}
              >
                <View style={styles.textContainer}>
                  {image.title && <Text style={styles.title}>{image.title}</Text>}
                  {image.description && (
                    <Text style={styles.description}>{image.description}</Text>
                  )}
                </View>
              </LinearGradient>
            )}
          </View>
        ))}
      </ScrollView>

      {showDots && images.length > 1 && (
        <View style={styles.pagination}>
          {images.map((_, index) => {
            const widthAnim = animations[index].interpolate({
              inputRange: [0, 1],
              outputRange: [8, 20], // circle → pill
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
    height: 250,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: width - 32,
    height: 250,
    position: 'relative',
    marginLeft: 16,
    marginRight: 16,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 12,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    justifyContent: 'flex-end',
  },
  textContainer: {
    padding: 20,
    paddingBottom: 30,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  placeholder: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
  },
});
