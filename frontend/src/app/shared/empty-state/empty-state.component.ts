import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="empty-state">
      <div class="empty-ornament">~</div>
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
    }
    .empty-ornament {
      font-size: 2.5rem;
      color: #c9a96e;
      opacity: 0.4;
      margin-bottom: 1.5rem;
    }
    .empty-state h3 {
      font-family: 'Playfair Display', serif;
      font-size: 1.6rem;
      color: #555;
      margin-bottom: 0.75rem;
      font-weight: 400;
    }
    .empty-state p {
      color: #444;
      font-size: 0.9rem;
      letter-spacing: 0.05em;
      max-width: 300px;
    }
  `,
})
export class EmptyStateComponent {
  readonly title = input.required<string>();
  readonly message = input.required<string>();
}