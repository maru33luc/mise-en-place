import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Recipe {
  id: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: Ingredient[];
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  errors?: { field: string; message: string }[];
}

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private http = inject(HttpClient);

  private readonly baseUrl = `${environment.apiUrl}/recipes`;

  getAll(): Observable<ApiResponse<Recipe[]>> {
    return this.http.get<ApiResponse<Recipe[]>>(this.baseUrl);
  }

  getById(id: number): Observable<ApiResponse<Recipe>> {
    return this.http.get<ApiResponse<Recipe>>(`${this.baseUrl}/${id}`);
  }

  create(recipe: Omit<Recipe, 'id'>): Observable<ApiResponse<Recipe>> {
    return this.http.post<ApiResponse<Recipe>>(this.baseUrl, recipe);
  }

  update(id: number, recipe: Partial<Omit<Recipe, 'id'>>): Observable<ApiResponse<Recipe>> {
    return this.http.put<ApiResponse<Recipe>>(`${this.baseUrl}/${id}`, recipe);
  }

  delete(id: number): Observable<ApiResponse<Recipe>> {
    return this.http.delete<ApiResponse<Recipe>>(`${this.baseUrl}/${id}`);
  }
}
