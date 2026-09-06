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

  /** Fotografías de comida (IDs verificados de Unsplash), elegidas por id de receta. */
  private readonly foodImages = [
    'photo-1546069901-ba9599a7e63c', // bowl gourmet
    'photo-1512621776951-a57141f2eefd', // ensalada
    'photo-1467003909585-2f8a72700288', // plato de salmón
    'photo-1567620905732-2d1ec7ab7445', // pancakes
    'photo-1540189549336-e6e99c3679fe', // salmón
    'photo-1565958011703-44f9829ba187', // postre
    'photo-1482049016688-2d3e1b311543', // plato toast
    'photo-1476224203421-9ac39bcb3327', // noodles
  ];

  getFoodImage(id: number): string {
    const photo = this.foodImages[id % this.foodImages.length];
    return `https://images.unsplash.com/${photo}?w=640&q=80&auto=format&fit=crop`;
  }

  /** Si la imagen no carga, ocultamos el <img> y el fondo decorativo del contenedor queda visible. */
  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }
}