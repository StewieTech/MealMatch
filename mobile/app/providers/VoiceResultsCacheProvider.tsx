import React, { createContext, useContext, useRef } from 'react';
import {
  RecipeDetail,
  RecipeFilter,
  VoiceRecipeRequestSignature,
  VoiceResultsCacheStore,
} from '../types/voice';

function normalizeIngredient(value: string) {
  return value.trim().toLowerCase();
}

export function normalizeVoiceIngredients(ingredients: string[]) {
  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const ingredient of ingredients) {
    const item = normalizeIngredient(ingredient);
    if (!item || seen.has(item)) continue;
    seen.add(item);
    normalized.push(item);
  }

  return normalized;
}

export function normalizeVoiceFilters(filters: RecipeFilter = {}) {
  return {
    quickMeal: Boolean(filters.quickMeal),
    highProtein: Boolean(filters.highProtein),
    vegetarian: Boolean(filters.vegetarian),
  };
}

export function buildVoiceRecipeRequestSignature(
  ingredients: string[],
  filters: RecipeFilter = {}
): VoiceRecipeRequestSignature {
  const normalizedIngredients = normalizeVoiceIngredients(ingredients);
  const normalizedFilters = normalizeVoiceFilters(filters);
  const cacheKey = JSON.stringify({
    ingredients: normalizedIngredients,
    filters: normalizedFilters,
  });

  return {
    cacheKey,
    ingredients: normalizedIngredients,
    filters: normalizedFilters,
  };
}

export async function getRecipesFromCacheOrFetch(
  cache: Map<string, RecipeDetail[]>,
  signature: VoiceRecipeRequestSignature,
  fetcher: () => Promise<RecipeDetail[]>,
  forceRefresh = false
) {
  if (!forceRefresh) {
    const cached = cache.get(signature.cacheKey);
    if (cached) return { recipes: cached, fromCache: true };
  }

  const recipes = await fetcher();
  cache.set(signature.cacheKey, recipes);
  return { recipes, fromCache: false };
}

const VoiceResultsCacheContext = createContext<VoiceResultsCacheStore | null>(null);

export function VoiceResultsCacheProvider({ children }: { children: React.ReactNode }) {
  const cacheRef = useRef<Map<string, RecipeDetail[]>>(new Map());

  const store: VoiceResultsCacheStore = {
    get(signature) {
      return cacheRef.current.get(signature.cacheKey);
    },
    set(signature, recipes) {
      cacheRef.current.set(signature.cacheKey, recipes);
    },
    clear() {
      cacheRef.current.clear();
    },
  };

  return (
    <VoiceResultsCacheContext.Provider value={store}>
      {children}
    </VoiceResultsCacheContext.Provider>
  );
}

export function useVoiceResultsCache() {
  const context = useContext(VoiceResultsCacheContext);
  if (!context) {
    throw new Error('useVoiceResultsCache must be used within VoiceResultsCacheProvider');
  }
  return context;
}

