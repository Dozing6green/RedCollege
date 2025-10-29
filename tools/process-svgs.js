const fs = require('fs');
const path = require('path');

const SVG_INPUT_DIR = 'extracted-svgs';
const SVG_OUTPUT_DIR = 'public/svg';
const SPRITE_FILE = path.join(SVG_OUTPUT_DIR, 'sprite.svg');
const MANIFEST_FILE = path.join(SVG_OUTPUT_DIR, 'manifest.json');

// Palabras clave para identificar ilustraciones grandes
const ILLUSTRATION_KEYWORDS = ['ilustracion', 'illustration', 'hero', 'persona', 'banner', 'cover'];

// Crear directorios si no existen
if (!fs.existsSync('public')) {
    fs.mkdirSync('public');
}
if (!fs.existsSync(SVG_OUTPUT_DIR)) {
    fs.mkdirSync(SVG_OUTPUT_DIR, { recursive: true });
}

// Función para limpiar SVG (eliminar width/height, mantener viewBox)
function optimizeSVG(svgContent) {
    // Eliminar width y height attributes
    let optimized = svgContent.replace(/\s*width="[^"]*"/gi, '');
    optimized = optimized.replace(/\s*height="[^"]*"/gi, '');

    // Eliminar class attributes del svg root (se manejarán por CSS)
    optimized = optimized.replace(/<svg([^>]*)\sclass="[^"]*"/, '<svg$1');

    return optimized.trim();
}

// Función para extraer id del nombre de archivo
function extractId(filename) {
    return filename.replace('.svg', '').replace(/^svg-figma-/, 'icon-');
}

// Función para determinar si es ilustración
function isIllustration(filename) {
    const lowerName = filename.toLowerCase();
    return ILLUSTRATION_KEYWORDS.some(keyword => lowerName.includes(keyword)) ||
           parseInt(filename.match(/\d+/)?.[0] || '0') >= 34; // SVGs grandes son ilustraciones
}

// Leer todos los archivos SVG
const svgFiles = fs.readdirSync(SVG_INPUT_DIR)
    .filter(file => file.endsWith('.svg'));

console.log(`\nProcesando ${svgFiles.length} archivos SVG...\n`);

const icons = [];
const illustrations = [];
const symbols = [];

svgFiles.forEach((filename) => {
    const filepath = path.join(SVG_INPUT_DIR, filename);
    let svgContent = fs.readFileSync(filepath, 'utf-8');

    // Optimizar SVG
    svgContent = optimizeSVG(svgContent);

    const id = extractId(filename);
    const fileSize = fs.statSync(filepath).size;

    if (isIllustration(filename) || fileSize > 2000) {
        // Es una ilustración grande - guardar como archivo individual
        const outputPath = path.join(SVG_OUTPUT_DIR, `${id}.svg`);
        fs.writeFileSync(outputPath, svgContent);

        illustrations.push({
            id: id,
            file: `svg/${id}.svg`,
            originalName: filename
        });

        console.log(`📄 Ilustración: ${id} (${fileSize} bytes)`);
    } else {
        // Es un ícono - agregar al sprite
        // Extraer contenido interno del SVG
        const match = svgContent.match(/<svg[^>]*>([\s\S]*)<\/svg>/i);
        if (match) {
            const innerContent = match[1];
            const viewBoxMatch = svgContent.match(/viewBox="([^"]*)"/i);
            const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24';

            symbols.push(`  <symbol id="${id}" viewBox="${viewBox}">
${innerContent}
  </symbol>`);

            icons.push({
                id: id,
                originalName: filename,
                viewBox: viewBox
            });

            console.log(`🎨 Ícono: ${id}`);
        }
    }
});

// Generar sprite SVG
const spriteContent = `<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
${symbols.join('\n')}
</svg>`;

fs.writeFileSync(SPRITE_FILE, spriteContent);
console.log(`\n✅ Sprite generado: ${SPRITE_FILE} (${icons.length} íconos)`);

// Generar manifest.json
const manifest = {
    icons: icons.map(i => ({ id: i.id, viewBox: i.viewBox })),
    illustrations: illustrations.map(i => ({ id: i.id, file: i.file })),
    meta: {
        generatedAt: new Date().toISOString(),
        totalIcons: icons.length,
        totalIllustrations: illustrations.length
    }
};

fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2));
console.log(`✅ Manifest generado: ${MANIFEST_FILE}`);

console.log(`\n📊 RESUMEN:`);
console.log(`   Íconos en sprite: ${icons.length}`);
console.log(`   Ilustraciones individuales: ${illustrations.length}`);
console.log(`   Total procesado: ${svgFiles.length}`);
console.log(`\n🎉 Procesamiento completado!\n`);
