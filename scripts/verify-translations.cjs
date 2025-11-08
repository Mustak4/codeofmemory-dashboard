// Translation Verification Script
// Compares keys across all locale JSON files and reports inconsistencies

const fs = require('fs');
const path = require('path');

const I18N_DIR = path.join(__dirname, '../src/i18n');
const LANGUAGES = ['en', 'de', 'sv', 'no'];

// Load all translation files
function loadTranslations() {
  const translations = {};
  
  LANGUAGES.forEach(lang => {
    const filePath = path.join(I18N_DIR, `${lang}.json`);
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        translations[lang] = JSON.parse(content);
      } catch (error) {
        console.error(`❌ Error loading ${lang}.json:`, error.message);
        translations[lang] = null;
      }
    } else {
      console.error(`❌ File not found: ${filePath}`);
      translations[lang] = null;
    }
  });
  
  return translations;
}

// Flatten nested object to dot-notation keys
function flattenKeys(obj, prefix = '') {
  const keys = [];
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      const value = obj[key];
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        keys.push(...flattenKeys(value, fullKey));
      } else {
        keys.push(fullKey);
      }
    }
  }
  
  return keys;
}

// Get all keys from a translation object
function getAllKeys(translations) {
  return flattenKeys(translations);
}

// Compare translations
function verifyTranslations() {
  console.log('🔍 Verifying translations...\n');
  
  const translations = loadTranslations();
  const baseLang = 'en';
  
  if (!translations[baseLang]) {
    console.error('❌ Base language (en) not found. Cannot verify.');
    process.exit(1);
  }
  
  const baseKeys = getAllKeys(translations[baseLang]);
  const results = {
    missing: {},
    extra: {},
    total: baseKeys.length,
    verified: 0
  };
  
  // Check each language against base
  LANGUAGES.forEach(lang => {
    if (lang === baseLang || !translations[lang]) {
      return;
    }
    
    const langKeys = getAllKeys(translations[lang]);
    const missing = baseKeys.filter(key => !langKeys.includes(key));
    const extra = langKeys.filter(key => !baseKeys.includes(key));
    
    if (missing.length > 0) {
      results.missing[lang] = missing;
    }
    
    if (extra.length > 0) {
      results.extra[lang] = extra;
    }
    
    if (missing.length === 0 && extra.length === 0) {
      results.verified++;
    }
  });
  
  // Print results
  console.log(`📊 Translation Verification Results\n`);
  console.log(`Base Language: ${baseLang} (${results.total} keys)\n`);
  
  let hasIssues = false;
  
  // Check missing keys
  Object.keys(results.missing).forEach(lang => {
    const missing = results.missing[lang];
    console.log(`⚠️  ${lang.toUpperCase()}: Missing ${missing.length} key(s):`);
    missing.forEach(key => {
      console.log(`   - ${key}`);
    });
    console.log('');
    hasIssues = true;
  });
  
  // Check extra keys
  Object.keys(results.extra).forEach(lang => {
    const extra = results.extra[lang];
    console.log(`⚠️  ${lang.toUpperCase()}: Extra ${extra.length} key(s) (not in base):`);
    extra.forEach(key => {
      console.log(`   - ${key}`);
    });
    console.log('');
    hasIssues = true;
  });
  
  // Summary
  LANGUAGES.forEach(lang => {
    if (lang === baseLang) return;
    
    const langKeys = getAllKeys(translations[lang] || {});
    const missingCount = results.missing[lang]?.length || 0;
    const extraCount = results.extra[lang]?.length || 0;
    const status = missingCount === 0 && extraCount === 0 ? '✅' : '⚠️';
    
    console.log(`${status} ${lang.toUpperCase()}: ${langKeys.length} keys (${missingCount} missing, ${extraCount} extra)`);
  });
  
  console.log('');
  
  if (!hasIssues) {
    console.log('✅ All translations are consistent!');
    return 0;
  } else {
    console.log('⚠️  Translation inconsistencies found. Please update translation files.');
    return 1;
  }
}

// Run verification
if (require.main === module) {
  const exitCode = verifyTranslations();
  process.exit(exitCode);
}

module.exports = { verifyTranslations, loadTranslations, getAllKeys };

