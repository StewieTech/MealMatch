import { Router } from 'express';
import { getHealth } from '../controllers/health.controller';
import {
  createRecipeFromImage,
  createRecipeFromText,
  createRecipeFromVoice,
} from '../controllers/recipe.controller';
import { presignUpload } from '../controllers/upload.controller';
import {
  generateRecipesFromIngredients,
  transcribeVoice,
} from '../controllers/voice.controller';

const router = Router();

router.get('/health', getHealth);
router.post('/recipes/from-text', createRecipeFromText);
router.post('/recipes/from-image', createRecipeFromImage);
router.post('/recipes/from-voice', createRecipeFromVoice);
router.post('/recipes/generate', generateRecipesFromIngredients);
router.post('/voice/transcribe', transcribeVoice);
router.post('/uploads/presign', presignUpload);

export default router;