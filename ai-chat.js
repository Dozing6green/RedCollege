// ===================================
// AI Chat System - Multi-API Support
// ===================================

class AIChatSystem {
    constructor() {
        this.config = {
            // Configuración de APIs disponibles
            apis: {
                openai: {
                    name: 'OpenAI GPT',
                    endpoint: '/api/openai/chat',
                    model: 'gpt-3.5-turbo',
                    enabled: true
                },
                claude: {
                    name: 'Claude (Anthropic)',
                    endpoint: '/api/claude/chat',
                    model: 'claude-3-sonnet-20240229',
                    enabled: true
                },
                gemini: {
                    name: 'Google Gemini',
                    endpoint: '/api/gemini/chat',
                    model: 'gemini-pro',
                    enabled: false
                },
                local: {
                    name: 'Simulación Local',
                    endpoint: null,
                    model: 'local-mock',
                    enabled: true
                }
            },
            // API activa actual
            activeAPI: 'local', // Cambiar a 'openai' o 'claude' cuando tengas las keys

            // Configuración general
            maxHistoryLength: 50,
            typingSpeed: 30, // ms por caracter
            storageKey: 'campus-royal-ai-chat'
        };

        this.chatHistory = [];
        this.isTyping = false;
        this.currentSessionId = this.generateSessionId();

        this.init();
    }

    init() {
        // Elementos del DOM
        this.chatButton = document.getElementById('aiChatButton');
        this.chatModal = document.getElementById('aiChatModal');
        this.chatClose = document.getElementById('aiChatClose');
        this.chatOverlay = document.querySelector('.ai-chat-overlay');
        this.chatMessages = document.getElementById('aiChatMessages');
        this.chatForm = document.getElementById('aiChatForm');
        this.chatInput = document.getElementById('aiChatInput');
        this.typingIndicator = document.getElementById('aiTypingIndicator');

        // Cargar historial guardado
        this.loadHistory();

        // Event listeners
        this.attachEventListeners();

        console.log('✅ AI Chat System initialized');
        console.log('📊 Active API:', this.config.activeAPI);
        console.log('💾 Session ID:', this.currentSessionId);
    }

