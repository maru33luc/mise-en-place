import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { RecipeShellComponent } from './recipe-shell.component';
import { errorInterceptor } from '@core/interceptors/error.interceptor';

describe('RecipeShellComponent', () => {
  let component: RecipeShellComponent;
  let fixture: ComponentFixture<RecipeShellComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [RecipeShellComponent],
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeShellComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe crear el shell', () => {
    expect(component).toBeTruthy();
  });

  it('debe renderizar el titulo y el FAB tras cargar', () => {
    fixture.detectChanges();
    // ngOnInit dispara store.load() -> GET /api/recipes
    const req = httpMock.expectOne((r) => r.url.includes('/api/recipes'));
    req.flush({ success: true, data: [], message: 'ok' });
    fixture.detectChanges();

    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1?.textContent?.replace(/\s+/g, ' ').trim()).toContain('Mise en Place');

    const fab = fixture.nativeElement.querySelector('.fab-button');
    expect(fab).toBeTruthy();
    expect(fab?.getAttribute('aria-label')).toBe('Crear nueva receta');
  });
});