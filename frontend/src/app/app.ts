import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecipeService } from './recipe.service';
import type { Recipe, Ingredient } from './recipe.service';

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

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.loadRecipes();
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
