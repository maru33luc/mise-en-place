const express = require('express');
const RecipesController = require('../controllers/practicesController');
const validateRequest = require('../middleware/validate');
const { createRecipeSchema, updateRecipeSchema } = require('../schemas/practiceSchema');

const router = express.Router();

router.get('/', RecipesController.getAllRecipes);
router.get('/:id', RecipesController.getRecipeById);
router.post('/', validateRequest(createRecipeSchema), RecipesController.createRecipe);
router.put('/:id', validateRequest(updateRecipeSchema), RecipesController.updateRecipe);
router.delete('/:id', RecipesController.deleteRecipe);

module.exports = router;
