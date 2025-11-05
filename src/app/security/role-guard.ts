import { CanActivateChildFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth-service';

export const roleGuard: CanActivateChildFn = (route, _) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const userRole = authService.getUserRoleFromToken();
  const requiredRoles = route.data['roles'] as string[] | undefined;

  if (requiredRoles && !requiredRoles.includes(userRole ?? '')) {
    alert('Non hai i permessi per accedere a questa pagina.');
    router.navigate(['/admin']).then();
    return false;
  }

  return true;
};
