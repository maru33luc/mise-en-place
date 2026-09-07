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
  if (!value.trim()) return 'Title is required';
  if (isNumericOnly(value)) return 'Title cannot contain only numbers';
  return null;
}

export function validateDescription(value: string): string | null {
  if (!value.trim()) return 'Description is required';
  if (isNumericOnly(value)) return 'Description cannot contain only numbers';
  return null;
}

export function validateIngredientName(value: string): string | null {
  if (!value.trim()) return 'Ingredient name is required';
  if (isNumericOnly(value)) return 'Ingredient name cannot contain only numbers';
  return null;
}

export function validateIngredientAmount(value: string | number | null | undefined): string | null {
  const amount = typeof value === 'number' ? value : Number(value);
  if (value === null || value === undefined || value === '' || !Number.isFinite(amount) || amount <= 0) {
    return 'Amount must be a positive number';
  }
  return null;
}

export function validateIngredientUnit(value: string): string | null {
  if (!value.trim()) return 'Unit is required';
  if (isNumericOnly(value)) return 'Unit cannot contain only numbers';
  return null;
}

/** Al menos 1 ingrediente completo es obligatorio. */
export function validateIngredients(ingredients: Ingredient[]): string | null {
  if (ingredients.length === 0) return 'Add at least one ingredient';
  return null;
}