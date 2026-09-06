import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

export const authGuard: CanActivateFn = () => inject(AuthService).isAuthenticated() ? true : inject(Router).createUrlTree(['/auth/login']);
export const publicGuard: CanActivateFn = () => inject(AuthService).isAuthenticated() ? inject(Router).createUrlTree(['/recipes']) : true;
