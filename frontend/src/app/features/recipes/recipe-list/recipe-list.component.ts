import { Component, input, output } from '@angular/core';
import { RecipeCardComponent } from '../recipe-card/recipe-card.component';
import { LoadingComponent } from '@shared/loading/loading.component';
import { EmptyStateComponent } from '@shared/empty-state/empty-state.component';
import type { Recipe } from '@core/models/recipe.model';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [RecipeCardComponent, LoadingComponent, EmptyStateComponent],
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent {
  readonly recipes = input.required<Recipe[]>();
  readonly loading = input(false);

  edit = output<Recipe>();
  delete = output<Recipe>();
}