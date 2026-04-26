import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../constants/theme';

interface Props {
  label: string;
  active: boolean;
  onToggle?: () => void;
  onRemove?: () => void;
}

export function FilterPill({ label, active, onToggle, onRemove }: Props) {
  return (
    <View style={[styles.pill, active && styles.pillActive]}>
      {onToggle ? (
        <Pressable onPress={onToggle} style={styles.labelTapArea}>
          <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
        </Pressable>
      ) : (
        <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
      )}
      {onRemove && (
        <Pressable onPress={onRemove} hitSlop={8} style={styles.removeButton}>
          <Text style={styles.removeText}>x</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    gap: theme.spacing.sm,
  },
  labelTapArea: {
    minHeight: 18,
    justifyContent: 'center',
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
  removeButton: {
    width: 18,
    height: 18,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  removeText: {
    color: '#ffffff',
    fontSize: 12,
    lineHeight: 14,
    fontWeight: '700',
  },
});
