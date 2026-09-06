import { Component, EventEmitter, Output, input } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    <div class="dialog-overlay" role="dialog" aria-modal="true" [attr.aria-labelledby]="'dialog-title-' + id">
      <div class="dialog">
        <span class="dialog-ornament">~</span>
        <h2 [attr.id]="'dialog-title-' + id">{{ title() }}</h2>
        <p>{{ message() }}</p>
        <div class="dialog-actions">
          <button type="button" class="secondary-button" (click)="cancel()">Cancelar</button>
          <button type="button" class="danger-button" (click)="confirm()">Eliminar</button>
        </div>
      </div>
    </div>
  `,
  styles: `
    .dialog-overlay {
      position: fixed;
      inset: 0;
      background: rgba(4, 4, 4, 0.75);
      backdrop-filter: blur(6px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 200;
      animation: overlayIn 0.3s ease;
    }
    @keyframes overlayIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .dialog {
      background: #0c0c0c;
      border: 1px solid #1a1a1a;
      border-top: 2px solid #c9a96e;
      border-radius: 4px;
      padding: 2.5rem;
      max-width: 420px;
      width: calc(100% - 2rem);
      text-align: center;
      animation: dialogIn 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
    @keyframes dialogIn {
      from { opacity: 0; transform: translateY(20px) scale(0.97); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .dialog-ornament {
      display: block;
      font-size: 1.5rem;
      color: #c9a96e;
      opacity: 0.4;
      margin-bottom: 1rem;
    }
    .dialog h2 {
      font-family: 'Playfair Display', serif;
      font-size: 1.6rem;
      font-weight: 500;
      color: #f0e6d2;
      margin-bottom: 0.75rem;
    }
    .dialog p {
      color: #8a8070;
      font-size: 0.9rem;
      line-height: 1.7;
      margin-bottom: 2rem;
    }
    .dialog-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: center;
    }
    .dialog-actions button {
      flex: 1;
      padding: 0.85rem 1.2rem;
      border-radius: 2px;
      cursor: pointer;
      font-family: 'Inter', sans-serif;
      font-size: 0.8rem;
      font-weight: 500;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
    .secondary-button {
      background: transparent;
      border: 1px solid #2a2a2a;
      color: #8a8070;
    }
    .secondary-button:hover { border-color: #555; color: #f0e6d2; }
    .danger-button {
      background: transparent;
      border: 1px solid rgba(120, 40, 40, 0.6);
      color: #c05050;
    }
    .danger-button:hover {
      background: rgba(120, 40, 40, 0.15);
      border-color: #c05050;
      box-shadow: 0 4px 20px rgba(192, 80, 80, 0.15);
    }
  `,
})
export class ConfirmDialogComponent {
  readonly id = input.required<string>();
  readonly title = input('¿Confirmas eliminar?');
  readonly message = input('Esta acción no se puede deshacer.');

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  confirm(): void {
    this.confirmed.emit();
  }

  cancel(): void {
    this.cancelled.emit();
  }
}