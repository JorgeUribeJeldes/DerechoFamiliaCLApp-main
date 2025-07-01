import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, tap, timeout } from 'rxjs/operators';
import { GeolocationService, LocationData } from './geolocation.service';
import { DatabaseService, LocationHistory } from './database.service';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  cached?: boolean;
}

export interface LegalConcept {
  id: number;
  title: string;
  description: string;
  category: string;
  lastUpdated: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly TIMEOUT_MS = 10000; // 10 segundos
  private isOnline$ = new BehaviorSubject<boolean>(true);
  
  // APIs de ejemplo para diferentes datos
  private readonly APIS = {
    concepts: 'https://jsonplaceholder.typicode.com/posts', // Simular conceptos legales
    location: 'http://ip-api.com/json/',
    backup: 'https://httpbin.org/json' // API de respaldo
  };

  constructor(
    private http: HttpClient,
    private geolocationService: GeolocationService,
    private databaseService: DatabaseService
  ) {
    this.setupNetworkMonitoring();
  }

  private setupNetworkMonitoring() {
    // Monitorear estado de conexión
    window.addEventListener('online', () => {
      this.isOnline$.next(true);
      console.log('Conexión restaurada');
    });

    window.addEventListener('offline', () => {
      this.isOnline$.next(false);
      console.log('Sin conexión a internet');
    });
  }

  get isOnline(): Observable<boolean> {
    return this.isOnline$.asObservable();
  }

  // Consulta síncrona para conceptos legales con persistencia
  async getLegalConcepts(): Promise<ApiResponse<LegalConcept[]>> {
    try {
      if (!navigator.onLine) {
        return await this.getCachedConcepts();
      }

      const response = await this.http.get<any[]>(this.APIS.concepts)
        .pipe(
          timeout(this.TIMEOUT_MS),
          catchError(this.handleError)
        ).toPromise();

      if (response && Array.isArray(response)) {
        const concepts = this.transformToConcepts(response.slice(0, 20)); // Limitar a 20
        
        // Guardar en cache para uso offline
        await this.databaseService.set('cached_concepts', concepts);
        await this.databaseService.set('concepts_timestamp', Date.now());

        return {
          success: true,
          data: concepts,
          cached: false
        };
      }

      throw new Error('Respuesta inválida de la API');
    } catch (error) {
      console.error('Error obteniendo conceptos:', error);
      return await this.getCachedConcepts();
    }
  }

  // Consulta asíncrona para ubicación con persistencia
  getLocationData(): Observable<ApiResponse<LocationData>> {
    return new Observable(observer => {
      this.geolocationService.getCompleteLocation()
        .then(async location => {
          // Guardar en historial
          const locationHistory: LocationHistory = {
            lat: location.lat,
            lon: location.lon,
            city: location.city,
            country: location.country,
            timestamp: new Date().toISOString()
          };
          
          // Obtener historial actual y agregar nueva ubicación
          const currentHistory = await this.databaseService.getLocationHistory();
          currentHistory.push(locationHistory);
          
          // Mantener solo los últimos 50 registros
          if (currentHistory.length > 50) {
            currentHistory.splice(0, currentHistory.length - 50);
          }
          
          // Guardar historial actualizado
          await this.databaseService.set('locationHistory', currentHistory);

          observer.next({
            success: true,
            data: location,
            cached: false
          });
          observer.complete();
        })
        .catch(async error => {
          console.error('Error obteniendo ubicación:', error);
          
          // Intentar obtener última ubicación conocida
          const lastLocation = await this.getLastKnownLocation();
          observer.next(lastLocation);
          observer.complete();
        });
    });
  }

  // Consulta con reintentos automáticos
  async getDataWithRetry<T>(
    url: string, 
    maxRetries: number = 3
  ): Promise<ApiResponse<T>> {
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await this.http.get<T>(url)
          .pipe(
            timeout(this.TIMEOUT_MS),
            catchError(this.handleError)
          ).toPromise();

        if (response) {
          return {
            success: true,
            data: response,
            cached: false
          };
        } else {
          throw new Error('Respuesta vacía del servidor');
        }
      } catch (error) {
        lastError = error;
        console.log(`Intento ${attempt} falló:`, error);
        
        if (attempt < maxRetries) {
          // Esperar antes del siguiente intento (backoff exponencial)
          await this.delay(Math.pow(2, attempt) * 1000);
        }
      }
    }

    return {
      success: false,
      error: `Error después de ${maxRetries} intentos: ${lastError.message}`,
      cached: false
    };
  }

  // Obtener datos desde cache cuando no hay conexión
  private async getCachedConcepts(): Promise<ApiResponse<LegalConcept[]>> {
    const cachedConcepts = await this.databaseService.get('cached_concepts');
    const timestamp = await this.databaseService.get('concepts_timestamp');
    
    if (cachedConcepts) {
      const age = Date.now() - (timestamp || 0);
      const isStale = age > 24 * 60 * 60 * 1000; // 24 horas
      
      return {
        success: true,
        data: cachedConcepts,
        cached: true,
        error: isStale ? 'Datos desactualizados (sin conexión)' : undefined
      };
    }

    return {
      success: false,
      error: 'No hay datos guardados y sin conexión a internet',
      cached: true
    };
  }

  private async getLastKnownLocation(): Promise<ApiResponse<LocationData>> {
    const locationHistory = await this.databaseService.getLocationHistory();
    
    if (locationHistory.length > 0) {
      const lastLoc = locationHistory[locationHistory.length - 1]; // Obtener el último registro
      return {
        success: true,
        data: {
          lat: lastLoc.lat,
          lon: lastLoc.lon,
          city: lastLoc.city,
          country: lastLoc.country,
          region: 'Última ubicación conocida',
          timezone: 'Unknown',
          isp: 'Cached'
        },
        cached: true
      };
    }

    return {
      success: false,
      error: 'No hay ubicación guardada',
      cached: true
    };
  }

  private transformToConcepts(posts: any[]): LegalConcept[] {
    return posts.map((post, index) => ({
      id: post.id,
      title: post.title.substring(0, 50) + '...',
      description: post.body.substring(0, 200) + '...',
      category: this.getRandomCategory(),
      lastUpdated: new Date().toISOString()
    }));
  }

  private getRandomCategory(): string {
    const categories = [
      'Divorcio',
      'Custodias',
      'Pensión Alimenticia',
      'Bienes Matrimoniales',
      'Violencia Intrafamiliar',
      'Adopción'
    ];
    return categories[Math.floor(Math.random() * categories.length)];
  }

  private handleError = (error: HttpErrorResponse) => {
    console.error('Error HTTP:', error);
    
    if (error.status === 0) {
      // Error de red
      return of(null);
    } else if (error.status === 404) {
      // No encontrado
      throw new Error('Recurso no encontrado (404)');
    } else {
      // Otros errores HTTP
      throw new Error(`Error del servidor: ${error.status}`);
    }
  };

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Métodos de utilidad
  async clearAllCache(): Promise<void> {
    await this.databaseService.remove('cached_concepts');
    await this.databaseService.remove('concepts_timestamp');
    await this.databaseService.clearLocationHistory();
  }

  async getConnectionStatus(): Promise<{
    online: boolean;
    lastCheck: string;
    cached_data_available: boolean;
  }> {
    const cachedConcepts = await this.databaseService.get('cached_concepts');
    
    return {
      online: navigator.onLine,
      lastCheck: new Date().toISOString(),
      cached_data_available: !!cachedConcepts
    };
  }
}
