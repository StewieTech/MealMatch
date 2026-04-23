import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../../constants/theme';

interface Props {
  percent: number;
}

export function MatchBadge({ percent }: Props) {
  const isPerfect = percent >= 100;
  return (
    <View style={[styles.badge, isPerfect && styles.badgePerfect]}>
      <Text style={[styles.text, isPerfect && styles.textPerfect]}>
        {Math.round(percent)}% match
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surfaceMuted,
  },
  badgePerfect: {
    backgroundColor: theme.colors.textPrimary,
  },
  text: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.xs,
    fontWeight: '700',
  },
  textPerfect: {
    color: '#ffffff',
  },
});
