import { Routes } from '@angular/router';
import { authGuard, homeGuard, publicGuard } from '@core/guards';

export const appRoutes: Routes = [
  {
    path: '',
    canActivate: [homeGuard],
    loadComponent: () => import('@features/home/home.component').then((m) => m.HomeComponent),
  },
  { path: 'auth/login', canActivate: [publicGuard], loadComponent: () => import('@features/auth/auth-page.component').then((m) => m.AuthPageComponent), data: { mode: 'login' } },
  { path: 'auth/register', canActivate: [publicGuard], loadComponent: () => import('@features/auth/auth-page.component').then((m) => m.AuthPageComponent), data: { mode: 'register' } },
  { path: 'recipes', canActivate: [authGuard], loadComponent: () => import('@features/recipes/recipe-shell/recipe-shell.component').then((m) => m.RecipeShellComponent) },
  { path: 'recipes/:id', canActivate: [authGuard], loadComponent: () => import('@features/recipes/recipe-detail.component').then((m) => m.RecipeDetailComponent) },
  { path: 'menu', canActivate: [authGuard], loadComponent: () => import('@features/menu/menu.component').then((m) => m.MenuComponent) },
  { path: 'prep-list', canActivate: [authGuard], loadComponent: () => import('@features/prep-list/prep-list.component').then((m) => m.PrepListComponent) },
  { path: '**', redirectTo: '' },
];