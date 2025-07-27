import { Feather } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  type DimensionValue,
} from 'react-native';

interface SubmitButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Feather.glyphMap;
  color?: string;
  width?: DimensionValue;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  icon,
  color = '#0D0D0D',
  width = '100%',
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={loading || disabled}
      style={{
        backgroundColor: color,
        width: width,
        opacity: loading || disabled ? 0.8 : 1,
        alignSelf: 'center',
      }}
      className="py-[14px] rounded-full mt-6 items-center justify-center"
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <View className="flex-row items-center">
          {icon && (
            <Feather
              name={icon}
              size={18}
              color="#fff"
              style={{ marginRight: 8 }}
            />
          )}
          <Text className="text-white text-[16px] font-semibold">
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default SubmitButton;
