import { Component, EventEmitter, Output, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IngredientInputComponent } from '../ingredient-input/ingredient-input.component';
import { DIFFICULTIES, DIFFICULTY_CONFIG } from '@core/models/recipe.model';
import type { Difficulty, Ingredient, Recipe } from '@core/models/recipe.model';
import {
  validateTitle,
  validateDescription,
  validateIngredients,
} from '@core/utils/validators';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [FormsModule, IngredientInputComponent],
  template: `
    <section class="card form-card">
      <div class="card-header">
        <h2>{{ isEdit ? 'Editar Receta' : 'Nueva Receta' }}</h2>
      </div>

      <form class="recipe-form" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="form-title">Título</label>
          <input
            type="text"
            [(ngModel)]="title"
            name="title"
            id="form-title"
            placeholder="Ej. Pasta Carbonara"
            class="text-input"
            required
          />
        </div>

        <div class="form-group">
          <label for="form-description">Descripción</label>
          <textarea
            [(ngModel)]="description"
            name="description"
            id="form-description"
            placeholder="Describe tu receta..."
            class="text-input"
            rows="3"
            required
          ></textarea>
        </div>

        <div class="form-group">
          <label for="form-difficulty">Dificultad</label>
          <select [(ngModel)]="difficulty" name="difficulty" id="form-difficulty" class="text-input">
            @for (d of DIFFICULTIES; track d) {
              <option [value]="d">{{ DIFFICULTY_CONFIG[d].label }}</option>
            }
          </select>
        </div>

        <div class="form-group">
          <label [attr.for]="'ing-name-' + ingredientInputId">Ingredientes</label>
          <app-ingredient-input [id]="ingredientInputId" [(ingredients)]="ingredients" />
        </div>

        <div class="form-actions">
          <button type="submit" class="primary-button">
            {{ isEdit ? 'Guardar Cambios' : 'Crear Receta' }}
          </button>
          <button type="button" class="secondary-button" (click)="onCancel()">Cancelar</button>
        </div>
      </form>
    </section>
  `,
  styles: [
    `
    .card {
      background: #111111;
      border: 1px solid #1e1e1e;
      border-radius: 2px;
      padding: 2.5rem;
      margin-bottom: 2rem;
      animation: fadeIn 0.4s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .form-card { border-color: #2a2218; border-top: 2px solid #c9a96e; }
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #1e1e1e;
    }
    .card-header h2 {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.8rem;
      font-weight: 600;
      color: #c9a96e;
      letter-spacing: 0.05em;
      margin: 0;
    }
    .recipe-form { display: grid; gap: 1.75rem; }
    .form-group { display: grid; gap: 0.6rem; }
    .form-group label {
      font-size: 0.75rem;
      font-weight: 500;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #888;
    }
    .text-input, select, textarea {
      width: 100%;
      padding: 0.85rem 1rem;
      background: #0a0a0a;
      border: 1px solid #2a2a2a;
      border-radius: 2px;
      color: #e8e0d0;
      font-size: 0.95rem;
      font-family: inherit;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .text-input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: #c9a96e;
      box-shadow: 0 0 0 3px rgba(201, 169, 110, 0.08);
    }
    select option { background: #111; }
    textarea { resize: vertical; min-height: 90px; }
    .form-actions { display: flex; gap: 1rem; margin-top: 0.5rem; }
    .form-actions button { flex: 1; }
    .primary-button, .secondary-button {
      cursor: pointer;
      border-radius: 2px;
      font-weight: 500;
      font-size: 0.85rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      transition: all 0.2s ease;
      padding: 0.9rem 1.5rem;
      font-family: inherit;
    }
    .primary-button { background: #c9a96e; color: #0a0a0a; border: none; }
    .primary-button:hover:not(:disabled) { background: #d4b87a; box-shadow: 0 4px 20px rgba(201, 169, 110, 0.3); }
    .primary-button:disabled { opacity: 0.4; cursor: not-allowed; }
    .secondary-button { background: transparent; color: #888; border: 1px solid #2a2a2a; }
    .secondary-button:hover:not(:disabled) { border-color: #555; color: #e8e0d0; }
    @media (max-width: 768px) { .card { padding: 1.75rem; } }
    `,
  ],
})
export class RecipeFormComponent {
  /** Receta a editar; si no se provee, es un formulario de creación. */
  readonly recipe = input<Recipe | null>(null);

  @Output() save = new EventEmitter<{ title: string; description: string; difficulty: Difficulty; ingredients: Ingredient[] }>();
  @Output() cancelled = new EventEmitter<void>();

  private readonly toast = inject(ToastService);

  protected readonly DIFFICULTIES = DIFFICULTIES;
  protected readonly DIFFICULTY_CONFIG = DIFFICULTY_CONFIG;
  protected readonly ingredientInputId = 'recipe-form-ingredients';

  protected title = '';
  protected description = '';
  protected difficulty: Difficulty = 'easy';
  protected ingredients: Ingredient[] = [];

  /** Cuando la receta de entrada cambia, sincronizamos el formulario. */
  constructor() {
    const r = this.recipe();
    if (r) {
      this.title = r.title;
      this.description = r.description;
      this.difficulty = r.difficulty;
      this.ingredients = [...r.ingredients];
    }
  }

  protected get isEdit(): boolean {
    return this.recipe() !== null;
  }

  protected onSubmit(): void {
    const titleError = validateTitle(this.title);
    if (titleError) {
      this.toast.error(titleError);
      return;
    }
    const descError = validateDescription(this.description);
    if (descError) {
      this.toast.error(descError);
      return;
    }
    const ingredientsError = validateIngredients(this.ingredients);
    if (ingredientsError) {
      this.toast.error(ingredientsError);
      return;
    }

    this.save.emit({
      title: this.title.trim(),
      description: this.description.trim(),
      difficulty: this.difficulty,
      ingredients: this.ingredients,
    });
  }

  protected onCancel(): void {
    this.cancelled.emit();
  }
}