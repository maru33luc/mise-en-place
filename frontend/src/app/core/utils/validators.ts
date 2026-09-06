import type { Ingredient } from '@core/models/recipe.model';

/**
 * Validaciones compartidas por los formularios de crear/editar receta.
 * Devolvemos el mensaje de error o `null` si el campo es válido.
 */

/** Un texto "solo número" (p.ej. "123") no es un nombre válido de receta/ingrediente. */
export function isNumericOnly(value: string): boolean {
  return !isNaN(Number(value));
}

export function validateTitle(value: string): string | null {
  if (!value.trim()) return 'El título es requerido';
  if (isNumericOnly(value)) return 'El título no puede ser solo un número';
  return null;
}

export function validateDescription(value: string): string | null {
  if (!value.trim()) return 'La descripción es requerida';
  if (isNumericOnly(value)) return 'La descripción no puede ser solo un número';
  return null;
}

export function validateIngredientName(value: string): string | null {
  if (!value.trim()) return 'El nombre del ingrediente es requerido';
  if (isNumericOnly(value)) return 'El nombre del ingrediente no puede ser solo un número';
  return null;
}

export function validateIngredientAmount(value: string): string | null {
  const amount = parseFloat(value);
  if (!value.trim() || isNaN(amount) || amount <= 0) return 'La cantidad debe ser un número positivo';
  return null;
}

export function validateIngredientUnit(value: string): string | null {
  if (!value.trim()) return 'La unidad es requerida';
  if (isNumericOnly(value)) return 'La unidad no puede ser solo un número';
  return null;
}

/** Al menos 1 ingrediente completo es obligatorio. */
export function validateIngredients(ingredients: Ingredient[]): string | null {
  if (ingredients.length === 0) return 'Agrega al menos 1 ingrediente';
  return null;
}