import { mkdir, copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const sourceDir = resolve(root, 'node_modules/pdfjs-dist/build');
const targetDir = resolve(root, 'public/pdfjs');

await mkdir(targetDir, { recursive: true });
await copyFile(resolve(sourceDir, 'pdf.mjs'), resolve(targetDir, 'pdf.mjs'));
await copyFile(resolve(sourceDir, 'pdf.worker.mjs'), resolve(targetDir, 'pdf.worker.mjs'));

console.log('Prepared local PDF.js runtime in public/pdfjs');
