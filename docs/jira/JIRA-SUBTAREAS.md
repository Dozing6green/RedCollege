# 🎯 Subtareas - Integración IA Backend

---

## Backend - Configuración (7 subtareas)

### Subtarea 1: Verificar instalación de dependencias
**Tipo:** Tarea técnica
**Estimación:** 15 min
**Descripción:**
- Confirmar que `npm install` completó correctamente (220 paquetes)
- Revisar warnings y vulnerabilidades
- Ejecutar `npm audit` si es necesario

**Criterio de aceptación:**
- ✅ Comando `npm list` muestra 220 paquetes instalados sin errores críticos

---

### Subtarea 2: Crear archivo de configuración de ambiente
**Tipo:** Tarea técnica
**Estimación:** 10 min
**Descripción:**
- Crear archivo `.env` en la raíz del proyecto
- Agregar configuración base del servidor

**Código:**
```env
PORT=3000
NODE_ENV=development
```

**Criterio de aceptación:**
- ✅ Archivo `.env` existe en raíz
- ✅ Variables PORT y NODE_ENV configuradas

---

### Subtarea 3: Configurar API Keys de servicios IA
**Tipo:** Tarea técnica
**Estimación:** 20 min
**Descripción:**
- Obtener API key de al menos un servicio (OpenAI, Claude o Gemini)
- Agregar al archivo `.env`

**Opciones de APIs:**
1. OpenAI: https://platform.openai.com/api-keys
2. Claude: https://console.anthropic.com/
3. Gemini: https://makersuite.google.com/app/apikey

**Código:**
```env
# Agregar al menos una:
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
# O
CLAUDE_API_KEY=sk-ant-xxxxxxxxxxxxx
# O
GEMINI_API_KEY=xxxxxxxxxxxxx
```

**Criterio de aceptación:**
- ✅ Al menos una API key válida configurada en `.env`

---

### Subtarea 4: Iniciar servidor y verificar funcionamiento
**Tipo:** Tarea técnica
**Estimación:** 10 min
**Descripción:**
- Ejecutar `npm start` desde la raíz del proyecto
- Verificar que inicia sin errores en puerto 3000
- Confirmar mensaje de consola

**Comando:**
```bash
npm start
```

**Criterio de aceptación:**
- ✅ Servidor inicia sin errores
- ✅ Consola muestra: "Server running on port 3000" (o similar)
- ✅ No hay errores de variables de entorno faltantes

---

### Subtarea 5: Probar endpoint de health check
**Tipo:** Testing
**Estimación:** 10 min
**Descripción:**
- Hacer request GET al endpoint de salud
- Verificar respuesta del servidor

**Comando de prueba:**
```bash
curl http://localhost:3000/api/health
```

**Respuesta esperada:**
```json
{
  "status": "ok",
  "apis": {
    "openai": true,
    "claude": false,
    "gemini": false
  }
}
```

**Criterio de aceptación:**
- ✅ Endpoint `/api/health` responde 200 OK
- ✅ JSON muestra estado de APIs configuradas

---

### Subtarea 6: Probar endpoint de chat con herramienta externa
**Tipo:** Testing
**Estimación:** 15 min
**Descripción:**
- Usar Postman, curl o Thunder Client
- Hacer POST al endpoint de la API configurada
- Verificar respuesta de la IA

**Comando de prueba (OpenAI):**
```bash
curl -X POST http://localhost:3000/api/openai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Hola, ¿qué puedes hacer?"}
    ]
  }'
```

**Comando de prueba (Claude):**
```bash
curl -X POST http://localhost:3000/api/claude/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Hola, ¿qué puedes hacer?"}
    ]
  }'
```

**Respuesta esperada:**
```json
{
  "response": "Hola! Soy un asistente...",
  "model": "gpt-3.5-turbo",
  "tokens": 150
}
```

**Criterio de aceptación:**
- ✅ Endpoint responde 200 OK
- ✅ IA genera respuesta coherente
- ✅ JSON contiene campo "response" con texto

---

### Subtarea 7: Implementar System Prompt educativo chileno
**Tipo:** Desarrollo
**Estimación:** 30 min
**Descripción:**
- Crear system prompt especializado en educación chilena
- Configurar contexto pedagógico y terminología
- Definir formato de respuestas estructuradas

