import { RecipeFilter } from '../types/voice';

export type ToggleFilterKey = 'quickMeal' | 'highProtein' | 'vegetarian' | 'asian' | 'mediterranean';

export interface FilterOption {
  key: ToggleFilterKey;
  label: string;
}

export const FILTER_OPTIONS: FilterOption[] = [
  { key: 'quickMeal', label: 'Quick meal' },
  { key: 'highProtein', label: 'High protein' },
  { key: 'vegetarian', label: 'Vegetarian' },
  { key: 'asian', label: 'Asian' },
  { key: 'mediterranean', label: 'Mediterranean' },
];

export const DEFAULT_FILTERS: RecipeFilter = {
  quickMeal: false,
  highProtein: false,
  vegetarian: false,
  asian: false,
  mediterranean: false,
  customTags: [],
};

export const DEFAULT_CUSTOM_TAGS: string[] = [];
export const MAX_CUSTOM_FILTER_TAGS = 10;
export const MAX_CUSTOM_FILTER_LENGTH = 32;

export const MAX_RECORDING_MS = 60_000;
export const MIN_RECORDING_MS = 1_000;
