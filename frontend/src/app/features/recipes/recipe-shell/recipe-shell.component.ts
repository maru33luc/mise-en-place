import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RecipesStore } from '@core/services/recipes.store';
import { ConfirmDialogComponent } from '@shared/confirm-dialog/confirm-dialog.component';
import { RecipeListComponent } from '../recipe-list/recipe-list.component';
import { RecipeFormComponent } from '../recipe-form/recipe-form.component';
import type { Recipe, RecipePayload } from '@core/models/recipe.model';

@Component({
  selector: 'app-recipe-shell',
  standalone: true,
  imports: [FormsModule, ConfirmDialogComponent, RecipeListComponent, RecipeFormComponent],
  templateUrl: './recipe-shell.component.html',
  styleUrls: ['./recipe-shell.component.css'],
})
export class RecipeShellComponent implements OnInit {
  protected readonly store = inject(RecipesStore);

  ngOnInit(): void {
    this.store.load();
  }

  protected openCreateForm(): void {
    this.showCreateForm.set(true);
    this.editingRecipe.set(null);
    this.scrollToRecipeForm();
  }

  protected openEditForm(recipe: Recipe): void {
    this.showCreateForm.set(false);
    this.editingRecipe.set(recipe);
    this.scrollToRecipeForm();
  }

  private scrollToRecipeForm(): void {
    setTimeout(() => {
      document.getElementById('recipe-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      document.getElementById('form-title')?.focus();
    });
  }

  protected readonly showCreateForm = signal(false);
  protected readonly editingRecipe = signal<Recipe | null>(null);
  protected readonly recipeToDelete = signal<Recipe | null>(null);

  protected onCreate(payload: RecipePayload): void {
    this.store.create(payload);
    this.showCreateForm.set(false);
  }

  protected onUpdate(id: number, payload: Partial<RecipePayload>): void {
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