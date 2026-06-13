import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecipeService } from './recipe.service';
import type { Recipe, Ingredient } from './recipe.service';

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
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly recipes = signal<Recipe[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly success = signal<string | null>(null);

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

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.loadRecipes();
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
      ingredientUnit: ''
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

    if (!this.editForm.title.trim() || !this.editForm.description.trim() || this.editForm.ingredients.length === 0) {
      this.error.set('Completa todos los campos y agrega al menos 1 ingrediente');
      setTimeout(() => this.error.set(null), 3000);
      return;
    }

    this.loading.set(true);
    this.recipeService.update(id, {
      title: this.editForm.title.trim(),
      description: this.editForm.description.trim(),
      difficulty: this.editForm.difficulty,
      ingredients: this.editForm.ingredients
    }).subscribe({
      next: (response) => {
        if (response.success) {
          this.success.set('Receta actualizada');
          this.loadRecipes();
          this.cancelEdit();
          setTimeout(() => this.success.set(null), 2000);
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Error al actualizar receta');
        this.loading.set(false);
      }
    });
  }

  protected loadRecipes(): void {
    this.loading.set(true);
    this.error.set(null);
    
    this.recipeService.getAll().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.recipes.set(response.data);
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar recetas');
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  protected addIngredient(): void {
    const name = this.ingredientName().trim();
    const amount = parseFloat(this.ingredientAmount());
    const unit = this.ingredientUnit().trim();

    if (!name || !amount || !unit) {
      this.error.set('Completa todos los campos del ingrediente');
      setTimeout(() => this.error.set(null), 3000);
      return;
    }

    this.tempIngredients.update((ing) => [
      ...ing,
      { name, amount, unit }
    ]);

    this.ingredientName.set('');
    this.ingredientAmount.set('');
    this.ingredientUnit.set('');
  }

  protected removeIngredient(index: number): void {
    this.tempIngredients.update((ing) =>
      ing.filter((_, i) => i !== index)
    );
  }

  protected addRecipe(): void {
    const title = this.newRecipeTitle().trim();
    const description = this.newRecipeDescription().trim();
    const ingredients = this.tempIngredients();

    if (!title || !description || ingredients.length === 0) {
      this.error.set('Completa todos los campos y agrega al menos 1 ingrediente');
      return;
    }

    this.loading.set(true);
    
    this.recipeService.create({
      title,
      description,
      difficulty: this.newRecipeDifficulty(),
      ingredients
    }).subscribe({
      next: (response) => {
        if (response.success) {
          this.success.set('¡Receta creada exitosamente!');
          this.loadRecipes();
          this.resetForm();
          
          setTimeout(() => {
            this.success.set(null);
            this.showForm.set(false);
          }, 2000);
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Error al crear receta');
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  protected removeRecipe(id: number): void {
    if (!confirm('¿Deseas eliminar esta receta?')) return;

    this.loading.set(true);
    this.recipeService.delete(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.success.set('Receta eliminada');
          this.loadRecipes();
          setTimeout(() => this.success.set(null), 2000);
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al eliminar receta');
        this.loading.set(false);
      }
    });
  }

  protected getDifficultyClass(difficulty: string): string {
    return {
      easy: 'difficulty-easy',
      medium: 'difficulty-medium',
      hard: 'difficulty-hard'
    }[difficulty] || '';
  }

  protected getDifficultyLabel(difficulty: string): string {
    return {
      easy: 'Fácil',
      medium: 'Media',
      hard: 'Difícil'
    }[difficulty] || difficulty;
  }

  protected resetForm(): void {
    this.newRecipeTitle.set('');
    this.newRecipeDescription.set('');
    this.tempIngredients.set([]);
    this.newRecipeDifficulty.set('easy');
  }

  protected toggleForm(): void {
    this.showForm.update(v => !v);
    if (!this.showForm()) {
      this.resetForm();
      this.error.set(null);
    }
  }
}
