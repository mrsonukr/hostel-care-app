import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import CustomHeader from '../../../components/CustomHeader';
import { Feather } from '@expo/vector-icons';

const electricityIssues = [
  'Fan (not working/faulty)',
  'Tubelight problems',
  'Plug or switch defects',
  'Short circuit/burning smell',
  'Power outage in room',
  'Other electricity-related issues',
];

export default function ElectricityComplaint() {
  const [selected, setSelected] = useState<string | null>(null);
  const [description, setDescription] = useState('');

  const handleToggle = (item: string) => {
    if (selected === item) {
      setSelected(null); // unselect and show full list again
      setDescription('');
    } else {
      setSelected(item);
      setDescription('');
    }
  };

  return (
    <>
      <CustomHeader title="Electricity Issues" />
      <ScrollView className="flex-1 bg-white" contentContainerStyle={{ padding: 20 }}>
        {/* Heading */}
        <Text className="text-base font-semibold text-black mb-4">
          {selected ? 'Selected Problem:' : 'Select a problem:'}
        </Text>

        {/* Complaint Options */}
        {(selected ? [selected] : electricityIssues).map((item, index) => (
          <TouchableOpacity
            key={index}
            className={`flex-row items-center justify-between py-4 px-4 mb-3 border rounded-xl ${
              selected === item ? 'border-black bg-gray-100' : 'border-gray-300'
            }`}
            onPress={() => handleToggle(item)}
          >
            <Text className="text-base text-black">{item}</Text>
            {selected === item && <Feather name="check" size={20} color="black" />}
          </TouchableOpacity>
        ))}

        {/* Description Input & Submit Button */}
        {selected && (
          <>
            <Text className="mt-6 mb-2 text-base font-semibold text-black">Description (optional):</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Add any extra details here..."
              multiline
              className="border border-gray-300 rounded-xl p-4 text-base text-black h-32"
            />

            <TouchableOpacity className="mt-6 bg-black rounded-xl py-4 items-center">
              <Text className="text-white text-base font-semibold">Submit</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </>
  );
}
