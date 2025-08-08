import React from 'react';
import { TouchableOpacity, Text, View, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface PhotoUploadSectionProps {
  images: string[];
  onPickImage: () => void;
  onRemoveImage: (index: number) => void;
}

export default function PhotoUploadSection({ 
  images, 
  onPickImage, 
  onRemoveImage 
}: PhotoUploadSectionProps) {
  return (
    <View className="mt-6">
      <Text className="mb-2 text-base font-semibold text-black font-okra">Upload Photos (max 4):</Text>
      <View className="flex-row flex-wrap gap-3">
        {images.map((uri, index) => (
          <View key={index} className="relative">
            <Image
              source={{ uri }}
              className="w-24 h-24 rounded-xl"
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={() => onRemoveImage(index)}
              activeOpacity={0.7}
              className="absolute top-1 right-1 bg-black/70 rounded-full p-1"
            >
              <Feather name="x" size={14} color="white" />
            </TouchableOpacity>
          </View>
        ))}

        {images.length < 4 && (
          <TouchableOpacity
            onPress={onPickImage}
            activeOpacity={0.7}
            className="w-24 h-24 rounded-xl border border-dashed border-gray-400 bg-white justify-center items-center"
          >
            <Feather name="plus" size={24} color="#999" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
