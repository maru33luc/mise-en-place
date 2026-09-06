import { Routes } from '@angular/router';

export const RECIPES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../recipes/recipe-shell/recipe-shell.component').then((m) => m.RecipeShellComponent),
  },
];

export default RECIPES_ROUTES;