**Ubicación:** `server.js` o `api-config.json`

**Template del System Prompt:**
```javascript
const SYSTEM_PROMPT = `
Eres un asistente pedagógico especializado en educación chilena.

Contexto:
- Trabajas en Campus Royal, plataforma del Ministerio de Educación de Chile
- Ayudas a docentes a crear planificaciones curriculares
- Conoces las Bases Curriculares chilenas de todos los niveles educativos
- Dominas metodologías activas y Diseño Universal del Aprendizaje (DUA)

Tus funciones principales:
1. Generar planificaciones curriculares alineadas al curriculum nacional
2. Sugerir Objetivos de Aprendizaje (OA) pertinentes por nivel y asignatura
3. Crear actividades pedagógicas contextualizadas para Chile
4. Proponer evaluaciones formativas y sumativas
5. Diseñar adecuaciones curriculares inclusivas

Formato de Planificación que debes generar:
- **Asignatura y Nivel:** (ej: Matemática 2° Básico)
- **Unidad:** (nombre y número)
- **Objetivos de Aprendizaje (OA):** (código y descripción del curriculum)
- **Contenidos:** (conceptos, procedimientos, actitudes)
- **Actividades:**
  - Inicio (motivación, activación de conocimientos previos)
  - Desarrollo (experiencias de aprendizaje, trabajo individual/grupal)
  - Cierre (síntesis, reflexión, metacognición)
- **Evaluación:** (formativa y sumativa con instrumentos)
- **Recursos necesarios:** (materiales, tecnología, espacios)
- **Tiempo estimado:** (número de clases de 45 o 90 minutos)
- **Adecuaciones curriculares:** (si se solicita, según DUA)

Tono: Profesional, claro, pedagógico, cercano
Idioma: Español de Chile
Formato de salida: Estructurado con bullets, numeración y secciones claras
`;
```

**Criterio de aceptación:**
- ✅ System prompt implementado en el código
- ✅ Incluye contexto educativo chileno
- ✅ Define formato estructurado de planificaciones
- ✅ IA responde con terminología pedagógica apropiada

---

## Frontend - Integración (8 subtareas)

### Subtarea 8: Revisar función sendMessage() existente
**Tipo:** Análisis técnico
**Estimación:** 15 min
**Descripción:**
- Abrir archivo `ai-chat.js`
- Analizar flujo actual de envío de mensajes
- Identificar dónde conectar con backend
- Documentar estructura actual

**Criterio de aceptación:**
- ✅ Función `sendMessage()` localizada y analizada
- ✅ Puntos de integración identificados

---

### Subtarea 9: Conectar modal de chat con backend
**Tipo:** Desarrollo
**Estimación:** 45 min
**Descripción:**
- Implementar llamada fetch/axios al endpoint del backend
- Configurar headers y body correctamente
- Integrar con función existente de envío

**Código de ejemplo:**
```javascript
async function sendMessage(messageText) {
  try {
    // Agregar mensaje del usuario al chat
    addMessageToChat('user', messageText);

    // Mostrar indicador de carga
    showTypingIndicator();

    // Llamar al backend
    const response = await fetch('http://localhost:3000/api/openai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          { role: 'user', content: messageText }
        ]
      })
    });

    const data = await response.json();

    // Ocultar indicador de carga
    hideTypingIndicator();

    // Mostrar respuesta de IA
    addMessageToChat('assistant', data.response);

  } catch (error) {
    hideTypingIndicator();
    showErrorMessage('No se pudo conectar con el asistente. Intenta nuevamente.');
    console.error('Error:', error);
  }
}
```

**Criterio de aceptación:**
- ✅ Fetch/axios implementado correctamente
- ✅ Headers configurados (Content-Type: application/json)
- ✅ Body con formato correcto de mensajes
- ✅ Respuesta se procesa y muestra en el chat

---

### Subtarea 10: Implementar manejo de errores robusto
**Tipo:** Desarrollo
**Estimación:** 30 min
**Descripción:**
- Agregar try-catch en función de envío
- Capturar errores de red (servidor apagado)
- Capturar errores de API (rate limit, key inválida)
- Mostrar mensajes amigables al usuario

