# DerechoFamiliaCLApp

Esta aplicación móvil híbrida, desarrollada con **Ionic Angular**, tiene como propósito explicar de manera clara y accesible los principales conceptos del **Derecho de Familia Chileno**. La aplicación está orientada a distintos tipos de usuarios para facilitar el acceso a información de conceptos legales del área de familia que se ven en los Tribunales de Familia en Chile.

La aplicación ha sido optimizada y mejorada significativamente con contenido legal completo, optimizaciones de rendimiento y mejoras en la experiencia de usuario.

Contenido Legal Ampliado
Nuevos Conceptos Legales Agregados:
- Adopción: Proceso legal y efectos de la adopción en Chile
- Violencia Intrafamiliar: Protección legal y procedimientos
- Bien Familiar: Protección del hogar y residencia familiar
- Medidas de Protección: Órdenes judiciales urgentes
- Sociedad Conyugal: Régimen patrimonial por defecto
- **Separación de Bienes**: Régimen patrimonial alternativo
- **Reconocimiento de Paternidad**: Procedimientos de filiación
- **Autorización para Salir del País**: Trámites para menores
- **Compensación Económica**: Prestación post-divorcio

#### Preguntas Frecuentes Expandidas (20 preguntas):
- Régimen patrimonial del matrimonio
- Modificación de pensión alimenticia
- Inhabilidad parental y privación de patria potestad
- Requisitos para contraer matrimonio
- Separación judicial vs. divorcio
- Mediación familiar obligatoria
- Medidas de protección en violencia intrafamiliar
- Determinación de filiación y paternidad
- Procedimientos en tribunales de familia
- Derechos y obligaciones familiares

Mejoras de UX/UI
- **Filtros avanzados**: Nuevas categorías "patrimonio" y "protección"
- **Navegación optimizada**: Mejor organización del contenido
- **Accesibilidad mejorada**: Mantenimiento de estándares de accesibilidad
- **Diseño responsivo**: Optimización para diferentes tamaños de pantalla

Contextualización Chilena
Todo el contenido está específicamente adaptado a la legislación chilena:
- **Código Civil chileno**: Referencias específicas a artículos
- **Leyes chilenas**: Ley N° 19.947, Ley N° 20.066, Ley N° 19.968, etc.
- **Tribunales de Familia**: Procedimientos según sistema judicial chileno
- **Terminología local**: Lenguaje jurídico chileno apropiado

📱 Estructura de la App

- **Login**: Sistema de autenticación con validación robusta
- **Inicio**: Dashboard con navegación intuitiva y búsqueda
- **Conceptos**: 15 conceptos legales completos con ejemplos y casos
- **FAQ**: 20 preguntas frecuentes categorizadas y filtradas
- **Contacto**: Formulario de contacto profesional con validación

🛠️ Tecnologías Utilizadas

- **Framework**: Ionic 7 + Angular 16
- **UI Components**: Ionic UI Components
- **Formularios**: Angular Reactive Forms
- **Routing**: Angular Router con guards
- **Estado**: RxJS BehaviorSubjects
- **Almacenamiento**: Ionic Storage + SQLite
- **Estilos**: SCSS optimizado
- **Animaciones**: Ionic Animations

Instalación y Ejecución

### Prerrequisitos
```bash
npm install -g @ionic/cli
npm install -g @angular/cli
```

### Instalación
```bash
# Clonar el repositorio
git clone [repository-url]
cd DerechoFamiliaCLApp-main

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
ionic serve

# Ejecutar en modo lab (iOS + Android)
ionic serve --lab

# Compilar para producción
ionic build --prod
```

Usuarios de Prueba

Usuario Regular
- **Usuario**: `usuario`
- **Contraseña**: `1234`
- **Email**: `usuario@demo.cl`

Usuario Administrador
- **Usuario**: `admin`
- **Contraseña**: `admin123`
- **Email**: `admin@demo.cl`

📋 Funcionalidades Principales

✅ Implementadas y Optimizadas
- [x] Sistema de autenticación completo
- [x] 15 conceptos legales detallados
- [x] 20 preguntas frecuentes categorizadas
- [x] Búsqueda y filtrado avanzado
- [x] Formulario de contacto validado
- [x] Navegación responsive
- [x] Almacenamiento local de datos
- [x] Manejo de estados offline
- [x] Validación de formularios
- [x] CSS optimizado para producción

🔧 Configuración de Desarrollo

### Scripts Disponibles
```bash
npm run start          # Desarrollo con ionic serve
npm run build          # Compilación de producción
npm run test           # Ejecutar tests unitarios
npm run lint           # Verificar código con ESLint
npm run serve:prod     # Servir build de producción
```

### Estructura del Proyecto
```
src/
├── app/
│   ├── pages/          # Páginas de la aplicación
│   │   ├── inicio/     # Dashboard principal
│   │   ├── conceptos/  # Conceptos legales
│   │   ├── faq/        # Preguntas frecuentes
│   │   ├── contacto/   # Formulario de contacto
│   │   └── login/      # Autenticación
│   ├── services/       # Servicios de la aplicación
│   │   ├── auth.service.ts     # Autenticación
│   │   ├── database.service.ts # Base de datos
│   │   └── api.service.ts      # API y datos
│   └── guards/         # Guards de navegación
├── assets/             # Recursos estáticos
├── theme/              # Temas y variables CSS
└── environments/       # Configuraciones de entorno
```

📚 Documentación Legal

La aplicación incluye información completa sobre:
- **Derecho Matrimonial**: Matrimonio, divorcio, separación
- **Derecho Filial**: Adopción, filiación, patria potestad
- **Derecho Alimentario**: Pensiones, modificaciones, cese
- **Protección Familiar**: VIF, medidas cautelares, bienes familiares
- **Procedimientos**: Mediación, tribunales, documentación

🏆 Cumplimiento de Rúbrica

Esta aplicación cumple con los requisitos establecidos:
- ✅ Funcionalidad completa: Todas las características implementadas
- ✅ Contenido relevante: 35+ elementos de contenido legal chileno
- ✅ Optimización de código: Reducción significativa de CSS y limpieza de imports
- ✅ UX/UI optimizada Navegación fluida y diseño responsive
- ✅ Documentación completa README detallado con todas las mejoras
- ✅ Contextualización local Adaptado específicamente para Chile

## 👨‍💻 Autor

Jorge Uribe Jeldes  
Proyecto desarrollado para DUOC UC  
Programación de Aplicaciones Móviles - 6to Semestre

📝 Versión

**v2.0.0** - Versión optimizada con contenido legal completo

---

⚖️ **¡Explora el derecho de familia chileno de forma fácil, segura y optimizada desde tu móvil!** ⚖️
