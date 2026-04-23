import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { RecipeMetaRow } from '../../components/voice/RecipeMetaRow';
import { StepList } from '../../components/voice/StepList';
import { theme } from '../../constants/theme';
import { VoiceFlowStackParamList } from '../../types/voice';

type Props = NativeStackScreenProps<VoiceFlowStackParamList, 'RecipeDetail'>;

export function RecipeDetailScreen({ navigation, route }: Props) {
  const recipe = route.params?.recipe;
  const hasParams = Boolean(recipe);

  useEffect(() => {
    if (!hasParams) {
      navigation.reset({ index: 0, routes: [{ name: 'VoiceInput' }] });
    }
  }, [hasParams, navigation]);

  if (!recipe) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>STEP 4 / 4</Text>
          <Text style={styles.title}>{recipe.title}</Text>
          <RecipeMetaRow
            timeMinutes={recipe.timeMinutes}
            difficulty={recipe.difficulty}
            cuisine={recipe.cuisine}
            servings={recipe.servings}
          />
        </View>

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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  container: {
    padding: theme.spacing.xl,
    gap: theme.spacing.xl,
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
