const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 1. Production Vector Mark SVG (100x100)
const productionMarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" fill="none">
  <defs>
    <!-- Left Chisel Facet (Rich Amber Bronze) -->
    <linearGradient id="ttLeft" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFB014" />
      <stop offset="100%" stop-color="#B86F00" />
    </linearGradient>

    <!-- Right Chisel Facet (Luminous Gold) -->
    <linearGradient id="ttRight" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFE582" />
      <stop offset="60%" stop-color="#F5A30A" />
      <stop offset="100%" stop-color="#C97A00" />
    </linearGradient>

    <!-- Deep Graphite Technical Squircle -->
    <linearGradient id="ttBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#17171C" />
      <stop offset="100%" stop-color="#09090C" />
    </linearGradient>

    <!-- Gold Perimeter Glow Rim -->
    <linearGradient id="ttBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E49505" stop-opacity="0.85" />
      <stop offset="45%" stop-color="#E49505" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.06" />
    </linearGradient>

    <!-- Ambient Radial Halo -->
    <radialGradient id="ttAmbient" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#E49505" stop-opacity="0.25" />
      <stop offset="60%" stop-color="#E49505" stop-opacity="0.06" />
      <stop offset="100%" stop-color="#E49505" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Squircle Base -->
  <rect x="3" y="3" width="94" height="94" rx="23" fill="url(#ttBg)" stroke="url(#ttBorder)" stroke-width="1.5" />
  <rect x="3" y="3" width="94" height="94" rx="23" fill="url(#ttAmbient)" />

  <!-- Specular top rim reflection -->
  <path d="M 28 4.6 Q 50 4 72 4.6" stroke="rgba(255,255,255,0.22)" stroke-width="1" stroke-linecap="round" />

  <!-- Master Monogram T with Dual 3D Chisel Facets -->
  <!-- Left Chisel Facet -->
  <path d="M 50 21.5 L 22.5 21.5 C 21.2 21.5 20.4 22.4 20.8 23.5 L 26.8 35.5 C 27.2 36.4 28.2 37 29.2 37 L 44 37 L 44 72.5 L 50 78.5 Z" fill="url(#ttLeft)" />

  <!-- Right Chisel Facet -->
  <path d="M 50 21.5 L 77.5 21.5 C 78.8 21.5 79.6 22.4 79.2 23.5 L 73.2 35.5 C 72.8 36.4 71.8 37 70.8 37 L 56 37 L 56 72.5 L 50 78.5 Z" fill="url(#ttRight)" />

  <!-- Surgical Specular Ridge -->
  <line x1="50" y1="21.5" x2="50" y2="78.5" stroke="#FFFBF0" stroke-width="1.4" stroke-linecap="round" />

  <!-- Left Code Bracket < -->
  <path d="M 32 45.5 L 20 54.5 L 32 63.5" stroke="url(#ttLeft)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />

  <!-- Right Code Bracket > -->
  <path d="M 68 45.5 L 80 54.5 L 68 63.5" stroke="url(#ttRight)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />
