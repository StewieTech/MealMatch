import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { CombinedRecipeView } from '../../components/recipe/CombinedRecipeView';
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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <CombinedRecipeView recipe={recipe} eyebrow="STEP 4 / 4" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  scrollContainer: {},
});
