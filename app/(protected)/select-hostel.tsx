import {
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useState, useRef, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CustomHeader from '../../components/CustomHeader';
import SubmitButton from '../../components/ui/SubmitButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Mapping for backend saving (all hostels except 15)
const hostelCodeMap: { [key: number]: string } = {
  1: '1B',
  2: '2G',
  3: '3G',
  4: '4G',
  5: '5B',
  6: '6G',
  7: '7G',
  8: '8G',
  9: '9G',
  10: '10B',
  11: '11B',
  12: '12B',
  13: '13B',
  14: '14B',
  16: '16B',
};

// Only show 1 to 4 in frontend
const hostelsToShow: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16];

export default function HostelListScreen() {
  const router = useRouter();
  const { edit } = useLocalSearchParams<{ edit?: string }>();
  const isEditMode = edit === 'true';

  const [selected, setSelected] = useState<number | null>(null);
  const [digits, setDigits] = useState<string[]>(['', '', '']);
  const [loading, setLoading] = useState(false);

  const inputRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        const studentData = await AsyncStorage.getItem('student');
        if (studentData) {
          const parsedData = JSON.parse(studentData);
          const { hostel_no, room_no } = parsedData;

          if (isEditMode && hostel_no) {
            const hostelNumber = Object.keys(hostelCodeMap).find(
              (key) => hostelCodeMap[Number(key)] === hostel_no
            );
            if (hostelNumber) {
              setSelected(Number(hostelNumber));
            }
          }

          if (isEditMode && room_no && /^\d{3}$/.test(room_no)) {
            setDigits(room_no.split(''));
          } else if (!isEditMode) {
            setDigits(['1', '0', '0']);
          }
        } else {
          Alert.alert('Error', 'Student data not found. Please log in again.');
          router.replace('/(auth)/login');
        }
      } catch {
        Alert.alert('Error', 'Failed to load hostel data.');
      }
    };
    loadStudentData();
  }, [isEditMode, router]);

  const handleHostelPress = (number: number) => {
    Haptics.selectionAsync();
    setSelected(number);
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value;

    if (index === 2) {
      if (newDigits[0] === '' && newDigits[1] === '' && value) {
        newDigits[0] = '0';
        newDigits[1] = '0';
      } else if (newDigits[0] === '' && value) {
        newDigits[0] = '0';
      } else if (newDigits[1] === '' && value) {
        newDigits[1] = '0';
      }
    }

    if (index === 1 && newDigits[0] === '' && value) {
      newDigits[0] = '0';
    }

    setDigits(newDigits);

    if (value && index < 2) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && digits[index] === '' && index > 0) {
      const newDigits = [...digits];
      newDigits[index - 1] = '';
      setDigits(newDigits);
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleSubmit = async () => {
    const roomNumber = digits.join('');
    const roomNumberInt = parseInt(roomNumber, 10);

    if (!selected || !/^\d{3}$/.test(roomNumber) || roomNumberInt < 100) {
      Alert.alert('Error', 'Please select a hostel and enter a valid 3-digit room number (100 or above)');
      return;
    }

    setLoading(true);
    await Haptics.selectionAsync();

    try {
      const studentData = await AsyncStorage.getItem('student');
      if (!studentData) {
        Alert.alert('Error', 'Student data not found. Please log in again.');
        setLoading(false);
        return;
      }

      const { roll_no } = JSON.parse(studentData);
      const hostelCode = hostelCodeMap[selected];

      const response = await fetch(`https://hostelapis.mssonutech.workers.dev/api/student/${roll_no}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hostel_no: hostelCode,
          room_no: roomNumber,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const updatedStudent = {
          ...JSON.parse(studentData),
          hostel_no: hostelCode,
          room_no: roomNumber,
        };
        await AsyncStorage.setItem('student', JSON.stringify(updatedStudent));
        router.replace('/hostel-details');
      } else {
        Alert.alert('Error', result.error || 'Failed to update hostel information');
      }
    } catch {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CustomHeader
        title={isEditMode ? 'Edit Hostel' : 'Select Hostel'}
        showBackButton
        onBackPress={() => router.back()}
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="flex-1 bg-white"
        >
          <ScrollView contentContainerStyle={{ padding: 16 }}>
            {/* Hostel Grid (show only numbers) */}
            <View className="flex-row flex-wrap justify-between">
              {hostelsToShow.map((number) => (
                <TouchableOpacity
                  key={number}
                  onPress={() => handleHostelPress(number)}
                  activeOpacity={0.8}
                  className={`w-[68px] h-[68px] rounded-full justify-center items-center mb-4 ${
                    selected === number ? 'bg-black' : 'bg-neutral-200'
                  }`}
                >
                  {selected === number ? (
                    <MaterialCommunityIcons name="check" size={28} color="white" />
                  ) : (
                    <Text className="text-lg font-semibold text-black font-okra">
                      {number}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Room Input */}
            <View className="pt-10 items-center">
              <Text className="text-lg font-bold text-gray-800 mb-3">Enter Room Number</Text>
              <View className="flex-row justify-center gap-4">
                {digits.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={inputRefs[index]}
                    value={digit}
                    onChangeText={(value) => handleChange(index, value)}
                    onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
                    keyboardType="number-pad"
                    maxLength={1}
                    className="w-16 h-16 border border-gray-300 rounded-xl text-center text-2xl font-bold text-black"
                    placeholder="0"
                    placeholderTextColor="#A0A0A0"
                  />
                ))}
              </View>
            </View>

            {/* Submit Button */}
            <View className="mt-10 items-center">
              <SubmitButton
                title={isEditMode ? 'Save Hostel' : 'Add Hostel'}
                icon="arrow-right"
                onPress={handleSubmit}
                loading={loading}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </>
  );
}
