# Paid Marketing & Ads Performance Tracking

## Overview
Automated system for tracking paid marketing campaigns with ethical ad copy validation and budget control.

## Quick Start

### Generate Ads Performance Report
```bash
npm run report:ads
```

### Validate Ad Copy
```bash
node scripts/validate-ad-copy.cjs
```

## Features

### 1. Performance Tracking
- Fetches campaign data from Plausible Analytics
- Tracks by UTM parameters (source/medium/campaign)
- Calculates metrics: Clicks, Conversions, Cost, CPC, CTR
- Weekly auto-updates via GitHub Actions

### 2. Budget Control
- **Daily Limit**: €20/day combined spend
- **Monitoring**: Automatic calculation
- **Alerts**: Console output on each run
- **Status**: Within Budget / Over Budget

### 3. Ad Copy Validation
- **Single CTA**: Only "Begin Your Tribute" allowed
- **Tone**: Respectful, factual, calm
- **No Manipulation**: Blocks urgency tactics
- **Word Filter**: Detects forbidden phrases

### 4. Automated Reporting
- Weekly updates via GitHub Actions
- Commits reports to repository
- Uploads as artifacts
- Includes date stamps

## Campaign Setup

### UTM Parameters
All campaigns must use consistent UTM parameters:

```
?utm_source=[platform]&utm_medium=cpc&utm_campaign=[campaign-name]
```

### Tracked Platforms
- Google Ads (`utm_source=google`)
- Facebook Ads (`utm_source=facebook`)
- LinkedIn Ads (`utm_source=linkedin`)

## Ad Copy Guidelines

### ✅ Required
- Single CTA: "Begin Your Tribute"
- Factual, respectful tone
- Calm, dignified language

### ❌ Forbidden
- Multiple CTAs
- Urgency words ("urgent", "limited time", "act now")
- Emotional manipulation
- Exclamation marks (multiple)

## Budget Management

### Daily Limit
- Maximum: €20/day across all campaigns
- Monitoring: Automatic
- Reporting: Weekly summary
- Alerts: Console output

### Budget Calculation
```
Daily Average = Total Spend (30 days) / 30
Remaining = Daily Limit - Daily Average
Status = Daily Average <= Limit ? "Within Budget" : "Over Budget"
```

## Plausible API Setup

### Environment Variable
```bash
export PLAUSIBLE_API_KEY="your-api-key-here"
```

### GitHub Secrets
Add to repository secrets:
- `PLAUSIBLE_API_KEY` - For fetching real data

### API Requirements
- Plausible paid plan (API access)
- Read permissions for site statistics
- UTM parameter breakdown access

## Report Structure

### Campaign Performance Table
| Campaign | Clicks | Conversions | Cost | CPC | CTR | Date |

### Budget Summary
- Daily Budget Limit
- Current Period Average
- Total Spend
- Remaining Budget
- Status

### Campaign Details
- Source/Medium breakdown
- Performance metrics
- Conversion rates
- Cost analysis

## GitHub Action Integration

### Weekly Automation
- Runs every Monday at 2 AM UTC
- Fetches ads performance
- Commits updated reports
- Uploads as artifacts

### Manual Trigger
Available via GitHub Actions UI (`workflow_dispatch`)

## Validation Examples

### ✅ Valid Ad Copy
```
"Create a lasting digital tribute for your loved ones. Begin Your Tribute."
```

### ❌ Invalid Ad Copy
```
"Limited time offer! Act now! Begin Your Tribute. Order today!"
```
Issues:
- Multiple CTAs
- Urgency tactics
- Emotional manipulation

## Files

- `reports/ADS_PERFORMANCE.md` - Performance report
- `scripts/fetch-ads-performance.cjs` - Data fetcher
- `scripts/validate-ad-copy.cjs` - Ad copy validator

## Console Output

```
📊 Budget Summary:
   Daily Limit: €20/day
   Current Average: €2.32/day
   Status: ✅ Within Budget
   Remaining: €17.68/day

📈 Campaign Performance:
   [Campaign details...]
```

## Troubleshooting

### API Key Not Set
- Script uses mock data for demonstration
- Set `PLAUSIBLE_API_KEY` environment variable
- Add to GitHub Secrets for automation

### No Campaign Data
- Check UTM parameters in ad platforms
- Verify Plausible tracking
- Ensure API permissions

### Budget Over Limit
- Review campaign spending
- Adjust daily budgets
- Check console output for details

---

**Budget Limit**: €20/day  
**Update Frequency**: Weekly  
**Validation**: Automatic  
**Status**: ✅ Production Ready

