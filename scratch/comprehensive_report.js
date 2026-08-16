const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const functionDir = path.join(rootDir, 'function');
const existingKeys = new Set(require(path.join(__dirname, 'existing_keys.json')).en);

const files = fs.readdirSync(functionDir)
    .filter(f => f.endsWith('.js') && f !== 'localization.js')
    .map(f => ({ name: f, fullPath: path.join(functionDir, f), dir: 'function' }));

['fan.js', 'auditresponses.js', 'migrateToSqlite.js', 'uploadBackups.js'].forEach(f => {
    const full = path.join(rootDir, f);
    if (fs.existsSync(full)) files.push({ name: f, fullPath: full, dir: 'root' });
});

// Let's create an in-depth audit per file
const comprehensiveReport = [];

files.forEach(fileObj => {
    const content = fs.readFileSync(fileObj.fullPath, 'utf8');
    const lines = content.split(/\r?\n/);
    const relPath = fileObj.dir === 'root' ? fileObj.name : `function/${fileObj.name}`;

    const items = [];

    lines.forEach((line, idx) => {
        const lineNum = idx + 1;
        const trimmed = line.trim();

        if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) return;

        // Check if this line has string literals
        // If line already uses ougi.text, check if it has unlocalized concatenated parts (e.g. `":warning: " + await ougi.text(...)` or `.replace(...)`)
        // If line doesn't use ougi.text but has user-facing calls (send, reply, setTitle, setDescription, setFooter, addFields, prompt, etc.)
        
        // 1. Direct embed methods with hardcoded strings
        const embedTitleMatch = trimmed.match(/\.setTitle\(\s*(['"`])(.*?)\1\s*\)/);
        if (embedTitleMatch && !trimmed.includes('ougi.text(')) {
            items.push({
                lineNum,
                line: trimmed,
                type: 'Embed Title (Hardcoded)',
                string: embedTitleMatch[2],
                needsPlaceholder: /\$\{.*\}|\+/.test(trimmed)
            });
        }

        const embedDescMatch = trimmed.match(/\.setDescription\(\s*(['"`])(.*?)\1\s*\)/);
        if (embedDescMatch && !trimmed.includes('ougi.text(')) {
            items.push({
                lineNum,
                line: trimmed,
                type: 'Embed Description (Hardcoded)',
                string: embedDescMatch[2],
                needsPlaceholder: /\$\{.*\}|\+/.test(trimmed)
            });
        }

        const embedFooterMatch = trimmed.match(/\.setFooter\(\s*\{\s*text:\s*(['"`])(.*?)\1/);
        if (embedFooterMatch && !trimmed.includes('ougi.text(')) {
            items.push({
                lineNum,
                line: trimmed,
                type: 'Embed Footer (Hardcoded)',
                string: embedFooterMatch[2],
                needsPlaceholder: /\$\{.*\}|\+/.test(trimmed)
            });
        }

        const embedAuthorMatch = trimmed.match(/\.setAuthor\(\s*\{\s*name:\s*(['"`])(.*?)\1/);
        if (embedAuthorMatch && !trimmed.includes('ougi.text(')) {
            items.push({
                lineNum,
                line: trimmed,
                type: 'Embed Author (Hardcoded)',
                string: embedAuthorMatch[2],
                needsPlaceholder: /\$\{.*\}|\+/.test(trimmed)
            });
        }

        const addFieldsMatch = trimmed.match(/\.addFields\(\s*\{\s*name:\s*(['"`])(.*?)\1\s*,\s*value:\s*(['"`])(.*?)\3/);
        if (addFieldsMatch && !trimmed.includes('ougi.text(')) {
            items.push({
                lineNum,
                line: trimmed,
                type: 'Embed Field (Hardcoded name & value)',
                name: addFieldsMatch[2],
                value: addFieldsMatch[4],
                needsPlaceholder: /\$\{.*\}|\+/.test(trimmed)
            });
        }

        // 2. Direct send or reply with string literals
        const sendLiteralMatch = trimmed.match(/(?:msg|interaction|channel)\.(?:send|reply|followUp)\(\s*(['"`])(.*?)\1\s*\)/);
        if (sendLiteralMatch && !trimmed.includes('ougi.text(')) {
            items.push({
                lineNum,
                line: trimmed,
                type: 'Message Send/Reply (Hardcoded string literal)',
                string: sendLiteralMatch[2],
                needsPlaceholder: /\$\{.*\}|\+/.test(trimmed)
            });
        }

        // 3. send/reply with template literal `${...}` or string concat
        if (/(?:msg|interaction|channel)\.(?:send|reply|followUp)\(\s*`([^`]+)`\s*\)/.test(trimmed) && !trimmed.includes('ougi.text(')) {
            const m = trimmed.match(/(?:msg|interaction|channel)\.(?:send|reply|followUp)\(\s*`([^`]+)`\s*\)/);
            items.push({
                lineNum,
                line: trimmed,
                type: 'Message Send/Reply (Template Literal)',
                string: m[1],
                needsPlaceholder: true
            });
        }

        // 4. ougi.text calls with mixed hardcoded prefixes/suffixes
        if (trimmed.includes('ougi.text(')) {
            if (/:\s*(['"`])(:warning:|:information_source:|•|\*\*|`|> )/i.test(trimmed) || /['"`]\s*\+\s*await ougi\.text/.test(trimmed) || /await ougi\.text\(.*?\)\s*\+\s*['"`]/.test(trimmed)) {
                items.push({
                    lineNum,
                    line: trimmed,
                    type: 'Mixed Localized & Hardcoded Prefix/Suffix',
                    needsPlaceholder: true
                });
            }
        }
    });

    if (items.length > 0) {
        comprehensiveReport.push({
            file: relPath,
            count: items.length,
            items
        });
    }
});

fs.writeFileSync(path.join(__dirname, 'comprehensive_line_report.json'), JSON.stringify(comprehensiveReport, null, 2));
console.log(`Generated report for ${comprehensiveReport.length} files with specific UI string items.`);
