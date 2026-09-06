import { Component, OnInit, signal, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RecipesStore } from '@core/services/recipes.store';
import type { Recipe, Ingredient } from '@core/models/recipe.model';
import {
  validateTitle,
  validateDescription,
  validateIngredients,
  validateIngredientName,
  validateIngredientAmount,
  validateIngredientUnit,
} from '@core/utils/validators';

interface EditForm {
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: Ingredient[];
  ingredientName: string;
  ingredientAmount: string;
  ingredientUnit: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private readonly store = inject(RecipesStore);

  protected readonly recipes = this.store.recipes;
  protected readonly loading = this.store.loading;
  protected readonly success = signal<string | null>(null);
  protected readonly error = signal<string | null>(null);

  protected readonly newRecipeTitle = signal('');
  protected readonly newRecipeDescription = signal('');
  protected readonly newRecipeDifficulty = signal<'easy' | 'medium' | 'hard'>('easy');
  protected readonly ingredientName = signal('');
  protected readonly ingredientAmount = signal('');
  protected readonly ingredientUnit = signal('');
  protected readonly tempIngredients = signal<Ingredient[]>([]);
  protected readonly showForm = signal(false);

  protected readonly editingId = signal<number | null>(null);
  protected editForm: EditForm | null = null;
ngOnInit(): void {
    this.store.load();
  }

  protected startEdit(recipe: Recipe): void {
    this.editingId.set(recipe.id);
    this.editForm = {
      title: recipe.title,
      description: recipe.description,
      difficulty: recipe.difficulty,
      ingredients: [...recipe.ingredients],
      ingredientName: '',
      ingredientAmount: '',
      ingredientUnit: '',
    };
  }

  protected cancelEdit(): void {
    this.editingId.set(null);
    this.editForm = null;
  }

  protected addEditIngredient(): void {
    if (!this.editForm) return;
    const name = this.editForm.ingredientName.trim();
    const amount = parseFloat(this.editForm.ingredientAmount);
    const unit = this.editForm.ingredientUnit.trim();
    if (!name || !amount || !unit) return;
    this.editForm.ingredients = [...this.editForm.ingredients, { name, amount, unit }];
    this.editForm.ingredientName = '';
    this.editForm.ingredientAmount = '';
    this.editForm.ingredientUnit = '';
  }

  protected removeEditIngredient(index: number): void {
    if (!this.editForm) return;
    this.editForm.ingredients = this.editForm.ingredients.filter((_, i) => i !== index);
  }

  protected saveEdit(): void {
    const id = this.editingId();
    if (!id || !this.editForm) return;

    const titleError = validateTitle(this.editForm.title);
    const descError = validateDescription(this.editForm.description);
    const ingredientsError = validateIngredients(this.editForm.ingredients);
    if (titleError || descError || ingredientsError) {
      this.error.set(titleError || descError || ingredientsError);
      return;
    }

    this.store.update(id, {
      title: this.editForm.title.trim(),
      description: this.editForm.description.trim(),
      difficulty: this.editForm.difficulty,
      ingredients: this.editForm.ingredients,
    });
    this.cancelEdit();
    this.success.set('Receta actualizada');
    setTimeout(() => this.success.set(null), 2000);
  }

  protected loadRecipes(): void {
    this.store.load();
  }
protected toggleForm(): void {
    this.showForm.update((v: boolean) => !v);
    if (!this.showForm()) {
      this.resetForm();
      this.error.set(null);
    }
  }

  protected addIngredient(): void {
    const name = this.ingredientName().trim();
    const amount = parseFloat(this.ingredientAmount());
    const unit = this.ingredientUnit().trim();

    const nameError = validateIngredientName(name);
    if (nameError) {
      this.error.set(nameError);
      setTimeout(() => this.error.set(null), 3000);
      return;
    }
    const amountError = validateIngredientAmount(this.ingredientAmount());
    if (amountError) {
      this.error.set(amountError);
      setTimeout(() => this.error.set(null), 3000);
      return;
    }
    const unitError = validateIngredientUnit(unit);
    if (unitError) {
      this.error.set(unitError);
      setTimeout(() => this.error.set(null), 3000);
      return;
    }

    this.tempIngredients.update((ing: Ingredient[]) => [...ing, { name, amount, unit }]);
    this.ingredientName.set('');
    this.ingredientAmount.set('');
    this.ingredientUnit.set('');
  }

  protected removeIngredient(index: number): void {
    this.tempIngredients.update((ing: Ingredient[]) => ing.filter((_, i) => i !== index));
  }

  protected addRecipe(): void {
    const title = this.newRecipeTitle().trim();
    const description = this.newRecipeDescription().trim();
    const ingredients = this.tempIngredients();

    const titleError = validateTitle(title);
    if (titleError) {
      this.error.set(titleError);
      return;
    }
    const descError = validateDescription(description);
    if (descError) {
      this.error.set(descError);
      return;
    }
    const ingredientsError = validateIngredients(ingredients);
    if (ingredientsError) {
      this.error.set(ingredientsError);
      return;
    }

    this.store.create({ title, description, difficulty: this.newRecipeDifficulty(), ingredients });
    this.resetForm();
    this.success.set('¡Receta creada exitosamente!');
    this.showForm.set(false);
    setTimeout(() => this.success.set(null), 2000);
  }

  protected removeRecipe(id: number): void {
    if (!confirm('¿Deseas eliminar esta receta?')) return;
    this.store.delete(id);
    this.success.set('Receta eliminada');
    setTimeout(() => this.success.set(null), 2000);
  }

  protected getDifficultyClass(difficulty: string): string {
    return (
      {
        easy: 'difficulty-easy',
        medium: 'difficulty-medium',
        hard: 'difficulty-hard',
      }[difficulty] || ''
    );
  }

  protected getDifficultyLabel(difficulty: string): string {
    return (
      {
        easy: 'Fácil',
        medium: 'Media',
        hard: 'Difícil',
      }[difficulty] || difficulty
    );
  }

  protected resetForm(): void {
    this.newRecipeTitle.set('');
    this.newRecipeDescription.set('');
    this.tempIngredients.set([]);
    this.newRecipeDifficulty.set('easy');
  }
}