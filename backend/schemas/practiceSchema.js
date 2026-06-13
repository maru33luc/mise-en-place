const { z } = require('zod');

const ingredientSchema = z.object({
  name: z.string().min(2, 'Nombre del ingrediente requerido'),
  amount: z.number().positive('Cantidad debe ser positiva'),
  unit: z.string().min(1, 'Unidad requerida')
});

const createRecipeSchema = z.object({
  title: z.string().min(3, 'Título debe tener al menos 3 caracteres').max(100),
  description: z.string().min(5, 'Descripción debe tener al menos 5 caracteres').max(500),
  difficulty: z.enum(['easy', 'medium', 'hard'], {
    errorMap: () => ({ message: 'Dificultad debe ser: easy, medium o hard' })
  }),
  ingredients: z.array(ingredientSchema).min(1, 'Debe tener al menos 1 ingrediente')
});

const updateRecipeSchema = createRecipeSchema.partial();

module.exports = {
  createRecipeSchema,
  updateRecipeSchema
};
