import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { RecipeService } from './recipe.service';
import { errorInterceptor } from '../interceptors/error.interceptor';

describe('RecipeService', () => {
  let service: RecipeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(RecipeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getAll() hace GET a /api/recipes', () => {
    service.getAll().subscribe((res) => expect(res.data).toBeDefined());
    const req = httpMock.expectOne((r) => r.url.includes('/api/recipes'));
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: [], message: 'ok' });
  });

  it('create() hace POST con el payload', () => {
    const payload = { title: 'X', description: 'desc', difficulty: 'medium' as const, ingredients: [] };
    service.create(payload).subscribe();
    const req = httpMock.expectOne((r) => r.url.includes('/api/recipes'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ success: true, data: { id: 1, ...payload }, message: 'ok' });
  });

  it('delete() hace DELETE con el id', () => {
    service.delete(42).subscribe();
    const req = httpMock.expectOne((r) => r.url.includes('/api/recipes/42'));
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true, message: 'ok' });
  });
});