const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'complete_168_files_audit.json'), 'utf8'));

console.log("=== UNLOCALIZED FILES (58) ===");
const unlocalized = data.filter(d => d.status === 'Unlocalized (Hardcoded)');
unlocalized.forEach(u => {
    console.log(`- ${u.file} (${u.hardcodedUserFacingCount} UI lines)`);
});

console.log("\n=== PARTIALLY LOCALIZED FILES (66) ===");
const partial = data.filter(d => d.status === 'Partially Localized');
partial.forEach(p => {
    console.log(`- ${p.file} (ougi.text: ${p.ougiTextCount}, UI lines: ${p.hardcodedUserFacingCount})`);
});

console.log("\n=== FULLY LOCALIZED FILES (17) ===");
const fully = data.filter(d => d.status === 'Fully Localized');
fully.forEach(f => {
    console.log(`- ${f.file} (ougi.text: ${f.ougiTextCount})`);
});

console.log("\n=== INTERNAL / NO UI TEXT FILES (27) ===");
const internal = data.filter(d => d.status === 'Internal / No UI Text');
internal.forEach(i => {
    console.log(`- ${i.file}`);
});
