import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { theme } from '../../constants/theme';
import { IngredientChip } from './IngredientChip';

interface Props {
  ingredients: string[];
  onAdd: (ingredient: string) => void;
  onRemove: (ingredient: string) => void;
}

export function IngredientEditor({ ingredients, onAdd, onRemove }: Props) {
  const [draft, setDraft] = useState('');

  function handleSubmit() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setDraft('');
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>
          YOUR INGREDIENTS <Text style={styles.count}>({ingredients.length})</Text>
        </Text>
      </View>

      <View style={styles.chips}>
        {ingredients.map((ingredient) => (
          <IngredientChip
            key={ingredient}
            label={ingredient}
            onRemove={() => onRemove(ingredient)}
          />
        ))}
        {ingredients.length === 0 && (
          <Text style={styles.empty}>No ingredients yet. Add one below.</Text>
        )}
      </View>

      <View style={styles.addRow}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={handleSubmit}
          returnKeyType="done"
          placeholder="Add an ingredient"
          placeholderTextColor={theme.colors.textMuted}
          style={styles.input}
        />
        <Pressable onPress={handleSubmit} style={styles.addButton} disabled={!draft.trim()}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.xs,
    fontWeight: '700',
    letterSpacing: 1,
  },
  count: {
    color: theme.colors.textMuted,
    fontWeight: '500',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  empty: {
    color: theme.colors.textMuted,
    fontStyle: 'italic',
    fontSize: theme.fontSize.sm,
  },
  addRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.fontSize.sm,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.surface,
  },
  addButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.textPrimary,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: theme.fontSize.sm,
  },
});