**Código de ejemplo:**
```javascript
async function sendMessage(messageText) {
  try {
    const response = await fetch('http://localhost:3000/api/openai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: messageText }]
      })
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Límite de solicitudes alcanzado. Espera un momento.');
      } else if (response.status === 401) {
        throw new Error('Error de autenticación. Verifica la API key.');
      } else if (response.status === 500) {
        throw new Error('Error del servidor. Intenta nuevamente.');
      } else {
        throw new Error('Error desconocido. Intenta nuevamente.');
      }
    }

    const data = await response.json();
    addMessageToChat('assistant', data.response);

  } catch (error) {
    hideTypingIndicator();

    // Mensajes amigables según tipo de error
    if (error.message.includes('Failed to fetch')) {
      showErrorMessage('No se pudo conectar al servidor. ¿Está iniciado?');
    } else {
      showErrorMessage(error.message);
    }

    console.error('Error completo:', error);
  }
}
```

**Criterio de aceptación:**
- ✅ Try-catch implementado
- ✅ Errores de red capturados
- ✅ Errores de API capturados (401, 429, 500)
- ✅ Mensajes amigables al usuario
- ✅ No se muestran errores técnicos en UI

---

### Subtarea 11: Agregar indicador de "IA escribiendo..."
**Tipo:** Desarrollo UI/UX
**Estimación:** 30 min
**Descripción:**
- Crear componente visual de "typing indicator"
- Mostrar mientras se espera respuesta del backend
- Ocultar cuando llega la respuesta
- Agregar animación (opcional)

**Código HTML:**
```html
<div id="typing-indicator" class="hidden flex items-center gap-2 px-4 py-3">
  <div class="flex gap-1">
    <span class="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
    <span class="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></span>
    <span class="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
  </div>
  <span class="text-sm text-gray-500">El asistente está escribiendo...</span>
</div>
```

**Código JavaScript:**
```javascript
function showTypingIndicator() {
  const indicator = document.getElementById('typing-indicator');
  indicator.classList.remove('hidden');
  scrollToBottom();
}

function hideTypingIndicator() {
  const indicator = document.getElementById('typing-indicator');
  indicator.classList.add('hidden');
}
```

**Criterio de aceptación:**
- ✅ Indicador visual implementado
- ✅ Se muestra al enviar mensaje
- ✅ Se oculta al recibir respuesta
- ✅ Animación funciona correctamente

---

### Subtarea 12: Formatear respuestas con markdown
**Tipo:** Desarrollo
**Estimación:** 30 min
**Descripción:**
- Convertir markdown a HTML en respuestas de IA
- Soportar: negritas, listas, numeración, títulos
- Mantener formato estructurado de planificaciones

**Opción 1: Usar librería (recomendado):**
```javascript
// Agregar marked.js
// <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>

function addMessageToChat(role, content) {
  const messageDiv = document.createElement('div');
  messageDiv.className = role === 'user' ? 'message-user' : 'message-assistant';

  // Convertir markdown a HTML
  const htmlContent = marked.parse(content);
  messageDiv.innerHTML = htmlContent;

  chatContainer.appendChild(messageDiv);
  scrollToBottom();
}
```

**Opción 2: Regex simple (sin dependencias):**
```javascript
function formatMarkdown(text) {
  return text
    // Negritas: **texto** → <strong>texto</strong>
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Cursivas: *texto* → <em>texto</em>
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Listas: - item → <li>item</li>
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // Saltos de línea
    .replace(/\n/g, '<br>');
}
```

**Criterio de aceptación:**
- ✅ Negritas se renderizan correctamente
- ✅ Listas (bullets y numeradas) se muestran bien
- ✅ Títulos y subtítulos tienen estilo apropiado
- ✅ Formato de planificaciones es legible

---

### Subtarea 13: Implementar scroll automático a último mensaje
**Tipo:** Desarrollo UI/UX
**Estimación:** 15 min
**Descripción:**
- Detectar cuando se agrega nuevo mensaje
- Hacer scroll al final del contenedor de chat
- Asegurar que último mensaje sea visible