</svg>`;

// 2. Production Full Logo SVG - Dark Canvas (Social / OG / Default) (600x200)
const productionFullLogoDarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 200" width="600" height="200" fill="none">
  <defs>
    <linearGradient id="ttLeftFull" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFB014" />
      <stop offset="100%" stop-color="#B86F00" />
    </linearGradient>
    <linearGradient id="ttRightFull" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFE582" />
      <stop offset="60%" stop-color="#F5A30A" />
      <stop offset="100%" stop-color="#C97A00" />
    </linearGradient>
    <linearGradient id="ttBgFull" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1A1A22" />
      <stop offset="100%" stop-color="#0A0A0E" />
    </linearGradient>
    <linearGradient id="ttBorderFull" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E49505" stop-opacity="0.85" />
      <stop offset="45%" stop-color="#E49505" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.06" />
    </linearGradient>
    <radialGradient id="ttAmbientFull" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#E49505" stop-opacity="0.28" />
      <stop offset="60%" stop-color="#E49505" stop-opacity="0.06" />
      <stop offset="100%" stop-color="#E49505" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="canvasBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0D0E13" />
      <stop offset="100%" stop-color="#060608" />
    </linearGradient>
  </defs>

  <!-- Premium Deep Slate Card Canvas -->
  <rect width="600" height="200" rx="20" fill="url(#canvasBg)" />
  <rect width="600" height="200" rx="20" stroke="#E49505" stroke-opacity="0.15" stroke-width="1.5" />

  <!-- Scaled Emblem (120x120) at (40, 40) -->
  <g transform="translate(40, 40) scale(1.2)">
    <rect x="3" y="3" width="94" height="94" rx="23" fill="url(#ttBgFull)" stroke="url(#ttBorderFull)" stroke-width="1.5" />
    <rect x="3" y="3" width="94" height="94" rx="23" fill="url(#ttAmbientFull)" />
    <path d="M 28 4.6 Q 50 4 72 4.6" stroke="rgba(255,255,255,0.22)" stroke-width="1" stroke-linecap="round" />
    <path d="M 50 21.5 L 22.5 21.5 C 21.2 21.5 20.4 22.4 20.8 23.5 L 26.8 35.5 C 27.2 36.4 28.2 37 29.2 37 L 44 37 L 44 72.5 L 50 78.5 Z" fill="url(#ttLeftFull)" />
    <path d="M 50 21.5 L 77.5 21.5 C 78.8 21.5 79.6 22.4 79.2 23.5 L 73.2 35.5 C 72.8 36.4 71.8 37 70.8 37 L 56 37 L 56 72.5 L 50 78.5 Z" fill="url(#ttRightFull)" />
    <line x1="50" y1="21.5" x2="50" y2="78.5" stroke="#FFFBF0" stroke-width="1.4" stroke-linecap="round" />
    <path d="M 32 45.5 L 20 54.5 L 32 63.5" stroke="url(#ttLeftFull)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M 68 45.5 L 80 54.5 L 68 63.5" stroke="url(#ttRightFull)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />
  </g>

  <!-- Typography: talhacodes -->
  <g transform="translate(185, 116)">
    <text font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="64" font-weight="700" letter-spacing="-1.5">
      <tspan fill="#FFFFFF">talha</tspan><tspan fill="#E49505">codes</tspan>
    </text>
  </g>

  <!-- Tagline -->
  <g transform="translate(190, 148)">
    <text font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="500" letter-spacing="3" fill="#A1A1AA">
      SOFTWARE ENGINEER
    </text>
  </g>
</svg>`;

// 3. Compact 32x32 Favicon / App Icon SVG
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none">
  <defs>
    <linearGradient id="favLeft" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFB014" />
      <stop offset="100%" stop-color="#B86F00" />
    </linearGradient>
    <linearGradient id="favRight" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFE582" />
      <stop offset="60%" stop-color="#F5A30A" />
      <stop offset="100%" stop-color="#C97A00" />
    </linearGradient>
    <linearGradient id="favBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#18181D" />
      <stop offset="100%" stop-color="#08080B" />
    </linearGradient>
  </defs>

  <rect width="32" height="32" rx="8" fill="url(#favBg)" stroke="#E49505" stroke-opacity="0.4" stroke-width="0.8" />
  
  <g transform="translate(0.5, 0.5) scale(0.31)">
    <path d="M 50 21.5 L 22.5 21.5 C 21.2 21.5 20.4 22.4 20.8 23.5 L 26.8 35.5 C 27.2 36.4 28.2 37 29.2 37 L 44 37 L 44 72.5 L 50 78.5 Z" fill="url(#favLeft)" />
    <path d="M 50 21.5 L 77.5 21.5 C 78.8 21.5 79.6 22.4 79.2 23.5 L 73.2 35.5 C 72.8 36.4 71.8 37 70.8 37 L 56 37 L 56 72.5 L 50 78.5 Z" fill="url(#favRight)" />
    <line x1="50" y1="21.5" x2="50" y2="78.5" stroke="#FFFBF0" stroke-width="1.8" stroke-linecap="round" />
    <path d="M 32 45.5 L 20 54.5 L 32 63.5" stroke="url(#favLeft)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M 68 45.5 L 80 54.5 L 68 63.5" stroke="url(#favRight)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
  </g>
</svg>`;

async function main() {
  const publicDir = path.resolve(__dirname, '..', 'public');
  const imagesDir = path.join(publicDir, 'images');
  const appDir = path.resolve(__dirname, '..', 'app');

  // Write SVGs
  fs.writeFileSync(path.join(imagesDir, 'logo-mark.svg'), productionMarkSvg);
  fs.writeFileSync(path.join(imagesDir, 'logo.svg'), productionFullLogoDarkSvg);
  fs.writeFileSync(path.join(publicDir, 'logo.svg'), productionFullLogoDarkSvg);
  fs.writeFileSync(path.join(appDir, 'icon.svg'), faviconSvg);

  // Generate High-Res PNGs
  await sharp(Buffer.from(productionMarkSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(imagesDir, 'logo-mark.png'));

  await sharp(Buffer.from(productionFullLogoDarkSvg))
    .resize(1200, 400)
    .png()
    .toFile(path.join(imagesDir, 'logo.png'));

  console.log('Production logo assets regenerated successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
