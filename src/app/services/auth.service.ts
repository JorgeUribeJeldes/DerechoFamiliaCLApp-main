import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { DatabaseService, UserSession } from './database.service';

export interface User {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  isAuthenticated: boolean;
  lastLogin?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  private databaseService = inject(DatabaseService);
  private authSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor() {
    // Inicialización síncrona para evitar bloqueos
    this.initSync();
  }

  private initSync() {
    // Inicialización síncrona básica
    this.authSubject.next(false);
    this.currentUserSubject.next(null);
    
    // Verificar sesión de forma asíncrona después
    this.checkStoredSession();
  }

  private async checkStoredSession() {
    try {
      const session = await this.databaseService.getUserSession();
      const isAuth = session?.isAuthenticated || false;
      this.authSubject.next(isAuth);
      
      if (isAuth && session) {
        const user = await this.getUserData(session.username);
        this.currentUserSubject.next(user);
      }
    } catch (error) {
      console.error('Error checking stored session:', error);
      this.authSubject.next(false);
      this.currentUserSubject.next(null);
    }
  }

  async init() {
    return this.checkStoredSession();
  }

  async login(username: string, password: string): Promise<boolean> {
    // Validar credenciales
    const user = await this.validateCredentials(username, password);
    
    if (user) {
      this.authSubject.next(true);
      this.currentUserSubject.next(user);
      
      const session: UserSession = {
        username: user.username,
        isAuthenticated: true,
        lastLogin: new Date().toISOString()
      };
      
      await this.databaseService.saveUserSession(session);
      return true;
    }
    return false;
  }

  async register(userData: Omit<User, 'isAuthenticated' | 'lastLogin'>, password: string): Promise<boolean> {
    try {
      // Guardar usuario en la base de datos
      await this.databaseService.saveUser({
        ...userData,
        password: await this.hashPassword(password),
        createdAt: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      return false;
    }
  }

  async logout() {
    this.authSubject.next(false);
    this.currentUserSubject.next(null);
    
    const session: UserSession = {
      username: '',
      isAuthenticated: false,
      lastLogin: new Date().toISOString()
    };
    
    await this.databaseService.saveUserSession(session);
    this.router.navigate(['/login']);
  }

  async checkAuth(): Promise<boolean> {
    const session = await this.databaseService.getUserSession();
    const isAuth = session?.isAuthenticated || false;
    this.authSubject.next(isAuth);
    return isAuth;
  }

  async getCurrentUser(): Promise<User | null> {
    const session = await this.databaseService.getUserSession();
    if (session?.isAuthenticated && session.username) {
      return await this.getUserData(session.username);
    }
    return null;
  }

  getAuthState(): Observable<boolean> {
    return this.authSubject.asObservable();
  }

  getCurrentUserObservable(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  async resetPassword(email: string): Promise<boolean> {
    // Simular envío de email de recuperación
    const user = await this.databaseService.getUserByEmail(email);
    if (user) {
      // En una implementación real, enviarías un email
      console.log(`Email de recuperación enviado a: ${email}`);
      return true;
    }
    return false;
  }

  validatePasswordStrength(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('La contraseña debe tener al menos 8 caracteres');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Debe contener al menos una mayúscula');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Debe contener al menos una minúscula');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Debe contener al menos un número');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Debe contener al menos un carácter especial');
    }
    
    return { isValid: errors.length === 0, errors };
  }

  private async validateCredentials(username: string, password: string): Promise<User | null> {
    // Usuarios demo predefinidos
    const demoUsers: { [key: string]: User & { password: string } } = {
      'usuario': {
        username: 'usuario',
        email: 'usuario@demo.cl',
        firstName: 'Usuario',
        lastName: 'Demo',
        role: 'user',
        isAuthenticated: false,
        password: '1234'
      },
      'usuario@demo.cl': {
        username: 'usuario',
        email: 'usuario@demo.cl',
        firstName: 'Usuario',
        lastName: 'Demo',
        role: 'user',
        isAuthenticated: false,
        password: '1234'
      },
      'admin': {
        username: 'admin',
        email: 'admin@demo.cl',
        firstName: 'Admin',
        lastName: 'Sistema',
        role: 'admin',
        isAuthenticated: false,
        password: 'admin123'
      },
      'admin@demo.cl': {
        username: 'admin',
        email: 'admin@demo.cl',
        firstName: 'Admin',
        lastName: 'Sistema',
        role: 'admin',
        isAuthenticated: false,
        password: 'admin123'
      }
    };

    const user = demoUsers[username];
    
    if (user && user.password === password) {
      const { password: _, ...userWithoutPassword } = user;
      return { ...userWithoutPassword, isAuthenticated: true };
    }

    // Buscar en la base de datos solo si no es usuario demo
    try {
      const dbUser = await this.databaseService.getUser(username);
      if (dbUser && await this.verifyPassword(password, dbUser.password)) {
        return {
          username: dbUser.username,
          email: dbUser.email,
          firstName: dbUser.firstName,
          lastName: dbUser.lastName,
          role: dbUser.role,
          isAuthenticated: true
        };
      }
    } catch (error) {
      console.log('Database not available, using demo credentials only');
    }

    return null;
  }

  private async getUserData(username: string): Promise<User | null> {
    // Buscar en usuarios demo primero
    const demoUsers: { [key: string]: User } = {
      'usuario': {
        username: 'usuario',
        email: 'usuario@demo.cl',
        firstName: 'Usuario',
        lastName: 'Demo',
        role: 'user',
        isAuthenticated: true
      },
      'admin': {
        username: 'admin',
        email: 'admin@demo.cl',
        firstName: 'Admin',
        lastName: 'Sistema',
        role: 'admin',
        isAuthenticated: true
      }
    };

    if (demoUsers[username]) {
      return demoUsers[username];
    }

    // Buscar en la base de datos
    const dbUser = await this.databaseService.getUser(username);
    if (dbUser) {
      return {
        username: dbUser.username,
        email: dbUser.email,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        role: dbUser.role,
        isAuthenticated: true
      };
    }

    return null;
  }

  private async hashPassword(password: string): Promise<string> {
    // En un proyecto real, usar bcrypt o similar
    return btoa(password); // Base64 simple para demo
  }

  private async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return btoa(password) === hashedPassword;
  }
}
