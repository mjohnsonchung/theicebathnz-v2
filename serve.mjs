import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { extname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PORT = 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff2':'font/woff2',
  '.woff': 'font/woff',
  '.ttf':  'font/ttf',
  '.mjs':  'application/javascript',
};

const server = createServer(async (req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  const filePath = join(__dirname, url === '/' ? 'index.html' : url);
  const ext = extname(filePath).toLowerCase();

  // Try candidates: exact path, path + .html, path/index.html
  const candidates = [filePath];
  if (!extname(filePath)) {
    candidates.push(filePath + '.html');
    candidates.push(join(filePath, 'index.html'));
  }

  let served = false;
  for (const candidate of candidates) {
    try {
      const data = await readFile(candidate);
      const mime = MIME[extname(candidate).toLowerCase()] || 'text/plain';
      res.writeHead(200, { 'Content-Type': mime });
      res.end(data);
      served = true;
      break;
    } catch { /* try next */ }
  }
  if (!served) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Serving at http://localhost:${PORT}`);
});
