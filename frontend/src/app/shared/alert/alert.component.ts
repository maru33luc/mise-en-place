import { Component, inject } from '@angular/core';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-alert',
  standalone: true,
  template: `
    @if (toast(); as t) {
      <div class="alert" [class.alert-error]="t.kind === 'error'" [class.alert-success]="t.kind === 'success'" role="alert" aria-live="assertive">
        <div class="alert-indicator"></div>
        <span class="alert-message">{{ t.kind === 'success' ? '✓' : '⚠' }} {{ t.message }}</span>
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
      gap: 1rem;
      border-radius: 2px;
      font-size: 0.875rem;
      letter-spacing: 0.05em;
      animation: slideDown 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
      position: relative;
      overflow: hidden;
    }
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .alert-indicator {
      width: 3px;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
    }
    .alert-error {
      background: rgba(26, 10, 10, 0.9);
      border: 1px solid rgba(92, 31, 31, 0.5);
      color: #e07070;
      backdrop-filter: blur(8px);
    }
    .alert-error .alert-indicator {
      background: linear-gradient(180deg, #c05050, #5c1f1f);
    }
    .alert-success {
      background: rgba(10, 20, 10, 0.9);
      border: 1px solid rgba(31, 92, 31, 0.5);
      color: #70c070;
      backdrop-filter: blur(8px);
    }
    .alert-success .alert-indicator {
      background: linear-gradient(180deg, #50a050, #1f5c1f);
    }
    .alert-message {
      flex: 1;
      padding-left: 0.5rem;
    }
    .close-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1rem;
      color: inherit;
      opacity: 0.5;
      transition: opacity 0.2s;
      padding: 0.25rem;
    }
    .close-btn:hover { opacity: 1; }
  `,
})
export class AlertComponent {
  protected readonly toast = inject(ToastService).toast;
  protected readonly toastService = inject(ToastService);
}