import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { theme } from '../../constants/theme';
import { searchRecipeVideo } from '../../lib/photoApi';
import { VideoSearchResponse } from '../../types/photo';
import { RecipeDetail } from '../../types/voice';
import { RecipeMetaRow } from '../voice/RecipeMetaRow';
import { StepList } from '../voice/StepList';

interface Props {
  recipe: RecipeDetail;
  eyebrow: string;
}

function WebVideoEmbed({ embedUrl }: { embedUrl: string }) {
  const Iframe = 'iframe' as any;
  return (
    <View style={styles.videoBox}>
      <Iframe
        src={embedUrl}
        title="Recipe short"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{
          border: 0,
          width: '100%',
          height: '100%',
          borderRadius: theme.radius.md,
        }}
      />
    </View>
  );
}

function NativeVideoEmbed({
  video,
  onOpen,
}: {
  video: VideoSearchResponse;
  onOpen: () => void;
}) {
  return (
    <Pressable onPress={onOpen} style={styles.videoBox}>
      {video.thumbnailUrl ? (
        <Image source={{ uri: video.thumbnailUrl }} style={styles.thumbnail} resizeMode="cover" />
      ) : (
        <View style={[styles.thumbnail, styles.thumbnailFallback]} />
      )}
      <View style={styles.playOverlay}>
        <Text style={styles.playIcon}>▶</Text>
      </View>
    </Pressable>
  );
}

export function CombinedRecipeView({ recipe, eyebrow }: Props) {
  const [video, setVideo] = useState<VideoSearchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    searchRecipeVideo(recipe.title)
      .then((v) => {
        if (!cancelled) setVideo(v);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Could not load video.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [recipe.title]);

  const steps = recipe.steps;
  const totalSteps = steps.length;
  const currentStep = steps[stepIndex];
  const progress = totalSteps > 0 ? ((stepIndex + 1) / totalSteps) * 100 : 0;

  function handlePrev() {
    setStepIndex((i) => Math.max(0, i - 1));
  }

  function handleNext() {
    setStepIndex((i) => Math.min(totalSteps - 1, i + 1));
  }

  function handleOpenExternal() {
    if (video?.videoId) {
      void Linking.openURL(`https://www.youtube.com/watch?v=${video.videoId}`);
    }
  }

  const nextSteps = steps.slice(stepIndex + 1, stepIndex + 4);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.title}>{recipe.title}</Text>
        <RecipeMetaRow
          timeMinutes={recipe.timeMinutes}
          difficulty={recipe.difficulty}
          cuisine={recipe.cuisine}
          servings={recipe.servings}
        />
      </View>

      <View style={styles.videoWrap}>
        {loading && (
          <View style={styles.videoPlaceholder}>
            <ActivityIndicator color={theme.colors.textPrimary} />
            <Text style={styles.placeholderText}>Finding a short…</Text>
          </View>
        )}
        {!loading && error && (
          <View style={styles.videoPlaceholder}>
            <Text style={styles.placeholderText}>{error}</Text>
          </View>
        )}
        {!loading && !error && video && Platform.OS === 'web' && <WebVideoEmbed embedUrl={video.embedUrl} />}
        {!loading && !error && video && Platform.OS !== 'web' && (
          <NativeVideoEmbed video={video} onOpen={handleOpenExternal} />
        )}
        {!loading && !error && !video && (
          <View style={styles.videoPlaceholder}>
            <Text style={styles.placeholderText}>No matching short found.</Text>
          </View>
        )}
        {video && (
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>
              Step {totalSteps === 0 ? 0 : stepIndex + 1} of {totalSteps}
            </Text>
          </View>
        )}
      </View>

      {currentStep && (
        <View style={styles.currentStepWrap}>
          <Text style={styles.currentStepTitle}>{currentStep.instruction}</Text>
        </View>
      )}

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <View style={styles.controls}>
        <Pressable
          onPress={handlePrev}
          disabled={stepIndex === 0}
          style={[styles.controlBtn, stepIndex === 0 && styles.disabled]}
        >
          <Text style={styles.controlIcon}>⏮</Text>
        </Pressable>
        <Pressable onPress={handleOpenExternal} style={[styles.controlBtn, styles.controlBtnPrimary]}>
          <Text style={[styles.controlIcon, styles.controlIconPrimary]}>▶</Text>
        </Pressable>
        <Pressable
          onPress={handleNext}
          disabled={stepIndex >= totalSteps - 1}
          style={[styles.controlBtn, stepIndex >= totalSteps - 1 && styles.disabled]}
        >
          <Text style={styles.controlIcon}>⏭</Text>
        </Pressable>
      </View>

      {nextSteps.length > 0 && (
        <View style={styles.nextSteps}>
          <Text style={styles.nextStepsHeading}>Next steps:</Text>
          {nextSteps.map((s) => (
            <Text key={s.number} style={styles.nextStep}>
              {s.number}. {s.instruction}
            </Text>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionHeading}>INGREDIENTS</Text>
        <View style={styles.ingredientList}>
          {recipe.ingredients.map((item, index) => (
            <Text key={`${item}-${index}`} style={styles.ingredient}>
              {'\u2022'} {item}
            </Text>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeading}>INSTRUCTIONS</Text>
        <StepList steps={recipe.steps} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.xl,
    gap: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  header: { gap: theme.spacing.sm },
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
  videoWrap: {
    position: 'relative',
    width: '100%',
  },
  videoBox: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000000',
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoPlaceholder: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  placeholderText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
  },
  thumbnail: { width: '100%', height: '100%' },
  thumbnailFallback: { backgroundColor: theme.colors.surfaceMuted },
  playOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  playIcon: {
    fontSize: 28,
    color: theme.colors.textPrimary,
    paddingLeft: 4,
  },
  stepBadge: {
    position: 'absolute',
    top: theme.spacing.sm,
    left: theme.spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.pill,
  },
  stepBadgeText: {
    color: '#ffffff',
    fontSize: theme.fontSize.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  currentStepWrap: { gap: theme.spacing.xs },
  currentStepTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.lg,
    fontWeight: '700',
    lineHeight: 24,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.border,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.textPrimary,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.lg,
    marginTop: theme.spacing.sm,
  },
  controlBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  controlBtnPrimary: {
    backgroundColor: theme.colors.textPrimary,
    borderColor: theme.colors.textPrimary,
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  controlIcon: {
    fontSize: 22,
    color: theme.colors.textPrimary,
  },
  controlIconPrimary: {
    color: '#ffffff',
    fontSize: 24,
  },
  disabled: { opacity: 0.35 },
  nextSteps: {
    gap: theme.spacing.xs,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  nextStepsHeading: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    fontWeight: '700',
  },
  nextStep: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    lineHeight: 20,
  },
  section: {
    gap: theme.spacing.md,
  },
  sectionHeading: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.xs,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  ingredientList: {
    gap: theme.spacing.xs,
  },
  ingredient: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.md,
    lineHeight: 22,
  },
});
