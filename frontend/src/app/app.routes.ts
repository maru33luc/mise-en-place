import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('@features/home/home.component').then((m) => m.HomeComponent),
  },
  { path: 'auth/login', canActivate: [() => import('@core/guards').then((m) => m.publicGuard)], loadComponent: () => import('@features/auth/auth-page.component').then((m) => m.AuthPageComponent), data: { mode: 'login' } },
  { path: 'auth/register', canActivate: [() => import('@core/guards').then((m) => m.publicGuard)], loadComponent: () => import('@features/auth/auth-page.component').then((m) => m.AuthPageComponent), data: { mode: 'register' } },
  { path: 'recipes', canActivate: [() => import('@core/guards').then((m) => m.authGuard)], loadComponent: () => import('@features/recipes/recipe-shell/recipe-shell.component').then((m) => m.RecipeShellComponent) },
  { path: 'recipes/:id', canActivate: [() => import('@core/guards').then((m) => m.authGuard)], loadComponent: () => import('@features/recipes/recipe-detail.component').then((m) => m.RecipeDetailComponent) },
  { path: 'menu', canActivate: [() => import('@core/guards').then((m) => m.authGuard)], loadComponent: () => import('@features/menu/menu.component').then((m) => m.MenuComponent) },
  { path: 'prep-list', canActivate: [() => import('@core/guards').then((m) => m.authGuard)], loadComponent: () => import('@features/prep-list/prep-list.component').then((m) => m.PrepListComponent) },
  { path: '**', redirectTo: '' },
];