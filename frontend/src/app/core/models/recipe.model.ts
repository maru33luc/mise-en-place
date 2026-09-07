/** Dificultades soportadas por el dominio recetas. */
export type Difficulty = 'easy' | 'medium' | 'hard';

/** Ingrediente de una receta. */
export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

/** Entidad principal del dominio. */
export interface Recipe {
  id: number;
  title: string;
  description: string;
  difficulty: Difficulty;
  ingredients: Ingredient[];
  imageUrl?: string;
  season?: 'spring' | 'summer' | 'fall' | 'winter' | 'all';
  tags?: string[];
  servings?: number;
}

/** DTO usado para crear/actualizar una receta (sin el id que genera el servidor). */
export type RecipePayload = Omit<Recipe, 'id'>;

/** Presentación de cada dificultad: etiqueta legible + clase de badge. */
export const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; badge: string }> = {
  easy: { label: 'Easy', badge: 'badge-easy' },
  medium: { label: 'Medium', badge: 'badge-medium' },
  hard: { label: 'Hard', badge: 'badge-hard' },
};

export const DIFFICULTIES = Object.keys(DIFFICULTY_CONFIG) as Difficulty[];