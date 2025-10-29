// Obtener el JSON de contenido del sitio Figma
const https = require('https');
const fs = require('fs').promises;

const jsonUrl = 'https://campus-royal-43590135.figma.site/_json/04ba4987-57d7-466d-ba70-a87d633075de/_index.json';

console.log('📥 Obteniendo contenido JSON del sitio Figma...\n');

https.get(jsonUrl, (response) => {
    let data = '';

    response.on('data', chunk => {
        data += chunk;
    });

    response.on('end', async () => {
        try {
            const json = JSON.parse(data);

            await fs.writeFile('figma-content.json', JSON.stringify(json, null, 2), 'utf8');

            console.log('✅ Contenido JSON guardado: figma-content.json');
            console.log(`📊 Tamaño: ${(data.length / 1024).toFixed(2)} KB\n`);

            // Analizar estructura
            console.log('📋 Estructura del contenido:');
            console.log(`   - Nodes: ${json.nodes ? Object.keys(json.nodes).length : 0}`);
            console.log(`   - Breakpoints: ${json.breakpoints ? json.breakpoints.length : 0}`);

            // Intentar extraer textos
            if (json.nodes) {
                const textos = [];
                Object.values(json.nodes).forEach(node => {
                    if (node.text) {
                        textos.push(node.text);
                    }
                    if (node.props && node.props.text) {
                        textos.push(node.props.text);
                    }
                });

                if (textos.length > 0) {
                    console.log(`\n📝 Textos encontrados (primeros 20):`);
                    textos.slice(0, 20).forEach((t, i) => {
                        const preview = t.substring(0, 100);
                        console.log(`   ${i + 1}. ${preview}${t.length > 100 ? '...' : ''}`);
                    });
                }
            }

            console.log('\n✅ Revisa figma-content.json para ver toda la estructura');

        } catch (error) {
            console.error('❌ Error al procesar JSON:', error.message);
        }
    });
}).on('error', (error) => {
    console.error('❌ Error al obtener JSON:', error.message);
});
