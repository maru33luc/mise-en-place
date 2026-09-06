import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RecipesStore } from '@core/services/recipes.store';
import { AlertComponent } from '@shared/alert/alert.component';
import { ConfirmDialogComponent } from '@shared/confirm-dialog/confirm-dialog.component';
import { RecipeListComponent } from '../recipe-list/recipe-list.component';
import { RecipeFormComponent } from '../recipe-form/recipe-form.component';
import type { Recipe } from '@core/models/recipe.model';

@Component({
  selector: 'app-recipe-shell',
  standalone: true,
  imports: [FormsModule, AlertComponent, ConfirmDialogComponent, RecipeListComponent, RecipeFormComponent],
  templateUrl: './recipe-shell.component.html',
  styleUrls: ['./recipe-shell.component.css'],
})
export class RecipeShellComponent implements OnInit {
  protected readonly store = inject(RecipesStore);

  ngOnInit(): void {
    this.store.load();
  }

  protected readonly showCreateForm = signal(false);
  protected readonly editingRecipe = signal<Recipe | null>(null);
  protected readonly recipeToDelete = signal<Recipe | null>(null);

  protected onCreate(payload: {
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    ingredients: import('@core/models/recipe.model').Ingredient[];
  }): void {
    this.store.create(payload);
    this.showCreateForm.set(false);
  }

  protected onUpdate(id: number, payload: {
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    ingredients: import('@core/models/recipe.model').Ingredient[];
  }): void {
    this.store.update(id, payload);
    this.editingRecipe.set(null);
  }

  protected confirmDelete(): void {
    const target = this.recipeToDelete();
    if (target) {
      this.store.delete(target.id);
    }
    this.recipeToDelete.set(null);
  }
}