let fs = require('fs');
let localization = require('./function/localization.js');
let localesCache = JSON.parse(fs.readFileSync('./localesCache.txt', 'utf-8'));
async function refactor(obj, path) {
    let newOBJ = {};
    for (key in obj) {
        for (key2 in obj[key]) {
            if (newOBJ[key2] === undefined) {
                newOBJ[key2] = {};
            }
            newOBJ[key2][key] = obj[key][key2];
        }
    }
    await fs.writeFile(path, JSON.stringify(newOBJ, null, 4), console.error);
}
refactor(localization, './function/localization.js');
refactor(localesCache, './localesCache.txt');