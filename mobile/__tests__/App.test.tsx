import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('App', () => {
  it('renders the MealMatch heading', () => {
    const screen = render(<App />);
    expect(screen.getByText('MealMatch')).toBeTruthy();
  });
});