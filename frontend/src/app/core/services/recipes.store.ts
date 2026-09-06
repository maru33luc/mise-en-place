import { Injectable, computed, inject, signal } from '@angular/core';
import { catchError, finalize, EMPTY } from 'rxjs';
import { RecipeService } from '@core/services/recipe.service';
import { ToastService } from '@core/services/toast.service';
import type { Recipe, RecipePayload } from '@core/models/recipe.model';

/**
 * Estado del dominio recetas (única fuente de verdad).
 * Los componentes leen los signals de solo lectura y llaman acciones.
 * El servicio HTTP queda oculto detrás del store.
 */
@Injectable({ providedIn: 'root' })
export class RecipesStore {
  private readonly recipeService = inject(RecipeService);
  private readonly toast = inject(ToastService);

  private readonly recipesSignal = signal<Recipe[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly loadedSignal = signal(false);

  /** Lista de recetas ordenadas por update (más reciente primero). */
  readonly recipes = this.recipesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly loaded = this.loadedSignal.asReadonly();
  readonly recipeCount = computed(() => this.recipesSignal().length);

  load(): void {
    this.loadingSignal.set(true);
    this.recipeService
      .getAll()
      .pipe(
        finalize(() => this.loadingSignal.set(false)),
        // El mensaje de error ya se muestra vía errorInterceptor + ToastService.
        catchError(() => EMPTY),
      )
      .subscribe({
        next: (res) => {
          if (res.success && res.data) {
            this.recipesSignal.set(res.data);
            this.loadedSignal.set(true);
          }
        },
      });
  }

  create(recipe: RecipePayload): void {
    this.loadingSignal.set(true);
    this.recipeService
      .create(recipe)
      .pipe(
        finalize(() => this.loadingSignal.set(false)),
        catchError(() => EMPTY),
      )
      .subscribe({
        next: (res) => {
          if (!res.success || !res.data) return;
          // Actualizamos el estado en memoria: sin refetch completo.
          this.recipesSignal.update((list) => [res.data!, ...list]);
          this.toast.success('¡Receta creada exitosamente!');
        },
      });
  }

  update(id: number, recipe: Partial<RecipePayload>): void {
    this.loadingSignal.set(true);
    this.recipeService
      .update(id, recipe)
      .pipe(
        finalize(() => this.loadingSignal.set(false)),
        catchError(() => EMPTY),
      )
      .subscribe({
        next: (res) => {
          if (!res.success || !res.data) return;
          this.recipesSignal.update((list) => list.map((r) => (r.id === id ? res.data! : r)));
          this.toast.success('Receta actualizada');
        },
      });
  }

  delete(id: number): void {
    this.loadingSignal.set(true);
    this.recipeService
      .delete(id)
      .pipe(
        finalize(() => this.loadingSignal.set(false)),
        catchError(() => EMPTY),
      )
      .subscribe({
        next: (res) => {
          if (!res.success) return;
          this.recipesSignal.update((list) => list.filter((r) => r.id !== id));
          this.toast.success('Receta eliminada');
        },
      });
  }

  reset(): void {
    this.recipesSignal.set([]);
    this.loadedSignal.set(false);
  }
}