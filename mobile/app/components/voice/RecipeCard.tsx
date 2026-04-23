import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../constants/theme';
import { RecipeSummary } from '../../types/voice';
import { MatchBadge } from './MatchBadge';
import { RecipeMetaRow } from './RecipeMetaRow';

interface Props {
  recipe: RecipeSummary;
  onPress: () => void;
}

export function RecipeCard({ recipe, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title} numberOfLines={1}>
          {recipe.title}
        </Text>
        <MatchBadge percent={recipe.matchPercent} />
      </View>
      <RecipeMetaRow
        timeMinutes={recipe.timeMinutes}
        difficulty={recipe.difficulty}
        cuisine={recipe.cuisine}
      />
      {recipe.missingIngredients > 0 && (
        <Text style={styles.missing}>
          +{recipe.missingIngredients} additional ingredient
          {recipe.missingIngredients === 1 ? '' : 's'} needed
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  title: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.lg,
    fontWeight: '700',
  },
  missing: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.xs,
    fontStyle: 'italic',
  },
});
