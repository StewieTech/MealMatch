import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { VoiceFlowNavigator } from './app/navigation/VoiceFlowNavigator';
import { HomeScreen } from './app/screens/HomeScreen';

export type RootStackParamList = {
  Home: undefined;
  VoiceFlow: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['mealmatch://', 'http://localhost:8082', 'https://localhost:8082'],
  config: {
    screens: {
      Home: '',
      VoiceFlow: {
        path: 'voice',
        screens: {
          VoiceInput: '',
          ConfirmIngredients: 'confirm',
          RecipeResults: 'results',
          RecipeDetail: 'recipe',
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
          <RootStack.Screen name="Home" component={HomeScreen} />
          <RootStack.Screen name="VoiceFlow" component={VoiceFlowNavigator} />
        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}