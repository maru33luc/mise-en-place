import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IngredientInputComponent } from './ingredient-input.component';

describe('IngredientInputComponent', () => {
  let component: IngredientInputComponent;
  let fixture: ComponentFixture<IngredientInputComponent>;

  // Acceso a miembros protected en tests.
  interface IngredientInputTestAccess {
    name: string;
    amount: string;
    unit: string;
    add: () => void;
    remove: (i: number) => void;
  }

  beforeEach(async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [IngredientInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IngredientInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

function setInput(c: IngredientInputComponent, name: string, amount: string, unit: string): void {
  const access = c as unknown as IngredientInputTestAccess;
  access.name = name;
  access.amount = amount;
  access.unit = unit;
}

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('add() debe agregar un ingrediente valido a la lista', () => {
    fixture.componentRef.setInput('ingredients', []);
    setInput(component, 'pasta', '400', 'g');
    (component as unknown as IngredientInputTestAccess).add();

    expect(component.ingredients().length).toBe(1);
    expect(component.ingredients()[0]).toEqual({ name: 'pasta', amount: 400, unit: 'g' });
  });

  it('add() no debe agregar si falta un campo', () => {
    fixture.componentRef.setInput('ingredients', []);
    setInput(component, '', '400', 'g');
    (component as unknown as IngredientInputTestAccess).add();

    expect(component.ingredients().length).toBe(0);
  });

  it('remove() debe eliminar el ingrediente por indice', () => {
    fixture.componentRef.setInput('ingredients', [
      { name: 'pasta', amount: 1, unit: 'g' },
      { name: 'sal', amount: 2, unit: 'g' },
    ]);
    (component as unknown as IngredientInputTestAccess).remove(0);

    expect(component.ingredients().length).toBe(1);
    expect(component.ingredients()[0].name).toBe('sal');
  });
});