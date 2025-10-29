// ===================================
// Script Simple de Captura
// Alternativa más rápida sin Puppeteer
// ===================================

const https = require('https');
const fs = require('fs').promises;

async function captureSimple() {
    console.log('🚀 Capturando sitio Figma (método simple)...\n');

    const url = 'https://campus-royal-43590135.figma.site/';

    return new Promise((resolve, reject) => {
        https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        }, async (response) => {
            let data = '';

            response.on('data', chunk => {
                data += chunk;
            });

            response.on('end', async () => {
                try {
                    // Guardar HTML base
                    await fs.writeFile('figma-site-base.html', data, 'utf8');

                    console.log('✅ HTML base guardado: figma-site-base.html');
                    console.log('\n📝 NOTA: Este es el HTML inicial (antes de JavaScript)');
                    console.log('Para obtener el HTML completamente renderizado, usa:');
                    console.log('   npm run capture\n');

                    // Extraer información básica
                    const info = {
                        url: url,
                        timestamp: new Date().toISOString(),
                        size: data.length,
                        hasScripts: (data.match(/<script/g) || []).length,
                        hasStyles: (data.match(/<style|<link.*stylesheet/g) || []).length,
                        note: 'HTML antes de ejecutar JavaScript. Para contenido completo use Puppeteer.'
                    };

                    await fs.writeFile('figma-site-base-info.json', JSON.stringify(info, null, 2), 'utf8');

                    console.log('📊 Estadísticas:');
                    console.log(`   - Tamaño: ${(data.length / 1024).toFixed(2)} KB`);
                    console.log(`   - Scripts: ${info.hasScripts}`);
                    console.log(`   - Estilos: ${info.hasStyles}`);

                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            });
        }).on('error', reject);
    });
}

if (require.main === module) {
    captureSimple().catch(error => {
        console.error('❌ Error:', error.message);
        process.exit(1);
    });
}

module.exports = { captureSimple };
