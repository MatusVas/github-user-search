import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Auth guard for protecting routes that require authentication
 * Redirects unauthenticated users to home page with return URL
 * Uses functional guard pattern (Angular 21)
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirect to home with return URL
  return router.createUrlTree(['/'], {
    queryParams: { returnUrl: state.url }
  });
};
