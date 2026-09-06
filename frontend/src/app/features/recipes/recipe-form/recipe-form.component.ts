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
        <span class="form-label">{{ isEdit ? 'Edit' : 'New Creation' }}</span>
        <h2>{{ isEdit ? 'Edit Recipe' : 'New Recipe' }}</h2>
      </div>

      <form class="recipe-form" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="form-title">Title</label>
          <input
            type="text"
            [(ngModel)]="title"
            name="title"
            id="form-title"
            placeholder="e.g. Pasta Carbonara"
            class="text-input"
            required
          />
        </div>

        <div class="form-group">
          <label for="form-description">Description</label>
          <textarea
            [(ngModel)]="description"
            name="description"
            id="form-description"
            placeholder="Describe your recipe..."
            class="text-input"
            rows="3"
            required
          ></textarea>
        </div>

        <div class="form-group">
          <label for="form-difficulty">Difficulty</label>
          <select [(ngModel)]="difficulty" name="difficulty" id="form-difficulty" class="text-input">
            @for (d of DIFFICULTIES; track d) {
              <option [value]="d">{{ DIFFICULTY_CONFIG[d].label }}</option>
            }
          </select>
        </div>

        <div class="form-group">
          <label [attr.for]="'ing-name-' + ingredientInputId">Ingredients</label>
          <app-ingredient-input [id]="ingredientInputId" [(ingredients)]="ingredients" />
        </div>

        <div class="form-actions">
          <button type="submit" class="primary-button">
            {{ isEdit ? 'Save Changes' : 'Create Recipe' }}
          </button>
          <button type="button" class="secondary-button" (click)="onCancel()">Cancel</button>
        </div>
      </form>
    </section>
  `,
  styles: [
    `
    .card {
      background: #0c0c0c;
      border: 1px solid #1a1a1a;
      border-radius: 4px;
      padding: 2.5rem;
      margin-bottom: 2rem;
      animation: fadeInUp 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .form-card {
      border-color: #2a2418;
      border-top: 2px solid #c9a96e;
    }
    .card-header {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #1a1a1a;
    }
    .form-label {
      font-family: 'Inter', sans-serif;
      font-size: 0.7rem;
      font-weight: 500;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: #c9a96e;
    }
    .card-header h2 {
      font-family: 'Playfair Display', serif;
      font-size: clamp(1.8rem, 3vw, 2.2rem);
      font-weight: 500;
      color: #f0e6d2;
      letter-spacing: 0.02em;
      margin: 0;
    }
    .recipe-form { display: grid; gap: 1.75rem; }
    .form-group { display: grid; gap: 0.6rem; }
    .form-group label {
      font-size: 0.75rem;
      font-weight: 500;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #8a8070;
    }
    .text-input, select, textarea {
      width: 100%;
      padding: 0.85rem 1rem;
      background: #080808;
      border: 1px solid #2a2a2a;
      border-radius: 2px;
      color: #f0e6d2;
      font-size: 0.95rem;
      font-family: inherit;
      transition: border-color 0.3s, box-shadow 0.3s, background 0.3s;
    }
    .text-input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: #c9a96e;
      background: #0a0a0a;
      box-shadow: 0 0 0 3px rgba(201, 169, 110, 0.1);
    }
    select option { background: #0c0c0c; }
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
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      padding: 0.9rem 1.5rem;
      font-family: inherit;
    }
    .primary-button {
      background: linear-gradient(135deg, #c9a96e 0%, #a8894e 100%);
      color: #080808;
      border: none;
    }
    .primary-button:hover:not(:disabled) {
      background: linear-gradient(135deg, #d4b87a 0%, #b8960c 100%);
      box-shadow: 0 6px 24px rgba(201, 169, 110, 0.35);
    }
    .primary-button:disabled { opacity: 0.4; cursor: not-allowed; }
    .secondary-button { background: transparent; color: #8a8070; border: 1px solid #2a2a2a; }
    .secondary-button:hover:not(:disabled) { border-color: #555; color: #f0e6d2; }
    @media (max-width: 768px) {
      .card { padding: 1rem; margin-bottom: 1rem; }
      .card-header { margin-bottom: 1rem; padding-bottom: .8rem; }
      .recipe-form { gap: .8rem; }
      .form-group { gap: .35rem; }
      .text-input, select, textarea { padding: .65rem .75rem; }
      textarea { min-height: 64px; }
      .form-actions { gap: .6rem; margin-top: .25rem; }
      .primary-button, .secondary-button { padding: .75rem .8rem; }
    }
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