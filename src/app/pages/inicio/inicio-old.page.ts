import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonMenuButton,
  IonButtons,
  IonList,
  IonItem, 
  IonIcon, 
  IonCardSubtitle, 
  IonGrid, 
  IonRow, 
  IonCol,
  IonSpinner,
  IonBadge,
  IonText,
  IonSearchbar,
  IonLabel,
  IonNote,
  AlertController,
  ToastController
} from '@ionic/angular/standalone';

import { AuthService, User } from '../../services/auth.service';
import { ApiService, LegalConcept } from '../../services/api.service';
import { GeolocationService, LocationData } from '../../services/geolocation.service';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'concepto' | 'articulo' | 'faq' | 'noticia';
  route?: string;
}

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [
    IonText,
    IonBadge,
    IonSpinner,
    IonCol, 
    IonRow, 
    IonGrid, 
    IonCardSubtitle, 
    IonIcon, 
    RouterModule,
    IonMenu,
    IonMenuButton,
    IonButtons,
    IonList,
    IonItem,
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton
  ]
})
export class InicioPage implements OnInit, AfterViewInit {
  currentUser: string | null = null;
  currentLocation: LocationData | null = null;
  isOnline: boolean = true;
  isLoadingLocation: boolean = false;
  isLoadingConcepts: boolean = false;
  legalConcepts: LegalConcept[] = [];
  showCachedWarning: boolean = false;

  constructor(
    private router: Router, 
    public menu: MenuController,
    private authService: AuthService,
    private apiService: ApiService,
    private geolocationService: GeolocationService
  ) {}

  async ngOnInit(): Promise<void> {
    console.log('InicioPage initialized');
    await this.loadInitialData();
  }

  ngAfterViewInit() {
    const el = document.querySelector('.titulo');
    if (el) {
      const anim = createAnimation()
        .addElement(el)
        .duration(1000)
        .iterations(1)
        .fromTo('opacity', '0', '1');
      anim.play();
    } else {
      console.warn('Elemento ".titulo" no encontrado en el DOM.');
    }
  }

  private async loadInitialData(): Promise<void> {
    // Cargar usuario actual
    this.currentUser = await this.authService.getCurrentUser();
    
    // Cargar estado de conexión
    this.apiService.isOnline.subscribe(status => {
      this.isOnline = status;
    });

    // Cargar ubicación
    await this.loadLocation();
    
    // Cargar conceptos legales
    await this.loadLegalConcepts();
  }

  async loadLocation(): Promise<void> {
    this.isLoadingLocation = true;
    
    this.apiService.getLocationData().subscribe({
      next: (response) => {
        if (response.success) {
          this.currentLocation = response.data!;
          this.showCachedWarning = response.cached || false;
        }
        this.isLoadingLocation = false;
      },
      error: (error) => {
        console.error('Error cargando ubicación:', error);
        this.isLoadingLocation = false;
      }
    });
  }

  async loadLegalConcepts(): Promise<void> {
    this.isLoadingConcepts = true;
    
    try {
      const response = await this.apiService.getLegalConcepts();
      
      if (response.success) {
        this.legalConcepts = response.data || [];
        this.showCachedWarning = response.cached || false;
      } else {
        console.error('Error cargando conceptos:', response.error);
      }
    } catch (error) {
      console.error('Error en loadLegalConcepts:', error);
    } finally {
      this.isLoadingConcepts = false;
    }
  }

  async refreshLocation(): Promise<void> {
    this.geolocationService.clearCache();
    await this.loadLocation();
  }

  async refreshData(): Promise<void> {
    await this.loadLegalConcepts();
    await this.loadLocation();
  }

  async logout(): Promise<void> {
    this.menu.close();
    await this.authService.logout();
  }

  navigateToPage(page: string): void {
    this.menu.close();
    this.router.navigate([`/${page}`]);
  }

  getLocationText(): string {
    if (!this.currentLocation) return 'Ubicación no disponible';
    
    return `${this.currentLocation.city}, ${this.currentLocation.country}`;
  }

  getConnectionStatusColor(): string {
    return this.isOnline ? 'success' : 'danger';
  }

  getConnectionStatusText(): string {
    return this.isOnline ? 'En línea' : 'Sin conexión';
  }
}
