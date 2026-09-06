import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecipeCardComponent } from './recipe-card.component';
import type { Recipe } from '@core/models/recipe.model';
import { vi } from 'vitest';

describe('RecipeCardComponent', () => {
  let component: RecipeCardComponent;
  let fixture: ComponentFixture<RecipeCardComponent>;

  const mockRecipe: Recipe = {
    id: 1,
    title: 'Pasta Carbonara',
    description: 'Pasta clasica',
    difficulty: 'medium',
    ingredients: [{ name: 'pasta', amount: 400, unit: 'g' }],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('recipe', mockRecipe);
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe mostrar el titulo y descripcion', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h3')?.textContent).toContain('Pasta Carbonara');
    expect(el.querySelector('.recipe-description')?.textContent).toContain('Pasta clasica');
  });

  it('debe mostrar el badge de dificultad', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.recipe-badge')?.textContent?.trim()).toBe('Media');
  });

  it('debe emitir edit al hacer clic en Editar', () => {
    const spy = vi.spyOn(component.edit, 'emit');
    const btn = fixture.nativeElement.querySelector('.edit-button') as HTMLButtonElement;
    btn.click();
    expect(spy).toHaveBeenCalledWith(mockRecipe);
  });

  it('debe emitir delete al hacer clic en Eliminar', () => {
    const spy = vi.spyOn(component.delete, 'emit');
    const btn = fixture.nativeElement.querySelector('.delete-button') as HTMLButtonElement;
    btn.click();
    expect(spy).toHaveBeenCalledWith(mockRecipe);
  });
});