import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { RecipesStore } from './recipes.store';
import { errorInterceptor } from '../interceptors/error.interceptor';
import type { Recipe } from '../models/recipe.model';

describe('RecipesStore', () => {
  let store: RecipesStore;
  let httpMock: HttpTestingController;

  const mockRecipe: Recipe = {
    id: 1,
    title: 'Pasta',
    description: 'Receta de pasta',
    difficulty: 'easy',
    ingredients: [{ name: 'pasta', amount: 1, unit: 'g' }],
  };

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    store = TestBed.inject(RecipesStore);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('load() rellena el estado y marca loaded=true', () => {
    store.load();
    const req = httpMock.expectOne((r) => r.url.includes('/api/recipes'));
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: [mockRecipe], message: 'ok' });

    expect(store.recipes().length).toBe(1);
    expect(store.recipes()[0].title).toBe('Pasta');
    expect(store.loaded()).toBe(true);
    expect(store.loading()).toBe(false);
  });

  it('create() añade la receta al inicio sin refetch', () => {
    store.create({ title: 'Nueva', description: 'desc', difficulty: 'hard', ingredients: [] });
    const req = httpMock.expectOne((r) => r.url.includes('/api/recipes'));
    expect(req.request.method).toBe('POST');
    req.flush({ success: true, data: mockRecipe, message: 'ok' });

    expect(store.recipes()[0].id).toBe(1);
    expect(store.loading()).toBe(false);
  });

  it('update() reemplaza la receta con el mismo id', () => {
    store['recipesSignal'].set([mockRecipe]);

    store.update(1, { title: 'Actualizada' });
    httpMock.expectOne((r) => r.url.includes('/api/recipes/1')).flush({ success: true, data: { ...mockRecipe, title: 'Actualizada' }, message: 'ok' });

    expect(store.recipes()[0].title).toBe('Actualizada');
    expect(store.recipes().length).toBe(1);
  });

  it('delete() elimina la receta del estado', () => {
    store['recipesSignal'].set([mockRecipe]);

    store.delete(1);
    httpMock.expectOne((r) => r.url.includes('/api/recipes/1')).flush({ success: true, data: mockRecipe, message: 'ok' });

    expect(store.recipes().length).toBe(0);
  });

  it('error de red se propaga y deja loading en false', () => {
    store.load();
    httpMock.expectOne((r) => r.url.includes('/api/recipes')).flush(
      { success: false, message: 'Error interno del servidor' },
      { status: 500, statusText: 'Server Error' },
    );

    expect(store.loading()).toBe(false);
    expect(store.loaded()).toBe(false);
  });
});