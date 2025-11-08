// Backlink Outreach & Citation Tracking System
// Maintains a list of directories/blogs for outreach and tracks status

const fs = require('fs');
const path = require('path');

const OUTREACH_DATA_FILE = path.join(__dirname, '../data/outreach.json');
const REPORTS_DIR = path.join(__dirname, '../../reports');

// Ensure reports directory exists
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

// Initial outreach targets (20 directories/blogs)
const initialOutreachData = {
  lastUpdated: new Date().toISOString(),
  targets: [
    {
      id: 1,
      name: "Find A Grave",
      url: "https://www.findagrave.com",
      category: "Memorial Directory",
      contact_email: "support@findagrave.com",
      status: "pending",
      notes: "",
      dateAdded: new Date().toISOString(),
      dateContacted: null,
      dateApproved: null
    },
    {
      id: 2,
      name: "Memorials.com",
      url: "https://www.memorials.com",
      category: "Memorial Directory",
      contact_email: "info@memorials.com",
      status: "pending",
      notes: "",
      dateAdded: new Date().toISOString(),
      dateContacted: null,
      dateApproved: null
    },
    {
      id: 3,
      name: "Legacy.com",
      url: "https://www.legacy.com",
      category: "Obituary Directory",
      contact_email: "contact@legacy.com",
      status: "pending",
      notes: "",
      dateAdded: new Date().toISOString(),
      dateContacted: null,
      dateApproved: null
    },
    {
      id: 4,
      name: "Everlasting Memorials",
      url: "https://www.everlastingmemorials.com",
      category: "Memorial Directory",
      contact_email: "info@everlastingmemorials.com",
      status: "pending",
      notes: "",
      dateAdded: new Date().toISOString(),
      dateContacted: null,
      dateApproved: null
    },
    {
      id: 5,
      name: "Memorial Pages",
      url: "https://www.memorialpages.org",
      category: "Memorial Directory",
      contact_email: "contact@memorialpages.org",
      status: "pending",
      notes: "",
      dateAdded: new Date().toISOString(),
      dateContacted: null,
      dateApproved: null
    },
    {
      id: 6,
      name: "Tribute Archive",
      url: "https://www.tributearchive.com",
      category: "Memorial Directory",
      contact_email: "info@tributearchive.com",
      status: "pending",
      notes: "",
      dateAdded: new Date().toISOString(),
      dateContacted: null,
      dateApproved: null
    },
    {
      id: 7,
      name: "Memorials Online",
      url: "https://www.memorialsonline.com",
      category: "Memorial Directory",
      contact_email: "contact@memorialsonline.com",
      status: "pending",
      notes: "",
      dateAdded: new Date().toISOString(),
      dateContacted: null,
      dateApproved: null
    },
    {
      id: 8,
      name: "Cremation Society",
      url: "https://www.cremationsociety.org",
      category: "Memorial Directory",
      contact_email: "info@cremationsociety.org",
      status: "pending",
      notes: "",
      dateAdded: new Date().toISOString(),
      dateContacted: null,
      dateApproved: null
    },
    {
      id: 9,
      name: "Memorial Finder",
      url: "https://www.memorialfinder.com",
      category: "Memorial Directory",
      contact_email: "support@memorialfinder.com",
      status: "pending",
      notes: "",
      dateAdded: new Date().toISOString(),
      dateContacted: null,
      dateApproved: null
    },
    {
      id: 10,
      name: "Grief Support Blog",
      url: "https://www.griefsupportblog.com",
      category: "Blog",
      contact_email: "editor@griefsupportblog.com",
      status: "pending",
      notes: "",
      dateAdded: new Date().toISOString(),
      dateContacted: null,
      dateApproved: null
    },
    {
      id: 11,
      name: "Memorial Technology Review",
      url: "https://www.memorialtechreview.com",
      category: "Blog",
      contact_email: "contact@memorialtechreview.com",
      status: "pending",
      notes: "",
      dateAdded: new Date().toISOString(),
      dateContacted: null,
      dateApproved: null
    },
    {
      id: 12,
      name: "Digital Memorials Guide",
      url: "https://www.digitalmemorialsguide.com",
      category: "Blog",
      contact_email: "info@digitalmemorialsguide.com",
      status: "pending",
      notes: "",
      dateAdded: new Date().toISOString(),
      dateContacted: null,
      dateApproved: null
    },
    {
      id: 13,
      name: "Funeral Home Directory",
      url: "https://www.funeralhomedirectory.com",
      category: "Directory",
      contact_email: "admin@funeralhomedirectory.com",
      status: "pending",
      notes: "",
      dateAdded: new Date().toISOString(),
      dateContacted: null,
      dateApproved: null
    },
    {
      id: 14,
      name: "Memorial Services UK",
      url: "https://www.memorialservicesuk.co.uk",
      category: "Directory",
      contact_email: "contact@memorialservicesuk.co.uk",
      status: "pending",
      notes: "",
      dateAdded: new Date().toISOString(),
      dateContacted: null,
      dateApproved: null
    },
    {
      id: 15,
      name: "QR Code Technology Blog",
      url: "https://www.qrcodetechblog.com",
      category: "Blog",
      contact_email: "editor@qrcodetechblog.com",
      status: "pending",
      notes: "",
      dateAdded: new Date().toISOString(),
      dateContacted: null,
      dateApproved: null
    },
    {
      id: 16,
      name: "Memorial Planning Guide",
      url: "https://www.memorialplanningguide.com",
      category: "Blog",
      contact_email: "info@memorialplanningguide.com",
      status: "pending",
      notes: "",
      dateAdded: new Date().toISOString(),
      dateContacted: null,
      dateApproved: null
    },
    {
      id: 17,
      name: "Cemetery Directory",
      url: "https://www.cemeterydirectory.com",
      category: "Directory",
      contact_email: "support@cemeterydirectory.com",
      status: "pending",
      notes: "",
      dateAdded: new Date().toISOString(),
      dateContacted: null,
      dateApproved: null
    },
    {
      id: 18,
      name: "Memorial Innovations",
      url: "https://www.memorialinnovations.com",
      category: "Blog",
      contact_email: "contact@memorialinnovations.com",
      status: "pending",
      notes: "",
      dateAdded: new Date().toISOString(),
      dateContacted: null,
      dateApproved: null
    },
    {
      id: 19,
      name: "Grief & Remembrance Blog",
      url: "https://www.griefremembranceblog.com",
      category: "Blog",
      contact_email: "editor@griefremembranceblog.com",
      status: "pending",
      notes: "",
      dateAdded: new Date().toISOString(),
      dateContacted: null,
      dateApproved: null
    },
    {
      id: 20,
      name: "Memorial Resources Hub",
      url: "https://www.memorialresourceshub.com",
      category: "Directory",
      contact_email: "info@memorialresourceshub.com",
      status: "pending",
      notes: "",
      dateAdded: new Date().toISOString(),
      dateContacted: null,
      dateApproved: null
    }
  ]
};

