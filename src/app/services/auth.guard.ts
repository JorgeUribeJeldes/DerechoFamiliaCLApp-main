import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  async canActivate(): Promise<boolean> {
    console.log('AuthGuard.canActivate called');
    
    // Esperar un poco para asegurar que la sesión se ha guardado
    await new Promise(resolve => setTimeout(resolve, 50));
    
    const isAuth = await this.authService.checkAuth();
    console.log('AuthGuard.checkAuth result:', isAuth);
    
    if (!isAuth) {
      console.log('AuthGuard: Not authenticated, redirecting to /login');
      this.router.navigate(['/login']);
      return false;
    }
    console.log('AuthGuard: Authenticated, allowing access');
    return true;
  }
}
