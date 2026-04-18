import { Router } from 'express';
import { getHealth } from '../controllers/health.controller';
import {
  createRecipeFromImage,
  createRecipeFromText,
  createRecipeFromVoice,
} from '../controllers/recipe.controller';
import { presignUpload } from '../controllers/upload.controller';

const router = Router();

router.get('/health', getHealth);
router.post('/recipes/from-text', createRecipeFromText);
router.post('/recipes/from-image', createRecipeFromImage);
router.post('/recipes/from-voice', createRecipeFromVoice);
router.post('/uploads/presign', presignUpload);

export default router;