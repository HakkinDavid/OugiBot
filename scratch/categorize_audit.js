const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const existingKeys = new Set(require(path.join(__dirname, 'existing_keys.json')).en);

// Functional categories for files:
const categories = {
    "Help Modules (*Help.js)": [],
    "Command Handlers (*Command.js, gamblingCommands.js, etc.)": [],
    "Economy & Gambling System": [],
    "Raffle System": [],
    "Voice & Audio System": [],
    "Conversational AI & NLP": [],
    "Administration & Moderation": [],
    "Utilities, Embeds & Root Systems": []
};

function categorizeFile(filename) {
    if (filename.endsWith('Help.js')) return "Help Modules (*Help.js)";
    if (filename.startsWith('raffle') || filename === 'pickWinners.js') return "Raffle System";
    if (['economy.js', 'manageEconomy.js', 'balanceCheck.js', 'gamblingCommands.js', 'payCommand.js', 'dailyCommand.js', 'workCommand.js', 'economyIcons.js'].includes(filename)) return "Economy & Gambling System";
    if (['voice.js', 'voiceManager.js', 'voiceCallMusic.js', 'audioCacheManager.js', 'queue.js', 'tts.js'].includes(filename)) return "Voice & Audio System";
    if (['judgementAbility.js', 'genAIAbility.js', 'mimicAbility.js', 'genAIText.js', 'talkLearn.js', 'talkForget.js'].includes(filename)) return "Conversational AI & NLP";
    if (['adminCheck.js', 'adminRegister.js', 'allowCommand.js', 'banCommand.js', 'checkPerms.js', 'checkBadWords.js', 'setLog.js', 'setNews.js', 'optout.js', 'optback.js', 'rm.js'].includes(filename)) return "Administration & Moderation";
    if (filename.includes('Command') || filename.includes('Commands')) return "Command Handlers (*Command.js, gamblingCommands.js, etc.)";
    return "Utilities, Embeds & Root Systems";
}

const allData = JSON.parse(fs.readFileSync(path.join(__dirname, 'all_hardcoded_instances.json'), 'utf8'));

allData.forEach(fileObj => {
    const filename = path.basename(fileObj.file);
    const cat = categorizeFile(filename);
    categories[cat].push(fileObj);
});

fs.writeFileSync(path.join(__dirname, 'categorized_audit.json'), JSON.stringify(categories, null, 2));
console.log('Saved categorized audit.');
