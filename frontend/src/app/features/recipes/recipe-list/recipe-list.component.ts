import { Component, input, output } from '@angular/core';
import { RecipeCardComponent } from '../recipe-card/recipe-card.component';
import { LoadingComponent } from '@shared/loading/loading.component';
import { EmptyStateComponent } from '@shared/empty-state/empty-state.component';
import type { Recipe } from '@core/models/recipe.model';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [RecipeCardComponent, LoadingComponent, EmptyStateComponent],
  template: `
    <section class="card recipes-section">
      <div class="section-header">
        <h2>Mis Recetas</h2>
        <span class="recipe-count">{{ recipes().length }}</span>
      </div>

      @if (loading() && recipes().length === 0) {
        <app-loading />
      } @else if (recipes().length > 0) {
        <div class="recipes-grid">
          @for (recipe of recipes(); track recipe.id) {
            <app-recipe-card
              [recipe]="recipe"
              (edit)="edit.emit($event)"
              (delete)="delete.emit($event)"
            />
          }
        </div>
      } @else if (!loading()) {
        <app-empty-state
          title="No hay recetas aún"
          message="Crea tu primera receta haciendo clic en el botón + arriba"
        />
      }
    </section>
  `,
  styles: [
    `
    .card {
      background: #111111;
      border: 1px solid #1e1e1e;
      border-radius: 2px;
      padding: 2.5rem;
      margin-bottom: 4rem;
      animation: fadeIn 0.4s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #1e1e1e;
    }
    .section-header h2 {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.8rem;
      color: #c9a96e;
      letter-spacing: 0.05em;
      margin: 0;
    }
    .recipe-count {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 1px solid #c9a96e;
      color: #c9a96e;
      font-size: 0.85rem;
      font-weight: 500;
    }
    .recipes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      grid-auto-rows: 1fr;
      gap: 1.5rem;
      align-items: stretch;
    }
    @media (max-width: 768px) { .recipes-grid { grid-template-columns: 1fr; } }
    `,
  ],
})
export class RecipeListComponent {
  readonly recipes = input.required<Recipe[]>();
  readonly loading = input(false);

  edit = output<Recipe>();
  delete = output<Recipe>();
}