**Código:**
```javascript
function scrollToBottom() {
  const chatContainer = document.getElementById('chat-messages');
  chatContainer.scrollTop = chatContainer.scrollHeight;

  // Con animación suave (opcional)
  chatContainer.scrollTo({
    top: chatContainer.scrollHeight,
    behavior: 'smooth'
  });
}

// Llamar después de agregar mensaje
function addMessageToChat(role, content) {
  // ... código para agregar mensaje ...

  scrollToBottom(); // ← Agregar aquí
}
```

**Criterio de aceptación:**
- ✅ Scroll automático funciona al recibir mensaje
- ✅ Último mensaje siempre visible
- ✅ Animación suave (opcional pero recomendado)

---

### Subtarea 14: Mantener historial de conversación
**Tipo:** Desarrollo
**Estimación:** 30 min
**Descripción:**
- Crear array para almacenar mensajes de la sesión
- Enviar contexto completo en cada request
- Permitir que IA tenga memoria de conversación

**Código:**
```javascript
// Variable global para historial
let conversationHistory = [];

async function sendMessage(messageText) {
  // Agregar mensaje del usuario al historial
  conversationHistory.push({
    role: 'user',
    content: messageText
  });

  addMessageToChat('user', messageText);
  showTypingIndicator();

  try {
    // Enviar TODA la conversación al backend
    const response = await fetch('http://localhost:3000/api/openai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: conversationHistory // ← Enviar historial completo
      })
    });

    const data = await response.json();

    // Agregar respuesta de IA al historial
    conversationHistory.push({
      role: 'assistant',
      content: data.response
    });

    hideTypingIndicator();
    addMessageToChat('assistant', data.response);

  } catch (error) {
    hideTypingIndicator();
    showErrorMessage('Error al enviar mensaje');
    console.error(error);
  }
}
```

**Criterio de aceptación:**
- ✅ Historial se mantiene durante la sesión
- ✅ Cada request incluye mensajes anteriores
- ✅ IA puede responder preguntas de seguimiento con contexto
- ✅ Prueba: "Agrega más actividades" después de generar planificación

---

### Subtarea 15: Agregar botón "Limpiar conversación"
**Tipo:** Desarrollo UI/UX
**Estimación:** 20 min
**Descripción:**
- Crear botón para resetear chat
- Vaciar historial de mensajes
- Limpiar interfaz visual

**Código HTML:**
```html
<button id="clear-chat-btn" class="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
  </svg>
  Limpiar conversación
</button>
```

**Código JavaScript:**
```javascript
function clearConversation() {
  // Confirmar acción
  if (!confirm('¿Estás seguro de limpiar la conversación?')) {
    return;
  }

  // Vaciar historial
  conversationHistory = [];

  // Limpiar interfaz
  const chatContainer = document.getElementById('chat-messages');
  chatContainer.innerHTML = '';

  // Mensaje de bienvenida (opcional)
  addMessageToChat('assistant', '¡Hola! Soy tu asistente pedagógico. ¿En qué puedo ayudarte?');
}

// Agregar event listener
document.getElementById('clear-chat-btn').addEventListener('click', clearConversation);
```

**Criterio de aceptación:**
- ✅ Botón visible y accesible
- ✅ Confirmación antes de limpiar
- ✅ Historial se vacía correctamente
- ✅ Interfaz se limpia visualmente
- ✅ IA responde como conversación nueva

---

## Testing - Validación (7 subtareas)

### Subtarea 16: Prueba básica de health check
**Tipo:** Testing
**Estimación:** 5 min
**Descripción:**
- Iniciar servidor
- Verificar endpoint de salud responde

**Pasos:**
1. Ejecutar: `npm start`
2. Ejecutar: `curl http://localhost:3000/api/health`
3. Verificar respuesta JSON con status OK

**Criterio de aceptación:**
- ✅ Servidor inicia sin errores
- ✅ Endpoint responde 200 OK
- ✅ JSON contiene `"status": "ok"`

---

### Subtarea 17: Prueba de endpoint con herramienta externa
**Tipo:** Testing
**Estimación:** 10 min
**Descripción:**
- Usar Postman/curl para probar endpoint de chat
- Verificar respuesta de IA

