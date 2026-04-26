import React, { ReactNode } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../constants/theme';
import { RecipeFilter } from '../../types/voice';
import { FilterBar } from '../voice/FilterBar';
import { IngredientEditor } from '../voice/IngredientEditor';

interface ConfirmIngredientsViewProps {
  subtitle: string;
  ingredients: string[];
  filters: RecipeFilter;
  onAddIngredient: (ingredient: string) => void;
  onRemoveIngredient: (ingredient: string) => void;
  onFiltersChange: (filters: RecipeFilter) => void;
  onSubmit: () => void;
  submitDisabled: boolean;
  headerSlot?: ReactNode;
}

export function ConfirmIngredientsView({
  subtitle,
  ingredients,
  filters,
  onAddIngredient,
  onRemoveIngredient,
  onFiltersChange,
  onSubmit,
  submitDisabled,
  headerSlot,
}: ConfirmIngredientsViewProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>STEP 2 / 4</Text>
          <Text style={styles.title}>Confirm Ingredients</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        {headerSlot ? <View style={styles.headerSlot}>{headerSlot}</View> : null}

        <IngredientEditor
          ingredients={ingredients}
          onAdd={onAddIngredient}
          onRemove={onRemoveIngredient}
        />

        <FilterBar filters={filters} onChange={onFiltersChange} />

        <Pressable
          onPress={onSubmit}
          disabled={submitDisabled}
          style={[styles.submitButton, submitDisabled && styles.submitButtonDisabled]}
        >
          <Text style={styles.submitText}>Find Recipes</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    padding: theme.spacing.xl,
    gap: theme.spacing.lg,
  },
  header: {
    gap: theme.spacing.xs,
  },
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
  headerSlot: {
    marginTop: -theme.spacing.sm,
  },
  submitButton: {
    marginTop: theme.spacing.sm,
    backgroundColor: theme.colors.accent,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: theme.colors.borderStrong,
  },
  submitText: {
    color: '#ffffff',
    fontSize: theme.fontSize.md,
    fontWeight: '700',
  },
});
