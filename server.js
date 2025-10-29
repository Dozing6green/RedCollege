// ===================================
// Campus Royal - AI API Server
// Node.js + Express Backend
// ===================================

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Cargar configuración
let apiConfig;

async function loadConfig() {
    try {
        const configData = await fs.readFile('./config/api-config.json', 'utf8');
        apiConfig = JSON.parse(configData);
        console.log('✅ Configuración de APIs cargada');
    } catch (error) {
        console.error('❌ Error al cargar configuración:', error);
        process.exit(1);
    }
}

// Logger middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
});

// ===================================
// Utilidades
// ===================================

// Construir mensajes para OpenAI
function buildOpenAIMessages(requestData) {
    return requestData.messages.map(msg => ({
        role: msg.role,
        content: msg.content
    }));
}

// Construir payload para Claude
function buildClaudePayload(requestData) {
    const systemMessage = requestData.messages.find(m => m.role === 'system');
    const userMessages = requestData.messages.filter(m => m.role !== 'system');

    return {
        model: requestData.model || apiConfig.apis.claude.models.default,
        max_tokens: requestData.options?.max_tokens || apiConfig.apis.claude.defaultParams.max_tokens,
        temperature: requestData.options?.temperature || apiConfig.apis.claude.defaultParams.temperature,
        system: systemMessage?.content || apiConfig.systemPrompts.default,
        messages: userMessages.map(msg => ({
            role: msg.role === 'assistant' ? 'assistant' : 'user',
            content: msg.content
        }))
    };
}

// ===================================
// Endpoints de API
// ===================================

// Rutas para módulos
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/modules/landing/index.html'));
});

app.get('/planificaciones', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/modules/planificaciones/index.html'));
});

app.get('/evalua360', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/modules/evalua360/index.html'));
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        apis: {
            openai: apiConfig?.apis?.openai?.enabled || false,
            claude: apiConfig?.apis?.claude?.enabled || false,
            gemini: apiConfig?.apis?.gemini?.enabled || false
        }
    });
});

