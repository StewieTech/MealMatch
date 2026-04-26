import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigatorScreenParams } from '@react-navigation/native';
import { PhotoFlowNavigator } from './app/navigation/PhotoFlowNavigator';
import { VoiceFlowNavigator } from './app/navigation/VoiceFlowNavigator';
import { MultiScreen } from './app/screens/MultiScreen';
import type { PhotoFlowStackParamList } from './app/types/photo';
import type { VoiceFlowStackParamList } from './app/types/voice';

export type RootStackParamList = {
  Multi: undefined;
  VoiceFlow: NavigatorScreenParams<VoiceFlowStackParamList> | undefined;
  PhotoFlow: NavigatorScreenParams<PhotoFlowStackParamList> | undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['mealmatch://', 'http://localhost:8082', 'https://localhost:8082'],
  config: {
    screens: {
      Multi: '',
      VoiceFlow: {
        path: 'voice',
        screens: {
          VoiceInput: '',
          ConfirmIngredients: 'confirm',
          RecipeResults: 'results',
          RecipeDetail: 'recipe',
        },
      },
      PhotoFlow: {
        path: 'photo',
        screens: {
          CameraScan: '',
          PhotoConfirmIngredients: 'confirm',
          PhotoRecipeResults: 'results',
          VideoRecipe: 'video',
        },
      },
    },
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer linking={linking}>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="Multi" component={MultiScreen} />
          <RootStack.Screen name="VoiceFlow" component={VoiceFlowNavigator} />
          <RootStack.Screen name="PhotoFlow" component={PhotoFlowNavigator} />
        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}