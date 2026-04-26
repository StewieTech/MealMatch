import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { RootStackParamList } from '../../App';
import { theme } from '../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Multi'>;

export function MultiScreen({ navigation }: Props) {
  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      style={styles.container}
    >
      <View style={styles.contentColumn}>
        <Text style={styles.heading}>MealMatch</Text>

        <View
          style={styles.stepper}
          accessibilityRole="text"
          accessibilityLabel="Ingredients to recipe to video"
        >
          <View style={styles.stepPill}>
            <Ionicons name="leaf" size={14} color={theme.colors.accent} />
            <Text style={styles.stepLabel}>Ingredients</Text>
          </View>
          <Ionicons name="chevron-forward" size={14} color={theme.colors.accent} />
          <View style={styles.stepPill}>
            <Ionicons name="restaurant" size={14} color={theme.colors.accent} />
            <Text style={styles.stepLabel}>Recipe</Text>
          </View>
          <Ionicons name="chevron-forward" size={14} color={theme.colors.accent} />
          <View style={styles.stepPill}>
            <Ionicons name="play-circle" size={14} color={theme.colors.accent} />
            <Text style={styles.stepLabel}>Video</Text>
          </View>
        </View>

        <Text style={styles.prompt}>Add your ingredients</Text>

        <View style={styles.stack}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Use a photo of your ingredients to get a recipe and video"
            style={({ pressed }) => [
              styles.buttonRow,
              pressed && styles.buttonRowPressed,
            ]}
            onPress={() => navigation.navigate('PhotoFlow')}
          >
            <View style={styles.blackCircle}>
              <Ionicons name="camera" size={30} color="#fff" />
            </View>
            <View style={styles.buttonText}>
              <Text style={styles.buttonLabel}>Photo</Text>
              <Text style={styles.buttonHint}>Snap fridge</Text>
            </View>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Use voice to list your ingredients and get a recipe and video"
            style={({ pressed }) => [
              styles.buttonRow,
              pressed && styles.buttonRowPressed,
            ]}
            onPress={() => navigation.navigate('VoiceFlow')}
          >
            <View style={styles.blackCircle}>
              <Ionicons name="mic" size={30} color="#fff" />
            </View>
            <View style={styles.buttonText}>
              <Text style={styles.buttonLabel}>Voice</Text>
              <Text style={styles.buttonHint}>Say it</Text>
            </View>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Type your ingredients to get a recipe and video"
            style={({ pressed }) => [
              styles.buttonRow,
              pressed && styles.buttonRowPressed,
            ]}
            onPress={() =>
              navigation.navigate('VoiceFlow', {
                screen: 'ConfirmIngredients',
                params: { ingredients: [] },
              })
            }
          >
            <View style={styles.blackCircle}>
              <Ionicons name="create" size={30} color="#fff" />
            </View>
            <View style={styles.buttonText}>
              <Text style={styles.buttonLabel}>Type</Text>
              <Text style={styles.buttonHint}>Quick list</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  contentColumn: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
  },
  heading: {
    fontSize: theme.fontSize.xxl,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  stepPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  stepLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  prompt: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xxl,
  },
  stack: {
    width: '100%',
    gap: theme.spacing.lg,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
  },
  buttonRowPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.85,
  },
  blackCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  buttonText: {
    flex: 1,
  },
  buttonLabel: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  buttonHint: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
  },
});
