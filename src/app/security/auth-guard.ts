import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import {AuthService} from '../service/auth-service';

export const authGuard: CanActivateFn = (_, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const accessToken = authService.getAccessToken();

  if (!accessToken) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } }).then();
    return false;
  }

  return true;
};
