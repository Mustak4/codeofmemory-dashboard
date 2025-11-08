# Maintenance Pipeline Documentation

## Overview
Automated maintenance pipeline for CodeOfMemory that handles SEO reports, translation verification, and performance audits.

## Quick Start

### Run Full Maintenance
```bash
npm run maintain
```

This runs:
1. SEO reports generation
2. SEO refresh (sitemap + Lighthouse)
3. Translation verification

## Individual Commands

### Translation Verification
```bash
npm run verify:translations
```
- Compares all translation files (en, de, sv, no)
- Reports missing or extra keys
- Exit code 0 if consistent, 1 if issues found

### SEO Refresh
```bash
npm run refresh:seo
```
- Regenerates sitemap
- Attempts Lighthouse audit
- Generates performance report

### SEO Reports
```bash
npm run report:seo
```
- Generates outreach status table
- Updates SEO performance report

## Translation Files

### Location
- `src/i18n/en.json` - English (base language)
- `src/i18n/de.json` - German
- `src/i18n/sv.json` - Swedish
- `src/i18n/no.json` - Norwegian

### Structure
All files must have identical key structure:
- `common.*` - Common UI elements
- `home.*` - Homepage content
- `about.*` - About page
- `faq.*` - FAQ page
- `order.*` - Order page
- `contact.*` - Contact page
- `blog.*` - Blog page
- `reviews.*` - Reviews page
- `notFound.*` - 404 page

### Adding New Translations
1. Add key to `en.json` first
2. Add same key to all other language files
3. Run `npm run verify:translations` to check consistency

## Reports

### Generated Reports
- `reports/SEO_REPORT.md` - SEO performance metrics
- `reports/OUTREACH_STATUS.md` - Outreach campaign tracking
- `reports/LIGHTHOUSE_REPORT.md` - Performance audit results

### Report Updates
Reports are auto-generated with:
- Current date and time
- Outreach statistics
- Translation verification status
- Performance scores (when available)

## GitHub Actions

### Weekly Maintenance
- **Schedule**: Every Monday at 2 AM UTC
- **Manual Trigger**: Available in GitHub Actions UI
- **Artifacts**: Reports uploaded (30-day retention)

### Workflow Steps
1. Checkout repository
2. Setup Node.js
3. Install dependencies
4. Run SEO reports
5. Verify translations
6. Refresh SEO
7. Upload reports as artifacts

## Troubleshooting

### Translation Verification Fails
- Check for missing keys in any language file
- Ensure all files have same structure
- Run verification to see specific missing keys

### Lighthouse Audit Fails
- Requires running preview server
- Run manually: `npm run build && npm run preview` (separate terminal)
- Then: `npm run audit`
- Automated runs create placeholder report

### Sitemap Generation Issues
- Sitemaps generated during build process
- Check `public/sitemap.xml` after build
- Language-specific sitemaps in `public/sitemap-{lang}.xml`

## Best Practices

1. **Translation Updates**: Always update all language files together
2. **Run Verification**: Check translations before committing
3. **Regular Maintenance**: Run `npm run maintain` weekly
4. **Monitor Reports**: Review GitHub Actions artifacts
5. **Keep Consistent**: Maintain same tone across all languages

## File Structure

```
scripts/
  verify-translations.cjs    # Translation verification
  refresh-seo.cjs             # SEO refresh with Lighthouse
  update-report.cjs          # SEO report generator
  generate-all-sitemaps.cjs   # Sitemap generation

src/
  i18n/
    en.json                   # English translations
    de.json                   # German translations
    sv.json                   # Swedish translations
    no.json                   # Norwegian translations

reports/
  SEO_REPORT.md              # SEO performance report
  OUTREACH_STATUS.md         # Outreach status table
  LIGHTHOUSE_REPORT.md       # Performance audit

.github/
  workflows/
    maintenance.yml           # Weekly maintenance workflow
```

---

**Last Updated**: 2025-01-20  
**Status**: ✅ Production Ready

