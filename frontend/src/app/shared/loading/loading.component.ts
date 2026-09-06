import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  standalone: true,
  template: `
    <div class="loading">
      <div class="spinner" aria-hidden="true"></div>
      <p>Cargando...</p>
    </div>
  `,
  styles: `
    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 4rem;
      text-align: center;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 2px solid #1e1e1e;
      border-top-color: #c9a96e;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .loading p {
      margin-top: 1rem;
      color: #555;
      font-size: 0.85rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }
  `,
})
export class LoadingComponent {}