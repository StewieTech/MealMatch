export type IngredientConfidence = 'high' | 'medium' | 'low';

export interface IngredientCandidate {
  raw: string;
  normalized: string;
  confidence: IngredientConfidence;
}

export interface RecipeFilter {
  quickMeal?: boolean;
  highProtein?: boolean;
  vegetarian?: boolean;
}

export interface NormalizedRecipeFilter {
  quickMeal: boolean;
  highProtein: boolean;
  vegetarian: boolean;
}

export type RecipeDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface RecipeStep {
  number: number;
  instruction: string;
}

export interface RecipeSummary {
  id: string;
  title: string;
  matchPercent: number;
  timeMinutes: number;
  difficulty: RecipeDifficulty;
  cuisine: string;
  servings: number;
  missingIngredients: number;
}

export interface RecipeDetail extends RecipeSummary {
  ingredients: string[];
  steps: RecipeStep[];
}

export interface TranscriptionResponse {
  transcript: string;
  ingredients: IngredientCandidate[];
}

export interface GenerateRecipesRequest {
  ingredients: string[];
  filters: RecipeFilter;
}

export interface GenerateRecipesResponse {
  count: number;
  recipes: RecipeDetail[];
}

export type VoiceCaptureStatus =
  | 'idle'
  | 'recording'
  | 'uploading'
  | 'done'
  | 'error';

export interface VoiceCaptureState {
  status: VoiceCaptureStatus;
  recordingUri: string | null;
  durationMs: number;
  error: string | null;
}

export interface APIError {
  error: string;
  details?: string;
  statusCode?: number;
}

export interface VoiceRecipeRequestSignature {
  cacheKey: string;
  ingredients: string[];
  filters: NormalizedRecipeFilter;
}

export interface VoiceResultsCacheStore {
  get: (signature: VoiceRecipeRequestSignature) => RecipeDetail[] | undefined;
  set: (signature: VoiceRecipeRequestSignature, recipes: RecipeDetail[]) => void;
  clear: () => void;
}

export type VoiceFlowStackParamList = {
  VoiceInput: undefined;
  ConfirmIngredients: {
    ingredients: IngredientCandidate[];
    transcript?: string;
    recordingUri?: string;
  };
  RecipeResults: {
    ingredients: string[];
    filters: RecipeFilter;
  };
  RecipeDetail: {
    recipe: RecipeDetail;
  };
};
