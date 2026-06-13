const Recipe = require('../models/practice');

class RecipesController {
  static getAllRecipes(req, res) {
    try {
      const recipes = Recipe.getAll();
      res.json({
        success: true,
        data: recipes,
        message: 'Recetas obtenidas exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener recetas',
        error: error.message
      });
    }
  }

  static getRecipeById(req, res) {
    try {
      const { id } = req.params;
      const recipe = Recipe.getById(parseInt(id));

      if (!recipe) {
        return res.status(404).json({
          success: false,
          message: 'Receta no encontrada'
        });
      }

      res.json({
        success: true,
        data: recipe,
        message: 'Receta obtenida exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener receta',
        error: error.message
      });
    }
  }

  static createRecipe(req, res) {
    try {
      const newRecipe = Recipe.create(req.validated);
      res.status(201).json({
        success: true,
        data: newRecipe,
        message: 'Receta creada exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al crear receta',
        error: error.message
      });
    }
  }

  static updateRecipe(req, res) {
    try {
      const { id } = req.params;
      const updated = Recipe.update(parseInt(id), req.validated);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Receta no encontrada'
        });
      }

      res.json({
        success: true,
        data: updated,
        message: 'Receta actualizada exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar receta',
        error: error.message
      });
    }
  }

  static deleteRecipe(req, res) {
    try {
      const { id } = req.params;
      const deleted = Recipe.delete(parseInt(id));

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Receta no encontrada'
        });
      }

      res.json({
        success: true,
        data: deleted,
        message: 'Receta eliminada exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al eliminar receta',
        error: error.message
      });
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
