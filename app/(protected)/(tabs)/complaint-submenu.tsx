import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import CustomHeader from '../../../components/CustomHeader';
import { Feather } from '@expo/vector-icons';

const electricityIssues: { label: string; icon: keyof typeof Feather.glyphMap }[] = [
  { label: 'Fan (not working/faulty)', icon: 'wind' },
  { label: 'Tubelight problems', icon: 'zap' },
  { label: 'Plug or switch defects', icon: 'toggle-left' },
  { label: 'Short circuit/burning smell', icon: 'alert-triangle' },
  { label: 'Power outage in room', icon: 'power' },
  { label: 'Other electricity-related issues', icon: 'more-horizontal' },
];

export default function ElectricityComplaint() {
  const [selected, setSelected] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]); // Dynamic list

  const handleToggle = (item: string) => {
    setSelected(prev => (prev === item ? null : item));
    setDescription('');
    setImages([]);
  };

  const pickImage = async () => {
    if (images.length >= 4) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsMultipleSelection: false,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImages(prev => [...prev, result.assets[0].uri].slice(0, 4));
    }
  };

  const removeImage = (index: number) => {
    const updated = [...images];
    updated.splice(index, 1); // remove image
    setImages(updated); // auto shifts remaining to left
  };

  const handleSubmit = () => {
    if (selected === 'Other electricity-related issues' && description.trim() === '') {
      Alert.alert('Description Required', 'Please provide a description for the selected issue.');
      return;
    }

    Alert.alert(
      'Complaint Submitted',
      `Issue: ${selected}\nDescription: ${description.trim() || 'N/A'}\nPhotos: ${images.length}`
    );

    setSelected(null);
    setDescription('');
    setImages([]);
  };

  const issuesToShow = selected
    ? electricityIssues.filter((i) => i.label === selected)
    : electricityIssues;

  return (
    <>
      <CustomHeader title="Electricity Issues" />
      <ScrollView className="flex-1 bg-[#f3f2f7]" contentContainerStyle={{ padding: 20 }}>
        <Text className="text-base font-semibold text-black mb-4">
          {selected ? 'Selected Problem:' : 'Select a problem:'}
        </Text>

        {issuesToShow.map((item, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.7}
            onPress={() => handleToggle(item.label)}
            className={`flex-row items-center justify-between py-4 px-4 mb-3 rounded-xl bg-white ${selected === item.label ? 'bg-gray-100' : ''
              }`}
          >
            <View className="flex-row items-center gap-3">
              <View className="bg-black rounded-full p-2">
                <Feather name={item.icon} size={16} color="white" />
              </View>
              <Text className="text-base text-black">{item.label}</Text>
            </View>
            {selected === item.label && <Feather name="check" size={20} color="black" />}
          </TouchableOpacity>
        ))}

        {selected && (
          <>
            <Text className="mt-6 mb-2 text-base font-semibold text-black">
              Description {selected === 'Other electricity-related issues' ? '(required)' : '(optional)'}:
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Add any extra details here..."
              multiline
              className="bg-white rounded-xl p-4 text-base text-black h-32"
            />

            {/* Photo Upload Section */}
            <View className="mt-6">
              <Text className="mb-2 text-base font-semibold text-black">Upload Photos (max 4):</Text>
              <View className="flex-row flex-wrap gap-3">
                {images.map((uri, index) => (
                  <View key={index} className="relative">
                    <Image
                      source={{ uri }}
                      className="w-24 h-24 rounded-xl"
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      onPress={() => removeImage(index)}
                      activeOpacity={0.7}
                      className="absolute top-1 right-1 bg-black/70 rounded-full p-1"
                    >
                      <Feather name="x" size={14} color="white" />
                    </TouchableOpacity>
                  </View>
                ))}

                {/* Add Image Button - only show if less than 4 */}
                {images.length < 4 && (
                  <TouchableOpacity
                    onPress={pickImage}
                    activeOpacity={0.7}
                    className="w-24 h-24 rounded-xl border border-dashed border-gray-400 bg-white justify-center items-center"
                  >
                    <Feather name="plus" size={24} color="#999" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Submit */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleSubmit}
              className="mt-6 bg-black rounded-xl py-4 items-center"
            >
              <Text className="text-white text-base font-semibold">Submit</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </>
  );
}
