const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const localization = require(path.join(rootDir, 'function', 'localization.js'));

const enKeys = Object.keys(localization.en || {});
const esKeys = Object.keys(localization.es || {});
const mxKeys = Object.keys(localization.mx || {});

console.log(`Current localization keys:`);
console.log(`- English (en): ${enKeys.length} keys`);
console.log(`- Spanish (es): ${esKeys.length} keys`);
console.log(`- Mexican Spanish (mx): ${mxKeys.length} keys`);

fs.writeFileSync(path.join(__dirname, 'existing_keys.json'), JSON.stringify({
    en: enKeys,
    es: esKeys,
    mx: mxKeys
}, null, 2));
