import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../../constants/theme';
import { RecipeDifficulty } from '../../types/voice';

interface Props {
  timeMinutes: number;
  difficulty: RecipeDifficulty;
  cuisine: string;
  servings?: number;
}

export function RecipeMetaRow({ timeMinutes, difficulty, cuisine, servings }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.item}>{timeMinutes} min</Text>
      <Text style={styles.separator}>·</Text>
      <Text style={styles.item}>{difficulty}</Text>
      <Text style={styles.separator}>·</Text>
      <Text style={styles.item}>{cuisine}</Text>
      {typeof servings === 'number' && (
        <>
          <Text style={styles.separator}>·</Text>
          <Text style={styles.item}>{servings} servings</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  item: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
  },
  separator: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
  },
});
