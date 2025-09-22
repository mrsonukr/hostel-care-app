import React from 'react';
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';

interface InputFieldProps extends TextInputProps {
  label: string;
  secure?: boolean;
  options?: string[];
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  maxLength?: number;
  verified?: boolean;
  showVerifyButton?: boolean;
  onVerifyPress?: () => void;
  verifying?: boolean;
  timer?: number;
  resendCount?: number;
  showPasswordToggle?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  secure = false,
  options,
  value,
  onChangeText,
  error,
  maxLength,
  verified = false,
  showVerifyButton = false,
  onVerifyPress,
  verifying = false,
  timer = 0,
  resendCount = 0,
  showPasswordToggle = false,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const isOptionsField = Array.isArray(options);

  const formatTimer = (seconds: number): string => {
    const numSeconds = Math.floor(Number(seconds) || 0);
    
    if (numSeconds < 60) {
      return String(numSeconds) + 's';
    } else if (numSeconds < 3600) {
      const minutes = Math.floor(numSeconds / 60);
      const remainingSeconds = numSeconds % 60;
      return String(minutes) + 'm ' + String(remainingSeconds) + 's';
    } else {
      const hours = Math.floor(numSeconds / 3600);
      const minutes = Math.floor((numSeconds % 3600) / 60);
      return String(hours) + 'h ' + String(minutes) + 'm';
    }
  };

  return (
    <View className="mb-4">
      <Text className="text-[16px] font-okra font-medium text-[#434343] mb-1.5 ml-1.5">
        {label}
      </Text>

      {isOptionsField ? (
        <View className="flex-row gap-2">
          {options!.map((option) => {
            const selected = value.toLowerCase() === option.toLowerCase();
            return (
              <TouchableOpacity
                key={option}
                activeOpacity={0.7}
                onPress={() => onChangeText(option.toLowerCase())}
                className={`
                  flex-1 items-center py-3 rounded-xl
                  ${selected ? 'bg-black' : 'bg-blue-50'}
                  ${error && !selected ? 'border border-[#FF3B30]' : ''}
                `}
              >
                <Text
                  className={`
                    text-[14px] font-okra font-medium
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
        <View className="relative">
            <TextInput
              className={`
                px-4 py-[12px] rounded-xl bg-blue-50
                text-[16px] font-okra text-black
                ${error ? 'border border-[#FF3B30]' : ''}
                ${verified || showVerifyButton || (showPasswordToggle && value.length > 0) ? 'pr-20' : ''}
              `}
              placeholderTextColor="#979797"
              secureTextEntry={secure && !isPasswordVisible}
              value={value}
              onChangeText={onChangeText}
              maxLength={maxLength}
              {...props}
            />
            {verified && (
              <View 
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: [{ translateY: -10 }]
                }}
              >
                <MaterialCommunityIcons
                  name="check-circle"
                  size={20}
                  color="#000000"
                />
              </View>
            )}
          {showVerifyButton && !verified && (
            <TouchableOpacity
              onPress={onVerifyPress}
              disabled={verifying || timer > 0}
              style={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: [{ translateY: -12 }],
                paddingHorizontal: 8,
                paddingVertical: 4,
                opacity: (verifying || timer > 0) ? 0.6 : 1,
                minWidth: 50,
                height: 24,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              {verifying ? (
                <ActivityIndicator size="small" color="#0D0D0D" />
              ) : (timer && Number(timer) > 0) ? (
                <Text className="text-gray-500 text-sm font-okra font-medium">
                  {formatTimer(Number(timer) || 0)}
                </Text>
              ) : (
                <Text className="text-black text-sm font-okra font-medium">
                  {Number(resendCount) === 0 ? 'Verify' : 'Resend'}
                </Text>
              )}
            </TouchableOpacity>
          )}
          {showPasswordToggle && value.length > 0 && (
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: [{ translateY: -10 }]
              }}
            >
              <Feather
                name={isPasswordVisible ? "eye-off" : "eye"}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          )}
        </View>
      )}

      {error && (
        <Text className="text-[#FF3B30] text-[13px] font-okra mt-1.5 ml-1.5">
          {error}
        </Text>
      )}
    </View>
  );
};

export default InputField;
