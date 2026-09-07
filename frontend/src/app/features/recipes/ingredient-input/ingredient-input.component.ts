import { Component, EventEmitter, Output, input, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  validateIngredientName,
  validateIngredientAmount,
  validateIngredientUnit,
} from '@core/utils/validators';
import type { Ingredient } from '@core/models/recipe.model';

@Component({
  selector: 'app-ingredient-input',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="ingredient-input">
      <input
        type="text"
        [(ngModel)]="name"
        name="ing-name-{{ id() }}"
        [id]="'ing-name-' + id()"
        placeholder="Name"
        class="text-input"
      />
      <input
        type="number"
        [(ngModel)]="amount"
        name="ing-amt-{{ id() }}"
        [id]="'ing-amt-' + id()"
        placeholder="Amount"
        class="text-input"
        step="0.1"
      />
      <input
        type="text"
        [(ngModel)]="unit"
        name="ing-unit-{{ id() }}"
        [id]="'ing-unit-' + id()"
        placeholder="Unit"
        class="text-input"
      />
      <button type="button" class="secondary-button" (click)="add()">
        Add
      </button>
      @if (validationError()) {
        <p class="validation-error" role="alert">{{ validationError() }}</p>
      }
    </div>

    @if (ingredients().length > 0) {
      <div class="ingredients-preview">
        @for (ing of ingredients(); track $index) {
          <div class="ingredient-tag">
            <span>{{ ing.name }} - {{ ing.amount }} {{ ing.unit }}</span>
            <button type="button" (click)="remove($index)" class="tag-close" [attr.aria-label]="'Remove ' + ing.name">×</button>
          </div>
        }
      </div>
    }
  `,
  styles: [
    `
    .ingredient-input {
      display: grid;
      grid-template-columns: 1.5fr 1fr 1fr auto;
      gap: 0.75rem;
      align-items: end;
    }
    .ingredients-preview {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
      margin-top: 1rem;
      padding: 1rem;
      background: #0a0a0a;
      border: 1px dashed #2a2a2a;
      border-radius: 2px;
    }
    .ingredient-tag {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4rem 0.85rem;
      background: #1a1810;
      border: 1px solid #c9a96e44;
      border-radius: 2px;
      font-size: 0.85rem;
      color: #c9a96e;
    }
    .tag-close {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1rem;
      color: #c9a96e;
      opacity: 0.6;
      transition: opacity 0.2s;
    }
    .tag-close:hover { opacity: 1; }
    .text-input {
      width: 100%;
      padding: 0.85rem 1rem;
      background: #080808;
      border: 1px solid #2a2a2a;
      border-radius: 2px;
      color: #f0e6d2;
      font-size: 0.95rem;
      font-family: inherit;
      transition: border-color 0.3s, box-shadow 0.3s, background 0.3s;
    }
    .text-input:focus {
      outline: none;
      border-color: #c9a96e;
      background: #0a0a0a;
      box-shadow: 0 0 0 3px rgba(201, 169, 110, 0.1);
    }
    .secondary-button {
      cursor: pointer;
      background: transparent;
      color: #8a8070;
      border: 1px solid #2a2a2a;
      border-radius: 2px;
      font-weight: 500;
      font-size: 0.85rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      padding: 0.9rem 1.5rem;
      font-family: inherit;
    }
    .secondary-button:hover:not(:disabled) { border-color: #555; color: #f0e6d2; }
    .secondary-button:disabled { opacity: 0.4; cursor: not-allowed; }
    .validation-error { grid-column: 1 / -1; margin: 0; color: #d47b6e; font: .7rem/1.4 Inter; }
    @media (max-width: 768px) { .ingredient-input { grid-template-columns: 1fr; } }
    `,
  ],
})
export class IngredientInputComponent {
  readonly id = input('ingredients');
  /** Lista actual de ingredientes (two-way con el formulario padre). */
  readonly ingredients = model<Ingredient[]>([]);

  @Output() errorMessage = new EventEmitter<string | null>();

  protected name = '';
  protected amount: number | null = null;
  protected unit = '';
  protected readonly validationError = signal('');

  protected add(): void {
    const nameError = validateIngredientName(this.name);
    if (nameError) {
      this.validationError.set(nameError);
      this.errorMessage.emit(nameError);
      return;
    }
    const amountError = validateIngredientAmount(this.amount);
    if (amountError) {
      this.validationError.set(amountError);
      this.errorMessage.emit(amountError);
      return;
    }
    const unitError = validateIngredientUnit(this.unit);
    if (unitError) {
      this.validationError.set(unitError);
      this.errorMessage.emit(unitError);
      return;
    }

    this.ingredients.update((list) => [...list, { name: this.name.trim(), amount: Number(this.amount), unit: this.unit.trim() }]);
    this.name = '';
    this.amount = null;
    this.unit = '';
    this.validationError.set('');
    this.errorMessage.emit(null);
  }

  protected remove(index: number): void {
    this.ingredients.update((list) => list.filter((_, i) => i !== index));
  }
}