import { Component, input, output } from '@angular/core';
import { DIFFICULTY_CONFIG } from '@core/models/recipe.model';
import type { Recipe, Ingredient } from '@core/models/recipe.model';

interface ImageCategory {
  keywords: string[];
  photo: string;
}

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

  private static readonly MAX_VISIBLE_INGREDIENTS = 3;

  /** Categorías por palabra clave: gana la primera coincidencia. URLs verificadas (200 image/jpeg). */
  private static readonly categories: ImageCategory[] = [
    { photo: 'photo-1551183053-bf91a1d81141', keywords: ['pasta', 'espagueti', 'spaghetti', 'carbonara', 'fideo', 'tallarin', 'lasana', 'macarron', 'penne', 'pesto', 'gnocchi'] },
    { photo: 'photo-1513104890138-7c749659a591', keywords: ['pizza'] },
    { photo: 'photo-1568901346375-23c9450c58cd', keywords: ['hamburguesa', 'burger', 'sandwich'] },
    { photo: 'photo-1600891964092-4316c288032e', keywords: ['carne', 'steak', 'bife', 'asado', 'lomo', 'res', 'costilla', 'chorizo', 'churrasco'] },
    { photo: 'photo-1604382354936-07c5d9983bd3', keywords: ['pollo', 'chicken', 'pavo', 'roast', 'al horno'] },
    { photo: 'photo-1540189549336-e6e99c3679fe', keywords: ['salmon', 'pescado', 'fish', 'trucha', 'merluza', 'atun', 'marisco', 'camaron', 'langosta'] },
    { photo: 'photo-1512621776951-a57141f2eefd', keywords: ['ensalada', 'salad', 'verdura', 'lechuga', 'vegetal', 'vegano', 'vegetariano', 'espinaca'] },
    { photo: 'photo-1547592166-23ac45744acd', keywords: ['sopa', 'soup', 'crema', 'caldo', 'estofado', 'guiso', 'puchero'] },
    { photo: 'photo-1579871494447-9811cf80d66c', keywords: ['sushi', 'sashimi', 'nigiri', 'japones', 'japonesa', 'maki'] },
    { photo: 'photo-1567620905732-2d1ec7ab7445', keywords: ['pancake', 'panqueque', 'desayuno', 'breakfast', 'waffle', 'miel'] },
    { photo: 'photo-1578985545062-69928b1d9587', keywords: ['torta', 'pastel', 'cake', 'chocolate', 'postre', 'dessert', 'helado', 'flan', 'brownie', 'galleta', 'cheesecake', 'budin'] },
    { photo: 'photo-1585937421612-70a008356fbe', keywords: ['curry', 'arroz', 'rice', 'tailandes', 'indio', 'india', 'especiado', 'paella'] },
    { photo: 'photo-1568901346375-23c9450c58cd', keywords: ['taco', 'burrito', 'quesadilla', 'mexicano', 'mexicana', 'fajita'] },
    { photo: 'photo-1509440159596-0249088772ff', keywords: ['pan', 'bread', 'masa', 'baguette', 'focaccia', 'empanada'] },
    { photo: 'photo-1476224203421-9ac39bcb3327', keywords: ['noodle', 'ramen', 'wok', 'stir', 'salteado', 'sopa de fideos'] },
    { photo: 'photo-1546069901-ba9599a7e63c', keywords: ['bowl', 'buddha', 'quinoa', 'grano', 'saludable', 'poke'] },
    { photo: 'photo-1482049016688-2d3e1b311543', keywords: ['tostada', 'toast', 'aguacate', 'avocado', 'bruschetta'] },
    { photo: 'photo-1565958011703-44f9829ba187', keywords: ['frutilla', 'fresa', 'strawberry', 'mermelada', 'crema'] },
  ];

  /** Fallback cuando ninguna palabra coincide: pool verificado, cicla por id. */
  private static readonly fallbackPool = [
    'photo-1546069901-ba9599a7e63c',
    'photo-1512621776951-a57141f2eefd',
    'photo-1467003909585-2f8a72700288',
    'photo-1476224203421-9ac39bcb3327',
  ];

  /** Quita acentos y pasa a minúsculas para que "Salmón" matchee "salmon". */
  private static normalize(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  /** Elige la foto buscando palabras clave del título, descripción e ingredientes. */
  getRecipeImage(): string {
    const recipe = this.recipe();
    if (recipe.imageUrl) return recipe.imageUrl;

    const haystack = RecipeCardComponent.normalize(
      [recipe.title, recipe.description, ...recipe.ingredients.map((i) => i.name)].join(' '),
    );

    for (const category of RecipeCardComponent.categories) {
      for (const keyword of category.keywords) {
        if (haystack.includes(keyword)) {
          return `https://images.unsplash.com/${category.photo}?w=640&q=80&auto=format&fit=crop`;
        }
      }
    }

    const photo = RecipeCardComponent.fallbackPool[recipe.id % RecipeCardComponent.fallbackPool.length];
    return `https://images.unsplash.com/${photo}?w=640&q=80&auto=format&fit=crop`;
  }

  /** Máximo de ingredientes visibles: mantiene las cards alineadas entre sí. */
  visibleIngredients(): Ingredient[] {
    return this.recipe().ingredients.slice(0, RecipeCardComponent.MAX_VISIBLE_INGREDIENTS);
  }

  hiddenIngredientsCount(): number {
    return Math.max(0, this.recipe().ingredients.length - RecipeCardComponent.MAX_VISIBLE_INGREDIENTS);
  }

  /** Si la imagen no carga, ocultamos el <img> y el fondo decorativo del contenedor queda visible. */
  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }
}