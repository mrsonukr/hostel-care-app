import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZES, SPACING } from '../../constants/colors';

interface NavItem {
  id: string;
  title: string;
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
  active?: boolean;
}

interface BottomNavigationProps {
  items: NavItem[];
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ items }) => {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      edges={['bottom']}
      style={[
        styles.safeAreaContainer,
        {
          paddingBottom:
            Platform.OS === 'android' ? 0 : -40,
        },
      ]}
    >
      {items.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.navItem}
          onPress={item.onPress}
          activeOpacity={0.7}
        >
          <Feather
            name={item.icon}
            size={24}
            color={item.active ? COLORS.primary : COLORS.textTertiary}
          />
          <Text style={[styles.navText, item.active && styles.activeNavText]}>
            {item.title}
          </Text>
        </TouchableOpacity>
      ))}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.border,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.sm,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  navText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textTertiary,
    marginTop: 2,
    fontWeight: '500',
  },
  activeNavText: {
    color: COLORS.primary,
  },
});
