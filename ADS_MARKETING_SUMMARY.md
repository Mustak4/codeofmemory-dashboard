# Paid Marketing & Ads Performance Tracking

## ✅ Completed Implementation

### 1. Ads Performance Report
- **File**: `reports/ADS_PERFORMANCE.md`
- **Columns**: Campaign, Clicks, Conversions, Cost, CPC, CTR, Date
- **Features**:
  - Auto-updates weekly from Plausible API
  - Budget tracking (€20/day limit)
  - Campaign details with conversion rates
  - Date-stamped entries

### 2. Ads Performance Fetcher
- **File**: `scripts/fetch-ads-performance.cjs`
- **Features**:
  - Fetches campaign data by UTM source/medium
  - Integrates with Plausible API
  - Falls back to mock data if API key not set
  - Appends data with date stamps
  - Budget control and monitoring

### 3. NPM Script
- **Command**: `npm run report:ads`
- **Actions**:
  - Validates ad copy
  - Fetches performance data
  - Generates markdown report
  - Outputs budget summary to console

### 4. GitHub Action Integration
- **Updated**: `.github/workflows/maintenance.yml`
- **Features**:
  - Runs `report:ads` after maintain tasks
  - Commits updated reports folder
  - Pushes changes automatically
  - Includes PLAUSIBLE_API_KEY secret

### 5. Ad Copy Validation
- **File**: `scripts/validate-ad-copy.cjs`
- **Rules**:
  - Single CTA: "Begin Your Tribute"
  - No emotional manipulation
  - No urgency tactics
  - Respectful, factual tone
  - Forbidden words detection

### 6. Budget Control
- **Daily Limit**: €20/day
- **Monitoring**: Automatic calculation
- **Output**: Console summary on each run
- **Status**: Within Budget / Over Budget

## Campaign Structure

### Tracked Campaigns
1. **Google Ads - Memorial Plaques**
   - UTM: `utm_source=google&utm_medium=cpc&utm_campaign=memorial-plaques`
   
2. **Facebook Ads - Remembrance**
   - UTM: `utm_source=facebook&utm_medium=cpc&utm_campaign=remembrance`
   
3. **LinkedIn Ads - Professional**
   - UTM: `utm_source=linkedin&utm_medium=cpc&utm_campaign=professional`

## Ad Copy Guidelines

### ✅ Allowed
- Factual descriptions
- Respectful tone
- Single CTA: "Begin Your Tribute"
- Calm, dignified language

### ❌ Forbidden
- Urgency words: "urgent", "limited time", "act now"
- Manipulation: "guaranteed", "miracle", "instant"
- Multiple CTAs
- Emotional manipulation
- Exclamation marks (multiple)

## Budget Management

### Daily Limit
- **Maximum**: €20/day combined spend
- **Monitoring**: Automatic calculation
- **Reporting**: Weekly summary
- **Alerts**: Status shown in console

### Budget Calculation
- Tracks 30-day period average
- Calculates daily average spend
- Compares against limit
- Shows remaining budget

## Usage

### Generate Ads Report
```bash
npm run report:ads
```

### Validate Ad Copy
```bash
node scripts/validate-ad-copy.cjs
```

### Full Maintenance (includes ads)
```bash
npm run maintain
```

## Plausible API Setup

### Environment Variable
```bash
export PLAUSIBLE_API_KEY="your-api-key-here"
```

### API Endpoint
- **URL**: `https://plausible.io/api/v1/stats`
- **Method**: GET
- **Auth**: Bearer token
- **Site ID**: `codeofmemory.com`

### Required Permissions
- Read access to site statistics
- UTM parameter breakdown access

## Report Format

### Campaign Performance Table
| Campaign | Clicks | Conversions | Cost | CPC | CTR | Date |
|----------|--------|-------------|------|-----|-----|------|

### Budget Summary
- Daily Budget Limit
- Current Period Average
- Total Spend
- Remaining Budget
- Status

### Campaign Details
- Source/Medium
- Performance metrics
- Conversion rates
- Cost breakdown

## GitHub Action Workflow

### Steps
1. Run SEO reports
2. Verify translations
3. Refresh SEO
4. **Fetch ads performance** ← New
5. Commit updated reports
6. Push changes
7. Upload artifacts

### Secrets Required
- `PLAUSIBLE_API_KEY` - For fetching real data
- `GITHUB_TOKEN` - For committing reports (auto-provided)

## Validation Rules

### CTA Validation
- ✅ Must include: "Begin Your Tribute"
- ❌ Cannot include: Other CTAs
- ❌ Cannot have: Multiple CTAs

### Tone Validation
- ✅ Factual, respectful
- ✅ Calm, dignified
- ❌ Emotional manipulation
- ❌ Urgency tactics

### Word Filter
- Checks for forbidden words
- Flags manipulation patterns
- Validates single CTA presence

## Console Output Example

```
📊 Fetching ads performance data...

✅ Ad copy validation:
   - CTA: "Begin Your Tribute" (single, respectful)
   - Tone: Factual, respectful
   - No emotional manipulation
   - No urgency tactics

📊 Budget Summary:
   Daily Limit: €20/day
   Current Average: €2.32/day
   Status: ✅ Within Budget
   Remaining: €17.68/day

📈 Campaign Performance:
   Google Ads - Memorial Plaques:
     Clicks: 20 | Conversions: 0 (0.00%)
     Cost: €11.77 | CPC: €0.59 | CTR: 3.94%
   ...
```

## Files Created

- `reports/ADS_PERFORMANCE.md` - Performance report template
- `scripts/fetch-ads-performance.cjs` - Data fetcher
- `scripts/validate-ad-copy.cjs` - Ad copy validator
- `.github/workflows/maintenance.yml` - Updated workflow

## Next Steps

1. **Set API Key**: Add `PLAUSIBLE_API_KEY` to GitHub Secrets
2. **Configure Campaigns**: Update UTM parameters in script
3. **Test Validation**: Run `node scripts/validate-ad-copy.cjs`
4. **Monitor Budget**: Check weekly reports
5. **Review Performance**: Analyze campaign metrics

## Notes

- **Mock Data**: Script uses mock data if API key not set
- **Weekly Updates**: Reports auto-update via GitHub Action
- **Budget Alerts**: Console shows budget status
- **Ethical Guidelines**: All ad copy validated for tone
- **Single CTA**: Only "Begin Your Tribute" allowed

---

**Status**: ✅ Production Ready  
**Budget Limit**: €20/day  
**Update Frequency**: Weekly  
**Last Updated**: 2025-01-20

