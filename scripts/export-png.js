/**
 * export-png.js — Flexible Modern Explorer
 * Esporta ogni slide dell'HTML come PNG 1080x1350
 *
 * SETUP (una volta sola):
 *   npm install puppeteer
 *
 * USO:
 *   node export-png.js                        → esporta carousel.html
 *   node export-png.js altro-carosello.html   → esporta file specifico
 *   node export-png.js --slide 3              → esporta solo slide 03
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// ── CONFIG ──────────────────────────────────────────────
const HTML_FILE = process.argv[2] && !process.argv[2].startsWith('--')
  ? process.argv[2]
  : 'carousel.html';

const ONLY_SLIDE = (() => {
  const i = process.argv.indexOf('--slide');
  return i !== -1 ? parseInt(process.argv[i + 1]) : null;
})();

const SLIDE_W = 1080;
const SLIDE_H = 1350;
const OUTPUT_DIR = 'png';
// ────────────────────────────────────────────────────────

(async () => {
  const htmlPath = path.resolve(__dirname, HTML_FILE);
  if (!fs.existsSync(htmlPath)) {
    console.error(`❌  File non trovato: ${htmlPath}`);
    process.exit(1);
  }

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // Viewport largo quanto una slide; altezza grande per contenere tutte le slide
  await page.setViewport({ width: SLIDE_W, height: SLIDE_H * 10, deviceScaleFactor: 1 });

  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

  // Aspetta che i font Google siano caricati
  await page.evaluateHandle('document.fonts.ready');

  // Raccogli tutti i .slide presenti
  const slides = await page.$$('.slide');

  if (slides.length === 0) {
    console.error('❌  Nessun elemento .slide trovato nell\'HTML.');
    await browser.close();
    process.exit(1);
  }

  console.log(`\n📂  Output → ./${OUTPUT_DIR}/`);
  console.log(`🎞   ${slides.length} slide trovate in ${HTML_FILE}\n`);

  for (let i = 0; i < slides.length; i++) {
    const num = i + 1;
    if (ONLY_SLIDE && ONLY_SLIDE !== num) continue;

    const filename = `slide-${String(num).padStart(2, '0')}.png`;
    const outPath = path.join(OUTPUT_DIR, filename);

    // Bounding box della slide
    const box = await slides[i].boundingBox();

    await page.screenshot({
      path: outPath,
      clip: {
        x: box.x,
        y: box.y,
        width:  SLIDE_W,
        height: SLIDE_H,
      },
    });

    console.log(`  ✓  ${filename}`);
  }

  await browser.close();
  console.log('\n✅  Export completato.\n');
})();
