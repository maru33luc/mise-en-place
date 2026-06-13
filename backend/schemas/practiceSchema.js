const { z } = require('zod');

const numericStringRegex = /^\d+(\.\d+)?$/;

const strictString = (field) =>
  z.string({
    required_error: `${field} es requerido`,
    invalid_type_error: `${field} debe ser texto`
  }).refine(val => isNaN(Number(val)) || val.trim() === '', {
    message: `${field} no puede ser solo un número`
  });

const strictNumber = (field) =>
  z.union([
    z.number({ invalid_type_error: `${field} debe ser un número` }),
    z.string().regex(numericStringRegex, `${field} debe ser un número válido`).transform(Number)
  ], { errorMap: () => ({ message: `${field} debe ser un número` }) });

const ingredientSchema = z.object({
  name: strictString('Nombre del ingrediente')
    .min(2, 'Nombre del ingrediente debe tener al menos 2 caracteres'),
  amount: strictNumber('Cantidad')
    .refine(n => n > 0, 'Cantidad debe ser positiva'),
  unit: z.string({ invalid_type_error: 'Unidad debe ser texto' })
    .min(1, 'Unidad requerida')
});

const createRecipeSchema = z.object({
  title: strictString('Título')
    .min(3, 'Título debe tener al menos 3 caracteres')
    .max(100, 'Título no puede superar 100 caracteres'),
  description: strictString('Descripción')
    .min(5, 'Descripción debe tener al menos 5 caracteres')
    .max(500, 'Descripción no puede superar 500 caracteres'),
  difficulty: z.enum(['easy', 'medium', 'hard'], {
    errorMap: () => ({ message: 'Dificultad debe ser: easy, medium o hard' })
  }),
  ingredients: z.array(ingredientSchema).min(1, 'Debe tener al menos 1 ingrediente')
});

const updateRecipeSchema = createRecipeSchema.partial().refine(
  data => Object.keys(data).length > 0,
  { message: 'Debe enviar al menos un campo para actualizar' }
);

module.exports = {
  createRecipeSchema,
  updateRecipeSchema
};
