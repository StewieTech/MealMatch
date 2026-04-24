import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ErrorState } from '../../components/voice/ErrorState';
import { LoadingOverlay } from '../../components/voice/LoadingOverlay';
import { theme } from '../../constants/theme';
import { useCameraCapture } from '../../hooks/useCameraCapture';
import { extractIngredientsFromPhoto, PhotoApiError } from '../../lib/photoApi';
import { CapturedPhoto, PhotoFlowStackParamList } from '../../types/photo';

type Props = NativeStackScreenProps<PhotoFlowStackParamList, 'CameraScan'>;

function formatPhotoError(error: unknown) {
  if (error instanceof PhotoApiError) {
    if (error.reason === 'network_failed') {
      return 'Your phone browser could not upload this photo. Try a smaller photo or retake it.';
    }
    if (error.reason === 'payload_too_large' || error.status === 413) {
      return 'This photo is too large to upload from your phone browser. Try a smaller photo or retake it.';
    }
    if (error.reason === 'unsupported_image_type') {
      return 'This photo format is not supported yet. Try a JPG, PNG, or WebP photo.';
    }
    if (error.reason === 'not_configured') {
      return 'Photo extraction is not configured on the server right now.';
    }
  }
  if (error instanceof Error) return error.message;
  return 'Ingredient detection failed.';
}

export function CameraScanScreen({ navigation }: Props) {
  const camera = useCameraCapture();
  const [processing, setProcessing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  async function handleCaptured(photo: CapturedPhoto | null) {
    if (!photo) return;
    setApiError(null);
    setProcessing(true);
    console.info('[MealMatch][photo] sending captured photo for extraction', {
      mimeType: photo.mimeType,
      width: photo.width,
      height: photo.height,
      fileSize: photo.fileSize ?? null,
      base64Length: photo.base64.length,
    });
    try {
      const { ingredients } = await extractIngredientsFromPhoto(photo.base64, photo.mimeType);
      navigation.navigate('PhotoConfirmIngredients', {
        ingredients,
        photoUri: photo.uri,
      });
    } catch (err) {
      console.error('[MealMatch][photo] extraction failed on Camera Scan', {
        message: err instanceof Error ? err.message : 'Ingredient detection failed.',
      });
      setApiError(formatPhotoError(err));
    } finally {
      setProcessing(false);
    }
  }

  async function handleScan() {
    const photo = await camera.captureFromCamera();
    await handleCaptured(photo);
  }

  async function handlePick() {
    const photo = await camera.pickFromGallery();
    await handleCaptured(photo);
  }

  function handleRetry() {
    setApiError(null);
    camera.reset();
  }

  const combinedError = apiError || camera.error;
  const busy = processing || camera.status === 'capturing';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>STEP 1 / 4</Text>
          <Text style={styles.title}>Camera Scan</Text>
          <Text style={styles.subtitle}>Initial ingredient detection.</Text>
        </View>

        <View style={styles.scanArea}>
          <View style={styles.frame}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
          </View>
          <View style={styles.scanLabelWrap}>
            <Text style={styles.scanLabel}>Scan your ingredients</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable
            onPress={handlePick}
            disabled={busy}
            style={[styles.secondaryBtn, busy && styles.disabled]}
          >
            <Text style={styles.secondaryBtnText}>Pick from gallery</Text>
          </Pressable>
          <Pressable
            onPress={handleScan}
            disabled={busy}
            style={[styles.primaryBtn, busy && styles.disabled]}
          >
            <Text style={styles.primaryBtnText}>Open camera</Text>
          </Pressable>
        </View>

        {busy && (
          <LoadingOverlay
            message={processing ? 'Detecting ingredients...' : 'Opening camera...'}
          />
        )}

        {combinedError && !busy && (
          <View style={styles.errorWrap}>
            <ErrorState message={combinedError} onRetry={handleRetry} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  container: {
    flex: 1,
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
  },
  scanArea: {
    flex: 1,
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    padding: theme.spacing.xl,
    minHeight: 320,
  },
  frame: {
    width: '70%',
    aspectRatio: 1,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: theme.colors.textPrimary,
  },
  cornerTL: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3 },
  scanLabelWrap: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    alignSelf: 'center',
    backgroundColor: theme.colors.textPrimary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.pill,
  },
  scanLabel: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: theme.fontSize.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: theme.colors.textPrimary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: theme.fontSize.md,
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  secondaryBtnText: {
    color: theme.colors.textPrimary,
    fontWeight: '700',
    fontSize: theme.fontSize.md,
  },
  disabled: { opacity: 0.5 },
  errorWrap: { marginTop: theme.spacing.md },
});