    attachEventListeners() {
        // Abrir modal
        this.chatButton?.addEventListener('click', () => this.openChat());

        // Cerrar modal
        this.chatClose?.addEventListener('click', () => this.closeChat());
        this.chatOverlay?.addEventListener('click', () => this.closeChat());

        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.chatModal?.classList.contains('active')) {
                this.closeChat();
            }
        });

        // Enviar mensaje
        this.chatForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendMessage();
        });

        // Auto-resize textarea
        this.chatInput?.addEventListener('input', (e) => {
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
        });

        // Enter para enviar, Shift+Enter para nueva línea
        this.chatInput?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Botones de acciones rápidas
        this.attachQuickActions();
    }

    attachQuickActions() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-action')) {
                const question = e.target.textContent;
                this.chatInput.value = question;
                this.sendMessage();
            }
        });
    }

    openChat() {
        this.chatModal?.classList.add('active');
        this.chatInput?.focus();
        document.body.style.overflow = 'hidden';
    }

    closeChat() {
        this.chatModal?.classList.remove('active');
        document.body.style.overflow = '';
    }

    generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    async sendMessage() {
        const message = this.chatInput?.value.trim();

        if (!message || this.isTyping) return;

        // Limpiar input
        this.chatInput.value = '';
        this.chatInput.style.height = 'auto';

        // Agregar mensaje del usuario
        this.addMessage({
            role: 'user',
            content: message,
            timestamp: new Date().toISOString()
        });

        // Mostrar indicador de escritura
        this.showTypingIndicator();

        // Preparar datos para la API
        const requestData = this.prepareAPIRequest(message);

        try {
            // Llamar a la API correspondiente
            const response = await this.callAPI(requestData);

            // Ocultar indicador
            this.hideTypingIndicator();

            // Agregar respuesta de la IA
            this.addMessage({
                role: 'assistant',
                content: response.content,
                timestamp: new Date().toISOString(),
                model: response.model
            }, true); // true para efecto typewriter

        } catch (error) {
            console.error('Error al obtener respuesta:', error);
            this.hideTypingIndicator();

            this.addMessage({
                role: 'assistant',
                content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta nuevamente.',
                timestamp: new Date().toISOString(),
                error: true
            });
        }
    }

    prepareAPIRequest(userMessage) {
        // Formato JSON estándar para todas las APIs
        return {
            session_id: this.currentSessionId,
            api: this.config.activeAPI,
            model: this.config.apis[this.config.activeAPI].model,
            messages: [
                {
                    role: 'system',
                    content: 'Eres un asistente educativo de Campus Royal, una plataforma de aprendizaje en línea. Tu función es ayudar a los estudiantes con información sobre cursos, certificaciones, métodos de pago, y resolver dudas generales sobre la plataforma. Sé amable, profesional y conciso en tus respuestas.'
                },
                ...this.getRecentHistory(5), // Últimos 5 mensajes para contexto
                {
                    role: 'user',
                    content: userMessage
                }
            ],
            options: {
                temperature: 0.7,
                max_tokens: 500,
                stream: false
            },
            timestamp: new Date().toISOString()
        };
    }

    async callAPI(requestData) {
        const activeAPI = this.config.apis[this.config.activeAPI];

        // Si es simulación local
        if (this.config.activeAPI === 'local' || !activeAPI.endpoint) {
            return this.simulateAIResponse(requestData);
        }

        // Llamada real a la API
        try {
            const response = await fetch(activeAPI.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            return {
                content: data.response || data.content || data.message,
                model: activeAPI.model,
                usage: data.usage
            };

        } catch (error) {
            console.error('API call failed:', error);
            // Fallback a simulación
            return this.simulateAIResponse(requestData);
        }
    }

    simulateAIResponse(requestData) {
        // Base de respuestas simuladas contextuales
        const userMessage = requestData.messages[requestData.messages.length - 1].content.toLowerCase();

        const responses = {
            cursos: [
                '¡Excelente pregunta! En Campus Royal ofrecemos más de 1,200 cursos en diversas áreas: Programación (React, Node.js, Python), Diseño (UX/UI, Figma), Inteligencia Artificial, Marketing Digital y más. ¿Hay algún área específica que te interese?',
                'Nuestros cursos están diseñados por expertos de la industria. Puedes filtrar por nivel (principiante, intermedio, avanzado), duración, y precio. ¿Quieres que te recomiende algunos según tus intereses?'
            ],
            certificacion: [
                'Todos nuestros cursos incluyen certificados oficiales reconocidos internacionalmente. Al completar el curso con un 80% o más de aprobación, recibirás tu certificado digital verificable.',
                'Las certificaciones de Campus Royal están avaladas por instituciones educativas y son reconocidas por empresas líderes en tecnología. ¿Te gustaría ver ejemplos de certificados?'
            ],
            precio: [
                'Ofrecemos cursos desde $69.99 hasta $129.99. Además, tenemos planes de suscripción mensual ($49.99/mes) que te dan acceso ilimitado a todo el catálogo. ¿Quieres conocer nuestras opciones de pago?',
                'Contamos con opciones de pago flexibles: tarjeta de crédito, PayPal, y planes de pago en cuotas sin intereses. También ofrecemos descuentos por volumen para empresas.'
            ],
            inscripcion: [
                'Inscribirse es muy sencillo: 1) Crea tu cuenta gratis, 2) Explora el catálogo de cursos, 3) Selecciona el curso que te interesa, 4) Completa el pago, ¡y listo! Tendrás acceso inmediato al contenido.',
                'El proceso de inscripción toma menos de 5 minutos. ¿Necesitas ayuda con algún paso en particular?'
            ],
            duracion: [
                'La duración varía según el curso. Tenemos cursos cortos de 10-20 horas y programas completos de 100+ horas. Puedes estudiar a tu propio ritmo con acceso ilimitado.',
                'Una vez inscrito, tienes acceso de por vida al curso. Puedes pausar y retomar cuando quieras, sin fechas límite.'
            ],
            soporte: [
                'Ofrecemos soporte 24/7 a través de este chat, email (soporte@campusroyal.com), y foros de la comunidad. Los instructores responden dudas en máximo 48 horas.',
                '¡Estoy aquí para ayudarte! Además, tenemos una base de conocimientos con tutoriales, FAQs y guías de estudio.'
            ],
            default: [
                'Interesante pregunta. En Campus Royal nos especializamos en educación de calidad. ¿Podrías darme más detalles para ayudarte mejor?',
                'Estoy aquí para ayudarte con información sobre cursos, certificaciones, precios, y más. ¿Qué te gustaría saber específicamente?',
                '¡Con gusto! Puedo ayudarte con: información de cursos, proceso de inscripción, certificaciones, precios, y soporte técnico. ¿Qué necesitas?'
            ]
        };

        // Detectar categoría de la pregunta
        let category = 'default';
        const keywords = {
            cursos: ['curso', 'aprender', 'estudiar', 'clase', 'programa', 'contenido'],
            certificacion: ['certificado', 'certificación', 'diploma', 'acreditación'],
            precio: ['precio', 'costo', 'pagar', 'cuanto', 'valor', 'suscripción'],
            inscripcion: ['inscribir', 'registrar', 'unir', 'empezar', 'comenzar'],
            duracion: ['duración', 'tiempo', 'horas', 'cuanto dura', 'largo'],
            soporte: ['ayuda', 'soporte', 'problema', 'contacto', 'asistencia']
        };

        for (const [key, words] of Object.entries(keywords)) {
            if (words.some(word => userMessage.includes(word))) {
                category = key;
                break;
            }
        }

        // Seleccionar respuesta aleatoria de la categoría
        const categoryResponses = responses[category];
        const selectedResponse = categoryResponses[Math.floor(Math.random() * categoryResponses.length)];

        // Simular delay de red
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    content: selectedResponse,
                    model: 'local-mock-v1',
                    simulated: true
                });
            }, 500 + Math.random() * 1000); // 0.5-1.5 segundos
        });
    }

    addMessage(messageData, useTypewriter = false) {
        const { role, content, timestamp } = messageData;

        // Guardar en historial
        this.chatHistory.push(messageData);
        this.saveHistory();

        // Crear elemento del mensaje
        const messageDiv = document.createElement('div');
        messageDiv.className = role === 'user' ? 'user-message' : 'ai-message';

        const avatar = document.createElement('div');
        avatar.className = `message-avatar ${role === 'user' ? 'user-avatar' : 'ai-avatar'}`;

        if (role === 'user') {
            avatar.textContent = 'TÚ';
        } else {
            avatar.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 28 31" fill="none">
                    <path d="M12.3635 6.73759H12.5159C12.5159 4.92134 14.0321 3.44308 15.8949 3.44308V3.29451C14.0321 3.29451 12.5159 1.81625 12.5159 0H12.3635C12.3635 1.81625 10.8473 3.29451 8.98438 3.29451V3.44308C10.8473 3.44308 12.3635 4.92134 12.3635 6.73759Z" fill="white"></path>
                    <path d="M5.65036 5.38981H5.40655C5.40655 8.29581 2.98061 10.661 0 10.661V10.8987C2.98061 10.8987 5.40655 13.264 5.40655 16.17H5.65036C5.65036 13.264 8.0763 10.8987 11.0569 10.8987V10.661C8.0763 10.661 5.65036 8.29581 5.65036 5.38981Z" fill="white"></path>
                    <path d="M27.1029 19.718V19.4864H27.0494C20.98 19.4864 16.0449 14.6748 16.0449 8.75735V8.70524H15.8073V8.75735C15.8073 14.6748 10.8722 19.4864 4.8028 19.4864H4.74935V19.718H4.8028C10.8722 19.718 15.8073 24.5296 15.8073 30.4471V30.4992H16.0449V30.4471C16.0449 24.5296 20.98 19.718 27.0494 19.718H27.1029Z" fill="white"></path>
                </svg>
            `;
        }

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';

        const messageParagraph = document.createElement('p');
        messageContent.appendChild(messageParagraph);

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);

        this.chatMessages?.appendChild(messageDiv);

        // Aplicar efecto typewriter solo para respuestas de IA
        if (useTypewriter && role === 'assistant') {
            this.typewriterEffect(messageParagraph, content);
        } else {
            messageParagraph.textContent = content;
        }

        // Scroll al final
        this.scrollToBottom();
    }

    typewriterEffect(element, text) {
        this.isTyping = true;
        let index = 0;
        const speed = this.config.typingSpeed;

        const type = () => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                this.scrollToBottom();
                setTimeout(type, speed);
            } else {
                this.isTyping = false;
            }
        };

        type();
    }

    showTypingIndicator() {
        if (this.typingIndicator) {
            this.typingIndicator.style.display = 'flex';
        }
    }

    hideTypingIndicator() {
        if (this.typingIndicator) {
            this.typingIndicator.style.display = 'none';
        }
    }

    scrollToBottom() {
        if (this.chatMessages) {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }
    }

    getRecentHistory(count = 5) {
        // Obtener los últimos N mensajes para contexto
        return this.chatHistory
            .slice(-count)
            .map(msg => ({
                role: msg.role,
                content: msg.content
            }));
    }

    saveHistory() {
        try {
            // Guardar solo los últimos N mensajes
            const historyToSave = this.chatHistory.slice(-this.config.maxHistoryLength);

            const dataToStore = {
                version: '1.0',
                sessionId: this.currentSessionId,
                lastUpdated: new Date().toISOString(),
                activeAPI: this.config.activeAPI,
                messages: historyToSave
            };

            localStorage.setItem(
                this.config.storageKey,
                JSON.stringify(dataToStore)
            );
        } catch (error) {
            console.error('Error al guardar historial:', error);
        }
    }

    loadHistory() {
        try {
            const stored = localStorage.getItem(this.config.storageKey);

            if (stored) {
                const data = JSON.parse(stored);

                // Validar versión y estructura
                if (data.version === '1.0' && Array.isArray(data.messages)) {
                    this.chatHistory = data.messages;

                    // Renderizar mensajes guardados (excepto el mensaje de bienvenida)
                    const messagesToRender = this.chatHistory.filter(msg => msg.role !== 'assistant' || !msg.content.includes('¡Hola! Soy tu asistente'));

                    messagesToRender.forEach(msg => {
                        this.addMessage(msg, false);
                    });

                    console.log(`📚 Historial cargado: ${this.chatHistory.length} mensajes`);
                }
            }
        } catch (error) {
            console.error('Error al cargar historial:', error);
        }
    }

    clearHistory() {
        this.chatHistory = [];
        localStorage.removeItem(this.config.storageKey);

        // Limpiar mensajes del chat (excepto el de bienvenida)
        const messages = this.chatMessages?.querySelectorAll('.user-message, .ai-message:not(:first-child)');
        messages?.forEach(msg => msg.remove());

        console.log('🗑️ Historial eliminado');
    }

    switchAPI(apiName) {
        if (this.config.apis[apiName] && this.config.apis[apiName].enabled) {
            this.config.activeAPI = apiName;
            console.log(`🔄 API cambiada a: ${this.config.apis[apiName].name}`);

            // Notificar al usuario
            this.addMessage({
                role: 'assistant',
                content: `Ahora estoy usando ${this.config.apis[apiName].name}. ¿En qué puedo ayudarte?`,
                timestamp: new Date().toISOString()
            });
        } else {
            console.error(`❌ API no disponible: ${apiName}`);
        }
    }

    // Método para exportar historial
    exportHistory() {
        const dataStr = JSON.stringify({
            exportDate: new Date().toISOString(),
            sessionId: this.currentSessionId,
            totalMessages: this.chatHistory.length,
            messages: this.chatHistory
        }, null, 2);

        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = `campus-royal-chat-${Date.now()}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();

        console.log('📥 Historial exportado');
    }

    // Método para obtener estadísticas
    getStats() {
        return {
            totalMessages: this.chatHistory.length,
            userMessages: this.chatHistory.filter(m => m.role === 'user').length,
            assistantMessages: this.chatHistory.filter(m => m.role === 'assistant').length,
            sessionId: this.currentSessionId,
            activeAPI: this.config.activeAPI,
            apiName: this.config.apis[this.config.activeAPI].name
        };
    }
}

// ===================================
// Inicialización
// ===================================

let aiChat;

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar sistema de chat
    aiChat = new AIChatSystem();

    // Exponer al scope global para debugging
    window.aiChat = aiChat;

    // Comandos de consola útiles
    console.log(`
    🤖 Campus Royal AI Chat System
    ================================

    Comandos disponibles en consola:

    aiChat.switchAPI('openai')    - Cambiar a OpenAI
    aiChat.switchAPI('claude')    - Cambiar a Claude
    aiChat.switchAPI('local')     - Cambiar a simulación
    aiChat.clearHistory()         - Limpiar historial
    aiChat.exportHistory()        - Exportar chat a JSON
    aiChat.getStats()             - Ver estadísticas
    aiChat.config                 - Ver configuración

    ================================
    `);
});
