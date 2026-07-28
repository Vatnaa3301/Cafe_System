/**
 * Post-build script: reads the Vite manifest and generates a static
 * public/index.html that references the compiled CSS & JS assets.
 * This allows Vercel to serve the React SPA without relying on Laravel's
 * Blade @vite() directive (which can fail in serverless PHP).
 */
const fs = require('fs');
const path = require('path');

const manifestPath = path.join(__dirname, '..', 'public', 'build', 'manifest.json');
const outputPath = path.join(__dirname, '..', 'public', 'index.html');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

const entry = manifest['resources/js/main.jsx'];
if (!entry) {
    console.error('Could not find resources/js/main.jsx in manifest');
    process.exit(1);
}

const jsFile = `/build/${entry.file}`;
const cssFiles = (entry.css || []).map(f => `/build/${f}`);

const cssLinks = cssFiles.map(href => `    <link rel="stylesheet" href="${href}">`).join('\n');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Café System</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
${cssLinks}
</head>
<body class="antialiased">
    <div id="root"></div>
    <script type="module" src="${jsFile}"></script>
</body>
</html>
`;

fs.writeFileSync(outputPath, html, 'utf-8');
console.log('✅ Generated public/index.html with assets:');
console.log('   JS:', jsFile);
cssFiles.forEach(f => console.log('   CSS:', f));
