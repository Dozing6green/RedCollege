// ===================================
// Script de Captura - Sitio Figma
// Usa Puppeteer para obtener HTML renderizado
// ===================================

const fs = require('fs').promises;
const path = require('path');

// Función principal de captura
async function captureFigmaSite() {
    let browser;

    try {
        console.log('🚀 Iniciando captura del sitio Figma...\n');

        // Verificar si Puppeteer está instalado
        let puppeteer;
        try {
            puppeteer = require('puppeteer');
        } catch (error) {
            console.error('❌ Puppeteer no está instalado.');
            console.log('\n📦 Para instalar Puppeteer, ejecuta:');
            console.log('   npm install puppeteer\n');
            console.log('⚠️  Nota: Puppeteer descarga Chromium (~170MB), puede tomar unos minutos.\n');
            process.exit(1);
        }

        // Lanzar navegador
        console.log('🌐 Abriendo navegador headless...');
        browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-web-security'
            ]
        });

        const page = await browser.newPage();

        // Configurar viewport
        await page.setViewport({
            width: 1920,
            height: 1080,
            deviceScaleFactor: 1
        });

        // User agent
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        const url = 'https://campus-royal-43590135.figma.site/';

        console.log(`📍 Navegando a: ${url}`);

        // Navegar y esperar a que se cargue completamente
        await page.goto(url, {
            waitUntil: 'networkidle0',
            timeout: 60000
        });

        console.log('⏳ Esperando que el JavaScript se ejecute completamente...');

        // Esperar a que el contenedor principal sea visible
        await page.waitForSelector('#container', { timeout: 30000 }).catch(() => {
            console.log('⚠️  Contenedor #container no encontrado, continuando...');
        });

        // Esperar adicional para animaciones y contenido dinámico
        await new Promise(resolve => setTimeout(resolve, 5000));

        console.log('📸 Capturando contenido renderizado...\n');

        // Extraer HTML completo
        const htmlContent = await page.evaluate(() => document.documentElement.outerHTML);

        // Extraer información adicional útil
        const pageInfo = await page.evaluate(() => {
            // Obtener todos los textos visibles
            const textos = [];
            document.querySelectorAll('h1, h2, h3, p, a, button, span').forEach(el => {
                const text = el.textContent?.trim();
                if (text && text.length > 0) {
                    textos.push({
                        tag: el.tagName.toLowerCase(),
                        text: text,
                        classes: el.className
                    });
                }
            });

            // Obtener imágenes
            const imagenes = [];
            document.querySelectorAll('img').forEach(img => {
                imagenes.push({
                    src: img.src,
                    alt: img.alt,
                    width: img.width,
                    height: img.height
                });
            });

            // Obtener colores usados
            const colores = new Set();
            document.querySelectorAll('*').forEach(el => {
                const styles = window.getComputedStyle(el);
                if (styles.backgroundColor && styles.backgroundColor !== 'rgba(0, 0, 0, 0)') {
                    colores.add(styles.backgroundColor);
                }
                if (styles.color) {
                    colores.add(styles.color);
                }
            });

            // Obtener fuentes
            const fuentes = new Set();
            document.querySelectorAll('*').forEach(el => {
                const fontFamily = window.getComputedStyle(el).fontFamily;
                if (fontFamily) fuentes.add(fontFamily);
            });

            // Estructura de secciones
            const secciones = [];
            document.querySelectorAll('section, main, header, footer, nav, article').forEach(el => {
                secciones.push({
                    tag: el.tagName.toLowerCase(),
                    id: el.id,
                    classes: el.className,
                    children: el.children.length
                });
            });

            return {
                title: document.title,
                textos: textos.slice(0, 100), // Limitar a 100 para no saturar
                imagenes: imagenes,
                colores: [...colores],
                fuentes: [...fuentes],
                secciones: secciones,
                links: [...document.querySelectorAll('a')].map(a => ({
                    text: a.textContent?.trim(),
                    href: a.href
                })).slice(0, 50)
            };
        });

        // Capturar screenshot
        console.log('📷 Tomando screenshot...');
        await page.screenshot({
            path: 'figma-site-screenshot.png',
            fullPage: true
        });

        // Guardar HTML
        console.log('💾 Guardando archivos...\n');
        await fs.writeFile('figma-site-captured.html', htmlContent, 'utf8');

        // Guardar información extraída en JSON
        await fs.writeFile(
            'figma-site-info.json',
            JSON.stringify(pageInfo, null, 2),
            'utf8'
        );

        // Crear informe detallado
        const informe = `
╔══════════════════════════════════════════════════════════════╗
║           📊 INFORME DE CAPTURA - SITIO FIGMA               ║
╚══════════════════════════════════════════════════════════════╝

📍 URL: ${url}
📅 Fecha: ${new Date().toLocaleString('es-ES')}
📄 Título: ${pageInfo.title}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📁 ARCHIVOS GENERADOS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ figma-site-captured.html      - HTML completo renderizado
✅ figma-site-info.json          - Información estructurada (JSON)
✅ figma-site-screenshot.png     - Screenshot completo del sitio
✅ figma-site-report.txt         - Este informe

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📐 ESTRUCTURA DETECTADA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Secciones encontradas: ${pageInfo.secciones.length}

${pageInfo.secciones.map((s, i) =>
    `${i + 1}. <${s.tag}>${s.id ? ` id="${s.id}"` : ''}${s.classes ? ` class="${s.classes}"` : ''} (${s.children} hijos)`
).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 FUENTES DETECTADAS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${pageInfo.fuentes.slice(0, 10).map((f, i) => `${i + 1}. ${f}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 PALETA DE COLORES (primeros 20):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${pageInfo.colores.slice(0, 20).map((c, i) => `${i + 1}. ${c}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 CONTENIDO PRINCIPAL (primeros textos):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${pageInfo.textos.slice(0, 30).map((t, i) =>
    `${i + 1}. <${t.tag}> ${t.text.substring(0, 80)}${t.text.length > 80 ? '...' : ''}`
).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🖼️  IMÁGENES ENCONTRADAS: ${pageInfo.imagenes.length}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${pageInfo.imagenes.slice(0, 10).map((img, i) =>
    `${i + 1}. ${img.src.substring(0, 80)}... (${img.width}x${img.height})`
).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔗 NAVEGACIÓN (primeros enlaces):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${pageInfo.links.slice(0, 15).map((link, i) =>
    `${i + 1}. ${link.text} → ${link.href}`
).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 PRÓXIMOS PASOS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Revisa "figma-site-captured.html" para ver el código completo
2. Abre "figma-site-screenshot.png" para ver el diseño visual
3. Consulta "figma-site-info.json" para datos estructurados
4. Usa esta información para replicar el sitio en index.html

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Captura completada exitosamente!
`;

        await fs.writeFile('figma-site-report.txt', informe, 'utf8');

        console.log(informe);

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log('🎉 ¡CAPTURA COMPLETADA EXITOSAMENTE!\n');
        console.log('📂 Revisa los archivos generados en esta carpeta.\n');

    } catch (error) {
        console.error('\n❌ Error durante la captura:', error.message);
        console.error('\n💡 Sugerencias:');
        console.error('   1. Verifica tu conexión a internet');
        console.error('   2. Asegúrate de que Puppeteer esté instalado correctamente');
        console.error('   3. Intenta ejecutar: npm install puppeteer\n');
        process.exit(1);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Ejecutar
if (require.main === module) {
    captureFigmaSite();
}

module.exports = { captureFigmaSite };
