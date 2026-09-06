import { Component, inject, signal } from '@angular/core';
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
  imports: [
    FormsModule,
    AlertComponent,
    ConfirmDialogComponent,
    RecipeListComponent,
    RecipeFormComponent,
  ],
  template: `
    <div class="page-wrapper">
      <header class="hero">
        <div class="hero-content">
          <h1>Gestor de Recetas</h1>
          <p>Descubre, crea y comparte tus recetas favoritas</p>
        </div>
      </header>

      <div class="app-shell">
        <app-alert />

        @if (showCreateForm()) {
          <app-recipe-form
            (save)="onCreate($event)"
            (cancelled)="showCreateForm.set(false)"
          />
        }

        @if (editingRecipe(); as recipe) {
          <app-recipe-form
            [recipe]="recipe"
            (save)="onUpdate(recipe.id, $event)"
            (cancelled)="editingRecipe.set(null)"
          />
        }

        <app-recipe-list
          [recipes]="store.recipes()"
          [loading]="store.loading()"
          (edit)="editingRecipe.set($event)"
          (delete)="recipeToDelete.set($event)"
        />
      </div>

      @if (!showCreateForm() && !editingRecipe()) {
        <button
          type="button"
          class="fab-button"
          (click)="showCreateForm.set(true)"
          [disabled]="store.loading()"
          aria-label="Crear nueva receta"
        >
          +
        </button>
      }

      @if (recipeToDelete(); as target) {
        <app-confirm-dialog
          id="delete-recipe"
          title="¿Eliminar receta?"
          [message]="'Se eliminará &quot;' + target.title + '&quot; para siempre.'"
          (confirmed)="confirmDelete()"
          (cancelled)="recipeToDelete.set(null)"
        />
      }
    </div>
  `,
  styles: [
    `
    :host { display: block; min-height: 100vh; }
    .page-wrapper { min-height: 100vh; background-color: #0a0a0a; }
    .app-shell { width: min(100%, 1100px); margin: 0 auto; padding: 0 1.5rem 5rem; }
    .hero {
      width: 100%;
      padding: 6rem 1.5rem 4rem;
      text-align: center;
      border-bottom: 1px solid #1e1e1e;
      margin-bottom: 4rem;
    }
    .hero-content h1 {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(3rem, 6vw, 5rem);
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #c9a96e;
      margin-bottom: 1rem;
    }
    .hero-content p {
      font-size: 0.9rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #666;
      font-weight: 300;
    }
    .fab-button {
      position: fixed;
      bottom: 2.5rem;
      right: 2.5rem;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: #c9a96e;
      color: #0a0a0a;
      border: none;
      font-size: 1.75rem;
      cursor: pointer;
      box-shadow: 0 8px 32px rgba(201, 169, 110, 0.25);
      transition: all 0.3s ease;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .fab-button:hover:not(:disabled) {
      background: #d4b87a;
      transform: scale(1.08) rotate(90deg);
      box-shadow: 0 12px 40px rgba(201, 169, 110, 0.4);
    }
    .fab-button:disabled { opacity: 0.4; cursor: not-allowed; }
    @media (max-width: 768px) { .fab-button { bottom: 1.5rem; right: 1.5rem; } }
    `,
  ],
})
export class RecipeShellComponent {
  protected readonly store = inject(RecipesStore);

  protected readonly showCreateForm = signal(false);
  protected readonly editingRecipe = signal<Recipe | null>(null);
  protected readonly recipeToDelete = signal<Recipe | null>(null);

  protected onCreate(payload: { title: string; description: string; difficulty: 'easy' | 'medium' | 'hard'; ingredients: import('@core/models/recipe.model').Ingredient[] }): void {
    this.store.create(payload);
    this.showCreateForm.set(false);
  }

  protected onUpdate(id: number, payload: { title: string; description: string; difficulty: 'easy' | 'medium' | 'hard'; ingredients: import('@core/models/recipe.model').Ingredient[] }): void {
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