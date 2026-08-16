const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const functionDir = path.join(rootDir, 'function');

const files = fs.readdirSync(functionDir)
    .filter(f => f.endsWith('.js') && f !== 'localization.js')
    .map(f => path.join(functionDir, f));

// Also add root js files
['fan.js', 'auditresponses.js', 'migrateToSqlite.js', 'uploadBackups.js'].forEach(f => {
    const full = path.join(rootDir, f);
    if (fs.existsSync(full)) files.push(full);
});

// Keywords / context clues for user-facing strings:
// .send(, .reply(, .setTitle(, .setDescription(, .setFooter(, .setAuthor(, .addFields(, .edit(,
// Error messages, alert messages, prompts, fallback strings, hardcoded English/Spanish text.

const results = [];

files.forEach(file => {
    const rel = path.relative(rootDir, file);
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split(/\r?\n/);

    const fileFindings = [];

    lines.forEach((line, idx) => {
        const lineNum = idx + 1;
        const trimmed = line.trim();

        // Skip pure comments or empty
        if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) return;

        // Check if line contains user-facing patterns or strings
        // Patterns: send(, reply(, setTitle(, setDescription(, setFooter(, addFields(, name:, value:, etc.
        const hasSendOrReply = /channel\.send|\.reply|interaction\.reply|interaction\.followUp/i.test(trimmed);
        const hasEmbedMethod = /setTitle|setDescription|setFooter|setAuthor|addFields/i.test(trimmed);
        const hasTextOugi = /ougi\.text\(/i.test(trimmed);
        const hasLiteralString = /["'`][^"'`]{3,}["'`]/.test(trimmed);

        // Extract string literals
        // Matches "...", '...', `...`
        const strMatches = trimmed.match(/(["'`])(?:(?=(\\?))\2[\s\S])*?\1/g) || [];

        // Check for potential hardcoded user facing text
        // E.g. strings with spaces, punctuation, words > 3 chars that aren't pure identifiers or sql or regex
        const suspiciousStrings = strMatches.filter(s => {
            const inner = s.slice(1, -1);
            if (inner.length < 3) return false;
            // Ignore common technical strings
            if (/^[a-zA-Z0-9_-]+$/.test(inner) && !inner.includes(' ') && !/^[A-Z]/.test(inner)) {
                // Single technical token like 'utf-8', 'en', 'guildId', 'json', etc.
                return false;
            }
            if (/^(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|PRAGMA|WHERE|FROM)/i.test(inner)) return false;
            if (/^https?:\/\//i.test(inner)) return false;
            if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(inner)) return false; // Hex color
            if (/^(\.\/|\/|\.|\.\.)/.test(inner) && (inner.includes('.txt') || inner.includes('.db') || inner.includes('.js') || inner.includes('.json') || inner.includes('.png'))) return false;
            if (/^[0-9]+$/.test(inner)) return false; // Discord IDs
            return true;
        });

        if (hasSendOrReply || hasEmbedMethod || suspiciousStrings.length > 0) {
            fileFindings.push({
                lineNum,
                line: trimmed,
                hasSendOrReply,
                hasEmbedMethod,
                hasTextOugi,
                suspiciousStrings
            });
        }
    });

    if (fileFindings.length > 0) {
        results.push({
            file: rel,
            findings: fileFindings
        });
    }
});

fs.writeFileSync(path.join(__dirname, 'analysis_results.json'), JSON.stringify(results, null, 2));
console.log(`Analyzed ${files.length} files. Found findings in ${results.length} files.`);
