import { Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { 
    path: 'login', 
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage) 
  },
  { 
    path: 'register', 
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage) 
  },
  { 
    path: 'forgot-password', 
    loadComponent: () => import('./pages/forgot-password/forgot-password.page').then(m => m.ForgotPasswordPage) 
  },
  { 
    path: 'inicio', 
    loadComponent: () => import('./pages/inicio/inicio.page').then(m => m.InicioPage),
    canActivate: [AuthGuard]
  },
  { 
    path: 'conceptos', 
    loadComponent: () => import('./pages/conceptos/conceptos.page').then(m => m.ConceptosPage),
    canActivate: [AuthGuard]
  },
  { 
    path: 'faq', 
    loadComponent: () => import('./pages/faq/faq.page').then(m => m.FaqPage),
    canActivate: [AuthGuard]
  },
  { 
    path: 'contacto', 
    loadComponent: () => import('./pages/contacto/contacto.page').then(m => m.ContactoPage),
    canActivate: [AuthGuard]
  },
];
