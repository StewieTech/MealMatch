import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../../constants/theme';
import { VoiceCaptureStatus } from '../../types/voice';

interface Props {
  status: VoiceCaptureStatus;
  durationMs: number;
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function statusLabel(status: VoiceCaptureStatus): string {
  switch (status) {
    case 'recording':
      return 'Listening...';
    case 'uploading':
      return 'Transcribing...';
    case 'done':
      return 'Captured';
    case 'error':
      return 'Something went wrong';
    default:
      return 'Tap the microphone to start';
  }
}

export function RecordingStatus({ status, durationMs }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{statusLabel(status)}</Text>
      {(status === 'recording' || status === 'uploading' || status === 'done') && (
        <Text style={styles.timer}>{formatDuration(durationMs)}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  label: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.md,
  },
  timer: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.xl,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
});
