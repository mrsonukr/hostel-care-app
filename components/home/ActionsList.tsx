import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, SPACING } from '../../constants/colors';

interface ActionItem {
  id: string;
  title: string;
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
}

interface ActionsListProps {
  actions: ActionItem[];
}

export const ActionsList: React.FC<ActionsListProps> = ({ actions }) => {
  return (
    <View style={styles.actionsList}>
      {actions.map((item, index) => (
        <TouchableOpacity
          key={item.id}
          style={[
            styles.actionItem,
            index === actions.length - 1 && styles.lastActionItem,
          ]}
          onPress={item.onPress}
          activeOpacity={0.7}
        >
          <View style={styles.actionContent}>
            <View style={styles.actionIcon}>
              <Feather name={item.icon} size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.actionTitle}>{item.title}</Text>
          </View>
          <Feather name="chevron-right" size={18} color={COLORS.gray} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  actionsList: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  lastActionItem: {
    borderBottomWidth: 0,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  actionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '400',
    color: COLORS.text,
  },
});