**Comando de prueba:**
```bash
curl -X POST http://localhost:3000/api/openai/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hola"}]}'
```

**Criterio de aceptación:**
- ✅ Endpoint responde 200 OK
- ✅ JSON contiene campo "response"
- ✅ Respuesta tiene contenido coherente

---

### Subtarea 18: Prueba de chat desde planificaciones.html
**Tipo:** Testing funcional
**Estimación:** 15 min
**Descripción:**
- Abrir página en navegador
- Interactuar con modal de IA
- Verificar flujo completo

**Pasos:**
1. Abrir: `http://localhost:3000/planificaciones.html`
2. Clic en botón de IA (estrella amarilla, esquina superior derecha)
3. Escribir: "Hola, ¿qué puedes hacer?"
4. Presionar Enter
5. Esperar respuesta

**Criterio de aceptación:**
- ✅ Modal se abre correctamente
- ✅ Mensaje se envía al escribir y presionar Enter
- ✅ Indicador "escribiendo..." aparece
- ✅ Respuesta de IA se muestra en el chat
- ✅ Formato es legible

---

### Subtarea 19: Prueba de generación de planificación
**Tipo:** Testing funcional
**Estimación:** 20 min
**Descripción:**
- Solicitar generación de planificación completa
- Verificar que contiene todas las secciones requeridas

**Prompt de prueba:**
```
Crea una planificación de Matemáticas para 2° Básico sobre el tema "Suma y resta hasta el 20"
```

**La respuesta DEBE incluir:**
- Asignatura y nivel
- Objetivos de Aprendizaje (OA)
- Contenidos
- Actividades (Inicio, Desarrollo, Cierre)
- Evaluación
- Recursos
- Tiempo estimado

**Criterio de aceptación:**
- ✅ IA genera planificación estructurada
- ✅ Incluye todas las secciones requeridas
- ✅ Contenido alineado con curriculum chileno
- ✅ Terminología pedagógica apropiada
- ✅ Actividades son realizables y contextualizadas

---

### Subtarea 20: Prueba de conversación con contexto
**Tipo:** Testing funcional
**Estimación:** 15 min
**Descripción:**
- Verificar que IA mantiene contexto de conversación
- Probar preguntas de seguimiento

**Flujo de prueba:**
1. Solicitar: "Crea una planificación de Lenguaje para 3° Básico sobre cuentos"
2. Esperar respuesta completa
3. Solicitar: "Agrega más actividades lúdicas a esta planificación"
4. Verificar que IA modifica/amplía la planificación anterior

**Criterio de aceptación:**
- ✅ IA recuerda la planificación generada anteriormente
- ✅ Responde coherentemente a solicitud de modificación
- ✅ No regenera desde cero, sino que complementa
- ✅ Mantiene contexto de asignatura y nivel

---

### Subtarea 21: Prueba de manejo de errores
**Tipo:** Testing de casos extremos
**Estimación:** 15 min
**Descripción:**
- Simular errores y verificar comportamiento

**Casos de prueba:**

**Caso 1: Servidor apagado**
- Detener servidor: `Ctrl+C` en terminal
- Intentar enviar mensaje desde el chat
- Verificar: mensaje de error amigable, no error técnico en consola del navegador

**Caso 2: Request muy largo (rate limit simulado)**
- Enviar prompt extremadamente largo (>2000 palabras)
- Verificar: timeout o error manejado apropiadamente

**Caso 3: API key inválida (opcional)**
- Modificar `.env` con key inválida: `OPENAI_API_KEY=invalid-key`
- Reiniciar servidor
- Intentar enviar mensaje
- Verificar: mensaje de error sobre autenticación

**Criterio de aceptación:**
- ✅ Errores de red muestran mensaje amigable
- ✅ No se muestran stack traces en UI
- ✅ Usuario sabe qué hacer (reiniciar servidor, verificar conexión)
- ✅ Chat no se rompe, se puede seguir usando

---

### Subtarea 22: Prueba multi-navegador
**Tipo:** Testing de compatibilidad
**Estimación:** 15 min
**Descripción:**
- Probar funcionalidad en diferentes navegadores

