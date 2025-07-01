# Guía de Imágenes para DerechoFamiliaCLApp

## 📁 Estructura de Carpetas

```
src/assets/images/
├── logos/           # Logos y iconos de la aplicación
├── banners/         # Banners para páginas principales
└── icons/           # Iconos personalizados (ya existe)
```

## 🎨 Especificaciones de Imágenes

### **Logos**
- **Formato:** PNG con transparencia
- **Tamaños:** 
  - Logo principal: 256x256px
  - Logo pequeño: 64x64px
  - Logo horizontal: 400x120px
- **Colores:** Paleta de la app (#7c4dff, #50c8ff)

### **Banners**
- **Formato:** JPG/PNG
- **Tamaños:**
  - Banner principal: 1200x400px
  - Banner móvil: 800x300px
  - Banner tarjeta: 400x200px
- **Estilo:** Profesional, colores corporativos

### **Iconos Personalizados**
- **Formato:** SVG (preferido) o PNG
- **Tamaño:** 32x32px, 64x64px
- **Estilo:** Línea simple, coherente con Ionic

## 🎯 Imágenes Necesarias

### **Página de Login**
- `banners/login-banner.jpg` (1200x400px)
- `logos/app-logo.png` (256x256px)

### **Página de Inicio**
- `banners/inicio-hero.jpg` (1200x400px)
- `banners/features-banner.jpg` (800x300px)

### **Página de Conceptos**
- `banners/conceptos-header.jpg` (1200x300px)
- Iconos para categorías:
  - `icons/matrimonio.svg`
  - `icons/divorcio.svg`
  - `icons/familia.svg`
  - `icons/patrimonio.svg`
  - `icons/proteccion.svg`

### **Página FAQ**
- `banners/faq-banner.jpg` (1200x300px)
- `icons/question-mark.svg`

### **Página de Contacto**
- `banners/contacto-header.jpg` (1200x300px)
- `icons/contact-form.svg`

## 🔍 Temas Visuales Sugeridos

### **Elementos Legales:**
- Balanza de la justicia
- Libro de leyes
- Martillo judicial
- Palacio de justicia chileno

### **Elementos Familiares:**
- Siluetas de familia
- Casa/hogar
- Corazón con familia
- Manos protectoras

### **Colores Corporativos:**
- Primario: #7c4dff (Púrpura)
- Secundario: #50c8ff (Azul claro)
- Terciario: #ff6b9d (Rosa)
- Neutros: Grises y blancos

## 📝 Prompts para IA

### **Logo Principal:**
```
Professional logo for Chilean family law mobile app, scales of justice with family silhouette, purple and blue gradient (#7c4dff, #50c8ff), minimalist design, clean modern typography, transparent background, 256x256 pixels
```

### **Banner Principal:**
```
Professional header banner for family law website, Chilean courthouse or justice building, soft purple and blue color scheme, clean modern design, legal documents, scales of justice, family protection theme, 1200x400 pixels
```

### **Banner de Conceptos:**
```
Educational banner for legal concepts page, open law books, legal scales, Chilean flag colors subtly integrated, professional academic style, modern flat design, 1200x300 pixels
```

## 🛠️ Herramientas Recomendadas

### **Generación con IA:**
- DALL-E 2 (OpenAI)
- Midjourney
- Stable Diffusion
- Canva AI

### **Edición:**
- Canva (templates legales)
- Figma (diseño UI)
- GIMP (edición avanzada)
- Adobe Express (online)

### **Optimización:**
- TinyPNG (compresión)
- SVGO (optimización SVG)
- ImageOptim (Mac)

## 📋 Checklist de Implementación

- [ ] Logo principal de la app
- [ ] Banner para página de login
- [ ] Banner para página de inicio
- [ ] Banner para conceptos legales
- [ ] Banner para FAQ
- [ ] Banner para contacto
- [ ] Iconos para categorías legales
- [ ] Favicon actualizado
- [ ] Splash screen (opcional)

## 🎨 Paleta de Colores Exacta

```scss
// Colores principales
$primary: #7c4dff;
$secondary: #50c8ff;
$tertiary: #ff6b9d;
$success: #10dc60;
$warning: #ffce00;
$danger: #f53d3d;

// Colores de apoyo
$light: #f4f5f8;
$medium: #92949c;
$dark: #222428;
```
