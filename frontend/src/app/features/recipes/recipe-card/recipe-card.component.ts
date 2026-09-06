import { Component, input, output } from '@angular/core';
import { DIFFICULTY_CONFIG } from '@core/models/recipe.model';
import type { Recipe } from '@core/models/recipe.model';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.css'],
})
export class RecipeCardComponent {
  readonly recipe = input.required<Recipe>();
  readonly DIFFICULTY_CONFIG = DIFFICULTY_CONFIG;

  edit = output<Recipe>();
  delete = output<Recipe>();

  /** Imágenes variadas de comida para las cards. */
  getFoodImage(id: number): string {
    const images = [
      '1504674491297-be0c61ea1d0a', // pasta
      '1546069901-9a6fdf0c3b6a', // steak
      '1565299624946-b29f6ec19c2c', // seafood
      '1476224244847-3a1bce4e20e5', // salad
      '1567620995520-0e8532f3ed69', // soup
      '1551024541-2317249e0f3a', // dessert
      '1499635316323-e5b8799eb536', // breakfast
      '1473093295673-caac58e4f7f4', // sushi
    ];
    return images[id % images.length];
  }
}