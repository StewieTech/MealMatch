import React from 'react';
import { render } from '@testing-library/react-native';

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
      const navigation = { navigate: jest.fn(), reset: jest.fn(), goBack: jest.fn() };
      return <Component navigation={navigation} route={{ params: {} }} />;
    },
    Screen: (_props: unknown) => null,
  });
  return { createNativeStackNavigator };
});

jest.mock('expo-image-picker', () => ({
  MediaTypeOptions: { Images: 'Images' },
  launchCameraAsync: jest.fn(() => Promise.resolve({ canceled: true })),
  launchImageLibraryAsync: jest.fn(() => Promise.resolve({ canceled: true })),
  requestCameraPermissionsAsync: jest.fn(() => Promise.resolve({ granted: true })),
  requestMediaLibraryPermissionsAsync: jest.fn(() => Promise.resolve({ granted: true })),
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { PhotoFlowNavigator } = require('../app/navigation/PhotoFlowNavigator');

describe('PhotoFlowNavigator', () => {
  it('renders the Camera Scan screen as the initial route', () => {
    const screen = render(<PhotoFlowNavigator />);
    expect(screen.getByText('Camera Scan')).toBeTruthy();
    expect(screen.getByText('Scan your ingredients')).toBeTruthy();
  });
});
