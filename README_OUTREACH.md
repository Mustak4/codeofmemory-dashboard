# Backlink Outreach & Citation Tracking

## Overview
Automated system for tracking backlink outreach campaigns and generating SEO reports.

## Files

- **`src/utils/outreach.cjs`**: Outreach data management and status tracking
- **`src/data/outreach.json`**: JSON database of outreach targets (auto-generated)
- **`scripts/update-report.cjs`**: SEO report generator
- **`reports/SEO_REPORT.md`**: SEO performance report template
- **`reports/OUTREACH_STATUS.md`**: Outreach status table (auto-generated)

## Usage

### Generate SEO Report
```bash
npm run report:seo
```

This command will:
1. Generate/update outreach status table
2. Update SEO report with current outreach statistics
3. Create markdown files in `/reports/` directory

### Update Outreach Status

Edit `src/data/outreach.json` directly or use the Node.js API:

```javascript
const { updateOutreachStatus } = require('./src/utils/outreach.cjs');

// Mark as sent
updateOutreachStatus(1, 'sent', 'Initial outreach email sent');

// Mark as approved
updateOutreachStatus(1, 'approved', 'Backlink approved and live');
```

### Outreach Status Values
- `pending`: Not yet contacted
- `sent`: Outreach email sent, awaiting response
- `approved`: Backlink approved and published

## Outreach Targets

The system tracks 20 outreach targets across:
- Memorial Directories (8)
- Blogs (7)
- General Directories (5)

Each target includes:
- Name
- URL
- Category
- Contact Email
- Status (pending/sent/approved)
- Dates (added/contacted/approved)
- Notes

## Reports

### SEO_REPORT.md
Comprehensive SEO performance report with sections for:
- Search Console Metrics (Impressions, CTR, Avg Position)
- Backlinks
- Citations
- Reviews
- Technical SEO Status

### OUTREACH_STATUS.md
Markdown table format suitable for Notion, including:
- All outreach targets
- Current status
- Contact dates
- Summary statistics

## Data Structure

Outreach data is stored in `src/data/outreach.json`:

```json
{
  "lastUpdated": "2025-01-20T12:00:00.000Z",
  "targets": [
    {
      "id": 1,
      "name": "Find A Grave",
      "url": "https://www.findagrave.com",
      "category": "Memorial Directory",
      "contact_email": "support@findagrave.com",
      "status": "pending",
      "notes": "",
      "dateAdded": "2025-01-20T12:00:00.000Z",
      "dateContacted": null,
      "dateApproved": null
    }
  ]
}
```

## Manual Updates

To manually update outreach status:

1. Open `src/data/outreach.json`
2. Find the target by `id`
3. Update `status` field: `"pending"`, `"sent"`, or `"approved"`
4. Add `notes` if needed
5. Update `dateContacted` or `dateApproved` as ISO strings
6. Run `npm run report:seo` to regenerate reports

## Integration with Notion

The `OUTREACH_STATUS.md` file can be:
1. Copied directly into Notion
2. Imported as a markdown page
3. Used as a template for Notion databases

The markdown table format is compatible with Notion's table import feature.

## Notes

- All dates are stored in ISO 8601 format
- Reports are generated with current date/time
- Outreach statistics are automatically calculated
- Reports include placeholders for manual data entry from Google Search Console

