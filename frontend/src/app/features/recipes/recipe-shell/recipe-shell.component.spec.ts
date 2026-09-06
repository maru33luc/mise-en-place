import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecipeShellComponent } from './recipe-shell.component';

describe('RecipeShellComponent', () => {
  let component: RecipeShellComponent;
  let fixture: ComponentFixture<RecipeShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeShellComponent);
    component = fixture.componentInstance;
  });

  it('debe crear el shell', () => {
    expect(component).toBeTruthy();
  });

  it('debe renderizar el titulo principal', () => {
    fixture.detectChanges();
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1?.textContent).toContain('Gestor de Recetas');
  });

  it('debe mostrar el boton FAB para crear', () => {
    fixture.detectChanges();
    const fab = fixture.nativeElement.querySelector('.fab-button');
    expect(fab).toBeTruthy();
    expect(fab?.getAttribute('aria-label')).toBe('Crear nueva receta');
  });
});