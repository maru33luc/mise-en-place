import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <main class="auth">
      <div class="visual">
        <p>THE KITCHEN<br /><i>BEGINS HERE.</i></p>
      </div>

      <form
        #authForm="ngForm"
        novalidate
        (ngSubmit)="submit(authForm)"
        aria-labelledby="auth-title"
      >
        <a routerLink="/" class="back">← Back to the dining room</a>
        <p class="eyebrow">{{ mode === 'login' ? 'Welcome back' : 'Join the kitchen' }}</p>
        <h1 id="auth-title">
          {{ mode === 'login' ? 'Enter the service' : 'Create your station' }}
        </h1>

        @if (mode === 'register') {
          <label for="auth-name">Name</label>
          <input
            id="auth-name"
            name="name"
            [(ngModel)]="name"
            #nameControl="ngModel"
            autocomplete="name"
            required
            minlength="2"
            [attr.aria-invalid]="hasError(nameControl)"
            [attr.aria-describedby]="hasError(nameControl) ? 'name-error' : null"
          />
          @if (hasError(nameControl)) {
            <p class="field-error" id="name-error">{{ nameError(nameControl) }}</p>
          }
        }

        <label for="auth-email">Email</label>
        <input
          id="auth-email"
          name="email"
          type="email"
          [(ngModel)]="email"
          #emailControl="ngModel"
          autocomplete="email"
          required
          [pattern]="emailPattern"
          [attr.aria-invalid]="hasError(emailControl)"
          [attr.aria-describedby]="hasError(emailControl) ? 'email-error' : null"
        />
        @if (hasError(emailControl)) {
          <p class="field-error" id="email-error">{{ emailError(emailControl) }}</p>
        }

        <label for="auth-password">Password</label>
        <input
          id="auth-password"
          name="password"
          type="password"
          [(ngModel)]="password"
          #passwordControl="ngModel"
          autocomplete="{{ mode === 'login' ? 'current-password' : 'new-password' }}"
          required
          minlength="6"
          [attr.aria-invalid]="hasError(passwordControl)"
          [attr.aria-describedby]="hasError(passwordControl) ? 'password-error' : null"
        />
        @if (hasError(passwordControl)) {
          <p class="field-error" id="password-error">{{ passwordError(passwordControl) }}</p>
        }

        @if (errorMessage(); as message) {
          <p class="error" role="alert" aria-live="assertive">{{ message }}</p>
        }

        <button type="submit" [disabled]="submitting()">
          {{ submitting() ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Register' }}
          <span>→</span>
        </button>
        <p class="switch">
          {{ mode === 'login' ? 'New to the kitchen?' : 'Already have a station?' }}
          <a [routerLink]="mode === 'login' ? '/auth/register' : '/auth/login'">{{
            mode === 'login' ? 'Create one' : 'Sign in'
          }}</a>
        </p>
      </form>
    </main>
  `,
  styles: [
    `
      :host{display:block;height:100dvh}

.auth{
  height:100dvh; /* antes: min-height:100vh */
  overflow:hidden;
  display:grid;
  grid-template-columns:1fr 1fr;
  background:#0b0b0b;
}

.visual{
  background:linear-gradient(90deg,rgba(8,8,8,.25),#0b0b0b),url('https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=1200&q=85&auto=format&fit=crop') center/cover;
  display:flex;
  align-items:flex-end;
  padding:clamp(1.5rem,5vw,4rem);
}
.visual p{font:500 clamp(1.6rem,4vw,3.4rem)/.9 'Playfair Display';color:#eee0c8}
.visual i{color:#c9a96e}

.auth form{
  width:min(400px,86%);
  height:100%;
  margin:0 auto;
  padding:clamp(.5rem,3vh,1.5rem) 0;
  display:flex;
  flex-direction:column;
  justify-content:center;
  overflow-y:auto; /* red de seguridad si la pantalla es MUY chica */
}

.back{color:#817767;text-decoration:none;font:600 .65rem Inter;letter-spacing:.12em;text-transform:uppercase}
.eyebrow{margin-top:1.5rem;color:#c9a96e;text-transform:uppercase;font:600 .65rem Inter;letter-spacing:.2em}
h1{color:#eee0c8;font:500 clamp(1.6rem,3.2vw,2.8rem) 'Playfair Display';margin:.4rem 0 1.2rem}
label{display:block;color:#988d7d;font:600 .65rem Inter;letter-spacing:.14em;text-transform:uppercase;margin:.8rem 0 .4rem}
input{display:block;width:100%;margin:0;background:transparent;border:0;border-bottom:1px solid #3a3328;color:#eee0c8;padding:.6rem 0;font:1rem Inter;outline:0}
input:focus{border-color:#c9a96e}
input[aria-invalid="true"]{border-color:#d47b6e}
.field-error{color:#d47b6e;font:.68rem/1.4 Inter;margin:.35rem 0 0}
.auth button{width:100%;margin-top:1.2rem;padding:.85rem;background:#c9a96e;border:0;color:#080808;text-transform:uppercase;letter-spacing:.18em;font:600 .68rem Inter;cursor:pointer}
.auth button:disabled{opacity:.55;cursor:wait}
.auth button span{float:right;font-size:1.1rem}
.switch{color:#817767;text-align:center;font:.75rem Inter;margin-top:1rem}
.switch a{color:#c9a96e}
.error{color:#f09a8c;background:rgba(120,40,40,.14);border:1px solid rgba(212,123,110,.35);padding:.65rem;font:.75rem/1.5 Inter;margin-top:1rem}

@media(max-width:760px){
  .auth{grid-template-columns:1fr}
  .visual{display:none}
  .auth form{padding:clamp(.5rem,3vh,1.5rem) 0}
}
    `,
  ],
})
export class AuthPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly mode = this.route.snapshot.data['mode'] as 'login' | 'register';
  readonly emailPattern = '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$';
  name = '';
  email = '';
  password = '';
  readonly errorMessage = signal('');
  readonly submitting = signal(false);

  submit(form: NgForm): void {
    this.errorMessage.set('');
    form.control.markAllAsTouched();
    if (form.invalid) {
      this.errorMessage.set('Please correct the highlighted fields.');
      return;
    }

    this.submitting.set(true);
    const payload = { name: this.name.trim(), email: this.email.trim(), password: this.password };
    const request = this.mode === 'login' ? this.auth.login(payload) : this.auth.register(payload);
    request.subscribe({
      next: () => {
        this.submitting.set(false);
        void this.router.navigateByUrl('/recipes');
      },
      error: (error: unknown) => {
        this.submitting.set(false);
        this.errorMessage.set(this.getBackendMessage(error));
      },
    });
  }

  hasError(control: { invalid: boolean | null; touched: boolean | null } | null): boolean {
    return control?.invalid === true && control.touched === true;
  }

  nameError(control: { errors: Record<string, unknown> | null }): string {
    if (control.errors?.['required']) return 'Name is required.';
    if (control.errors?.['minlength']) return 'Name must be at least 2 characters.';
    return 'Please enter a valid name.';
  }

  emailError(control: { errors: Record<string, unknown> | null }): string {
    if (control.errors?.['required']) return 'Email is required.';
    return 'Enter a valid email address.';
  }

  passwordError(control: { errors: Record<string, unknown> | null }): string {
    if (control.errors?.['required']) return 'Password is required.';
    if (control.errors?.['minlength']) return 'Password must be at least 6 characters.';
    return 'Please enter a valid password.';
  }

  private getBackendMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const body = error.error as {
        message?: string;
        errors?: ({ message?: string } | string)[];
      } | null;
      if (body?.errors?.length) {
        return body.errors
          .map((item) => (typeof item === 'string' ? item : item.message))
          .filter(Boolean)
          .join(' ');
      }
      if (body?.message) return body.message;
      if (error.status === 0) return 'Could not connect to the server. Please try again.';
    }
    return 'Something went wrong. Please try again.';
  }
}
