const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const functionDir = path.join(rootDir, 'function');

const allFiles = fs.readdirSync(functionDir)
    .filter(f => f.endsWith('.js') && f !== 'localization.js')
    .map(f => ({ name: f, relPath: `function/${f}`, fullPath: path.join(functionDir, f) }));

['fan.js', 'auditresponses.js', 'migrateToSqlite.js', 'uploadBackups.js'].forEach(f => {
    const full = path.join(rootDir, f);
    if (fs.existsSync(full)) allFiles.push({ name: f, relPath: f, fullPath: full });
});

const report = [];

allFiles.forEach(file => {
    const content = fs.readFileSync(file.fullPath, 'utf8');
    const lines = content.split(/\r?\n/);

    const stringLines = [];
    const ougiTextLines = [];
    const hardcodedUserFacingLines = [];

    lines.forEach((line, idx) => {
        const lineNum = idx + 1;
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) return;

        if (trimmed.includes('ougi.text(')) {
            ougiTextLines.push({ lineNum, line: trimmed });
        }

        // Check for quotes / backticks
        if (trimmed.includes("'") || trimmed.includes('"') || trimmed.includes('`')) {
            stringLines.push({ lineNum, line: trimmed });

            // Evaluate if this line contains user-facing hardcoded text
            const hasSendReply = /\.(send|reply|followUp)\(/.test(trimmed);
            const hasEmbed = /\.(setTitle|setDescription|setFooter|setAuthor|addFields|setColor)\(/.test(trimmed);
            const hasField = /(?:name|value|text|title|description|content|label|placeholder):\s*[`"']/.test(trimmed);
            const hasUserMsgAssign = /(?:let|const|var)\s+\w*(?:msg|response|output|reply|answer|prompt|err|text|description|title)\w*\s*=\s*[`"']/.test(trimmed);
            
            if (hasSendReply || hasEmbed || hasField || hasUserMsgAssign) {
                hardcodedUserFacingLines.push({
                    lineNum,
                    line: trimmed,
                    hasOugiText: trimmed.includes('ougi.text(')
                });
            }
        }
    });

    report.push({
        file: file.relPath,
        totalLines: lines.length,
        totalStringLines: stringLines.length,
        ougiTextCount: ougiTextLines.length,
        hardcodedUserFacingCount: hardcodedUserFacingLines.length,
        hardcodedUserFacingLines,
        status: ougiTextLines.length > 0 && hardcodedUserFacingLines.filter(l => !l.hasOugiText).length === 0 
            ? 'Fully Localized' 
            : (ougiTextLines.length > 0 ? 'Partially Localized' : (hardcodedUserFacingLines.length > 0 ? 'Unlocalized (Hardcoded)' : 'Internal / No UI Text'))
    });
});

fs.writeFileSync(path.join(__dirname, 'complete_168_files_audit.json'), JSON.stringify(report, null, 2));

const statusCounts = {};
report.forEach(r => {
    statusCounts[r.status] = (statusCounts[r.status] || 0) + 1;
});
console.log('Complete 168 files audit summary:', statusCounts);
