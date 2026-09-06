import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="empty-state">
      <div class="empty-icon" aria-hidden="true">🍽️</div>
      <h3>{{ title() }}</h3>
      <p>{{ message() }}</p>
    </div>
  `,
  styles: `
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 5rem 2rem;
      text-align: center;
      border: 1px dashed #1e1e1e;
      border-radius: 2px;
    }
    .empty-icon {
      font-size: 3rem;
      margin-bottom: 1.5rem;
      opacity: 0.4;
    }
    .empty-state h3 {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.5rem;
      color: #444;
      margin-bottom: 0.5rem;
      font-weight: 400;
    }
    .empty-state p {
      color: #333;
      font-size: 0.85rem;
      letter-spacing: 0.05em;
    }
  `,
})
export class EmptyStateComponent {
  readonly title = input.required<string>();
  readonly message = input.required<string>();
}