import React from 'react';
import { Text, TextInput } from 'react-native';

interface DescriptionInputProps {
  description: string;
  onDescriptionChange: (text: string) => void;
  selectedOption: string | null;
}

export default function DescriptionInput({ 
  description, 
  onDescriptionChange, 
  selectedOption 
}: DescriptionInputProps) {
  const requiresDescription = [
    'Other electricity-related issues',
    'Other plumbing issues',
    'Other cleaning needs',
    'Other room & facilities issues'
  ];

  const isRequired = selectedOption && requiresDescription.includes(selectedOption);

  return (
    <>
      <Text className="mt-6 mb-2 text-base font-semibold text-black font-okra">
        Description {isRequired ? '(required)' : '(optional)'}:
      </Text>
      <TextInput
        className='font-okra'
        value={description}
        onChangeText={onDescriptionChange}
        placeholder="Add any extra details here..."
        placeholderTextColor="#999999"
        multiline
        textAlignVertical="top"
        maxLength={250}
        style={{
          backgroundColor: 'white',
          borderRadius: 12,
          padding: 16,
          fontSize: 16,
          color: 'black',
          height: 128,
          textAlignVertical: 'top',
        }}
      />
      <Text className="text-xs font-okra text-gray-500 mt-1 text-right">
        {description.length}/250
      </Text>
    </>
  );
}
