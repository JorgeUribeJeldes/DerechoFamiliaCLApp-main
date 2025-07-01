import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

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
  private db: SQLiteObject | null = null;
  private _storage: Storage | null = null;

  constructor(
    private storage: Storage,
    private sqlite: SQLite
  ) {
    this.init();
  }

  async init() {
    // Inicializar Ionic Storage
    const storage = await this.storage.create();
    this._storage = storage;

    // Inicializar SQLite (solo en dispositivo móvil)
    try {
      await this.initDatabase();
    } catch (error) {
      console.log('SQLite no disponible, usando Storage como fallback:', error);
    }
  }

  private async initDatabase() {
    this.db = await this.sqlite.create({
      name: 'derecho_familia.db',
      location: 'default'
    });

    await this.createTables();
  }

  private async createTables() {
    if (!this.db) return;

    // Tabla de usuarios
    await this.db.executeSql(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        password TEXT NOT NULL,
        createdAt TEXT NOT NULL
      )
    `, []);

    // Tabla de sesiones de usuario
    await this.db.executeSql(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        isAuthenticated INTEGER NOT NULL,
        lastLogin TEXT NOT NULL
      )
    `, []);

    // Tabla de historial de ubicaciones
    await this.db.executeSql(`
      CREATE TABLE IF NOT EXISTS location_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        lat REAL NOT NULL,
        lon REAL NOT NULL,
        city TEXT NOT NULL,
        country TEXT NOT NULL,
        timestamp TEXT NOT NULL
      )
    `, []);
  }

  // Operaciones de usuarios
  async saveUser(user: Omit<UserData, 'id' | 'createdAt'>): Promise<void> {
    const createdAt = new Date().toISOString();
    
    if (this.db) {
      await this.db.executeSql(`
        INSERT INTO users 
        (username, email, firstName, lastName, role, password, createdAt) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [user.username, user.email, user.firstName, user.lastName, user.role, user.password, createdAt]);
    } else {
      // Fallback a Storage
      const users = await this._storage?.get('users') || [];
      users.push({ ...user, id: Date.now(), createdAt });
      await this._storage?.set('users', users);
    }
  }

  async getUser(username: string): Promise<UserData | null> {
    if (this.db) {
      const result = await this.db.executeSql(`
        SELECT * FROM users WHERE username = ?
      `, [username]);
      
      if (result.rows.length > 0) {
        return result.rows.item(0);
      }
    } else {
      // Fallback a Storage
      const users = await this._storage?.get('users') || [];
      return users.find((user: UserData) => user.username === username) || null;
    }
    return null;
  }

  async getUserByEmail(email: string): Promise<UserData | null> {
    if (this.db) {
      const result = await this.db.executeSql(`
        SELECT * FROM users WHERE email = ?
      `, [email]);
      
      if (result.rows.length > 0) {
        return result.rows.item(0);
      }
    } else {
      // Fallback a Storage
      const users = await this._storage?.get('users') || [];
      return users.find((user: UserData) => user.email === email) || null;
    }
    return null;
  }

  async updateUser(username: string, updates: Partial<UserData>): Promise<void> {
    if (this.db) {
      const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
      const values = Object.values(updates);
      values.push(username);
      
      await this.db.executeSql(`
        UPDATE users SET ${fields} WHERE username = ?
      `, values);
    } else {
      // Fallback a Storage
      const users = await this._storage?.get('users') || [];
      const userIndex = users.findIndex((user: UserData) => user.username === username);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
        await this._storage?.set('users', users);
      }
    }
  }

  // Operaciones de sesiones de usuario
  async saveUserSession(session: UserSession): Promise<void> {
    if (this.db) {
      await this.db.executeSql(`
        INSERT OR REPLACE INTO user_sessions 
        (username, isAuthenticated, lastLogin) 
        VALUES (?, ?, ?)
      `, [session.username, session.isAuthenticated ? 1 : 0, session.lastLogin]);
    } else {
      // Fallback a Storage
      await this._storage?.set('userSession', session);
    }
  }

  async getUserSession(): Promise<UserSession | null> {
    if (this.db) {
      const result = await this.db.executeSql(`
        SELECT * FROM user_sessions ORDER BY id DESC LIMIT 1
      `, []);
      
      if (result.rows.length > 0) {
        const row = result.rows.item(0);
        return {
          id: row.id,
          username: row.username,
          isAuthenticated: row.isAuthenticated === 1,
          lastLogin: row.lastLogin
        };
      }
    } else {
      // Fallback a Storage
      return await this._storage?.get('userSession') || null;
    }
    return null;
  }

  // Operaciones de ubicación
  async saveLocation(location: LocationHistory): Promise<void> {
    if (this.db) {
      await this.db.executeSql(`
        INSERT INTO location_history 
        (lat, lon, city, country, timestamp) 
        VALUES (?, ?, ?, ?, ?)
      `, [location.lat, location.lon, location.city, location.country, location.timestamp]);
    } else {
      // Fallback a Storage
      const history = await this._storage?.get('locationHistory') || [];
      history.push(location);
      await this._storage?.set('locationHistory', history);
    }
  }

  async getLocationHistory(limit: number = 10): Promise<LocationHistory[]> {
    if (this.db) {
      const result = await this.db.executeSql(`
        SELECT * FROM location_history 
        ORDER BY timestamp DESC 
        LIMIT ?
      `, [limit]);
      
      const locations: LocationHistory[] = [];
      for (let i = 0; i < result.rows.length; i++) {
        locations.push(result.rows.item(i));
      }
      return locations;
    } else {
      // Fallback a Storage
      const history = await this._storage?.get('locationHistory') || [];
      return history.slice(-limit).reverse();
    }
  }

  async clearLocationHistory(): Promise<void> {
    if (this.db) {
      await this.db.executeSql('DELETE FROM location_history', []);
    } else {
      await this._storage?.remove('locationHistory');
    }
  }

  // Operaciones generales de Storage
  async get(key: string): Promise<any> {
    return await this._storage?.get(key);
  }

  async set(key: string, value: any): Promise<void> {
    await this._storage?.set(key, value);
  }

  async remove(key: string): Promise<void> {
    await this._storage?.remove(key);
  }

  // Métodos específicos para cache de datos
  async cacheData(key: string, data: string): Promise<void> {
    await this._storage?.set(key, data);
  }

  async getCachedData(key: string): Promise<string | null> {
    return await this._storage?.get(key);
  }

  async removeCachedData(key: string): Promise<void> {
    await this._storage?.remove(key);
  }
}
