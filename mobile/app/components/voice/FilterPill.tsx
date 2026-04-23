import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { theme } from '../../constants/theme';

interface Props {
  label: string;
  active: boolean;
  onToggle: () => void;
}

export function FilterPill({ label, active, onToggle }: Props) {
  return (
    <Pressable
      onPress={onToggle}
      style={[styles.pill, active && styles.pillActive]}
    >
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  pillActive: {
    backgroundColor: theme.colors.textPrimary,
    borderColor: theme.colors.textPrimary,
  },
  label: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    fontWeight: '500',
  },
  labelActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
