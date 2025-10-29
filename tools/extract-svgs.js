const https = require('https');
const fs = require('fs');

const url = 'https://campus-royal-43590135.figma.site/';

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        // Extract all SVG elements
        const svgRegex = /<svg[\s\S]*?<\/svg>/gi;
        const svgs = data.match(svgRegex) || [];

        console.log(`Found ${svgs.length} SVG elements\n`);

        // Save each SVG to a separate file
        svgs.forEach((svg, index) => {
            const filename = `svg-${index + 1}.svg`;
            fs.writeFileSync(filename, svg);
            console.log(`Saved: ${filename}`);

            // Also print the first 200 chars of each SVG
            console.log(`Preview: ${svg.substring(0, 200)}...\n`);
        });

        // Save all SVGs to a single file
        const allSvgsContent = svgs.map((svg, index) => {
            return `<!-- SVG ${index + 1} -->\n${svg}\n`;
        }).join('\n');

        fs.writeFileSync('all-svgs.txt', allSvgsContent);
        console.log('\nAll SVGs saved to: all-svgs.txt');

        // Print summary
        console.log('\n=== SUMMARY ===');
        console.log(`Total SVGs found: ${svgs.length}`);
    });

}).on('error', (err) => {
    console.error('Error:', err.message);
});
