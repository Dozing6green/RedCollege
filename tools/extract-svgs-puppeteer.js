const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    console.log('Navigating to Figma site...');
    await page.goto('https://campus-royal-43590135.figma.site/', {
        waitUntil: 'networkidle2',
        timeout: 60000
    });

    console.log('Waiting for content to load...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('Extracting SVGs...');
    const svgs = await page.evaluate(() => {
        const svgElements = document.querySelectorAll('svg');
        return Array.from(svgElements).map((svg, index) => {
            return {
                index: index + 1,
                outerHTML: svg.outerHTML,
                width: svg.getAttribute('width'),
                height: svg.getAttribute('height'),
                viewBox: svg.getAttribute('viewBox'),
                classes: svg.className.baseVal || svg.getAttribute('class')
            };
        });
    });

    console.log(`\nFound ${svgs.length} SVG elements\n`);

    // Create folder for SVGs
    const svgFolder = 'extracted-svgs';
    if (!fs.existsSync(svgFolder)) {
        fs.mkdirSync(svgFolder);
        console.log(`Created folder: ${svgFolder}\n`);
    }

    // Save each SVG to a separate file in the folder
    svgs.forEach((svg) => {
        const filename = `svg-figma-${svg.index}.svg`;
        const filepath = path.join(svgFolder, filename);
        fs.writeFileSync(filepath, svg.outerHTML);
        console.log(`Saved: ${filepath}`);
        console.log(`  Size: ${svg.width}x${svg.height}`);
        console.log(`  ViewBox: ${svg.viewBox}`);
        console.log(`  Classes: ${svg.classes}`);
        console.log(`  Preview: ${svg.outerHTML.substring(0, 150)}...\n`);
    });

    // Save all SVGs to a single file with metadata in the folder
    const allSvgsContent = svgs.map((svg) => {
        return `<!-- SVG ${svg.index} -->
<!-- Size: ${svg.width}x${svg.height}, ViewBox: ${svg.viewBox} -->
<!-- Classes: ${svg.classes} -->
${svg.outerHTML}

`;
    }).join('\n');

    const allSvgsPath = path.join(svgFolder, 'all-svgs-figma.txt');
    fs.writeFileSync(allSvgsPath, allSvgsContent);
    console.log(`All SVGs saved to: ${allSvgsPath}`);

    // Print summary
    console.log('\n=== SUMMARY ===');
    console.log(`Total SVGs found: ${svgs.length}`);
    console.log(`Saved to folder: ${svgFolder}`);

    await browser.close();
})();
