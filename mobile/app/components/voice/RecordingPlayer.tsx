import { Audio, AVPlaybackStatus } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../constants/theme';

interface Props {
  uri: string;
  label?: string;
}

function formatDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) return '0:00';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function RecordingPlayer({ uri, label = 'Your recording' }: Props) {
  if (Platform.OS === 'web') {
    return <WebRecordingPlayer uri={uri} label={label} />;
  }
  return <NativeRecordingPlayer uri={uri} label={label} />;
}

function WebRecordingPlayer({ uri, label }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      {React.createElement('audio', {
        src: uri,
        controls: true,
        style: { width: '100%' },
      })}
    </View>
  );
}

function NativeRecordingPlayer({ uri, label }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [positionMs, setPositionMs] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    return () => {
      const sound = soundRef.current;
      soundRef.current = null;
      if (sound) {
        sound.unloadAsync().catch(() => undefined);
      }
    };
  }, []);

  function handleStatusUpdate(status: AVPlaybackStatus) {
    if (!status.isLoaded) {
      if (status.error) setError(status.error);
      return;
    }
    setPositionMs(status.positionMillis ?? 0);
    if (status.durationMillis) setDurationMs(status.durationMillis);
    setIsPlaying(status.isPlaying);
    if (status.didJustFinish) {
      setIsPlaying(false);
      setPositionMs(0);
      soundRef.current?.setPositionAsync(0).catch(() => undefined);
    }
  }

  async function handlePress() {
    try {
      setError(null);
      if (!soundRef.current) {
        setIsLoading(true);
        const { sound, status } = await Audio.Sound.createAsync(
          { uri },
          { shouldPlay: true },
          handleStatusUpdate
        );
        soundRef.current = sound;
        if (status.isLoaded && status.durationMillis) {
          setDurationMs(status.durationMillis);
        }
        setIsLoading(false);
        return;
      }

      const status = await soundRef.current.getStatusAsync();
      if (!status.isLoaded) return;
      if (status.isPlaying) {
        await soundRef.current.pauseAsync();
      } else {
        if (status.didJustFinish || status.positionMillis === status.durationMillis) {
          await soundRef.current.setPositionAsync(0);
        }
        await soundRef.current.playAsync();
      }
    } catch (err) {
      setIsLoading(false);
      setError(err instanceof Error ? err.message : 'Unable to play recording.');
    }
  }

  const icon = isPlaying ? '\u23F8' : '\u25B6';
  const position = formatDuration(positionMs);
  const duration = formatDuration(durationMs);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <Pressable onPress={handlePress} disabled={isLoading} style={styles.button}>
          <Text style={styles.buttonIcon}>{isLoading ? '...' : icon}</Text>
        </Pressable>
        <Text style={styles.time}>
          {position} / {duration}
        </Text>
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
  },
  label: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.xs,
    fontWeight: '700',
    letterSpacing: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: theme.colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  time: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.sm,
    fontVariant: ['tabular-nums'],
  },
  error: {
    color: theme.colors.danger,
    fontSize: theme.fontSize.xs,
  },
});
