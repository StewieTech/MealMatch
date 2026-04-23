import { RecipeFilter } from '../types/voice';

export type FilterKey = keyof RecipeFilter;

export interface FilterOption {
  key: FilterKey;
  label: string;
}

export const FILTER_OPTIONS: FilterOption[] = [
  { key: 'quickMeal', label: 'Quick meal' },
  { key: 'highProtein', label: 'High protein' },
  { key: 'vegetarian', label: 'Vegetarian' },
];

export const DEFAULT_FILTERS: RecipeFilter = {
  quickMeal: false,
  highProtein: false,
  vegetarian: false,
};

export const MAX_RECORDING_MS = 60_000;
export const MIN_RECORDING_MS = 1_000;
