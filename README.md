# 🎓 Campus Royal - Plataforma Educativa con IA

Demo funcional de plataforma educativa con asistente de inteligencia artificial integrado. Diseñado para presentaciones empresariales y maquetas de alto impacto.

## ✨ Características

### 🎨 Frontend
- ✅ Landing page moderna y responsive
- ✅ Diseño profesional tipo campus educativo
- ✅ Animaciones suaves y efectos visuales
- ✅ Totalmente responsive (mobile, tablet, desktop)
- ✅ Optimizado para rendimiento

### 🤖 Módulo de IA
- ✅ Chat interactivo con asistente de IA
- ✅ **Soporte multi-API**: OpenAI, Claude (Anthropic), Google Gemini
- ✅ Sistema de simulación local (sin necesidad de API keys)
- ✅ Efecto typewriter en respuestas
- ✅ Historial de conversación persistente (localStorage)
- ✅ Formato JSON para todos los datos
- ✅ Exportación de historial de chat
- ✅ Cambio dinámico entre APIs

### 🔧 Backend
- ✅ Servidor Node.js + Express
- ✅ Endpoints REST para cada API de IA
- ✅ Sistema de configuración flexible (JSON)
- ✅ Manejo de errores y fallbacks
- ✅ CORS habilitado
- ✅ Logging de requests

## 📁 Estructura del Proyecto

```
red college/
├── index.html              # Página principal
├── styles.css              # Estilos globales
├── main.js                 # JavaScript principal
├── ai-chat.js              # Sistema de chat IA
├── server.js               # Servidor backend
├── api-config.json         # Configuración de APIs
├── package.json            # Dependencias Node.js
├── .env.example            # Ejemplo de variables de entorno
└── README.md               # Este archivo
```

## 🚀 Instalación y Uso

### Opción 1: Solo Frontend (Modo Simulación)

**No requiere Node.js ni API keys**

1. Abre `index.html` directamente en tu navegador
2. El chat funcionará en modo simulación local
3. ¡Listo! Ya puedes probar el asistente

### Opción 2: Con Backend y APIs Reales

**Requisitos:**
- Node.js 16+
- npm 8+
- API keys de OpenAI y/o Claude

**Pasos:**

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar API keys:**
```bash
# Copia el archivo de ejemplo
copy .env.example .env

# Edita .env y agrega tus API keys
notepad .env
```

3. **Iniciar el servidor:**
```bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
```

4. **Abrir en el navegador:**
```
http://localhost:3000
```

## 🔑 Obtener API Keys

### OpenAI (GPT)
1. Ve a https://platform.openai.com/api-keys
2. Crea una cuenta / Inicia sesión
3. Genera una nueva API key
4. Cópiala en tu archivo `.env`

### Claude (Anthropic)
1. Ve a https://console.anthropic.com/
2. Crea una cuenta / Inicia sesión
3. Genera una API key
4. Cópiala en tu archivo `.env`

### Google Gemini (Opcional)
1. Ve a https://makersuite.google.com/app/apikey
2. Genera una API key
3. Cópiala en tu archivo `.env`

## 🎮 Uso del Chat de IA

### Comandos de Consola

Abre la consola del navegador (F12) y usa estos comandos:

```javascript
// Ver configuración actual
aiChat.config

// Cambiar a OpenAI
aiChat.switchAPI('openai')

// Cambiar a Claude
aiChat.switchAPI('claude')

// Volver a simulación local
aiChat.switchAPI('local')

// Ver estadísticas
aiChat.getStats()

// Limpiar historial
aiChat.clearHistory()

// Exportar chat a JSON
aiChat.exportHistory()
```

### Cambiar API en `api-config.json`

```json
{
  "apis": {
    "openai": {
      "enabled": true,  // ← Cambiar a false para deshabilitar
      ...
    },
    "claude": {
      "enabled": true,
      ...
    }
  }
}
```

## 📊 Formato de Datos (JSON)

### Request a la API
```json
{
  "session_id": "session_123456",
  "api": "claude",
  "model": "claude-3-sonnet-20240229",
  "messages": [
    {
      "role": "system",
      "content": "Eres un asistente educativo..."
    },
    {
      "role": "user",
      "content": "¿Qué cursos ofrecen?"
    }
  ],
  "options": {
    "temperature": 0.7,
    "max_tokens": 500
  }
}
```

### Response de la API
```json
{
  "response": "¡Excelente pregunta! Ofrecemos más de 1,200 cursos...",
  "model": "claude-3-sonnet-20240229",
  "usage": {
    "input_tokens": 45,
    "output_tokens": 120
  },
  "timestamp": "2025-10-21T10:30:00.000Z"
}
```

## 🎯 Personalización

### Cambiar Colores del Sitio

Edita las variables CSS en `styles.css`:

```css
:root {
    --color-primary: #22A3E6;      /* Azul principal */
    --color-secondary: #00A488;    /* Verde secundario */
    --color-accent: #FFCC00;       /* Amarillo de acento */
    /* ... más variables ... */
}
```

### Modificar Respuestas Simuladas

Edita el objeto `responses` en `ai-chat.js` (línea ~200):

```javascript
const responses = {
    cursos: [
        'Tu respuesta personalizada sobre cursos...',
        'Otra variante de respuesta...'
    ],
    // ... más categorías ...
};
```

### Cambiar Prompt del Sistema

Edita `api-config.json`:

```json
{
  "systemPrompts": {
    "default": "Tu prompt personalizado aquí..."
  }
}
```

## 🛠️ Troubleshooting

### El chat no responde
- ✅ Verifica que el servidor esté corriendo (`npm start`)
- ✅ Revisa la consola del navegador (F12) para errores
- ✅ Asegúrate de que las API keys sean válidas

### Error de CORS
- ✅ Reinicia el servidor
- ✅ Verifica que CORS esté habilitado en `server.js`

### API key inválida
- ✅ Verifica que copiaste la key completa
- ✅ Asegúrate de que la key tenga créditos
- ✅ Prueba con modo simulación (`aiChat.switchAPI('local')`)

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px
- **Large**: > 1280px
- **XL**: > 2048px

## 🔒 Seguridad

⚠️ **IMPORTANTE:**

- ❌ **NUNCA** compartas tus API keys
- ❌ **NUNCA** subas el archivo `.env` a GitHub
- ✅ Usa variables de entorno en producción
- ✅ Implementa rate limiting en producción
- ✅ Valida todas las entradas del usuario

## 🎨 Tipografías Usadas

- **Manrope**: Títulos y encabezados (700-800)
- **Noto Sans**: Textos de cuerpo (400-600)
- **Roboto**: Elementos monoespaciados (400)

## 🌟 Próximas Funcionalidades

- [ ] Streaming de respuestas (real-time)
- [ ] Análisis de sentimientos
- [ ] Sugerencias de cursos con IA
- [ ] Multi-idioma
- [ ] Voice input
- [ ] Temas claro/oscuro

## 📄 Licencia

MIT License - Uso libre para proyectos comerciales y educativos

## 👨‍💻 Soporte

Para dudas o problemas:
- 📧 Email: soporte@campusroyal.com
- 💬 Chat: Usa el asistente de IA en la página

---

**Desarrollado con 🤖 para presentaciones gubernamentales y empresariales**

¡Buena suerte con tu demo! 🚀
