import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
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
  return (
    <View style={styles.bottomNavigation}>
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
          <Text
            style={[
              styles.navText,
              item.active && styles.activeNavText,
            ]}
          >
            {item.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNavigation: {
    backgroundColor: COLORS.background,
    flexDirection: 'row',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.xl,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.border,
    paddingBottom: Platform.OS === 'ios' ? SPACING.xs : SPACING.xs,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  navText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textTertiary,
    marginTop: SPACING.xs,
    fontWeight: '500',
  },
  activeNavText: {
    color: COLORS.primary,
  },
});