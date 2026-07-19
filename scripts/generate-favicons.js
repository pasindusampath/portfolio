const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SOURCE = 'C:\\Users\\Pasindu Sampath\\.gemini\\antigravity-ide\\brain\\ee01fa1a-9a06-4eb8-89b8-1ff596ddfefb\\favicon_design_1784440338491.png';
const PUBLIC_DIR = path.resolve(__dirname, '..', 'public');
const APP_DIR = path.resolve(__dirname, '..', 'app');

async function generate() {
  const input = sharp(SOURCE);

  // Generate favicon.ico replacement (32x32 PNG, browsers accept PNG favicons)
  await input.clone().resize(32, 32).png().toFile(path.join(PUBLIC_DIR, 'favicon-32x32.png'));
  console.log('✓ favicon-32x32.png');

  // 16x16
  await input.clone().resize(16, 16).png().toFile(path.join(PUBLIC_DIR, 'favicon-16x16.png'));
  console.log('✓ favicon-16x16.png');

  // Apple touch icon (180x180)
  await input.clone().resize(180, 180).png().toFile(path.join(PUBLIC_DIR, 'apple-touch-icon.png'));
  console.log('✓ apple-touch-icon.png');

  // Android chrome icons (192x192 and 512x512)
  await input.clone().resize(192, 192).png().toFile(path.join(PUBLIC_DIR, 'icon-192x192.png'));
  console.log('✓ icon-192x192.png');

  await input.clone().resize(512, 512).png().toFile(path.join(PUBLIC_DIR, 'icon-512x512.png'));
  console.log('✓ icon-512x512.png');

  // Next.js app router icon (placed in app/ directory for automatic favicon)
  await input.clone().resize(32, 32).png().toFile(path.join(APP_DIR, 'icon.png'));
  console.log('✓ app/icon.png');

  // Apple icon for app router
  await input.clone().resize(180, 180).png().toFile(path.join(APP_DIR, 'apple-icon.png'));
  console.log('✓ app/apple-icon.png');

  // OG image / Open Graph default (can be used as a fallback)
  await input.clone().resize(512, 512).png().toFile(path.join(PUBLIC_DIR, 'og-icon.png'));
  console.log('✓ og-icon.png');

  console.log('\n✅ All favicon assets generated!');
}

generate().catch(console.error);
