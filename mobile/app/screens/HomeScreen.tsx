import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { RootStackParamList } from '../../App';
import { Mode, ModeTabs } from '../components/ModeTabs';
import { fetchRecipeFromText } from '../lib/api';
import { RecipeResponse } from '../types/recipe';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const [mode, setMode] = useState<Mode>('text');
  const [ingredientsText, setIngredientsText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RecipeResponse | null>(null);

  async function handleGenerate() {
    if (!ingredientsText.trim()) {
      Alert.alert('Add ingredients', 'Type at least one ingredient to generate a recipe.');
      return;
    }

    setLoading(true);
    try {
      const data = await fetchRecipeFromText(ingredientsText);
      setResult(data);
    } catch (error) {
      Alert.alert('Recipe failed', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  function handleStartVoiceFlow() {
    navigation.navigate('VoiceFlow');
  }

  function handleStartPhotoFlow() {
    navigation.navigate('PhotoFlow');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.eyebrow}>MealMatch</Text>
        <Text style={styles.title}>Find dinner from what is already in your fridge.</Text>
        <Text style={styles.subtitle}>
          Start with text today. Photo uploads and voice capture are scaffolded for the next build.
        </Text>

        <ModeTabs mode={mode} onChange={setMode} />

        {mode === 'text' && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Type your ingredients</Text>
            <TextInput
              multiline
              value={ingredientsText}
              onChangeText={setIngredientsText}
              placeholder="eggs, tomatoes, basil, feta"
              style={styles.input}
            />
            <Pressable onPress={handleGenerate} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Generate recipe</Text>
            </Pressable>
          </View>
        )}

        {mode === 'photo' && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Photo mode</Text>
            <Text style={styles.paragraph}>
              Scan your fridge or counter and we&apos;ll detect ingredients and suggest a video recipe.
            </Text>
            <Pressable onPress={handleStartPhotoFlow} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Start photo flow</Text>
            </Pressable>
          </View>
        )}

        {mode === 'voice' && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Voice mode</Text>
            <Text style={styles.paragraph}>
              Speak what is in your fridge. We&apos;ll transcribe, confirm ingredients, and suggest recipes.
            </Text>
            <Pressable onPress={handleStartVoiceFlow} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Start voice flow</Text>
            </Pressable>
          </View>
        )}

        {loading && <ActivityIndicator size="large" color="#ea580c" style={styles.loader} />}

        {result?.recipe && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>{result.recipe.title}</Text>
            <Text style={styles.meta}>{result.recipe.timeMinutes} min · serves {result.recipe.servings}</Text>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            {result.recipe.ingredients.map((item) => (
              <Text key={item} style={styles.bullet}>- {item}</Text>
            ))}
            <Text style={styles.sectionTitle}>Steps</Text>
            {result.recipe.steps.map((step) => (
              <Text key={step} style={styles.bullet}>- {step}</Text>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff7ed',
  },
  container: {
    padding: 20,
    gap: 16,
  },
  eyebrow: {
    color: '#c2410c',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 12,
  },
  title: {
    color: '#7c2d12',
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
  },
  subtitle: {
    color: '#9a3412',
    fontSize: 16,
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 18,
    gap: 12,
  },
  resultCard: {
    backgroundColor: '#ffedd5',
    borderRadius: 24,
    padding: 18,
    gap: 8,
  },
  sectionTitle: {
    color: '#7c2d12',
    fontSize: 18,
    fontWeight: '700',
  },
  paragraph: {
    color: '#7c2d12',
    lineHeight: 20,
  },
  input: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#fdba74',
    borderRadius: 16,
    padding: 14,
    textAlignVertical: 'top',
    color: '#431407',
  },
  primaryButton: {
    backgroundColor: '#ea580c',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '800',
  },
  secondaryButton: {
    backgroundColor: '#fed7aa',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#9a3412',
    fontWeight: '700',
  },
  loader: {
    marginVertical: 12,
  },
  resultTitle: {
    color: '#7c2d12',
    fontSize: 22,
    fontWeight: '800',
  },
  meta: {
    color: '#9a3412',
    marginBottom: 8,
  },
  bullet: {
    color: '#431407',
    lineHeight: 22,
  },
});