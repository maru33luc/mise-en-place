import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthPageComponent } from './auth-page.component';
import { errorInterceptor } from '@core/interceptors/error.interceptor';

describe('AuthPageComponent', () => {
  let fixture: ComponentFixture<AuthPageComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [AuthPageComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: { snapshot: { data: { mode: 'login' } } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthPageComponent);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('shows invalid credentials returned by the backend', () => {
    fixture.detectChanges();

    const email = fixture.nativeElement.querySelector('#auth-email') as HTMLInputElement;
    const password = fixture.nativeElement.querySelector('#auth-password') as HTMLInputElement;
    email.value = 'unknown@example.com';
    email.dispatchEvent(new Event('input'));
    password.value = 'secret123';
    password.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    fixture.componentInstance.submit({
      invalid: false,
      control: {
        markAllAsTouched: () => undefined,
      },
    } as unknown as NgForm);
    const request = httpMock.expectOne((request) => request.url.endsWith('/auth/login'));
    request.flush({ success: false, message: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="alert"]')?.textContent).toContain('Invalid credentials');
  });

  it('shows client validation before sending the request', () => {
    fixture.detectChanges();

    fixture.componentInstance.submit({
      invalid: true,
      control: {
        markAllAsTouched: () => undefined,
      },
    } as unknown as NgForm);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="alert"]')?.textContent).toContain('Please correct the highlighted fields.');
    httpMock.expectNone((request) => request.url.endsWith('/auth/login'));
  });
});
