// SEO Refresh Script
// Regenerates sitemap, runs Lighthouse audit, and generates report

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPORTS_DIR = path.join(__dirname, '../reports');
const SITEMAP_SCRIPT = path.join(__dirname, '../scripts/generate-all-sitemaps.cjs');

// Ensure reports directory exists
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

function generateSitemap() {
  console.log('🗺️  Regenerating sitemap...');
  try {
    // Check if sitemap script exists (it might be .js or .cjs)
    const sitemapScriptJS = path.join(__dirname, '../scripts/generate-all-sitemaps.js');
    const sitemapScriptCJS = path.join(__dirname, '../scripts/generate-all-sitemaps.cjs');
    
    let sitemapScript = null;
    if (fs.existsSync(sitemapScriptJS)) {
      sitemapScript = sitemapScriptJS;
    } else if (fs.existsSync(sitemapScriptCJS)) {
      sitemapScript = sitemapScriptCJS;
    }
    
    if (sitemapScript) {
      execSync(`node ${sitemapScript}`, { stdio: 'inherit' });
      console.log('✅ Sitemap regenerated\n');
      return true;
    } else {
      console.log('⚠️  Sitemap generation script not found, skipping...\n');
      console.log('💡 To generate sitemaps manually, run: node scripts/generate-all-sitemaps.js\n');
      return false;
    }
  } catch (error) {
    console.error('❌ Error generating sitemap:', error.message);
    return false;
  }
}

function runLighthouse() {
  console.log('🔍 Running Lighthouse audit...');
  
  try {
    // First build the project
    console.log('📦 Building project...');
    execSync('npm run build', { stdio: 'inherit' });
    
    // Note: Lighthouse requires a running server
    // In CI/CD, this would be handled differently
    // For now, we'll try to run it, but it may fail if server isn't running
    console.log('💡 Note: Lighthouse requires a running preview server.');
    console.log('💡 To run manually: npm run build && npm run preview (in separate terminal)');
    console.log('💡 Then run: npx lighthouse http://localhost:4173 --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=./reports/lighthouse-results.json\n');
    
    // Try to run Lighthouse (will fail if server not running, which is expected)
    try {
      const lighthouseCmd = 'npx lighthouse http://localhost:4173 --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=./reports/lighthouse-results.json --quiet';
      execSync(lighthouseCmd, { stdio: 'pipe', timeout: 60000 });
      return true;
    } catch (lighthouseError) {
      console.log('⚠️  Lighthouse audit skipped (server not running or timeout)');
      console.log('💡 This is expected in automated runs. Run manually for full audit.\n');
      return false;
    }
  } catch (error) {
    console.error('⚠️  Error during Lighthouse setup:', error.message);
    return false;
  }
}

function generateLighthouseReport() {
  const resultsPath = path.join(REPORTS_DIR, 'lighthouse-results.json');
  
  if (!fs.existsSync(resultsPath)) {
    console.log('⚠️  Lighthouse results not found. Skipping report generation.');
    return;
  }
  
  try {
    const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
    const now = new Date();
    const reportDate = now.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const reportTime = now.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const categories = results.categories || {};
    const scores = {};
    
    Object.keys(categories).forEach(key => {
      scores[key] = {
        score: Math.round((categories[key].score || 0) * 100),
        title: categories[key].title || key
      };
    });
    
    // Get audit details
    const audits = results.audits || {};
    const opportunities = Object.keys(audits)
      .filter(key => audits[key].details && audits[key].details.type === 'opportunity')
      .map(key => ({
        id: key,
        title: audits[key].title,
        description: audits[key].description,
        score: audits[key].score,
        displayValue: audits[key].displayValue
      }))
      .slice(0, 10); // Top 10 opportunities
    
    let report = `# Lighthouse Performance Report\n\n`;
    report += `**Report Date:** ${reportDate}\n`;
    report += `**Generated:** ${reportDate} at ${reportTime}\n\n`;
    report += `---\n\n`;
    
    report += `## Overall Scores\n\n`;
    report += `| Category | Score |\n`;
    report += `|----------|-------|\n`;
    
    Object.keys(scores).forEach(key => {
      const score = scores[key];
      const emoji = score.score >= 90 ? '✅' : score.score >= 50 ? '⚠️' : '❌';
      report += `| ${score.title} | ${emoji} ${score.score}/100 |\n`;
    });
    
    report += `\n---\n\n`;
    
    report += `## Performance Metrics\n\n`;
    const metrics = ['first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time', 'cumulative-layout-shift', 'speed-index'];
    metrics.forEach(metric => {
      if (audits[metric]) {
        const audit = audits[metric];
        report += `- **${audit.title}**: ${audit.displayValue || 'N/A'}\n`;
      }
    });
    
    if (opportunities.length > 0) {
      report += `\n---\n\n`;
      report += `## Top Optimization Opportunities\n\n`;
      opportunities.forEach(opp => {
        report += `### ${opp.title}\n`;
        report += `${opp.description || ''}\n`;
        if (opp.displayValue) {
          report += `\n**Potential Savings:** ${opp.displayValue}\n`;
        }
        report += `\n`;
      });
    }
    
    report += `\n---\n\n`;
    report += `*Report generated automatically by Lighthouse audit.*\n`;
    report += `*For detailed analysis, check lighthouse-results.json*\n`;
    
    const reportPath = path.join(REPORTS_DIR, 'LIGHTHOUSE_REPORT.md');
    fs.writeFileSync(reportPath, report, 'utf8');
    console.log(`✅ Lighthouse report generated: ${reportPath}\n`);
    
  } catch (error) {
    console.error('❌ Error generating Lighthouse report:', error.message);
  }
}

function refreshSEO() {
  console.log('🔄 Starting SEO refresh...\n');
  
  // Generate sitemap
  generateSitemap();
  
  // Try to run Lighthouse (may fail if server not running)
  const lighthouseSuccess = runLighthouse();
  
  if (lighthouseSuccess) {
    generateLighthouseReport();
  } else {
    // Create a placeholder report if Lighthouse didn't run
    const now = new Date();
    const reportDate = now.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const reportTime = now.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const placeholderReport = `# Lighthouse Performance Report\n\n**Report Date:** ${reportDate}\n**Generated:** ${reportDate} at ${reportTime}\n\n---\n\n## Status\n\n⚠️ Lighthouse audit was not run automatically.\n\nTo generate a full report:\n1. Build the project: \`npm run build\`\n2. Start preview server: \`npm run preview\` (in separate terminal)\n3. Run Lighthouse: \`npm run audit\`\n\nOr use the automated command: \`npm run audit\`\n\n---\n\n*Report placeholder generated automatically.*\n`;
    
    const reportPath = path.join(REPORTS_DIR, 'LIGHTHOUSE_REPORT.md');
    fs.writeFileSync(reportPath, placeholderReport, 'utf8');
    console.log(`📝 Placeholder report created: ${reportPath}\n`);
  }
  
  console.log('✅ SEO refresh complete!');
  console.log('\n📊 Next steps:');
  console.log('   1. Review sitemap.xml files');
  console.log('   2. Check Lighthouse report in reports/LIGHTHOUSE_REPORT.md');
  console.log('   3. Address any optimization opportunities');
}

// Run if called directly
if (require.main === module) {
  try {
    refreshSEO();
  } catch (error) {
    console.error('❌ Error during SEO refresh:', error);
    process.exit(1);
  }
}

module.exports = { refreshSEO, generateSitemap, runLighthouse, generateLighthouseReport };

