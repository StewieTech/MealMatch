import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { theme } from '../constants/theme';
import { CameraScanScreen } from '../screens/photo/CameraScanScreen';
import { PhotoConfirmIngredientsScreen } from '../screens/photo/ConfirmIngredientsScreen';
import { PhotoRecipeResultsScreen } from '../screens/photo/RecipeResultsScreen';
import { VideoRecipeScreen } from '../screens/photo/VideoRecipeScreen';
import { PhotoFlowStackParamList } from '../types/photo';

const Stack = createNativeStackNavigator<PhotoFlowStackParamList>();

export function PhotoFlowNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="CameraScan"
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.background },
        headerTitleStyle: { color: theme.colors.textPrimary, fontWeight: '700' },
        headerTintColor: theme.colors.textPrimary,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen
        name="CameraScan"
        component={CameraScanScreen}
        options={{ title: 'Photo to Recipe' }}
      />
      <Stack.Screen
        name="PhotoConfirmIngredients"
        component={PhotoConfirmIngredientsScreen}
        options={{ title: 'Confirm Ingredients' }}
      />
      <Stack.Screen
        name="PhotoRecipeResults"
        component={PhotoRecipeResultsScreen}
        options={{ title: 'Recipe Results' }}
      />
      <Stack.Screen
        name="VideoRecipe"
        component={VideoRecipeScreen}
        options={{ title: 'Video Recipe' }}
      />
    </Stack.Navigator>
  );
}
