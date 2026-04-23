import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../constants/theme';

interface Props {
  label: string;
  onRemove?: () => void;
}

export function IngredientChip({ label, onRemove }: Props) {
  return (
    <View style={styles.chip}>
      <Text style={styles.label}>{label}</Text>
      {onRemove && (
        <Pressable onPress={onRemove} hitSlop={8} style={styles.removeButton}>
          <Text style={styles.removeText}>x</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    backgroundColor: theme.colors.surface,
    gap: theme.spacing.sm,
  },
  label: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.sm,
    fontWeight: '500',
  },
  removeButton: {
    width: 18,
    height: 18,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceMuted,
  },
  removeText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    lineHeight: 14,
    fontWeight: '700',
  },
});