**Navegadores a probar:**
1. Google Chrome
2. Mozilla Firefox
3. Microsoft Edge

**Para cada navegador verificar:**
- Modal de IA se abre correctamente
- Input de texto funciona
- Mensajes se envían con Enter
- Respuestas se muestran correctamente
- Scroll automático funciona
- Estilos se ven bien

**Criterio de aceptación:**
- ✅ Funciona en Chrome
- ✅ Funciona en Firefox
- ✅ Funciona en Edge
- ✅ No hay diferencias visuales importantes
- ✅ No hay errores de JavaScript en consola

---

## Documentación (3 subtareas)

### Subtarea 23: Actualizar ESTADO-PROYECTO.md
**Tipo:** Documentación
**Estimación:** 10 min
**Descripción:**
- Marcar tareas completadas
- Agregar notas de implementación
- Actualizar estado del proyecto

**Secciones a actualizar:**
- Estado actual del proyecto (líneas 271-274)
- Próximos pasos (marcar completados)
- Agregar sección "IA Integrada" con detalles

**Criterio de aceptación:**
- ✅ Documento actualizado con progreso
- ✅ Estado refleja integración completada
- ✅ Incluye notas técnicas relevantes

---

### Subtarea 24: Actualizar JIRA-TICKET.md con resultados
**Tipo:** Documentación
**Estimación:** 10 min
**Descripción:**
- Marcar criterios de aceptación completados
- Documentar issues encontrados
- Agregar observaciones

**Secciones a actualizar:**
- Criterios de aceptación (cambiar [ ] por [x])
- Agregar sección "Resultados de Testing"
- Documentar problemas encontrados y soluciones

**Criterio de aceptación:**
- ✅ Checkboxes marcados según progreso
- ✅ Issues documentados
- ✅ Decisiones técnicas registradas

---

### Subtarea 25: Crear documentación del System Prompt (opcional)
**Tipo:** Documentación
**Estimación:** 10 min
**Descripción:**
- Documentar system prompt final utilizado
- Incluir ejemplos de respuestas
- Agregar notas de optimización

**Crear archivo:** `SYSTEM-PROMPT-DOCS.md`

**Contenido sugerido:**
```markdown
# System Prompt - Asistente Pedagógico

## Prompt Utilizado
[Texto completo del prompt]

## Ejemplos de Uso

### Ejemplo 1: Generación de planificación básica
**Input:** "Crea una planificación de Matemáticas para 2° Básico"
**Output:** [Ejemplo de respuesta]

### Ejemplo 2: Pregunta de seguimiento
**Input:** "Agrega más actividades grupales"
**Output:** [Ejemplo de respuesta]

## Notas de Optimización
- Temperatura: 0.7 (balance creatividad/consistencia)
- Max tokens: 1000 (ajustar según necesidad)
- Top-p: 0.9

## Ajustes Realizados
[Documentar cambios al prompt durante testing]
```

**Criterio de aceptación:**
- ✅ Archivo creado con prompt completo
- ✅ Incluye al menos 2 ejemplos
- ✅ Notas de configuración documentadas

---

## Seguridad (1 subtarea)

### Subtarea 26: Verificar que .env no se sube a GitHub
**Tipo:** Seguridad
**Estimación:** 5 min
**Descripción:**
- Confirmar que archivo `.env` está en `.gitignore`
- Verificar que no aparece en `git status`

**Pasos:**
1. Abrir archivo `.gitignore` en raíz del proyecto
2. Verificar que contiene línea: `.env`
3. Ejecutar: `git status`
4. Confirmar que `.env` NO aparece en lista de archivos

**Si `.env` no está en .gitignore:**
```bash
echo ".env" >> .gitignore
git add .gitignore
git commit -m "Add .env to gitignore for security"
git push
```

**Criterio de aceptación:**
- ✅ `.env` está en `.gitignore`
- ✅ `git status` no muestra `.env`
- ✅ API keys NO están expuestas en GitHub

---

## 📊 Resumen Ejecutivo

