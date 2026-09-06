import { Injectable, signal } from '@angular/core';

export type ToastKind = 'success' | 'error';

export interface Toast {
  kind: ToastKind;
  message: string;
}

const AUTO_DISMISS_MS = 3000;

/**
 * Mensajería global de éxito/error.
 * En lugar de `setTimeout` repartidos por los componentes, centralizamos el
 * auto-dismiss en un único lugar (evita timers huérfanos).
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly toastSignal = signal<Toast | null>(null);
  readonly toast = this.toastSignal.asReadonly();

  private timer: ReturnType<typeof setTimeout> | null = null;

  show(kind: ToastKind, message: string): void {
    this.clearTimer();
    this.toastSignal.set({ kind, message });
    this.timer = setTimeout(() => this.dismiss(), AUTO_DISMISS_MS);
  }

  success(message: string): void {
    this.show('success', message);
  }

  error(message: string): void {
    this.show('error', message);
  }

  dismiss(): void {
    this.clearTimer();
    this.toastSignal.set(null);
  }

  private clearTimer(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}