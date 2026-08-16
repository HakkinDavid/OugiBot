const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const functionDir = path.join(rootDir, 'function');
const existingKeys = require(path.join(__dirname, 'existing_keys.json')).en;
const existingKeysSet = new Set(existingKeys);

const files = fs.readdirSync(functionDir)
    .filter(f => f.endsWith('.js') && f !== 'localization.js')
    .map(f => ({ name: f, fullPath: path.join(functionDir, f), dir: 'function' }));

['fan.js', 'auditresponses.js', 'migrateToSqlite.js', 'uploadBackups.js'].forEach(f => {
    const full = path.join(rootDir, f);
    if (fs.existsSync(full)) files.push({ name: f, fullPath: full, dir: 'root' });
});

const fileAudits = [];

for (const fileObj of files) {
    const content = fs.readFileSync(fileObj.fullPath, 'utf8');
    const lines = content.split(/\r?\n/);
    const relPath = fileObj.dir === 'root' ? fileObj.name : `function/${fileObj.name}`;

    const instances = [];

    lines.forEach((line, index) => {
        const lineNum = index + 1;
        const trimmed = line.trim();

        if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) return;

        // Find string literals in this line:
        // We match single quoted, double quoted, and backtick strings
        // Regex pattern to extract string tokens:
        const stringRegex = /(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g;
        let match;
        while ((match = stringRegex.exec(trimmed)) !== null) {
            const rawQuote = match[1];
            const strVal = match[2];
            
            // Skip technical / non-user facing strings:
            if (!strVal || strVal.trim() === '') continue;
            if (existingKeysSet.has(strVal)) continue; // It's an existing localization key!
            
            // Check if technical identifier/config/SQL/regex/path/event
            if (/^(utf-8|hex|base64|ascii|json|text|client|messageCreate|interactionCreate|ready|guildCreate|guildDelete|voiceStateUpdate|error|warn|close|finish|pipe|data|open|end)$/i.test(strVal)) continue;
            if (/^(sqlite|better-sqlite3|node:|discord\.js|dotenv|fs|path|child_process|crypto-js|mathjs|youtube-dl-exec|youtube-sr|google-tts-api|twit|newsapi|async-g-i-s|require-all|string-similarity|find-remove|is-hexcolor|is-image-url|levenary|leven|remove-words|@colors\/colors\/safe|@vitalets\/google-translate-api|@discordjs\/voice|@ksoft\/api)/.test(strVal)) continue;
            if (/^https?:\/\//.test(strVal)) continue;
            if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(strVal)) continue;
            if (/^\.[\w-]+$/.test(strVal)) continue; // File extension like .txt, .db
            if (/^[0-9]+$/.test(strVal)) continue; // Discord snowflakes / pure numbers
            if (/^(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|PRAGMA|ALTER|TABLE|INTO|VALUES|WHERE|AND|OR|SET|ORDER BY|GROUP BY|JOIN|INTEGER|TEXT|PRIMARY KEY|DEFAULT|FOREIGN KEY|REFERENCES|VACUUM|BEGIN|COMMIT|ROLLBACK)/i.test(strVal) && strVal.includes(' ')) continue; // SQL
            if (/^(dev|prod|test|staging|silent|always|never|inherit|branch|share)$/.test(strVal)) continue;
            if (/^(POST|GET|PUT|DELETE|PATCH|HEAD)$/.test(strVal)) continue;
            if (/^(\.\/|\/)/.test(strVal) && (strVal.endsWith('.db') || strVal.endsWith('.txt') || strVal.endsWith('.js') || strVal.endsWith('.png') || strVal.endsWith('.mp3') || strVal.endsWith('.clean') || strVal.includes('/'))) continue;
            if (/^[a-zA-Z0-9_]+$/.test(strVal) && !strVal.includes(' ') && !/^[A-Z]/.test(strVal) && strVal.length < 15) {
                // Potential variable name or property key or single command name
                // Let's check context
                if (/^(author|footer|thumbnail|image|color|fields|title|description|timestamp|name|value|inline|url|iconURL|custom_id|customId|components|type|flags|ephemeral|content|embeds|files|action|amount|balance|username|id|tag|avatar|status|prefix|lang|cooldown|rate|limit)$/.test(strVal)) continue;
            }

            // Now let's check if the string is used in a user-facing or potentially user-facing context
            const isUserFacingContext = 
                trimmed.includes('send(') ||
                trimmed.includes('reply(') ||
                trimmed.includes('setTitle(') ||
                trimmed.includes('setDescription(') ||
                trimmed.includes('setFooter(') ||
                trimmed.includes('setAuthor(') ||
                trimmed.includes('addFields(') ||
                trimmed.includes('name:') ||
                trimmed.includes('value:') ||
                trimmed.includes('title:') ||
                trimmed.includes('description:') ||
                trimmed.includes('text:') ||
                trimmed.includes('content:') ||
                trimmed.includes('embed') ||
                trimmed.includes('console.error(') ||
                trimmed.includes('throw new Error') ||
                strVal.includes(' ') || // Multi-word strings
                /[A-Z]/.test(strVal[0]); // Capitalized strings

            if (isUserFacingContext) {
                instances.push({
                    lineNum,
                    line: trimmed,
                    quoteType: rawQuote,
                    value: strVal
                });
            }
        }
    });

    if (instances.length > 0) {
        fileAudits.push({
            file: relPath,
            totalInstances: instances.length,
            instances
        });
    }
}

fs.writeFileSync(path.join(__dirname, 'all_hardcoded_instances.json'), JSON.stringify(fileAudits, null, 2));
console.log(`Found hardcoded string instances in ${fileAudits.length} files.`);
