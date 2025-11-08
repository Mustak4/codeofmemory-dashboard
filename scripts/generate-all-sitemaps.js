// Script to generate all language-specific sitemaps
// Run with: node scripts/generate-all-sitemaps.js

import { generateLanguageSpecificSitemap, generateSitemapIndex } from '../src/utils/sitemap.ts';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

const languages = ['en', 'de', 'se', 'no'];

// Generate language-specific sitemaps
languages.forEach((lang) => {
  const sitemap = generateLanguageSpecificSitemap(lang);
  const outputPath = resolve(process.cwd(), 'public', `sitemap-${lang}.xml`);
  writeFileSync(outputPath, sitemap, 'utf-8');
  console.log(`✅ Generated sitemap-${lang}.xml`);
});

// Generate sitemap index
const sitemapIndex = generateSitemapIndex();
const indexPath = resolve(process.cwd(), 'public', 'sitemap-index.xml');
writeFileSync(indexPath, sitemapIndex, 'utf-8');
console.log(`✅ Generated sitemap-index.xml`);

// Also generate main sitemap.xml (for backward compatibility)
import { generateSitemap } from '../src/utils/sitemap.ts';
const mainSitemap = generateSitemap();
const mainPath = resolve(process.cwd(), 'public', 'sitemap.xml');
writeFileSync(mainPath, mainSitemap, 'utf-8');
console.log(`✅ Generated sitemap.xml (main)`);

console.log('\n🎉 All sitemaps generated successfully!');

