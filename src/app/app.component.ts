import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { 
  IonApp, 
  IonRouterOutlet, 
  IonMenu, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonList, 
  IonItem, 
  IonIcon, 
  IonLabel,
  IonItemDivider,
  MenuController 
} from '@ionic/angular/standalone';
import { AuthService, User } from './services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [
    CommonModule,
    RouterModule,
    IonApp, 
    IonRouterOutlet, 
    IonMenu, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonList, 
    IonItem, 
    IonIcon, 
    IonLabel,
    IonItemDivider
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  userRole = '';
  isDarkMode = false;
  private authSubscription?: Subscription;
  private userSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private menuController: MenuController
  ) {
    // Cargar configuración de modo oscuro
    this.loadDarkModePreference();
  }

  ngOnInit() {
    // Suscribirse al estado de autenticación
    this.authSubscription = this.authService.getAuthState().subscribe((isAuth: boolean) => {
      this.isAuthenticated = isAuth;
    });

    // Suscribirse a los datos del usuario
    this.userSubscription = this.authService.getCurrentUserObservable().subscribe((user: User | null) => {
      this.userRole = user?.role || '';
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  async closeMenu() {
    await this.menuController.close('main-menu');
  }

  async logout() {
    await this.authService.logout();
    await this.closeMenu();
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark', this.isDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(this.isDarkMode));
  }

  private loadDarkModePreference() {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      this.isDarkMode = JSON.parse(savedDarkMode);
      document.body.classList.toggle('dark', this.isDarkMode);
    }
  }
}
