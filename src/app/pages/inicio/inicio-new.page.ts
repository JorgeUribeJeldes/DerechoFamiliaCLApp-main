import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
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
    CommonModule,
    RouterModule,
    FormsModule,
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
    IonNote
  ]
})
export class InicioPage implements OnInit, OnDestroy {
  currentUser: string | null = null;
  currentLocation: LocationData | null = null;
  isOnline: boolean = true;
  isLoadingLocation: boolean = false;
  isLoadingConcepts: boolean = false;
  legalConcepts: LegalConcept[] = [];
  showCachedWarning: boolean = false;
  
  // Nuevas propiedades para búsqueda
  searchTerm: string = '';
  searchResults: SearchResult[] = [];
  
  // Base de datos de contenido para búsqueda
  private searchDatabase: SearchResult[] = [
    {
      id: '1',
      title: 'Matrimonio',
      description: 'Contrato solemne entre un hombre y una mujer',
      type: 'concepto',
      route: '/conceptos'
    },
    {
      id: '2',
      title: 'Divorcio',
      description: 'Disolución del vínculo matrimonial',
      type: 'concepto',
      route: '/conceptos'
    },
    {
      id: '3',
      title: 'Patria Potestad',
      description: 'Derechos y deberes de los padres sobre los hijos',
      type: 'concepto',
      route: '/conceptos'
    },
    {
      id: '4',
      title: 'Pensión Alimenticia',
      description: 'Obligación de proporcionar alimentos',
      type: 'concepto',
      route: '/conceptos'
    },
    {
      id: '5',
      title: '¿Cómo iniciar un divorcio?',
      description: 'Pasos para iniciar un proceso de divorcio',
      type: 'faq',
      route: '/faq'
    },
    {
      id: '6',
      title: '¿Cuánto dura un proceso de adopción?',
      description: 'Tiempos promedio para completar una adopción',
      type: 'faq',
      route: '/faq'
    },
    {
      id: '7',
      title: 'Artículo 102 - Código Civil',
      description: 'Definición legal del matrimonio',
      type: 'articulo'
    },
    {
      id: '8',
      title: 'Artículo 225 - Código Civil',
      description: 'Regulación de la patria potestad',
      type: 'articulo'
    }
  ];

  private userSubscription?: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: ApiService,
    private geolocationService: GeolocationService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  async ngOnInit(): Promise<void> {
    console.log('InicioPage initialized');
    await this.loadInitialData();
    this.subscribeToUser();
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  private subscribeToUser() {
    this.userSubscription = this.authService.getCurrentUserObservable().subscribe((user: User | null) => {
      this.currentUser = user ? `${user.firstName} ${user.lastName}` : null;
    });
  }

  private async loadInitialData(): Promise<void> {
    // Verificar estado de conexión
    this.isOnline = navigator.onLine;
    
    // Cargar ubicación
    this.loadLocation();
    
    // Cargar conceptos legales
    this.loadLegalConcepts();
  }

  async loadLocation(): Promise<void> {
    this.isLoadingLocation = true;
    try {
      this.currentLocation = await this.geolocationService.getCompleteLocation();
    } catch (error) {
      console.error('Error loading location:', error);
    } finally {
      this.isLoadingLocation = false;
    }
  }

  async loadLegalConcepts(): Promise<void> {
    this.isLoadingConcepts = true;
    try {
      const result = await this.apiService.getLegalConcepts();
      this.legalConcepts = result.data || [];
      this.showCachedWarning = result.cached || false;
    } catch (error) {
      console.error('Error loading legal concepts:', error);
      this.legalConcepts = [];
    } finally {
      this.isLoadingConcepts = false;
    }
  }

  async refreshLocation(): Promise<void> {
    await this.loadLocation();
  }

  async refreshData(): Promise<void> {
    await this.loadLegalConcepts();
  }

  getLocationText(): string {
    if (!this.currentLocation) return 'Ubicación no disponible';
    return `${this.currentLocation.city}, ${this.currentLocation.country}`;
  }

  getConnectionStatusText(): string {
    return this.isOnline ? 'En línea' : 'Sin conexión';
  }

  getConnectionStatusColor(): string {
    return this.isOnline ? 'success' : 'danger';
  }

  // Métodos para el buscador
  onSearchInput(event: any): void {
    const query = event.target.value.toLowerCase();
    this.searchTerm = query;
    
    if (query.trim() === '') {
      this.searchResults = [];
      return;
    }

    this.searchResults = this.searchDatabase.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    ).slice(0, 8); // Limitar a 8 resultados
  }

  navigateToResult(result: SearchResult): void {
    if (result.route) {
      this.router.navigate([result.route]);
    } else {
      this.showResultDetail(result);
    }
    this.searchTerm = '';
    this.searchResults = [];
  }

  async showResultDetail(result: SearchResult): Promise<void> {
    const alert = await this.alertController.create({
      header: result.title,
      message: result.description,
      buttons: ['OK']
    });
    await alert.present();
  }

  getResultIcon(type: string): string {
    switch (type) {
      case 'concepto': return 'book';
      case 'articulo': return 'document-text';
      case 'faq': return 'help-circle';
      case 'noticia': return 'newspaper';
      default: return 'information-circle';
    }
  }

  getResultColor(type: string): string {
    switch (type) {
      case 'concepto': return 'primary';
      case 'articulo': return 'secondary';
      case 'faq': return 'tertiary';
      case 'noticia': return 'success';
      default: return 'medium';
    }
  }

  // Métodos para acciones rápidas
  async showLegalCalculator(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Calculadora Legal',
      message: 'Próximamente: Herramientas para calcular pensiones alimenticias, división de bienes, etc.',
      buttons: ['OK']
    });
    await alert.present();
  }

  viewConceptDetail(concept: LegalConcept): void {
    // Por ahora solo mostrar en un alert, después se puede navegar a una página de detalle
    this.showConceptAlert(concept);
  }

  private async showConceptAlert(concept: LegalConcept): Promise<void> {
    const alert = await this.alertController.create({
      header: concept.title,
      message: concept.description.substring(0, 200) + '...',
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel'
        },
        {
          text: 'Ver más',
          handler: () => {
            this.router.navigate(['/conceptos']);
          }
        }
      ]
    });
    await alert.present();
  }

  private async showToast(message: string, color: string = 'primary'): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
      color
    });
    await toast.present();
  }
}
