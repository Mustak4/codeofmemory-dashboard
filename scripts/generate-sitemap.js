// Script to generate sitemap.xml from sitemap.ts
// Run with: node scripts/generate-sitemap.js

import { generateSitemap } from '../src/utils/sitemap.ts';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

const sitemap = generateSitemap();
const outputPath = resolve(process.cwd(), 'public', 'sitemap.xml');

writeFileSync(outputPath, sitemap, 'utf-8');
console.log(`✅ Sitemap generated at ${outputPath}`);

