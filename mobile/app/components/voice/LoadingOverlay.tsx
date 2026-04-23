import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../constants/theme';

interface Props {
  message?: string;
}

export function LoadingOverlay({ message = 'Loading...' }: Props) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.accent} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.xxl,
  },
  message: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.md,
  },
});
