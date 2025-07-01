import { Injectable, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, firstValueFrom } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface LocationData {
  lat: number;
  lon: number;
  city: string;
  country: string;
  region: string;
  timezone: string;
  isp: string;
}

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  private readonly API_URL = 'http://ip-api.com/json/';
  private cachedLocation: LocationData | null = null;

  constructor(
    private http: HttpClient
  ) {}

  // Obtener ubicación usando IP (API gratuita)
  getLocationByIP(): Observable<LocationData> {
    if (this.cachedLocation) {
      return of(this.cachedLocation);
    }

    return this.http.get<LocationData>(this.API_URL).pipe(
      tap(location => {
        this.cachedLocation = location;
        console.log('Ubicación obtenida por IP:', location);
      }),
      catchError(error => {
        console.error('Error obteniendo ubicación por IP:', error);
        return of({
          lat: -33.4489,
          lon: -70.6693,
          city: 'Santiago',
          country: 'Chile',
          region: 'Región Metropolitana',
          timezone: 'America/Santiago',
          isp: 'Unknown'
        });
      })
    );
  }

  // Obtener ubicación GPS del dispositivo (navegador web)
  async getCurrentPosition(): Promise<{ lat: number; lon: number } | null> {
    try {
      if ('geolocation' in navigator) {
        return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                lat: position.coords.latitude,
                lon: position.coords.longitude
              });
            },
            (error) => {
              console.error('Error obteniendo ubicación GPS:', error);
              resolve(null);
            },
            { timeout: 10000, enableHighAccuracy: false }
          );
        });
      } else {
        console.warn('Geolocation no está disponible');
        return null;
      }
    } catch (error) {
      console.error('Error obteniendo ubicación GPS:', error);
      return null;
    }
  }

  // Combinar ambos métodos de geolocalización
  async getCompleteLocation(): Promise<LocationData> {
    try {
      // Intentar obtener GPS primero
      const gpsPosition = await this.getCurrentPosition();
      
      if (gpsPosition) {
        // Si tenemos GPS, obtener datos adicionales por IP
        try {
          const ipLocation = await firstValueFrom(this.getLocationByIP());
          if (ipLocation) {
            return {
              ...ipLocation,
              lat: gpsPosition.lat,
              lon: gpsPosition.lon
            };
          }
        } catch (ipError) {
          console.warn('Error obteniendo datos por IP:', ipError);
        }
      }
      
      // Si no hay GPS o falló IP, usar solo IP
      try {
        const fallbackLocation = await firstValueFrom(this.getLocationByIP());
        return fallbackLocation || this.getDefaultLocation();
      } catch (error) {
        console.warn('Error obteniendo ubicación por IP:', error);
        return this.getDefaultLocation();
      }
    } catch (error) {
      console.error('Error en getCompleteLocation:', error);
      return this.getDefaultLocation();
    }
  }

  private getDefaultLocation(): LocationData {
    return {
      lat: -33.4489,
      lon: -70.6693,
      city: 'Santiago',
      country: 'Chile',
      region: 'Región Metropolitana',
      timezone: 'America/Santiago',
      isp: 'Unknown'
    };
  }

  clearCache() {
    this.cachedLocation = null;
  }
}
