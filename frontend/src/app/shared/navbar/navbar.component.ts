import { Component, HostListener, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { PrepListService } from '@core/services/prep-list.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="nav" [class.scrolled]="scrolled()">
      <a class="brand" routerLink="/" (click)="closeMenu()">
        <span>MP</span><strong>Mise en Place</strong>
      </a>

      @if (auth.user()) {
        <button
          class="menu-toggle"
          type="button"
          [attr.aria-expanded]="menuOpen()"
          aria-controls="primary-navigation"
          aria-label="Toggle navigation"
          (click)="menuOpen.update((open) => !open)"
        >
          <span></span><span></span>
        </button>
        <div id="primary-navigation" class="links" [class.open]="menuOpen()">
          <a routerLink="/recipes" routerLinkActive="active" (click)="closeMenu()">Collection</a>
          <a routerLink="/menu" routerLinkActive="active" (click)="closeMenu()">Daily Menu</a>
          <a routerLink="/prep-list" routerLinkActive="active" (click)="closeMenu()">Prep List <b>{{ pending() }}</b></a>
          <button type="button" (click)="auth.logout(); closeMenu()">Log out</button>
        </div>
      } @else {
        <a class="login" routerLink="/auth/login">Enter kitchen</a>
      }
    </nav>
  `,
  styles: [`
    :host { display: block; }
    .nav { height: 76px; padding: 0 clamp(1.25rem, 5vw, 5rem); display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid transparent; position: fixed; top: 0; left: 0; right: 0; z-index: 20; transition: .3s; background: rgba(8, 8, 8, .32); backdrop-filter: blur(16px); }
    .nav.scrolled { background: #080808; border-color: #2a2418; }
    .brand { display: flex; align-items: center; gap: .7rem; color: #eee0c8; text-decoration: none; }
    .brand span { display: grid; place-items: center; width: 32px; height: 32px; border: 1px solid #c9a96e; color: #c9a96e; font: 600 .7rem Inter; letter-spacing: .08em; }
    .brand strong { font: 500 1rem 'Playfair Display'; letter-spacing: .06em; }
    .links { display: flex; align-items: center; gap: 1.5rem; }
    .links a, .links button, .login { background: none; border: 0; color: #958b7d; text-decoration: none; font: 500 .68rem Inter; letter-spacing: .14em; text-transform: uppercase; cursor: pointer; }
    .links a:hover, .links .active, .links button:hover, .login:hover { color: #d4b87a; }
    .links b { color: #080808; background: #c9a96e; border-radius: 50%; padding: .15rem .38rem; margin-left: .25rem; font-size: .6rem; }
    .menu-toggle { display: none; background: transparent; border: 0; padding: .5rem; cursor: pointer; }
    .menu-toggle span { display: block; width: 24px; height: 1px; margin: 5px; background: #c9a96e; transition: transform .2s; }
    @media (max-width: 700px) {
      .brand strong { display: none; }
      .menu-toggle { display: block; }
      .links { position: absolute; top: 76px; left: 0; right: 0; display: none; flex-direction: column; align-items: stretch; gap: 0; padding: .6rem 1.25rem 1rem; background: rgba(8, 8, 8, .98); border-bottom: 1px solid #2a2418; }
      .links.open { display: flex; }
      .links a, .links button { padding: .9rem .25rem; text-align: left; }
    }
  `]
})
export class NavbarComponent {
  readonly auth = inject(AuthService);
  readonly pending = signal(0);
  readonly scrolled = signal(false);
  readonly menuOpen = signal(false);

  constructor() {
    if (this.auth.isAuthenticated()) {
      inject(PrepListService).getAll().subscribe({
        next: (response) => this.pending.set((response.data ?? []).filter((task) => task.status !== 'done').length),
        error: () => undefined,
      });
    }
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 16);
  }

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth > 700) this.closeMenu();
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
