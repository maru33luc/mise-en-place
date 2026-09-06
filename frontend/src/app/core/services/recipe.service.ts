import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { ApiResponse } from '@core/models/api-response.model';
import type { Recipe, RecipePayload } from '@core/models/recipe.model';

/**
 * Capa puramente HTTP del dominio recetas.
 * No maneja estado: los consumidores (RecipesStore) deciden qué hacer con la respuesta.
 */
@Injectable({ providedIn: 'root' })
export class RecipeService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/recipes`;

  getAll(): Observable<ApiResponse<Recipe[]>> {
    return this.http.get<ApiResponse<Recipe[]>>(this.baseUrl);
  }

  getById(id: number): Observable<ApiResponse<Recipe>> {
    return this.http.get<ApiResponse<Recipe>>(`${this.baseUrl}/${id}`);
  }

  create(recipe: RecipePayload): Observable<ApiResponse<Recipe>> {
    return this.http.post<ApiResponse<Recipe>>(this.baseUrl, recipe);
  }

  update(id: number, recipe: Partial<RecipePayload>): Observable<ApiResponse<Recipe>> {
    return this.http.put<ApiResponse<Recipe>>(`${this.baseUrl}/${id}`, recipe);
  }

  delete(id: number): Observable<ApiResponse<Recipe>> {
    return this.http.delete<ApiResponse<Recipe>>(`${this.baseUrl}/${id}`);
  }
}