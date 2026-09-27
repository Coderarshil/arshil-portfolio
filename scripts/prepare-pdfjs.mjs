import { access, cp, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourceDir = resolve(root, 'node_modules/pdfjs-dist/build');
const targetDir = resolve(root, 'public/pdfjs');

await access(sourceDir);
await mkdir(targetDir, { recursive: true });

for (const file of ['pdf.mjs', 'pdf.worker.mjs']) {
  await cp(resolve(sourceDir, file), resolve(targetDir, file));
}

console.log('PDF.js assets prepared in public/pdfjs/');
