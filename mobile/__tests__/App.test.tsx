import React from 'react';
import { render } from '@testing-library/react-native';

jest.mock('react-native-safe-area-context', () => {
  const Actual = jest.requireActual('react-native-safe-area-context');
  return {
    ...Actual,
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@react-navigation/native-stack', () => {
  const React = require('react');
  const createNativeStackNavigator = () => ({
    Navigator: ({ children }: { children: React.ReactNode }) => {
      const screens = React.Children.toArray(children) as React.ReactElement<{
        name: string;
        component: React.ComponentType<any>;
      }>[];
      const first = screens[0];
      if (!first) return null;
      const Component = first.props.component;
      const navigation = { navigate: jest.fn(), goBack: jest.fn() };
      return <Component navigation={navigation} route={{ params: {} }} />;
    },
    Screen: (_props: unknown) => null,
  });
  return { createNativeStackNavigator };
});

jest.mock('expo-av', () => ({
  Audio: {
    Recording: class {
      prepareToRecordAsync = jest.fn();
      startAsync = jest.fn();
      stopAndUnloadAsync = jest.fn();
      getURI = jest.fn(() => null);
    },
    RecordingOptionsPresets: { HIGH_QUALITY: {} },
    requestPermissionsAsync: jest.fn(() => Promise.resolve({ granted: true })),
    setAudioModeAsync: jest.fn(),
  },
}));

jest.mock('expo-file-system/legacy', () => ({
  readAsStringAsync: jest.fn(() => Promise.resolve('')),
  EncodingType: { Base64: 'base64' },
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const App = require('../App').default;

describe('App', () => {
  it('renders the MealMatch heading', () => {
    const screen = render(<App />);
    expect(screen.getByText('MealMatch')).toBeTruthy();
  });
});