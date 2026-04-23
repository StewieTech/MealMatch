import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../constants/theme';
import { VoiceCaptureStatus } from '../../types/voice';

interface Props {
  status: VoiceCaptureStatus;
  onPress: () => void;
  disabled?: boolean;
}

export function VoiceCaptureButton({ status, onPress, disabled }: Props) {
  const pulse = useRef(new Animated.Value(1)).current;
  const isRecording = status === 'recording';

  useEffect(() => {
    if (!isRecording) {
      pulse.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.18, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => {
      loop.stop();
    };
  }, [isRecording, pulse]);

  return (
    <View style={styles.wrapper}>
      <Animated.View
        style={[
          styles.halo,
          isRecording && styles.haloActive,
          { transform: [{ scale: pulse }] },
        ]}
      />
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={[
          styles.button,
          isRecording && styles.buttonActive,
          disabled && styles.buttonDisabled,
        ]}
      >
        <Text style={styles.icon}>{isRecording ? '\u25A0' : '\u{1F3A4}'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  halo: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 999,
    backgroundColor: theme.colors.surfaceMuted,
  },
  haloActive: {
    backgroundColor: theme.colors.accentSoft,
  },
  button: {
    width: 96,
    height: 96,
    borderRadius: 999,
    backgroundColor: theme.colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  buttonActive: {
    backgroundColor: theme.colors.accent,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  icon: {
    color: '#ffffff',
    fontSize: 34,
  },
});
