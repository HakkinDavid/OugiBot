const fs = require('fs');
const path = require('path');
const report = JSON.parse(fs.readFileSync(path.join(__dirname, 'complete_168_files_audit.json'), 'utf8'));

// Extract some key highlights from each group
const sampleFiles = [
    'fan.js',
    'function/adminRegister.js',
    'function/balanceCheck.js',
    'function/banCommand.js',
    'function/calculateCommand.js',
    'function/dailyCommand.js',
    'function/feedback.js',
    'function/gamblingCommands.js',
    'function/genAIAbility.js',
    'function/guildLog.js',
    'function/inspectCommand.js',
    'function/judgementAbility.js',
    'function/lang.js',
    'function/manageEconomy.js',
    'function/minesweeper.js',
    'function/musicHelp.js',
    'function/newsletter.js',
    'function/newspaper.js',
    'function/payCommand.js',
    'function/queue.js',
    'function/raffleCommand.js',
    'function/remindMe.js',
    'function/shootSniper.js',
    'function/spookyEmbed.js',
    'function/statsCommand.js',
    'function/storytellCommand.js',
    'function/subscribeCommand.js',
    'function/talkLearn.js',
    'function/tos.js',
    'function/voiceCallMusic.js',
    'function/whoIsMe.js',
    'function/workCommand.js'
];

sampleFiles.forEach(sf => {
    const f = report.find(r => r.file === sf);
    if (f) {
        console.log(`\n--- ${f.file} (${f.status}) ---`);
        f.hardcodedUserFacingLines.slice(0, 5).forEach(l => {
            console.log(`  L${l.lineNum}: ${l.line}`);
        });
    }
});
