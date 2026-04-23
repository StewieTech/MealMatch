import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { theme } from '../constants/theme';
import { VoiceResultsCacheProvider } from '../providers/VoiceResultsCacheProvider';
import { ConfirmIngredientsScreen } from '../screens/voice/ConfirmIngredientsScreen';
import { RecipeDetailScreen } from '../screens/voice/RecipeDetailScreen';
import { RecipeResultsScreen } from '../screens/voice/RecipeResultsScreen';
import { VoiceInputScreen } from '../screens/voice/VoiceInputScreen';
import { VoiceFlowStackParamList } from '../types/voice';

const Stack = createNativeStackNavigator<VoiceFlowStackParamList>();

export function VoiceFlowNavigator() {
  return (
    <VoiceResultsCacheProvider>
      <Stack.Navigator
        initialRouteName="VoiceInput"
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.background },
          headerTitleStyle: { color: theme.colors.textPrimary, fontWeight: '700' },
          headerTintColor: theme.colors.textPrimary,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Screen
          name="VoiceInput"
          component={VoiceInputScreen}
          options={{ title: 'Voice to Recipe' }}
        />
        <Stack.Screen
          name="ConfirmIngredients"
          component={ConfirmIngredientsScreen}
          options={{ title: 'Confirm Ingredients' }}
        />
        <Stack.Screen
          name="RecipeResults"
          component={RecipeResultsScreen}
          options={{ title: 'Recipe Results' }}
        />
        <Stack.Screen
          name="RecipeDetail"
          component={RecipeDetailScreen}
          options={{ title: 'Recipe' }}
        />
      </Stack.Navigator>
    </VoiceResultsCacheProvider>
  );
}
