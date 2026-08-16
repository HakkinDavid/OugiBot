const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const functionDir = path.join(rootDir, 'function');

const files = fs.readdirSync(functionDir)
    .filter(f => f.endsWith('.js') && f !== 'localization.js')
    .map(f => ({ name: f, fullPath: path.join(functionDir, f), dir: 'function' }));

['fan.js', 'auditresponses.js', 'migrateToSqlite.js', 'uploadBackups.js'].forEach(f => {
    const full = path.join(rootDir, f);
    if (fs.existsSync(full)) files.push({ name: f, fullPath: full, dir: 'root' });
});

const report = [];

for (const fileObj of files) {
    const content = fs.readFileSync(fileObj.fullPath, 'utf8');
    const lines = content.split(/\r?\n/);
    const fileReport = {
        file: fileObj.name,
        path: fileObj.dir === 'root' ? fileObj.name : `function/${fileObj.name}`,
        hardcodedStrings: []
    };

    lines.forEach((line, idx) => {
        const lineNum = idx + 1;
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) return;

        // Extract all string literals and template literals
        // We'll analyze lines that have strings
        if (trimmed.includes("'") || trimmed.includes('"') || trimmed.includes('`')) {
            // Check if this line has user-facing potential:
            // 1. send/reply/react
            // 2. setTitle/setDescription/setFooter/setAuthor/addFields/setHeader
            // 3. embed creation / field values / author names
            // 4. console.error or log that goes to user / discord logging
            // 5. string assignments for messages/responses/prompts
            // 6. hardcoded English/Spanish text
            fileReport.hardcodedStrings.push({
                lineNum,
                line: trimmed
            });
        }
    });

    report.push(fileReport);
}

fs.writeFileSync(path.join(__dirname, 'all_files_line_strings.json'), JSON.stringify(report, null, 2));
console.log(`Saved detailed line strings for ${report.length} files.`);
