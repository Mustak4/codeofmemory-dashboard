// Ad Copy Validation Script
// Ensures all ad copy follows ethical guidelines

const fs = require('fs');
const path = require('path');

// Valid CTA (only one allowed)
const VALID_CTA = 'Begin Your Tribute';

// Forbidden words/phrases (emotional manipulation)
const FORBIDDEN_WORDS = [
  'urgent',
  'limited time',
  'act now',
  "don't miss out",
  'guaranteed',
  'miracle',
  'instant',
  'free forever',
  'never again',
  'last chance',
  'exclusive',
  'secret',
  'shocking',
  'amazing deal',
  'limited offer'
];

// Required tone indicators
const REQUIRED_TONE = [
  'respectful',
  'factual',
  'calm',
  'dignified'
];

function validateAdCopy(text) {
  const issues = [];
  const lowerText = text.toLowerCase();
  
  // Check for forbidden words
  FORBIDDEN_WORDS.forEach(word => {
    if (lowerText.includes(word.toLowerCase())) {
      issues.push(`Forbidden word/phrase found: "${word}"`);
    }
  });
  
  // Check for multiple CTAs
  const ctaVariations = [
    'begin your tribute',
    'order now',
    'buy now',
    'get started',
    'sign up',
    'click here',
    'learn more',
    'read more'
  ];
  
  let ctaCount = 0;
  ctaVariations.forEach(cta => {
    if (lowerText.includes(cta)) {
      ctaCount++;
    }
  });
  
  if (ctaCount > 1) {
    issues.push(`Multiple CTAs found. Only "${VALID_CTA}" is allowed.`);
  }
  
  // Check if valid CTA is present
  if (!lowerText.includes('begin your tribute')) {
    issues.push(`Valid CTA "${VALID_CTA}" not found.`);
  }
  
  // Check for emotional manipulation patterns
  const manipulationPatterns = [
    /\d+% off/i,
    /save \$\d+/i,
    /only \$\d+/i,
    /!\s*!\s*!/, // Multiple exclamation marks
    /urgent/i,
    /hurry/i
  ];
  
  manipulationPatterns.forEach(pattern => {
    if (pattern.test(text)) {
      issues.push(`Emotional manipulation pattern detected: ${pattern}`);
    }
  });
  
  return {
    valid: issues.length === 0,
    issues,
    ctaFound: lowerText.includes('begin your tribute')
  };
}

function validateCampaigns() {
  console.log('🔍 Validating ad copy...\n');
  
  // Example ad copy to validate (in production, this would come from ad platforms)
  const exampleAds = [
    {
      name: 'Google Ads - Memorial Plaques',
      copy: 'Create a lasting digital tribute for your loved ones. Begin Your Tribute.',
      headline: 'QR Code Memorial Plaques'
    },
    {
      name: 'Facebook Ads - Remembrance',
      copy: 'Preserve memories with dignity. Build a beautiful memorial page. Begin Your Tribute.',
      headline: 'Remember Forever'
    }
  ];
  
  let allValid = true;
  
  exampleAds.forEach(ad => {
    const validation = validateAdCopy(ad.copy + ' ' + ad.headline);
    
    if (validation.valid) {
      console.log(`✅ ${ad.name}: Valid`);
    } else {
      console.log(`❌ ${ad.name}: Issues found`);
      validation.issues.forEach(issue => {
        console.log(`   - ${issue}`);
      });
      allValid = false;
    }
  });
  
  console.log('\n📋 Validation Rules:');
  console.log(`   - CTA: "${VALID_CTA}" (single, required)`);
  console.log(`   - Tone: Respectful, factual, calm`);
  console.log(`   - No emotional manipulation`);
  console.log(`   - No urgency tactics\n`);
  
  if (allValid) {
    console.log('✅ All ad copy is valid and follows ethical guidelines.\n');
    return 0;
  } else {
    console.log('⚠️  Some ad copy needs review.\n');
    return 1;
  }
}

// Run if called directly
if (require.main === module) {
  const exitCode = validateCampaigns();
  process.exit(exitCode);
}

module.exports = { validateAdCopy, VALID_CTA, FORBIDDEN_WORDS };

