import { Injectable } from '@angular/core';

export interface UserSession {
  id?: number;
  username: string;
  isAuthenticated: boolean;
  lastLogin: string;
}

export interface UserData {
  id?: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  password: string;
  createdAt: string;
}

export interface LocationHistory {
  id?: number;
  lat: number;
  lon: number;
  city: string;
  country: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor() {
    this.init();
  }

  async init() {
    // Inicializar usuarios demo si no existen
    await this.initDefaultUsers();
  }

  // Métodos de Usuario
  async saveUser(user: UserData): Promise<void> {
    const users = await this.getAllUsers();
    const existingUserIndex = users.findIndex(u => u.username === user.username || u.email === user.email);
    
    if (existingUserIndex >= 0) {
      users[existingUserIndex] = { ...user, id: users[existingUserIndex].id };
    } else {
      user.id = Date.now();
      users.push(user);
    }
    
    localStorage.setItem('users', JSON.stringify(users));
  }

  async getUser(username: string): Promise<UserData | null> {
    const users = await this.getAllUsers();
    return users.find(u => u.username === username || u.email === username) || null;
  }

  async getUserByEmail(email: string): Promise<UserData | null> {
    const users = await this.getAllUsers();
    return users.find(u => u.email === email) || null;
  }

  async getAllUsers(): Promise<UserData[]> {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }

  async deleteUser(username: string): Promise<void> {
    const users = await this.getAllUsers();
    const filteredUsers = users.filter(u => u.username !== username);
    localStorage.setItem('users', JSON.stringify(filteredUsers));
  }

  // Métodos de Sesión
  async saveUserSession(session: UserSession): Promise<void> {
    localStorage.setItem('userSession', JSON.stringify(session));
  }

  async getUserSession(): Promise<UserSession | null> {
    const session = localStorage.getItem('userSession');
    return session ? JSON.parse(session) : null;
  }

  async clearUserSession(): Promise<void> {
    localStorage.removeItem('userSession');
  }

  // Métodos de Historial de Ubicación
  async saveLocationHistory(location: LocationHistory): Promise<void> {
    const history = await this.getLocationHistory();
    location.id = Date.now();
    history.push(location);
    
    // Mantener solo los últimos 50 registros
    if (history.length > 50) {
      history.splice(0, history.length - 50);
    }
    
    localStorage.setItem('locationHistory', JSON.stringify(history));
  }

  async getLocationHistory(): Promise<LocationHistory[]> {
    const history = localStorage.getItem('locationHistory');
    return history ? JSON.parse(history) : [];
  }

  async clearLocationHistory(): Promise<void> {
    localStorage.removeItem('locationHistory');
  }

  // Inicializar usuarios por defecto
  private async initDefaultUsers(): Promise<void> {
    const users = await this.getAllUsers();
    if (users.length === 0) {
      const defaultUsers: UserData[] = [
        {
          id: 1,
          username: 'usuario',
          email: 'usuario@demo.cl',
          firstName: 'Usuario',
          lastName: 'Demo',
          role: 'user',
          password: '1234',
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          username: 'admin',
          email: 'admin@demo.cl',
          firstName: 'Admin',
          lastName: 'Sistema',
          role: 'admin',
          password: 'admin123',
          createdAt: new Date().toISOString()
        }
      ];

      for (const user of defaultUsers) {
        await this.saveUser(user);
      }
    }
  }

  // Método para obtener configuración
  async getConfig(key: string): Promise<any> {
    const config = localStorage.getItem(`config_${key}`);
    return config ? JSON.parse(config) : null;
  }

  async setConfig(key: string, value: any): Promise<void> {
    localStorage.setItem(`config_${key}`, JSON.stringify(value));
  }

  // Métodos genéricos de almacenamiento (compatibilidad con api.service)
  async get(key: string): Promise<any> {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key: string, value: any): Promise<void> {
    localStorage.setItem(key, JSON.stringify(value));
  }

  async remove(key: string): Promise<void> {
    localStorage.removeItem(key);
  }

  // Métodos de cache (compatibilidad con contacto.page y faq.page)
  async getCachedData(key: string): Promise<any> {
    return await this.get(key);
  }

  async cacheData(key: string, data: any): Promise<void> {
    await this.set(key, data);
  }

  // Limpiar toda la base de datos
  async clearDatabase(): Promise<void> {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('users') || key.startsWith('userSession') || 
          key.startsWith('locationHistory') || key.startsWith('config_')) {
        localStorage.removeItem(key);
      }
    });
    
    // Reinicializar usuarios por defecto
    await this.initDefaultUsers();
  }
}
