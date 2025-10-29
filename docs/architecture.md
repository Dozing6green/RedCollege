# 🏗️ Arquitectura del Proyecto - Red College Platform

**Fecha de reorganización:** 28 de Octubre, 2025
**Tipo de arquitectura:** Modular por features
**Estado:** ✅ Implementada

---

## 📋 Tabla de Contenidos

1. [Decisiones Arquitectónicas](#decisiones-arquitectónicas)
2. [Estructura de Carpetas](#estructura-de-carpetas)
3. [Módulos Principales](#módulos-principales)
4. [Componentes Compartidos](#componentes-compartidos)
5. [Flujo de Datos](#flujo-de-datos)
6. [Convenciones](#convenciones)

---

## 🎯 Decisiones Arquitectónicas

### ✅ Arquitectura Modular por Features

Organizamos el proyecto en **módulos independientes** donde cada feature tiene su propia carpeta con todo lo necesario:

- **Ventajas:**
  - Escalabilidad: Fácil agregar nuevos módulos
  - Mantenibilidad: Cambios aislados por feature
  - Reutilización: Componentes shared accesibles desde todos los módulos
  - Claridad: Cada módulo tiene responsabilidad única

- **Módulos actuales:**
  - `planificaciones`: Gestión de planificaciones curriculares
  - `evalua360`: Sistema de evaluación 360°
  - `landing`: Página principal del sitio

### 🗂️ Separación de Concerns

```
src/            → Código fuente de la aplicación
assets/         → Recursos estáticos (SVG, imágenes)
config/         → Configuraciones y variables de entorno
docs/           → Documentación del proyecto
archive/        → Archivos históricos y legacy
tools/          → Scripts de desarrollo y utilidades
```

---

## 📁 Estructura de Carpetas

### Vista General

```
red-college/
├── src/                    # Código fuente
│   ├── modules/           # Módulos por feature
│   │   ├── planificaciones/
│   │   ├── evalua360/
│   │   └── landing/
│   ├── shared/            # Código compartido
│   │   ├── components/
│   │   ├── utils/
│   │   └── styles/
│   └── api/               # Lógica de API (futuro)
│
├── assets/                # Recursos estáticos
│   ├── svg/
│   │   ├── illustrations/
│   │   ├── icons/
│   │   ├── sprite.svg
│   │   └── manifest.json
│   └── images/
│       ├── logos/
│       ├── screenshots/
│       └── general/
│
├── config/                # Configuración
│   ├── api-config.json
│   └── .env.example
│
├── docs/                  # Documentación
│   ├── jira/
│   ├── guides/
│   ├── README.md
│   └── architecture.md    # Este archivo
│
├── archive/               # Archivos legacy
│   ├── figma/
│   └── old-svgs/
│
├── tools/                 # Scripts de desarrollo
│   ├── capture-figma-site.js
│   ├── extract-svgs.js
│   └── process-svgs.js
│
├── server.js              # Backend Express
├── package.json
└── .gitignore
```

---

## 🎨 Módulos Principales

### 1. Módulo Planificaciones

**Ubicación:** `src/modules/planificaciones/`

**Responsabilidad:**
- Gestión de planificaciones curriculares
- CRUD de unidades didácticas
- Integración con asistente IA para generación de contenido

**Estructura:**
```
planificaciones/
├── index.html                    # Página principal
├── planificaciones.js            # Lógica del módulo (futuro)
├── planificaciones.css           # Estilos específicos (futuro)
└── components/                   # Componentes locales
    ├── unit-card.js              # Tarjetas de unidades
    ├── unit-details-panel.js     # Panel de detalles
    └── credits-badge.js          # Badge de créditos
```

**Dependencias:**
- Componente AI Chat (`../../shared/components/ai-chat/`)
- Tailwind CSS
- Assets de SVG e imágenes

---

### 2. Módulo Evalua360

**Ubicación:** `src/modules/evalua360/`

**Responsabilidad:**
- Sistema de evaluación 360 grados
- Visualización de resultados con gráficos
- Análisis de desempeño

**Estructura:**
```
evalua360/
├── index.html                    # Página principal
├── evalua360.js                  # Lógica del módulo (futuro)
├── evalua360.css                 # Estilos específicos (futuro)
└── components/                   # Componentes locales
    ├── evaluation-chart.js       # Gráficos Chart.js
    └── evaluation-form.js        # Formularios de evaluación
```

**Dependencias:**
- Chart.js (para visualizaciones)
- Tailwind CSS
- Componente AI Chat (opcional)

---

### 3. Módulo Landing

**Ubicación:** `src/modules/landing/`

**Responsabilidad:**
- Página principal del sitio
- Presentación institucional
- Hero section, features, testimonios

**Estructura:**
```
landing/
├── index.html       # Landing page
├── main.js          # Interacciones UI
└── styles.css       # Estilos globales
```

**Dependencias:**
- Google Fonts (Manrope, Noto Sans, Roboto)
- Componente AI Chat

---

## 🔗 Componentes Compartidos

### Ubicación: `src/shared/components/`

Componentes reutilizables accesibles desde todos los módulos.

### AI Chat Component

**Ubicación:** `src/shared/components/ai-chat/`

**Responsabilidad:**
- Sistema de chat con IA
- Soporte multi-API (OpenAI, Claude, Gemini)
- Modo simulación local
- Historial de conversación

**Uso:**
```html
<script src="../../shared/components/ai-chat/ai-chat.js"></script>
```

**Funcionalidades:**
- Efecto typewriter
- Persistencia en localStorage
- Exportación de historial
- Cambio dinámico de API

---

### Header Component (futuro)

**Ubicación:** `src/shared/components/header/`

Navegación principal común a todos los módulos.

---

### Modal Component (futuro)

**Ubicación:** `src/shared/components/modal/`

Sistema de modales reutilizables.

---

## 🔄 Flujo de Datos

### Arquitectura Cliente-Servidor

```
┌─────────────────┐
│   Browser       │
│                 │
│  ┌───────────┐  │
│  │ Módulos   │  │ ← Planificaciones, Evalua360, Landing
│  └─────┬─────┘  │
│        │        │
│  ┌─────▼─────┐  │
│  │ AI Chat   │  │ ← Componente compartido
│  └─────┬─────┘  │
│        │        │
└────────┼────────┘
         │ AJAX
         │
    ┌────▼─────┐
    │ server.js │ ← Express.js
    └────┬─────┘
         │
    ┌────▼──────┐
    │ APIs      │ ← OpenAI, Claude, Gemini
    └───────────┘
```

### Rutas del Servidor

**Archivo:** `server.js`

```javascript
// Módulos
GET  /                       → src/modules/landing/index.html
GET  /planificaciones        → src/modules/planificaciones/index.html
GET  /evalua360              → src/modules/evalua360/index.html

// APIs de IA
POST /api/openai/chat        → Chat con OpenAI GPT
POST /api/claude/chat        → Chat con Anthropic Claude
POST /api/gemini/chat        → Chat con Google Gemini

// Utilidades
GET  /api/health             → Estado del servidor
GET  /api/config             → Configuración de APIs
GET  /api/stats              → Estadísticas del servidor
```

---

## 📦 Assets

### SVG

**Ubicación:** `assets/svg/`

- **Illustrations:** `assets/svg/illustrations/` - 7 variantes de ilustraciones
- **Icons:** `assets/svg/icons/` - 20 iconos individuales
- **Sprite:** `assets/svg/sprite.svg` - Sprite SVG combinado
- **Manifest:** `assets/svg/manifest.json` - Metadata de iconos

**Uso:**
```html
<!-- Desde planificaciones/index.html -->
<img src="../../assets/svg/icons/icon-34.svg" alt="Icon">

<!-- O usando sprite -->
<svg><use href="../../assets/svg/sprite.svg#icon-34"></use></svg>
```

### Imágenes

**Ubicación:** `assets/images/`

- **Logos:** `assets/images/logos/asi_logo.png`
- **Screenshots:** `assets/images/screenshots/` - Capturas de EVALUA_360
- **General:** `assets/images/general/image.png`

---

## 🛠️ Configuración

### API Config

**Archivo:** `config/api-config.json`

Configuración centralizada para las 3 APIs de IA:

```json
{
  "apis": {
    "openai": {
      "enabled": true,
      "models": { "default": "gpt-3.5-turbo" }
    },
    "claude": {
      "enabled": true,
      "models": { "default": "claude-3-sonnet-20240229" }
    },
    "gemini": {
      "enabled": true,
      "models": { "default": "gemini-pro" }
    }
  },
  "systemPrompts": {
    "default": "Eres un asistente pedagógico..."
  }
}
```

### Environment Variables

**Archivo:** `config/.env.example`

```env
PORT=3000
OPENAI_API_KEY=tu_key_aqui
CLAUDE_API_KEY=tu_key_aqui
GEMINI_API_KEY=tu_key_aqui
```

---

## 📝 Convenciones

### Naming

- **Carpetas:** kebab-case (`ai-chat`, `unit-card`)
- **Archivos HTML:** `index.html` dentro de cada módulo
- **JavaScript:** camelCase para variables, PascalCase para clases
- **CSS:** BEM methodology (cuando se implementen estilos modulares)

### Rutas Relativas

Desde cualquier módulo hacia:

- **Assets:** `../../assets/`
- **Shared components:** `../../shared/components/`
- **Shared utils:** `../../shared/utils/`

Ejemplos:
```html
<!-- Desde planificaciones/index.html -->
<script src="../../shared/components/ai-chat/ai-chat.js"></script>
<img src="../../assets/images/logos/asi_logo.png">

<!-- Navegación entre módulos -->
<a href="../evalua360/index.html">Ir a Evalua360</a>
```

### Git Commits

Seguir Conventional Commits:

```
feat: Agregar nuevo módulo X
fix: Corregir error en componente Y
refactor: Reorganizar estructura de carpetas
docs: Actualizar documentación de arquitectura
style: Mejorar estilos de módulo Z
```

---

## 🚀 Próximos Pasos

### Fase 1 - Sistema de Componentes ✅ (Implementado básicamente)
- [x] Estructura modular
- [x] Componente AI Chat compartido
- [ ] Header compartido
- [ ] Modal compartido
- [ ] Component loader dinámico

### Fase 2 - Optimización
- [ ] Bundler (Webpack/Vite)
- [ ] Minificación de assets
- [ ] Lazy loading de módulos
- [ ] Service Workers para PWA

### Fase 3 - Testing
- [ ] Unit tests (Jest)
- [ ] Integration tests
- [ ] E2E tests (Playwright)

### Fase 4 - Base de Datos
- [ ] Modelar entidades
- [ ] API REST completa
- [ ] Autenticación
- [ ] Persistencia de datos

---

## 📚 Referencias

- [Express.js Documentation](https://expressjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Chart.js](https://www.chartjs.org/)
- [OpenAI API](https://platform.openai.com/docs)
- [Anthropic Claude API](https://docs.anthropic.com/)

---

**Última actualización:** 28 de Octubre, 2025
**Mantenido por:** Equipo Red College
