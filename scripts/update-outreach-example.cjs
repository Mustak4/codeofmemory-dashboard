// Example: How to update outreach status programmatically
// Usage: node scripts/update-outreach-example.cjs

const { updateOutreachStatus, loadOutreachData } = require('../src/utils/outreach.cjs');

console.log('📧 Outreach Status Update Example\n');

// Example 1: Mark target #1 as "sent"
console.log('Example 1: Marking target #1 as "sent"...');
updateOutreachStatus(1, 'sent', 'Initial outreach email sent on 2025-01-20');
console.log('✅ Status updated\n');

// Example 2: Mark target #2 as "approved"
console.log('Example 2: Marking target #2 as "approved"...');
updateOutreachStatus(2, 'approved', 'Backlink approved and published on homepage');
console.log('✅ Status updated\n');

// Example 3: View current status
console.log('Example 3: Current outreach statistics:');
const data = loadOutreachData();
const pending = data.targets.filter(t => t.status === 'pending').length;
const sent = data.targets.filter(t => t.status === 'sent').length;
const approved = data.targets.filter(t => t.status === 'approved').length;

console.log(`   Pending: ${pending}`);
console.log(`   Sent: ${sent}`);
console.log(`   Approved: ${approved}`);
console.log(`   Total: ${data.targets.length}\n`);

console.log('💡 To update more targets, edit src/data/outreach.json or use updateOutreachStatus() function');

