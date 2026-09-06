import { Component, EventEmitter, Output, input } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    <div class="dialog-overlay" role="dialog" aria-modal="true" [attr.aria-labelledby]="'dialog-title-' + id">
      <div class="dialog">
        <h2 [attr.id]="'dialog-title-' + id">{{ title() }}</h2>
        <p>{{ message() }}</p>
        <div class="dialog-actions">
          <button type="button" class="primary-button" (click)="confirm()">Confirmar</button>
          <button type="button" class="secondary-button" (click)="cancel()">Cancelar</button>
        </div>
      </div>
    </div>
  `,
  styles: `
    .dialog-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 200;
    }
    .dialog {
      background: #111111;
      border: 1px solid #1e1e1e;
      border-top: 2px solid #c9a96e;
      border-radius: 2px;
      padding: 2rem;
      max-width: 420px;
    }
    .dialog h2 {
      font-family: 'Cormorant Garamond', serif;
      color: #e8e0d0;
      margin-bottom: 1rem;
    }
    .dialog p { color: #999; margin-bottom: 1.5rem; }
    .dialog-actions { display: flex; gap: 1rem; justify-content: flex-end; }
    .primary-button {
      background: #c9a96e;
      border: none;
      color: #0a0a0a;
      padding: 0.6rem 1.2rem;
      border-radius: 2px;
      cursor: pointer;
    }
    .secondary-button {
      background: transparent;
      border: 1px solid #1e1e1e;
      color: #e8e0d0;
      padding: 0.6rem 1.2rem;
      border-radius: 2px;
      cursor: pointer;
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