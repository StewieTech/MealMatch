import {
  IngredientCandidate,
  RecipeDetail,
  RecipeFilter,
} from './voice';

export interface PhotoExtractResponse {
  ingredients: IngredientCandidate[];
}

export interface VideoSearchResponse {
  videoId: string;
  title: string;
  channel: string;
  thumbnailUrl: string;
  embedUrl: string;
}

export interface CapturedPhoto {
  base64: string;
  mimeType: string;
  uri: string;
  width: number;
  height: number;
  fileSize?: number;
}

export type PhotoFlowStackParamList = {
  CameraScan: undefined;
  PhotoConfirmIngredients: {
    ingredients: IngredientCandidate[];
    photoUri?: string;
  };
  PhotoRecipeResults: {
    ingredients: string[];
    filters: RecipeFilter;
  };
  VideoRecipe: {
    recipe: RecipeDetail;
  };
};
