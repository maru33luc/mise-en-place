const { z } = require('zod');

const numericStringRegex = /^\d+(\.\d+)?$/;
const imageUrlSchema = z.string().refine((value) => {
  try {
    if (value.startsWith('data:image/')) return /^data:image\/(jpeg|jpg|png|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(value);
    return ['http:', 'https:'].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}, 'Image must be a valid URL or image data').max(3_000_000, 'Image must be smaller than 2 MB');

const strictString = (field) =>
  z.string({
    required_error: `${field} is required`,
    invalid_type_error: `${field} debe ser texto`
  }).refine(val => isNaN(Number(val)) || val.trim() === '', {
    message: `${field} cannot contain only numbers`
  });

const strictNumber = (field) =>
  z.union([
    z.number({ invalid_type_error: `${field} must be a number` }),
    z.string().regex(numericStringRegex, `${field} must be a valid number`).transform(Number)
  ], { errorMap: () => ({ message: `${field} must be a number` }) });

const ingredientSchema = z.object({
  name: strictString('Nombre del ingrediente')
    .min(2, 'Nombre del ingrediente debe tener al menos 2 caracteres'),
  amount: strictNumber('Cantidad')
    .refine(n => n > 0, 'Cantidad debe ser positiva'),
  unit: z.string({ invalid_type_error: 'Unidad debe ser texto' })
    .min(1, 'Unit is required')
});

const createRecipeSchema = z.object({
  title: strictString('Title')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  description: strictString('Description')
    .min(5, 'Description must be at least 5 characters')
    .max(500, 'Description cannot exceed 500 characters'),
  difficulty: z.enum(['easy', 'medium', 'hard'], {
    errorMap: () => ({ message: 'Dificultad debe ser: easy, medium o hard' })
  }),
  ingredients: z.array(ingredientSchema).min(1, 'Debe tener al menos 1 ingrediente')
  ,imageUrl: imageUrlSchema.optional()
});

const updateRecipeSchema = createRecipeSchema.partial().refine(
  data => Object.keys(data).length > 0,
  { message: 'Debe enviar al menos un campo para actualizar' }
);

module.exports = {
  createRecipeSchema,
  updateRecipeSchema
};
