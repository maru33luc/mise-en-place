import { Component, EventEmitter, Output, input } from '@angular/core';
import { DIFFICULTY_CONFIG } from '@core/models/recipe.model';
import type { Recipe } from '@core/models/recipe.model';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  template: `
    <div class="recipe-card">
      <div class="recipe-card-top">
        <div class="recipe-badge" [class]="DIFFICULTY_CONFIG[recipe().difficulty].badge">
          {{ DIFFICULTY_CONFIG[recipe().difficulty].label }}
        </div>
        <h3>{{ recipe().title }}</h3>
        <p class="recipe-description">{{ recipe().description }}</p>
      </div>
      <div class="recipe-card-body">
        <div class="ingredients-section">
          <h4>Ingredientes</h4>
          <ul class="ingredients-list">
            @for (ing of recipe().ingredients; track $index) {
              <li>
                <span class="ingredient-name">{{ ing.name }}</span>
                <span class="ingredient-amount">{{ ing.amount }} {{ ing.unit }}</span>
              </li>
            }
          </ul>
        </div>
      </div>
      <div class="recipe-card-footer">
        <button type="button" class="edit-button" (click)="edit.emit(recipe())">Editar</button>
        <button type="button" class="delete-button" (click)="delete.emit(recipe())">Eliminar</button>
      </div>
    </div>
  `,
  styles: [
    `
    .recipe-card {
      background: #111111;
      border: 1px solid #1e1e1e;
      border-radius: 2px;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      height: 100%;
      box-sizing: border-box;
      transition: all 0.3s ease;
      border-top: 2px solid transparent;
    }
    .recipe-card:hover {
      border-top-color: #c9a96e;
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
      transform: translateY(-3px);
    }
    .recipe-card-top { display: flex; flex-direction: column; gap: 0.75rem; }
    .recipe-card-body { flex: 1; min-height: 0; }
    .recipe-card-footer { margin-top: auto; padding-top: 1.5rem; display: flex; gap: 0.75rem; }
    .recipe-badge {
      align-self: flex-start;
      padding: 0.3rem 0.75rem;
      border-radius: 2px;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    .badge-easy { background: #0a1f0a; color: #5c9c5c; border: 1px solid #1f3d1f; }
    .badge-medium { background: #1f1800; color: #b8960c; border: 1px solid #3d3000; }
    .badge-hard { background: #1f0a0a; color: #c05050; border: 1px solid #3d1515; }
    .recipe-card h3 {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.4rem;
      font-weight: 600;
      color: #e8e0d0;
      margin: 0;
      letter-spacing: 0.02em;
    }
    .recipe-description { color: #666; line-height: 1.7; font-size: 0.9rem; margin: 0; }
    .ingredients-section { margin: 1.5rem 0 0; }
    .ingredients-section h4 {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: #c9a96e;
      margin-bottom: 0.75rem;
      font-weight: 500;
    }
    .ingredients-list { list-style: none; display: grid; gap: 0.4rem; padding: 0; }
    .ingredients-list li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.6rem 0.75rem;
      background: #0a0a0a;
      border-left: 2px solid #2a2218;
      font-size: 0.875rem;
      transition: border-color 0.2s;
    }
    .ingredients-list li:hover { border-left-color: #c9a96e; }
    .ingredient-name { color: #ccc; font-weight: 400; }
    .ingredient-amount {
      color: #666;
      font-size: 0.8rem;
      background: #1a1a1a;
      padding: 0.2rem 0.5rem;
      border-radius: 2px;
    }
    .edit-button, .delete-button {
      cursor: pointer;
      flex: 1;
      background: transparent;
      border-radius: 2px;
      font-weight: 500;
      font-size: 0.85rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      transition: all 0.2s ease;
      padding: 0.9rem 1.5rem;
      font-family: inherit;
    }
    .edit-button { color: #c9a96e; border: 1px solid #3a2e18; }
    .edit-button:hover { background: #1a1408; border-color: #c9a96e; }
    .delete-button { color: #c05050; border: 1px solid #2a1515; }
    .delete-button:hover { background: #1a0808; border-color: #5c1f1f; }
    `,
  ],
})
export class RecipeCardComponent {
  readonly recipe = input.required<Recipe>();
  readonly DIFFICULTY_CONFIG = DIFFICULTY_CONFIG;

  @Output() edit = new EventEmitter<Recipe>();
  @Output() delete = new EventEmitter<Recipe>();
}