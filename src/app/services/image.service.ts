import { Injectable } from '@angular/core';

export interface ImageAsset {
  path: string;
  alt: string;
  fallback?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  // Rutas de imágenes principales
  private readonly IMAGE_PATHS = {
    logos: {
      main: 'assets/images/logos/app-logo.png',
      small: 'assets/images/logos/app-logo-small.png',
      horizontal: 'assets/images/logos/app-logo-horizontal.png'
    },
    banners: {
      login: 'assets/images/banners/login-banner.jpg',
      inicio: 'assets/images/banners/inicio-hero.jpg',
      conceptos: 'assets/images/banners/conceptos-header.jpg',
      faq: 'assets/images/banners/faq-banner.jpg',
      contacto: 'assets/images/banners/contacto-header.jpg'
    },
    icons: {
      matrimonio: 'assets/images/icons/matrimonio.svg',
      divorcio: 'assets/images/icons/divorcio.svg',
      filiacion: 'assets/images/icons/filiacion.svg',
      alimentos: 'assets/images/icons/alimentos.svg',
      patrimonio: 'assets/images/icons/patrimonio.svg',
      proteccion: 'assets/images/icons/proteccion.svg'
    }
  };

  // Emojis de fallback para categorías
  private readonly CATEGORY_EMOJIS = {
    matrimonio: '💒',
    divorcio: '📋',
    filiacion: '👨‍👩‍👧‍👦',
    alimentos: '💰',
    patrimonio: '🏠',
    proteccion: '🛡️',
    todas: '⚖️'
  };

  constructor() { }

  /**
   * Obtiene la ruta del logo principal
   */
  getMainLogo(): ImageAsset {
    return {
      path: this.IMAGE_PATHS.logos.main,
      alt: 'Derecho Familia CL - Logo',
      fallback: 'assets/icon/favicon.png'
    };
  }

  /**
   * Obtiene la ruta del banner para una página específica
   */
  getBanner(page: 'login' | 'inicio' | 'conceptos' | 'faq' | 'contacto'): ImageAsset {
    return {
      path: this.IMAGE_PATHS.banners[page],
      alt: `Banner ${page}`,
      fallback: `Banner ${page.charAt(0).toUpperCase() + page.slice(1)}`
    };
  }

  /**
   * Obtiene el icono para una categoría legal
   */
  getCategoryIcon(category: string): ImageAsset {
    const iconPath = this.IMAGE_PATHS.icons[category as keyof typeof this.IMAGE_PATHS.icons];
    return {
      path: iconPath || 'assets/icon/favicon.png',
      alt: `Icono ${category}`,
      fallback: this.getCategoryEmoji(category)
    };
  }

  /**
   * Obtiene el emoji de fallback para una categoría
   */
  getCategoryEmoji(category: string): string {
    return this.CATEGORY_EMOJIS[category as keyof typeof this.CATEGORY_EMOJIS] || '⚖️';
  }

  /**
   * Verifica si una imagen existe
   */
  async imageExists(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }

  /**
   * Obtiene la URL completa de una imagen
   */
  getImageUrl(relativePath: string): string {
    return relativePath.startsWith('assets/') ? relativePath : `assets/images/${relativePath}`;
  }

  /**
   * Genera placeholder de imagen con emoji
   */
  generatePlaceholder(type: 'logo' | 'banner' | 'icon', category?: string): string {
    const placeholders = {
      logo: '🏛️',
      banner: '🖼️',
      icon: category ? this.getCategoryEmoji(category) : '⚖️'
    };
    return placeholders[type];
  }

  /**
   * Obtiene todas las rutas de imágenes para precarga
   */
  getAllImagePaths(): string[] {
    const paths: string[] = [];
    
    // Logos
    Object.values(this.IMAGE_PATHS.logos).forEach(path => paths.push(path));
    
    // Banners
    Object.values(this.IMAGE_PATHS.banners).forEach(path => paths.push(path));
    
    // Iconos
    Object.values(this.IMAGE_PATHS.icons).forEach(path => paths.push(path));
    
    return paths;
  }

  /**
   * Precarga imágenes críticas
   */
  async preloadCriticalImages(): Promise<void> {
    const criticalImages = [
      this.IMAGE_PATHS.logos.main,
      this.IMAGE_PATHS.banners.login,
      this.IMAGE_PATHS.banners.inicio
    ];

    const promises = criticalImages.map(path => this.preloadImage(path));
    await Promise.allSettled(promises);
  }

  /**
   * Precarga una imagen específica
   */
  private preloadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  }
}