| **Categoría** | **Subtareas** | **Tiempo Estimado** | **Prioridad** |
|---------------|---------------|---------------------|---------------|
| Backend | 7 | 1.5 - 2 horas | 🔴 Alta |
| Frontend | 8 | 2.5 - 3 horas | 🔴 Alta |
| Testing | 7 | 1.5 - 2 horas | 🔴 Alta |
| Documentación | 3 | 30 minutos | 🟡 Media |
| Seguridad | 1 | 5 minutos | 🔴 Alta |
| **TOTAL** | **26** | **6 - 7.5 horas** | - |

---

## ⚡ Orden Sugerido de Ejecución

### Fase 1: Setup (30 min)
1. Subtarea 1: Verificar npm install
2. Subtarea 2: Crear .env
3. Subtarea 3: Configurar API key
4. Subtarea 26: Verificar .gitignore

### Fase 2: Backend (1 hora)
5. Subtarea 4: Iniciar servidor
6. Subtarea 5: Probar health check
7. Subtarea 6: Probar endpoint con curl
8. Subtarea 7: Implementar system prompt

### Fase 3: Frontend (2.5 horas)
9. Subtarea 8: Revisar sendMessage()
10. Subtarea 9: Conectar con backend
11. Subtarea 10: Manejo de errores
12. Subtarea 11: Indicador de typing
13. Subtarea 12: Formatear markdown
14. Subtarea 13: Scroll automático
15. Subtarea 14: Historial de conversación
16. Subtarea 15: Botón limpiar chat

### Fase 4: Testing (1.5 horas)
17. Subtarea 16: Health check test
18. Subtarea 17: Endpoint test con curl
19. Subtarea 18: Chat desde navegador
20. Subtarea 19: Generación de planificación
21. Subtarea 20: Conversación con contexto
22. Subtarea 21: Manejo de errores
23. Subtarea 22: Multi-navegador

### Fase 5: Documentación (30 min)
24. Subtarea 23: Actualizar ESTADO-PROYECTO.md
25. Subtarea 24: Actualizar JIRA-TICKET.md
26. Subtarea 25: Crear SYSTEM-PROMPT-DOCS.md (opcional)

---

## 🎯 Definición de "Hecho" (Definition of Done)

Una subtarea se considera completada cuando:

✅ Código implementado y funcionando
✅ Pruebas manuales realizadas
✅ Sin errores en consola del navegador
✅ Sin errores en consola del servidor
✅ Comportamiento coincide con criterio de aceptación
✅ Cambios commiteados a git (opcional por subtarea, requerido al finalizar)

---

## 📌 Notas Importantes para el Desarrollador

1. **API Keys**: Obtener al menos UNA API key antes de empezar (OpenAI es la más fácil de obtener)

2. **Servidor debe estar corriendo**: Para probar frontend, el backend debe estar iniciado en `http://localhost:3000`

3. **CORS**: Si hay problemas de CORS, verificar que `server.js` tiene `app.use(cors())` habilitado

4. **Rate Limits**: APIs gratuitas tienen límites. OpenAI free tier: ~3 requests/min. Considerar para testing.

5. **Costos**: OpenAI cobra por tokens. Una planificación completa usa ~500-1000 tokens (~$0.001-0.002 USD)

6. **Mock vs Producción**: Este es un MOCK para cliente, no es el sistema final. Priorizar velocidad sobre perfección.

7. **System Prompt**: El prompt puede ajustarse durante testing para mejorar respuestas

8. **Git**: Commitear después de cada fase completada, no por cada subtarea

---

## 🚀 Comando Rápido de Inicio

```bash
# 1. Navegar al proyecto
cd "C:\Users\AA\Desktop\red college"

# 2. Crear .env (copiar y pegar, reemplazar con tu API key)
echo PORT=3000 > .env
echo NODE_ENV=development >> .env
echo OPENAI_API_KEY=tu_api_key_aqui >> .env

# 3. Iniciar servidor
npm start

# 4. Abrir navegador
start http://localhost:3000/planificaciones.html
```

---

**Última actualización:** 22 de Octubre, 2025
**Versión:** 1.0
**Tipo de documento:** Subtareas para Jira
**Proyecto:** Red College - Campus Royal
**Sprint:** Sprint Actual
