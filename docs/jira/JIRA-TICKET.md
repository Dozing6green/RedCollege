# 🎫 Tarjeta de Jira - Red College Platform

---

## 📋 Información Básica

**Tipo:** Story
**Proyecto:** Red College - Campus Royal
**Prioridad:** Alta
**Sprint:** Sprint Actual
**Etiquetas:** `frontend`, `backend`, `ia`, `integracion`

---

## 📝 Título

**Integrar Asistente IA con Backend para Generación de Planificaciones Curriculares**

---

## 📖 Descripción

### Contexto
La plataforma Red College (Campus Royal) es un sistema gubernamental para gestión de planificaciones curriculares educativas. Actualmente cuenta con:
- ✅ Frontend completo (planificaciones.html) con diseño institucional
- ✅ Backend Express.js con endpoints para OpenAI, Claude y Gemini
- ✅ Modal de chat IA implementado visualmente
- ❌ NO hay conexión entre frontend y backend (pendiente)

### Objetivo
Conectar el asistente IA del frontend con el backend para permitir que los docentes generen planificaciones curriculares automáticamente usando IA.

### Alcance
1. Configurar API keys de servicios de IA
2. Conectar modal de chat con endpoints del backend
3. Implementar system prompt especializado en educación chilena
4. Crear flujo de conversación para generación de planificaciones
5. Mostrar respuestas de IA en tiempo real en el modal

---

## ✅ Criterios de Aceptación

### 1. Configuración de APIs
- [ ] Archivo `.env` creado con al menos una API key válida (OpenAI o Claude)
- [ ] Variables de entorno cargadas correctamente en `server.js`
- [ ] Endpoint `/api/health` responde con estado de APIs configuradas
- [ ] Servidor inicia sin errores en puerto 3000

### 2. Integración Frontend-Backend
- [ ] Botón IA en `planificaciones.html` abre el modal correctamente
- [ ] Input de texto del chat envía mensajes al endpoint correcto
- [ ] Respuestas de IA se muestran en el chat en tiempo real
- [ ] Indicador de "escribiendo..." se muestra mientras espera respuesta
- [ ] Errores se manejan con mensajes amigables al usuario

### 3. System Prompt Educativo
- [ ] Prompt especializado en educación chilena implementado
- [ ] IA conoce estructura de planificaciones (Objetivos, Contenidos, Evaluación)
- [ ] IA puede generar objetivos de aprendizaje alineados con curriculum
- [ ] Respuestas en español de Chile con terminología pedagógica correcta

### 4. Flujo de Generación
- [ ] Usuario puede solicitar: "Crea una planificación de matemáticas para 2° básico"
- [ ] IA genera planificación estructurada con secciones claras
- [ ] Usuario puede hacer preguntas de seguimiento
- [ ] Historial de conversación se mantiene durante la sesión

### 5. UX y Performance
- [ ] Respuestas de IA aparecen en menos de 5 segundos
- [ ] Chat soporta markdown (negritas, listas, etc.)
- [ ] Scroll automático a último mensaje
- [ ] Botón de limpiar conversación funcional

---

## 🔧 Tareas Técnicas

### Backend (server.js)
- [ ] Verificar que `npm install` completó correctamente
- [ ] Crear archivo `.env` en raíz del proyecto
- [ ] Agregar API key de OpenAI o Claude
- [ ] Probar endpoint `/api/health` → debe retornar `status: ok`
- [ ] Probar endpoint `/api/openai/chat` o `/api/claude/chat` con Postman/curl
- [ ] Implementar system prompt en `api-config.json` o como constante

### Frontend (ai-chat.js)
- [ ] Revisar función `sendMessage()` en `ai-chat.js`
- [ ] Conectar con endpoint del backend (fetch/axios)
- [ ] Implementar manejo de errores (try-catch)
- [ ] Agregar loading state mientras espera respuesta
- [ ] Formatear respuestas de IA (markdown a HTML)
- [ ] Implementar scroll automático

### System Prompt
```javascript
const SYSTEM_PROMPT = `
Eres un asistente pedagógico especializado en educación chilena.

Contexto:
- Trabajas en Campus Royal, plataforma del Ministerio de Educación
- Ayudas a docentes a crear planificaciones curriculares
- Conoces Bases Curriculares chilenas de todos los niveles
- Dominas metodologías activas y DUA

Funciones:
1. Generar planificaciones alineadas al curriculum nacional
2. Sugerir objetivos de aprendizaje (OA) pertinentes
3. Crear actividades pedagógicas contextualizadas
4. Proponer evaluaciones formativas y sumativas
5. Diseñar adecuaciones curriculares

Formato de Planificación:
- Asignatura y nivel
- Objetivos de Aprendizaje (OA)
- Contenidos
- Actividades (Inicio, Desarrollo, Cierre)
- Evaluación
- Recursos necesarios
- Tiempo estimado

Tono: Profesional, claro, pedagógico
Idioma: Español de Chile
`;
```

### Testing
- [ ] Probar con pregunta simple: "Hola, ¿qué puedes hacer?"
- [ ] Probar generación: "Crea una planificación de Lenguaje para 3° básico sobre cuentos"
- [ ] Probar pregunta de seguimiento: "Agrega más actividades lúdicas"
- [ ] Verificar que errores de API se manejan gracefully
- [ ] Probar con diferentes navegadores (Chrome, Firefox, Edge)

---

## 📂 Archivos a Modificar

```
red college/
├── .env                     ← CREAR (API keys)
├── server.js                ← VERIFICAR (system prompt)
├── ai-chat.js               ← MODIFICAR (conexión backend)
├── planificaciones.html     ← VERIFICAR (botón IA)
└── api-config.json          ← ACTUALIZAR (prompt config)
```

