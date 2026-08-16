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

// We want to thoroughly analyze every file
const detailedAnalysis = [];

for (const fileObj of files) {
    const content = fs.readFileSync(fileObj.fullPath, 'utf8');
    const lines = content.split(/\r?\n/);
    const relPath = fileObj.dir === 'root' ? fileObj.name : `function/${fileObj.name}`;

    const fileEntries = [];

    lines.forEach((line, idx) => {
        const lineNum = idx + 1;
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) return;

        // Check for user-facing patterns
        const isEmbedMethod = /\.(setTitle|setDescription|setFooter|setAuthor|addFields)\(/.test(trimmed);
        const isSendOrReply = /\.(send|reply|followUp)\(/.test(trimmed);
        const isButtonOrSelect = /\.(setLabel|setPlaceholder|setCustomId)\(/.test(trimmed);
        const hasQuotes = /["'`]/.test(trimmed);

        if (hasQuotes && (isEmbedMethod || isSendOrReply || isButtonOrSelect || trimmed.includes('EmbedBuilder') || trimmed.includes('new Discord.EmbedBuilder'))) {
            fileEntries.push({
                lineNum,
                line: trimmed,
                context: isSendOrReply ? 'Message Send/Reply' : (isEmbedMethod ? 'Embed Method' : (isButtonOrSelect ? 'Component Method' : 'Embed Construction'))
            });
        }
    });

    if (fileEntries.length > 0) {
        detailedAnalysis.push({
            file: relPath,
            entries: fileEntries
        });
    }
}

fs.writeFileSync(path.join(__dirname, 'detailed_user_facing_audit.json'), JSON.stringify(detailedAnalysis, null, 2));
console.log(`Audited user-facing strings across ${detailedAnalysis.length} files.`);
