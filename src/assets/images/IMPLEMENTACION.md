# Ejemplo de Implementación de Imágenes

## 🎯 Una vez que tengas las imágenes, aquí está cómo implementarlas:

### **1. Página de Login con Logo:**

```html
<!-- En login.page.html -->
<div class="login-header">
  <img src="assets/images/logos/app-logo.png" 
       alt="Derecho Familia CL" 
       class="app-logo"
       onerror="this.style.display='none'; this.nextElementSibling.style.display='block'">
  <div class="app-logo image-placeholder logo-placeholder" style="display: none;">
    Logo App
  </div>
  <h1>Derecho Familia CL</h1>
</div>
```

### **2. Página de Inicio con Banner:**

```html
<!-- En inicio.page.html -->
<div class="hero-banner">
  <img src="assets/images/banners/inicio-hero.jpg" 
       alt="Inicio Hero" 
       class="banner-image"
       onerror="this.style.display='none'; this.nextElementSibling.style.display='block'">
  <div class="hero-banner inicio-banner" style="display: none;">
    <div class="hero-banner-content">
      <h1>Bienvenido al Derecho de Familia</h1>
      <p>Tu guía legal completa</p>
    </div>
  </div>
</div>
```

### **3. Iconos de Categorías en Conceptos:**

```html
<!-- En conceptos.page.html -->
<ion-card class="concept-card">
  <ion-card-header>
    <div class="concept-icon-container">
      <img src="assets/images/icons/{{concepto.categoria}}.svg" 
           alt="{{concepto.categoria}}" 
           class="category-icon"
           onerror="this.style.display='none'; this.nextElementSibling.style.display='block'">
      <div class="category-icon image-placeholder icon-placeholder" style="display: none;">
        {{ getCategoryEmoji(concepto.categoria) }}
      </div>
    </div>
    <ion-card-title>{{ concepto.titulo }}</ion-card-title>
  </ion-card-header>
</ion-card>
```

### **4. TypeScript para Emojis de Fallback:**

```typescript
// En conceptos.page.ts
getCategoryEmoji(categoria: string): string {
  const emojis: { [key: string]: string } = {
    'matrimonio': '💒',
    'divorcio': '📋',
    'filiacion': '👨‍👩‍👧‍👦',
    'alimentos': '💰',
    'patrimonio': '🏠',
    'proteccion': '🛡️'
  };
  return emojis[categoria] || '⚖️';
}
```

## 📋 Checklist de Imágenes Prioritarias:

### **Esenciales (Crear primero):**
- [ ] `logos/app-logo.png` (256x256px) - Logo principal
- [ ] `banners/login-banner.jpg` (1200x400px) - Banner login
- [ ] `banners/inicio-hero.jpg` (1200x400px) - Banner principal

### **Iconos de Categorías:**
- [ ] `icons/matrimonio.svg` - Anillos o iglesia
- [ ] `icons/divorcio.svg` - Documento dividido
- [ ] `icons/filiacion.svg` - Familia
- [ ] `icons/alimentos.svg` - Dinero o balanza
- [ ] `icons/patrimonio.svg` - Casa o edificio
- [ ] `icons/proteccion.svg` - Escudo

### **Banners Secundarios:**
- [ ] `banners/conceptos-header.jpg` (1200x300px)
- [ ] `banners/faq-banner.jpg` (1200x300px)
- [ ] `banners/contacto-header.jpg` (1200x300px)

## 🎨 Prompts Específicos para tu App:

### **Logo Principal:**
```
"Professional minimalist logo for Chilean family law mobile app, scales of justice with heart symbol, purple and blue gradient (#7c4dff to #50c8ff), clean typography 'Derecho Familia CL', modern flat design, transparent background, 256x256 pixels"
```

### **Banner de Login:**
```
"Professional header image for legal app login page, Chilean courthouse building, soft purple and blue tones, legal books, scales of justice, clean modern design, welcoming atmosphere, 1200x400 pixels"
```

### **Iconos de Categorías:**
```
"Minimalist line icons for legal categories: wedding rings (matrimonio), split document (divorcio), family silhouette (filiación), money scales (alimentos), house (patrimonio), shield (protección), purple and blue colors, SVG style, 48x48 pixels each"
```
