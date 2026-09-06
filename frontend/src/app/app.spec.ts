import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { App } from './app';

const mockRecipes = [
  {
    id: 1,
    title: 'Pasta Carbonara',
    description: 'Pasta italiana clasica con salsa de huevo y queso',
    difficulty: 'medium',
    ingredients: [{ name: 'pasta', amount: 400, unit: 'g' }],
  },
  {
    id: 2,
    title: 'Ensalada Cesar',
    description: 'Ensalada fresca con aderezo Caesar casero',
    difficulty: 'easy',
    ingredients: [{ name: 'lechuga romana', amount: 1, unit: 'unidad' }],
  },
];

describe('App', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClientTesting()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  /** Dispara ngOnInit (GET /api/recipes) y responde con los datos mock. */
  function loadRecipes(fixture: ComponentFixture<App>): void {
    fixture.detectChanges();
    const req = httpMock.expectOne('/api/recipes');
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: mockRecipes, message: 'Recetas obtenidas exitosamente' });
    fixture.detectChanges();
  }

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(App);
    loadRecipes(fixture);
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1?.textContent).toContain('Gestor de Recetas');
  });

  it('should load recipes from the backend', () => {
    const fixture = TestBed.createComponent(App);
    loadRecipes(fixture);
    const cards = fixture.nativeElement.querySelectorAll('.recipe-card');
    expect(cards.length).toBe(mockRecipes.length);
  });
});
