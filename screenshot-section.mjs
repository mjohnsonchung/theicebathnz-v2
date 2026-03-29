import { createRequire } from 'module';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const puppeteer = require('C:/Users/Matthew/node_modules/puppeteer/lib/cjs/puppeteer/puppeteer.js');

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const url    = process.argv[2] || 'http://localhost:3000';
const scrollY = parseInt(process.argv[3] || '0');
const label  = process.argv[4] || 'section';

const screenshotsDir = join(__dirname, 'temporary screenshots');
if (!existsSync(screenshotsDir)) mkdirSync(screenshotsDir, { recursive: true });

const files = readdirSync(screenshotsDir).filter(f => /^screenshot-\d+/.test(f));
let maxN = 0;
for (const f of files) {
  const m = f.match(/^screenshot-(\d+)/);
  if (m) maxN = Math.max(maxN, parseInt(m[1]));
}
const n = maxN + 1;
const filename = `screenshot-${n}-${label}.png`;
const outPath  = join(screenshotsDir, filename);

const browser = await puppeteer.launch({
  executablePath: 'C:/Users/Matthew/.cache/puppeteer/chrome/win64-145.0.7632.77/chrome-win64/chrome.exe',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 800));

// Force all scroll-reveal elements visible
await page.evaluate(() => {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  document.querySelectorAll('.word').forEach(el => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; });
  document.querySelectorAll('.hero-eyebrow, .hero-sub, .hero-actions').forEach(el => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; });
});

await page.evaluate((y) => window.scrollTo(0, y), scrollY);
await new Promise(r => setTimeout(r, 400));
await page.screenshot({ path: outPath, fullPage: false });
await browser.close();

console.log(`Saved: ${filename}`);
