const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const files = [];

function getFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== 'scratch' && entry.name !== '.git') {
            getFiles(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.js') && entry.name !== 'localization.js') {
            files.push(fullPath);
        }
    }
}

getFiles(rootDir);
files.sort();

console.log(`Total JS files to analyze: ${files.length}`);

const fileResults = {};

for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split(/\r?\n/);
    const relPath = path.relative(rootDir, file);
    const stringLines = [];

    lines.forEach((line, index) => {
        if (line.includes("'") || line.includes('"') || line.includes('`')) {
            stringLines.push({
                lineNum: index + 1,
                line: line.trim()
            });
        }
    });

    fileResults[relPath] = stringLines;
}

fs.writeFileSync(path.join(__dirname, 'strings_dump.json'), JSON.stringify(fileResults, null, 2));
console.log('Dumped strings_dump.json successfully');
