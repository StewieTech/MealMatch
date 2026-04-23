import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../constants/theme';

interface Props {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({ message, onRetry, retryLabel = 'Try again' }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>!</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <Pressable onPress={onRetry} style={styles.button}>
          <Text style={styles.buttonText}>{retryLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: theme.spacing.md,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
  },
  icon: {
    width: 40,
    height: 40,
    lineHeight: 40,
    textAlign: 'center',
    borderRadius: 999,
    backgroundColor: theme.colors.danger,
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 22,
  },
  message: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.md,
    textAlign: 'center',
  },
  button: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.textPrimary,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
