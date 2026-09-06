const Recipe = require('../models/practice');
const getUserId = (req) => req.user?.id ?? null;

class RecipesController {
  static getAllRecipes(req, res) {
    try {
      const recipes = Recipe.getAll(getUserId(req));
      res.json({
        success: true,
        data: recipes,
        message: 'Recipes retrieved successfully'
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to retrieve recipes' });
    }
  }

  static getRecipeById(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid id' });

      const recipe = Recipe.getById(getUserId(req), id);
      if (!recipe) return res.status(404).json({ success: false, message: 'Recipe not found' });

      res.json({ success: true, data: recipe, message: 'Recipe retrieved successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to retrieve recipe' });
    }
  }

  static createRecipe(req, res) {
    try {
      const newRecipe = Recipe.create(getUserId(req), req.validated);
      res.status(201).json({ success: true, data: newRecipe, message: 'Recipe created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to create recipe' });
    }
  }

  static updateRecipe(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid id' });

      const updated = Recipe.update(getUserId(req), id, req.validated);
      if (!updated) return res.status(404).json({ success: false, message: 'Recipe not found' });

      res.json({ success: true, data: updated, message: 'Recipe updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to update recipe' });
    }
  }

  static deleteRecipe(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid id' });

      const deleted = Recipe.delete(getUserId(req), id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Recipe not found' });

      res.json({ success: true, data: deleted, message: 'Recipe deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to delete recipe' });
    }
  }

  static health(req, res) {
    res.json({
      success: true,
      status: 'ok',
      message: 'Backend server is running'
    });
  }
}

module.exports = RecipesController;
