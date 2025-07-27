import React from 'react';
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';

interface InputFieldProps extends TextInputProps {
  label: string;
  secure?: boolean;
  options?: string[];
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  secure = false,
  options,
  value,
  onChangeText,
  error,
  ...props
}) => {
  const isOptionsField = Array.isArray(options);

  return (
    <View className="mb-4">
      <Text className="text-[16px] font-medium text-[#434343] mb-1.5 ml-1.5">
        {label}
      </Text>

      {isOptionsField ? (
        <View className="flex-row gap-2">
          {options!.map((option) => {
            const selected = value === option;
            return (
              <TouchableOpacity
                key={option}
                onPress={() => onChangeText(option)}
                className={`
                  flex-1 items-center py-3 rounded-full
                  ${selected ? 'bg-black' : 'bg-[#f5f9ff]'}
                  ${error && !selected ? 'border border-[#FF3B30]' : ''}
                `}
              >
                <Text
                  className={`
                    text-[14px] font-medium
                    ${selected ? 'text-white' : 'text-black'}
                  `}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <TextInput
          className={`
            px-4 py-[12px] rounded-full bg-[#f5f9ff] text-[16px] text-black
            ${error ? 'border border-[#FF3B30]' : ''}
          `}
          placeholderTextColor="#979797"
          secureTextEntry={secure}
          value={value}
          onChangeText={onChangeText}
          {...props}
        />
      )}

      {error && (
        <Text className="text-[#FF3B30] text-[13px] mt-1.5 ml-1.5">
          {error}
        </Text>
      )}
    </View>
  );
};

export default InputField;
