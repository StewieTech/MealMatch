import mongoose from 'mongoose';

const RecipeRequestSchema = new mongoose.Schema(
  {
    source: { type: String, required: true },
    rawInput: { type: mongoose.Schema.Types.Mixed, required: true },
    normalizedIngredients: { type: [String], default: [] },
    recipe: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'recipe_requests',
  }
);

export const RecipeRequestModel =
  mongoose.models.RecipeRequest || mongoose.model('RecipeRequest', RecipeRequestSchema);