// Load or initialize outreach data
function loadOutreachData() {
  if (fs.existsSync(OUTREACH_DATA_FILE)) {
    try {
      const data = fs.readFileSync(OUTREACH_DATA_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading outreach data:', error);
      return initialOutreachData;
    }
  }
  return initialOutreachData;
}

// Save outreach data
function saveOutreachData(data) {
  const dataDir = path.dirname(OUTREACH_DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  data.lastUpdated = new Date().toISOString();
  fs.writeFileSync(OUTREACH_DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// Update outreach status
function updateOutreachStatus(id, status, notes = '') {
  const data = loadOutreachData();
  const target = data.targets.find(t => t.id === id);
  
  if (!target) {
    console.error(`Target with id ${id} not found`);
    return false;
  }
  
  target.status = status;
  target.notes = notes;
  
  if (status === 'sent' && !target.dateContacted) {
    target.dateContacted = new Date().toISOString();
  }
  
  if (status === 'approved' && !target.dateApproved) {
    target.dateApproved = new Date().toISOString();
  }
  
  saveOutreachData(data);
  return true;
}

// Generate markdown table for Notion
function generateOutreachTable() {
  const data = loadOutreachData();
  const targets = data.targets;
  
  let markdown = '# Outreach Status Report\n\n';
  markdown += `**Generated:** ${new Date().toLocaleDateString('en-GB', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}\n\n`;
  
  markdown += '| Name | URL | Category | Contact Email | Status | Date Contacted | Date Approved | Notes |\n';
  markdown += '|------|-----|----------|---------------|--------|----------------|---------------|-------|\n';
  
  targets.forEach(target => {
    const name = target.name || '';
    const url = target.url || '';
    const category = target.category || '';
    const email = target.contact_email || '';
    const status = target.status || 'pending';
    const dateContacted = target.dateContacted 
      ? new Date(target.dateContacted).toLocaleDateString('en-GB')
      : '-';
    const dateApproved = target.dateApproved
      ? new Date(target.dateApproved).toLocaleDateString('en-GB')
      : '-';
    const notes = (target.notes || '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
    
    markdown += `| ${name} | ${url} | ${category} | ${email} | ${status} | ${dateContacted} | ${dateApproved} | ${notes} |\n`;
  });
  
  // Add summary statistics
  const pending = targets.filter(t => t.status === 'pending').length;
  const sent = targets.filter(t => t.status === 'sent').length;
  const approved = targets.filter(t => t.status === 'approved').length;
  
  markdown += '\n## Summary\n\n';
  markdown += `- **Total Targets:** ${targets.length}\n`;
  markdown += `- **Pending:** ${pending}\n`;
  markdown += `- **Sent:** ${sent}\n`;
  markdown += `- **Approved:** ${approved}\n`;
  markdown += `- **Approval Rate:** ${targets.length > 0 ? ((approved / targets.length) * 100).toFixed(1) : 0}%\n`;
  
  return markdown;
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    loadOutreachData,
    saveOutreachData,
    updateOutreachStatus,
    generateOutreachTable,
    OUTREACH_DATA_FILE
  };
}

// If run directly, generate and save the table
if (require.main === module) {
  const table = generateOutreachTable();
  const reportFile = path.join(REPORTS_DIR, 'OUTREACH_STATUS.md');
  fs.writeFileSync(reportFile, table, 'utf8');
  console.log(`✅ Outreach status table generated: ${reportFile}`);
  console.log('\n' + table);
}

