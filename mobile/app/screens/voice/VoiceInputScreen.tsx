import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ErrorState } from '../../components/voice/ErrorState';
import { LoadingOverlay } from '../../components/voice/LoadingOverlay';
import { RecordingPlayer } from '../../components/voice/RecordingPlayer';
import { RecordingStatus } from '../../components/voice/RecordingStatus';
import { VoiceCaptureButton } from '../../components/voice/VoiceCaptureButton';
import { MIN_RECORDING_MS } from '../../constants/filters';
import { theme } from '../../constants/theme';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';
import { transcribeAudio } from '../../lib/voiceApi';
import { VoiceFlowStackParamList } from '../../types/voice';

type Props = NativeStackScreenProps<VoiceFlowStackParamList, 'VoiceInput'>;

export function VoiceInputScreen({ navigation }: Props) {
  const recorder = useAudioRecorder();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  async function handleMicPress() {
    setApiError(null);
    if (recorder.status === 'recording') {
      const payload = await recorder.stop();
      if (!payload) return;
      if (payload.durationMs < MIN_RECORDING_MS) {
        setApiError('Recording too short. Try holding longer.');
        recorder.reset();
        return;
      }
      setIsProcessing(true);
      try {
        const result = await transcribeAudio(payload.base64, payload.mimeType);
        setIsProcessing(false);
        // Preserve recordingUri in the hook so a Play button can appear here
        // too; only reset() clears it (e.g. on Re-record).
        navigation.navigate('ConfirmIngredients', {
          ingredients: result.ingredients,
          transcript: result.transcript,
          recordingUri: payload.uri,
        });
      } catch (err) {
        setIsProcessing(false);
        setApiError(err instanceof Error ? err.message : 'Transcription failed.');
      }
      return;
    }

    if (recorder.status === 'error') {
      recorder.reset();
    }
    await recorder.start();
  }

  function handleRetry() {
    setApiError(null);
    recorder.reset();
  }

  const disabled = isProcessing;
  const combinedError = apiError || recorder.error;
  const showLoading = isProcessing || recorder.status === 'uploading';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>STEP 1 / 4</Text>
          <Text style={styles.title}>Voice Input</Text>
          <Text style={styles.subtitle}>Speak the ingredients you have on hand.</Text>
        </View>

        <View style={styles.captureArea}>
          <VoiceCaptureButton
            status={recorder.status}
            onPress={handleMicPress}
            disabled={disabled}
          />
          <Text style={styles.prompt}>Tell me what&apos;s in your fridge.</Text>
          <RecordingStatus status={recorder.status} durationMs={recorder.durationMs} />
        </View>

        {recorder.recordingUri && recorder.status !== 'recording' && (
          <RecordingPlayer uri={recorder.recordingUri} />
        )}

        {showLoading && <LoadingOverlay message="Transcribing your ingredients..." />}

        {combinedError && !showLoading && (
          <ErrorState message={combinedError} onRetry={handleRetry} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  container: {
    flexGrow: 1,
    padding: theme.spacing.xl,
    gap: theme.spacing.xl,
  },
  header: { gap: theme.spacing.xs },
  eyebrow: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.xs,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.xxl,
    fontWeight: '800',
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.md,
    lineHeight: 22,
  },
  captureArea: {
    alignItems: 'center',
    gap: theme.spacing.lg,
    marginTop: theme.spacing.xxl,
  },
  prompt: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
  },
});