// OpenAI Endpoint
app.post('/api/openai/chat', async (req, res) => {
    try {
        const requestData = req.body;

        if (!apiConfig.apis.openai.enabled) {
            return res.status(503).json({
                error: 'OpenAI API no está habilitada',
                fallback: true
            });
        }

        const apiKey = process.env.OPENAI_API_KEY || apiConfig.apis.openai.headers.Authorization.replace('Bearer ', '');

        if (apiKey === 'YOUR_OPENAI_API_KEY') {
            return res.status(401).json({
                error: 'API key de OpenAI no configurada',
                message: 'Por favor, configura tu OPENAI_API_KEY en las variables de entorno o en api-config.json'
            });
        }

        const openAIPayload = {
            model: requestData.model || apiConfig.apis.openai.models.default,
            messages: buildOpenAIMessages(requestData),
            temperature: requestData.options?.temperature || apiConfig.apis.openai.defaultParams.temperature,
            max_tokens: requestData.options?.max_tokens || apiConfig.apis.openai.defaultParams.max_tokens
        };

        console.log('🔄 Llamando a OpenAI API...');

        const response = await fetch(apiConfig.apis.openai.baseURL + apiConfig.apis.openai.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(openAIPayload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();

        console.log('✅ Respuesta de OpenAI recibida');

        res.json({
            response: data.choices[0].message.content,
            model: data.model,
            usage: data.usage,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Error en OpenAI:', error.message);

        res.status(500).json({
            error: error.message,
            fallback: true,
            timestamp: new Date().toISOString()
        });
    }
});

// Claude Endpoint
app.post('/api/claude/chat', async (req, res) => {
    try {
        const requestData = req.body;

        if (!apiConfig.apis.claude.enabled) {
            return res.status(503).json({
                error: 'Claude API no está habilitada',
                fallback: true
            });
        }

        const apiKey = process.env.CLAUDE_API_KEY || apiConfig.apis.claude.headers['x-api-key'];

        if (apiKey === 'YOUR_CLAUDE_API_KEY') {
            return res.status(401).json({
                error: 'API key de Claude no configurada',
                message: 'Por favor, configura tu CLAUDE_API_KEY en las variables de entorno o en api-config.json'
            });
        }

        const claudePayload = buildClaudePayload(requestData);

        console.log('🔄 Llamando a Claude API...');

        const response = await fetch(apiConfig.apis.claude.baseURL + apiConfig.apis.claude.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': apiConfig.apis.claude.headers['anthropic-version']
            },
            body: JSON.stringify(claudePayload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Claude API error: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();

        console.log('✅ Respuesta de Claude recibida');

        res.json({
            response: data.content[0].text,
            model: data.model,
            usage: data.usage,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Error en Claude:', error.message);

        res.status(500).json({
            error: error.message,
            fallback: true,
            timestamp: new Date().toISOString()
        });
    }
});

// Gemini Endpoint (opcional)
app.post('/api/gemini/chat', async (req, res) => {
    try {
        const requestData = req.body;

        if (!apiConfig.apis.gemini.enabled) {
            return res.status(503).json({
                error: 'Gemini API no está habilitada',
                fallback: true
            });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(401).json({
                error: 'API key de Gemini no configurada',
                message: 'Por favor, configura tu GEMINI_API_KEY en las variables de entorno'
            });
        }

        // Construir payload para Gemini
        const geminiPayload = {
            contents: requestData.messages
                .filter(m => m.role !== 'system')
                .map(m => ({
                    parts: [{ text: m.content }],
                    role: m.role === 'assistant' ? 'model' : 'user'
                })),
            generationConfig: {
                temperature: requestData.options?.temperature || apiConfig.apis.gemini.defaultParams.temperature,
                maxOutputTokens: requestData.options?.max_tokens || apiConfig.apis.gemini.defaultParams.maxOutputTokens,
                topK: apiConfig.apis.gemini.defaultParams.topK,
                topP: apiConfig.apis.gemini.defaultParams.topP
            }
        };

        console.log('🔄 Llamando a Gemini API...');

        const url = `${apiConfig.apis.gemini.baseURL}${apiConfig.apis.gemini.endpoint}?key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(geminiPayload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();

        console.log('✅ Respuesta de Gemini recibida');

        res.json({
            response: data.candidates[0].content.parts[0].text,
            model: 'gemini-pro',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Error en Gemini:', error.message);

        res.status(500).json({
            error: error.message,
            fallback: true,
            timestamp: new Date().toISOString()
        });
    }
});

// Endpoint para obtener configuración (sin API keys)
app.get('/api/config', (req, res) => {
    const safeConfig = {
        version: apiConfig.version,
        apis: Object.keys(apiConfig.apis).reduce((acc, key) => {
            acc[key] = {
                enabled: apiConfig.apis[key].enabled,
                name: apiConfig.apis[key].name,
                models: apiConfig.apis[key].models
            };
            return acc;
        }, {}),
        features: apiConfig.features
    };

    res.json(safeConfig);
});

// Endpoint para estadísticas (opcional)
app.get('/api/stats', (req, res) => {
    res.json({
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        nodeVersion: process.version,
        platform: process.platform
    });
});

// ===================================
// Error Handling
// ===================================

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint no encontrado',
        path: req.path,
        timestamp: new Date().toISOString()
    });
});

// Error handler global
app.use((err, req, res, next) => {
    console.error('❌ Error no manejado:', err);

    res.status(500).json({
        error: 'Error interno del servidor',
        message: err.message,
        timestamp: new Date().toISOString()
    });
});

// ===================================
// Inicio del servidor
// ===================================

async function startServer() {
    await loadConfig();

    app.listen(PORT, () => {
        console.log(`
╔═══════════════════════════════════════════╗
║   🎓 Campus Royal - AI Server            ║
║   🚀 Servidor iniciado exitosamente      ║
╚═══════════════════════════════════════════╝

📍 URL: http://localhost:${PORT}
🌐 Entorno: ${process.env.NODE_ENV || 'development'}
⏰ Iniciado: ${new Date().toLocaleString('es-ES')}

APIs disponibles:
  ${apiConfig.apis.openai.enabled ? '✅' : '❌'} OpenAI - http://localhost:${PORT}/api/openai/chat
  ${apiConfig.apis.claude.enabled ? '✅' : '❌'} Claude  - http://localhost:${PORT}/api/claude/chat
  ${apiConfig.apis.gemini.enabled ? '✅' : '❌'} Gemini  - http://localhost:${PORT}/api/gemini/chat

🔧 Configuración: http://localhost:${PORT}/api/config
❤️  Health Check: http://localhost:${PORT}/api/health

Presiona Ctrl+C para detener el servidor
        `);
    });
}

// Iniciar el servidor
startServer().catch(error => {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
});

// Manejo de shutdown graceful
process.on('SIGTERM', () => {
    console.log('\n🛑 Recibida señal SIGTERM, cerrando servidor...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\n🛑 Recibida señal SIGINT, cerrando servidor...');
    process.exit(0);
});
