import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const puppeteer = require('C:/Users/Matthew/node_modules/puppeteer/lib/cjs/puppeteer/puppeteer.js');
const fs = await import('fs');

const browser = await puppeteer.launch({
  executablePath: 'C:/Users/Matthew/.cache/puppeteer/chrome/win64-145.0.7632.77/chrome-win64/chrome.exe',
  headless: true
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1200 });
await page.goto('http://localhost:3000/about.html', { waitUntil: 'networkidle0' });
await page.evaluate(() => document.querySelectorAll('.reveal').forEach(el => el.classList.add('in')));
// Scroll to the values section
await page.evaluate(() => {
  const sections = Array.from(document.querySelectorAll('section'));
  const el = sections.find(s => s.textContent.includes('What drives us'));
  if (el) el.scrollIntoView();
});
await new Promise(r => setTimeout(r, 400));

const buf = await page.screenshot();
fs.writeFileSync('temporary screenshots/screenshot-56-values-view.png', buf);
await browser.close();
console.log('Done');
