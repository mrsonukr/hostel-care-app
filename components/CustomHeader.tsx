import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Platform, Text, TouchableOpacity, View, Image, Modal, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

interface CustomHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  isHomeHeader?: boolean;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
  isHomeHeader = false,
}) => {
  const insets = useSafeAreaInsets();
  const [student, setStudent] = useState<any>(null);
  const [showFullScreenImage, setShowFullScreenImage] = useState(false);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const local = await AsyncStorage.getItem('student');
        if (local) {
          const parsed = JSON.parse(local);
          setStudent(parsed);
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    if (isHomeHeader) {
      fetchStudentData();
    }
  }, [isHomeHeader]);

  const getDefaultProfileImage = (gender?: string) =>
    gender?.toLowerCase() === 'female'
      ? require('../assets/images/female.png')
      : require('../assets/images/male.png');

  const handleProfileImagePress = () => {
    setShowFullScreenImage(true);
  };

  return (
    <>
      <View
        className="bg-white"
        style={{
          paddingTop: Platform.OS === 'android' ? 0 : insets.top,
          // Ensure no extra margins or padding for Android
          marginTop: Platform.OS === 'android' ? 0 : undefined,
        }}
      >
        <View className={`flex-row items-center justify-between px-4 ${isHomeHeader ? 'h-16' : 'h-11'}`}>
          {isHomeHeader ? (
            <>
              <Text className="text-2xl font-bold text-black">
                HostelCare
              </Text>
              <TouchableOpacity 
                className="w-12 h-12 justify-center items-center border-2 border-gray-300 rounded-full"
                onPress={handleProfileImagePress}
              >
                <Image 
                  source={
                    student?.profile_pic_url?.startsWith('http')
                      ? { uri: student.profile_pic_url }
                      : getDefaultProfileImage(student?.gender)
                  }
                  className="w-12 h-12 rounded-full"
                />
              </TouchableOpacity>
            </>
          ) : (
            <>
              {showBackButton ? (
                <TouchableOpacity
                  onPress={onBackPress}
                  className="w-8 h-8 justify-center items-start"
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="chevron-back" size={24} color="#000000" />
                </TouchableOpacity>
              ) : (
                <View className="w-8 h-8" />
              )}

              <Text
                numberOfLines={1}
                className="flex-1 text-center mx-4 text-lg font-semibold text-black"
              >
                {title}
              </Text>

              <View className="w-8" />
            </>
          )}
        </View>
      </View>

      {/* Full Screen Image Modal */}
      <Modal
        visible={showFullScreenImage}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowFullScreenImage(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowFullScreenImage(false)}>
          <View className="flex-1 bg-black bg-opacity-90 justify-center items-center">
            <TouchableWithoutFeedback onPress={() => {}}>
              <View className="w-full h-full justify-center items-center">
                <Image 
                  source={
                    student?.profile_pic_url?.startsWith('http')
                      ? { uri: student.profile_pic_url }
                      : getDefaultProfileImage(student?.gender)
                  }
                  className="w-full h-full"
                  resizeMode="contain"
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default CustomHeader;
