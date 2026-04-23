import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../../constants/theme';
import { RecipeStep } from '../../types/voice';

interface Props {
  steps: RecipeStep[];
}

export function StepList({ steps }: Props) {
  return (
    <View style={styles.list}>
      {steps.map((step) => (
        <View key={step.number} style={styles.row}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{step.number}</Text>
          </View>
          <Text style={styles.instruction}>{step.instruction}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    alignItems: 'flex-start',
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
  },
  badgeText: {
    color: theme.colors.textPrimary,
    fontWeight: '700',
    fontSize: theme.fontSize.sm,
  },
  instruction: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.md,
    lineHeight: 22,
  },
});
