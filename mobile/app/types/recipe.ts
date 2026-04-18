export type RecipeResponse = {
  source: 'text' | 'image' | 'voice';
  ingredients?: string[];
  recipe?: {
    title: string;
    servings: number;
    timeMinutes: number;
    ingredients: string[];
    steps: string[];
  };
  message?: string;
};