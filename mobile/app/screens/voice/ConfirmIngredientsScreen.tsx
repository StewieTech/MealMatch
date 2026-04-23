import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { FilterBar } from '../../components/voice/FilterBar';
import { IngredientEditor } from '../../components/voice/IngredientEditor';
import { RecordingPlayer } from '../../components/voice/RecordingPlayer';
import { DEFAULT_FILTERS } from '../../constants/filters';
import { theme } from '../../constants/theme';
import { buildVoiceRecipeRequestSignature } from '../../providers/VoiceResultsCacheProvider';
import { RecipeFilter, VoiceFlowStackParamList } from '../../types/voice';

type Props = NativeStackScreenProps<VoiceFlowStackParamList, 'ConfirmIngredients'>;

function dedupe(items: string[]): string[] {
  return [...new Set(items.map((i) => i.trim().toLowerCase()).filter(Boolean))];
}

export function ConfirmIngredientsScreen({ navigation, route }: Props) {
  const params = route.params;
  const hasParams = Boolean(params && Array.isArray(params.ingredients));

  useEffect(() => {
    if (!hasParams) {
      navigation.reset({ index: 0, routes: [{ name: 'VoiceInput' }] });
    }
  }, [hasParams, navigation]);

  const initial = useMemo(
    () =>
      hasParams
        ? dedupe((params.ingredients || []).map((c) => c.normalized || c.raw))
        : [],
    [hasParams, params]
  );
  const [ingredients, setIngredients] = useState<string[]>(initial);
  const [filters, setFilters] = useState<RecipeFilter>(DEFAULT_FILTERS);

  if (!hasParams) return null;
  const recordingUri = params.recordingUri;

  function handleRemove(ingredient: string) {
    setIngredients((prev) => prev.filter((i) => i !== ingredient));
  }

  function handleAdd(ingredient: string) {
    const normalized = ingredient.trim().toLowerCase();
    if (!normalized) return;
    setIngredients((prev) => (prev.includes(normalized) ? prev : [...prev, normalized]));
  }

  function handleSubmit() {
    if (ingredients.length === 0) return;
    const request = buildVoiceRecipeRequestSignature(ingredients, filters);
    navigation.navigate('RecipeResults', {
      ingredients: request.ingredients,
      filters: request.filters,
    });
  }

  const submitDisabled = ingredients.length === 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>STEP 2 / 4</Text>
          <Text style={styles.title}>Confirm Ingredients</Text>
          <Text style={styles.subtitle}>
            {params.ingredients.length > 0
              ? `Recognized ${params.ingredients.length} ingredient${
                  params.ingredients.length === 1 ? '' : 's'
                }. Edit as needed.`
              : 'No ingredients were recognized from your recording. Add them manually below.'}
          </Text>
        </View>

        {recordingUri && <RecordingPlayer uri={recordingUri} />}

        <View style={styles.card}>
          <IngredientEditor
            ingredients={ingredients}
            onAdd={handleAdd}
            onRemove={handleRemove}
          />
        </View>

        <View style={styles.card}>
          <FilterBar filters={filters} onChange={setFilters} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          onPress={handleSubmit}
          disabled={submitDisabled}
          style={[styles.cta, submitDisabled && styles.ctaDisabled]}
        >
          <Text style={styles.ctaText}>Find Recipes</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  container: {
    padding: theme.spacing.xl,
    gap: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl * 2,
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
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  footer: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  cta: {
    backgroundColor: theme.colors.textPrimary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: 'center',
  },
  ctaDisabled: {
    backgroundColor: theme.colors.borderStrong,
  },
  ctaText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: theme.fontSize.md,
  },
});