---

## 🔐 Variables de Entorno (.env)

```env
# Puerto del servidor
PORT=3000

# API Keys - Obtener de:
# OpenAI: https://platform.openai.com/api-keys
# Claude: https://console.anthropic.com/
# Gemini: https://makersuite.google.com/app/apikey

OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
# O
CLAUDE_API_KEY=sk-ant-xxxxxxxxxxxxx
# O
GEMINI_API_KEY=xxxxxxxxxxxxx

# Configuración
NODE_ENV=development
```

---

## 🧪 Plan de Pruebas

### Prueba 1: Conexión Básica
```bash
# Terminal 1: Iniciar servidor
npm start

# Terminal 2: Probar health check
curl http://localhost:3000/api/health

# Esperado: { "status": "ok", "apis": { ... } }
```

### Prueba 2: Endpoint de IA
```bash
curl -X POST http://localhost:3000/api/openai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Hola"}
    ]
  }'

# Esperado: { "response": "...", "model": "gpt-3.5-turbo" }
```

### Prueba 3: Frontend
1. Abrir: http://localhost:3000/planificaciones.html
2. Hacer clic en botón IA (botón con ícono de estrella)
3. Escribir: "Hola, ¿qué puedes hacer?"
4. Presionar Enter
5. Esperar respuesta de IA
6. Verificar que aparece en el chat

### Prueba 4: Generación de Planificación
1. En el chat escribir:
   ```
   Crea una planificación de Matemáticas para 2° Básico sobre suma y resta hasta el 20
   ```
2. Verificar que IA genera:
   - Objetivos de Aprendizaje
   - Contenidos
   - Actividades (Inicio, Desarrollo, Cierre)
   - Evaluación
   - Recursos

---

## 📊 Estimación

**Story Points:** 8
**Tiempo Estimado:** 1 día

### Desglose:
- Configuración de API keys: 30 min
- Conexión frontend-backend: 2 horas
- Implementación system prompt: 1 hora
- Testing y ajustes: 2 horas
- Documentación: 30 min

---

## 🔗 Enlaces Útiles

**Repositorio:**
- GitHub: https://github.com/Dozing6green/RedCollege
- Rama: `hika_test`

**APIs:**
- OpenAI Docs: https://platform.openai.com/docs/api-reference
- Claude Docs: https://docs.anthropic.com/claude/reference/
- Gemini Docs: https://ai.google.dev/docs

**Recursos Educativos:**
- Curriculum Nacional: https://www.curriculumnacional.cl/
- Bases Curriculares: https://www.curriculumnacional.cl/bases/

---

## 🚨 Riesgos y Dependencias

### Riesgos:
1. **API Keys no disponibles** → Solicitar acceso institucional
2. **Rate limits de APIs** → Implementar caché o usar tier pagado
3. **Costo de tokens** → Monitorear uso, optimizar prompts
4. **Latencia alta** → Implementar streaming de respuestas

### Dependencias:
- ✅ Backend implementado (server.js)
- ✅ Frontend implementado (planificaciones.html)
- ✅ Dependencias instaladas (npm install)
- ❌ API keys pendientes
- ❌ Testing con APIs reales pendiente

---

## 📝 Notas Adicionales

### Estado Actual del Proyecto:
- Frontend: 95% completo
- Backend: 90% completo (falta configuración)
- Integración: 0% (esta es la tarea)
- Testing: 0%

### Conocimiento Técnico Necesario:
- JavaScript ES6+
- Node.js y Express.js
- APIs REST
- Fetch API / Promises
- Manipulación del DOM
- System prompts para LLMs

### Documentación de Referencia:
Ver archivo: `ESTADO-PROYECTO.md` en la raíz del proyecto para contexto completo.

---

## ✅ Definición de "Done"

La tarjeta se considera completada cuando:

1. ✅ Servidor Express corriendo sin errores
2. ✅ Al menos 1 API de IA configurada y funcionando
3. ✅ Usuario puede abrir modal de chat desde planificaciones.html
4. ✅ Usuario puede escribir mensaje y recibir respuesta de IA
5. ✅ IA responde en contexto educativo chileno
6. ✅ IA puede generar planificación curricular básica
7. ✅ Errores se manejan y muestran mensajes amigables
8. ✅ Documentación actualizada
9. ✅ Cambios commiteados en rama `hika_test`
10. ✅ Demo funcional grabada (opcional)

---

## 👥 Asignación

**Desarrollador:** [Tu nombre]
**Revisor:** [Nombre del revisor]
**QA:** [Nombre del QA]

---

## 📅 Timeline

**Fecha de Inicio:** 23 de Octubre, 2025
**Fecha Estimada de Finalización:** 23 de Octubre, 2025
**Sprint:** Sprint Actual

---

## 🎯 Impacto en el Negocio

**Valor para el Usuario:**
- Docentes ahorran 80% del tiempo en crear planificaciones
- Planificaciones alineadas automáticamente con curriculum nacional
- Sugerencias pedagógicas de calidad basadas en IA
- Acceso a asistente 24/7

**Valor para el Proyecto:**
- Primera funcionalidad core del MVP
- Diferenciador clave vs competencia
- Base para futuras features de IA
- Demostrable para stakeholders

---

## 📸 Mockups / Referencias

Ver imagen de referencia en: `C:\Users\AA\Desktop\red college\image.png`

Modal de IA debe verse como en el diseño original de Figma.

---

**Creado:** 22 de Octubre, 2025
**Última actualización:** 22 de Octubre, 2025
**Versión:** 1.0
