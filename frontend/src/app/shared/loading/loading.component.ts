import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  standalone: true,
  template: `
    <div class="loading" role="status" aria-label="Loading content">
      <div class="spinner-ring" aria-hidden="true">
        <div class="spinner-inner"></div>
      </div>
      <p class="loading-label">Preparing the table</p>
    </div>
  `,
  styles: `
    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 5rem 2rem;
      text-align: center;
      animation: fadeIn 0.6s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .spinner-ring {
      width: 52px;
      height: 52px;
      border: 1px solid rgba(201, 169, 110, 0.15);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .spinner-ring::before {
      content: '';
      position: absolute;
      inset: -1px;
      border-radius: 50%;
      border: 1px solid transparent;
      border-top-color: #c9a96e;
      border-right-color: #c9a96e;
      animation: spin 1.2s cubic-bezier(0.6, 0.15, 0.4, 0.85) infinite;
    }
    .spinner-inner {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #c9a96e;
      animation: pulse 1.2s ease-in-out infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(0.6); opacity: 0.5; }
    }
    .loading-label {
      margin-top: 1.5rem;
      color: #8a8070;
      font-size: 0.7rem;
      letter-spacing: 0.3em;
      text-transform: uppercase;
    }
  `,
})
export class LoadingComponent {}