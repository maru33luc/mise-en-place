import { Component, inject } from '@angular/core';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-alert',
  standalone: true,
  template: `
    @if (toast(); as t) {
      <div class="alert" [class.alert-error]="t.kind === 'error'" [class.alert-success]="t.kind === 'success'" role="alert" aria-live="assertive">
        <span>{{ t.kind === 'success' ? '✓' : '⚠️' }} {{ t.message }}</span>
        <button type="button" class="close-btn" (click)="toastService.dismiss()" aria-label="Cerrar aviso">✕</button>
      </div>
    }
  `,
  styles: `
    .alert {
      margin-bottom: 2rem;
      padding: 1rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      border-radius: 2px;
      font-size: 0.875rem;
      letter-spacing: 0.05em;
      animation: slideDown 0.3s ease;
    }
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .alert-error {
      background: #1a0a0a;
      border: 1px solid #5c1f1f;
      color: #e07070;
    }
    .alert-success {
      background: #0a140a;
      border: 1px solid #1f5c1f;
      color: #70c070;
    }
    .close-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1rem;
      color: inherit;
      opacity: 0.6;
      transition: opacity 0.2s;
    }
    .close-btn:hover { opacity: 1; }
  `,
})
export class AlertComponent {
  protected readonly toast = inject(ToastService).toast;
  protected readonly toastService = inject(ToastService);
}