const Recipe = require('../models/practice');
const getUserId = (req) => req.user?.id ?? null;

class RecipesController {
  static getAllRecipes(req, res) {
    try {
      const recipes = Recipe.getAll(getUserId(req));
      res.json({
        success: true,
        data: recipes,
        message: 'Recetas obtenidas exitosamente'
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error al obtener recetas' });
    }
  }

  static getRecipeById(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ success: false, message: 'ID inválido' });

      const recipe = Recipe.getById(getUserId(req), id);
      if (!recipe) return res.status(404).json({ success: false, message: 'Receta no encontrada' });

      res.json({ success: true, data: recipe, message: 'Receta obtenida exitosamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error al obtener receta' });
    }
  }

  static createRecipe(req, res) {
    try {
      const newRecipe = Recipe.create(getUserId(req), req.validated);
      res.status(201).json({ success: true, data: newRecipe, message: 'Receta creada exitosamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error al crear receta' });
    }
  }

  static updateRecipe(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ success: false, message: 'ID inválido' });

      const updated = Recipe.update(getUserId(req), id, req.validated);
      if (!updated) return res.status(404).json({ success: false, message: 'Receta no encontrada' });

      res.json({ success: true, data: updated, message: 'Receta actualizada exitosamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error al actualizar receta' });
    }
  }

  static deleteRecipe(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ success: false, message: 'ID inválido' });

      const deleted = Recipe.delete(getUserId(req), id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Receta no encontrada' });

      res.json({ success: true, data: deleted, message: 'Receta eliminada exitosamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error al eliminar receta' });
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
