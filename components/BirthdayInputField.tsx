import React from 'react';
import {
  Text,
  TextInput,
  View,
} from 'react-native';

interface BirthdayInputFieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  placeholder?: string;
}

const BirthdayInputField: React.FC<BirthdayInputFieldProps> = ({
  label,
  value,
  onChangeText,
  error,
  placeholder = "DD-MM-YYYY",
}) => {
  const formatDateInput = (text: string) => {
    // Remove all non-numeric characters
    const numbers = text.replace(/\D/g, '');
    
    // Limit to 8 digits (DDMMYYYY)
    const limitedNumbers = numbers.slice(0, 8);
    
    // Format as DD-MM-YYYY
    let formatted = limitedNumbers;
    if (limitedNumbers.length >= 3) {
      formatted = limitedNumbers.slice(0, 2) + '-' + limitedNumbers.slice(2);
    }
    if (limitedNumbers.length >= 5) {
      formatted = limitedNumbers.slice(0, 2) + '-' + limitedNumbers.slice(2, 4) + '-' + limitedNumbers.slice(4);
    }
    
    return formatted;
  };

  const handleTextChange = (text: string) => {
    const formatted = formatDateInput(text);
    onChangeText(formatted);
  };

  return (
    <View className="mb-4">
      <Text className="text-[16px] font-okra font-medium text-[#434343] mb-1.5 ml-1.5">
        {label}
      </Text>

      <TextInput
        className={`
          px-4 py-[12px] rounded-xl bg-blue-50
          text-[16px] font-okra text-black
          ${error ? 'border border-[#FF3B30]' : ''}
        `}
        placeholderTextColor="#979797"
        value={value}
        onChangeText={handleTextChange}
        placeholder={placeholder}
        keyboardType="numeric"
        maxLength={10} // DD-MM-YYYY = 10 characters
      />

      {error && (
        <Text className="text-[#FF3B30] text-[13px] font-okra mt-1.5 ml-1.5">
          {error}
        </Text>
      )}
    </View>
  );
};

export default BirthdayInputField;

