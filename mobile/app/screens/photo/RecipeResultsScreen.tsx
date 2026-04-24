import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { EmptyState } from '../../components/voice/EmptyState';
import { ErrorState } from '../../components/voice/ErrorState';
import { LoadingOverlay } from '../../components/voice/LoadingOverlay';
import { RecipeCard } from '../../components/voice/RecipeCard';
import { theme } from '../../constants/theme';
import { generateRecipes } from '../../lib/voiceApi';
import { PhotoFlowStackParamList } from '../../types/photo';
import { RecipeDetail } from '../../types/voice';

type Props = NativeStackScreenProps<PhotoFlowStackParamList, 'PhotoRecipeResults'>;

export function PhotoRecipeResultsScreen({ navigation, route }: Props) {
  const params = route.params;
  const hasParams = Boolean(
    params && Array.isArray(params.ingredients) && params.ingredients.length > 0
  );

  useEffect(() => {
    if (!hasParams) {
      navigation.reset({ index: 0, routes: [{ name: 'CameraScan' }] });
    }
  }, [hasParams, navigation]);

  const ingredients = hasParams ? params.ingredients : [];
  const filters = hasParams ? params.filters : {};
  const [recipes, setRecipes] = useState<RecipeDetail[]>([]);
  const [loading, setLoading] = useState(Boolean(hasParams));
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!hasParams) return;
    setLoading(true);
    setError(null);
    try {
      const response = await generateRecipes(ingredients, filters);
      setRecipes(response.recipes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate recipes.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasParams, ingredients.join('|')]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>STEP 3 / 4</Text>
          <Text style={styles.title}>Recipe Results</Text>
          {!loading && !error && (
            <Text style={styles.subtitle}>
              Found {recipes.length} recipe{recipes.length === 1 ? '' : 's'}
            </Text>
          )}
        </View>

        {loading && <LoadingOverlay message="Finding recipes..." />}
        {!loading && error && <ErrorState message={error} onRetry={() => void load()} />}
        {!loading && !error && recipes.length === 0 && (
          <EmptyState
            title="No recipes match"
            message="Try removing a filter or adding more ingredients."
          />
        )}
        {!loading && !error && recipes.length > 0 && (
          <View style={styles.list}>
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onPress={() => navigation.navigate('VideoRecipe', { recipe })}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  container: {
    padding: theme.spacing.xl,
    gap: theme.spacing.lg,
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
  list: { gap: theme.spacing.md },
});
