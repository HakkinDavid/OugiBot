module.exports = {
    registry: [
        { name: 'help', aliases: [], help: (msg) => ougi.helpEmbed(msg) },
        { name: 'say', aliases: [], help: (msg) => ougi.sayHelp(msg) },
        { name: 'answer', aliases: [], help: (msg) => ougi.answerHelp(msg) },
        { name: 'snipe', aliases: [], help: (msg) => ougi.snipeHelp(msg, false) },
        { name: 'editsnipe', aliases: [], help: (msg) => ougi.snipeHelp(msg, true) },
        { name: 'image', aliases: [], help: (msg) => ougi.imageHelp(msg) },
        { name: 'dice', aliases: [], help: (msg) => ougi.diceHelp(msg) },
        { name: 'music', aliases: ['play', 'p'], help: (msg) => ougi.musicHelp(msg) },
        { name: 'skip', aliases: [], help: (msg) => ougi.skipHelp(msg) },
        { name: 'stop', aliases: [], help: (msg) => ougi.stopHelp(msg) },
        { name: 'curl', aliases: [], help: (msg) => ougi.curlHelp(msg) },
        { name: 'lyrics', aliases: [], help: (msg) => ougi.lyricsHelp(msg) },
        { name: 'language', aliases: [], help: (msg) => ougi.languageHelp(msg) },
        { name: 'guildlanguage', aliases: [], help: (msg) => ougi.languageHelp(msg, 1) },
        { name: 'survey', aliases: [], help: (msg) => ougi.surveyHelp(msg, 1) },
        { name: 'embed', aliases: [], help: (msg, args) => ougi.embedHelp(args, msg) },
        { name: 'recipe', aliases: [], help: (msg) => ougi.recipeHelp(msg) },
        { name: 'stats', aliases: [], help: (msg) => ougi.statsCommand(msg) },
        { name: 'learn', aliases: [], help: (msg) => ougi.learnHelp(msg) },
        { name: 'tweet', aliases: [], help: (msg) => ougi.tweetHelp(msg) },
        { name: 'forget', aliases: [], help: (msg) => ougi.forgetHelp(msg) },
        { name: 'translate', aliases: [], help: (msg) => ougi.translateHelp(msg) },
        { name: 'emoji-list', aliases: [], help: (msg) => ougi.emojiListHelp(msg) },
        { name: 'emoji', aliases: [], help: (msg) => ougi.emojiHelp(msg) },
        { name: 'blacklist', aliases: [], help: (msg) => ougi.removeHelp(msg) },
        { name: 'news', aliases: [], help: (msg) => ougi.newsHelp(msg) },
        { name: 'react', aliases: [], help: (msg) => ougi.reactHelp(msg) },
        { name: 'reminder', aliases: [], help: (msg) => ougi.reminderHelp(msg) },
        { name: 'raffle-execute', aliases: [], help: (msg) => ougi.raffleExecuteHelp(msg) },
        { name: 'allow', aliases: [], help: (msg) => ougi.allowHelp(msg) },
        { name: 'setlog', aliases: [], help: (msg) => ougi.setlogHelp(msg) },
        { name: 'setnews', aliases: [], help: (msg) => ougi.setnewsHelp(msg) },
        { name: 'newspaper', aliases: [], help: (msg) => ougi.newspaperHelp(msg) },
        { name: 'subscribe', aliases: [], help: (msg) => ougi.subscribeHelp(msg) },
        { name: 'unsubscribe', aliases: [], help: (msg) => ougi.unsubscribeHelp(msg) },
        { name: 'prefix', aliases: [], help: (msg) => ougi.prefixHelp(msg) },
        { name: 'acknowledgement', aliases: [], help: (msg) => ougi.tos(msg) },
        { name: 'info', aliases: [], help: (msg) => ougi.whoIsMe(msg) },
        { name: 'remindbump', aliases: [], help: (msg) => ougi.remindbumpHelp(msg) },
        { name: 'speak', aliases: [], help: (msg) => ougi.speakHelp(msg) },
        { name: 'patreon', aliases: [], help: (msg) => ougi.patreonCommand(msg) },
        { name: 'shortcut', aliases: [], help: (msg) => ougi.shortcutHelp(msg) },
        { name: 'raffle-join', aliases: [], help: (msg) => ougi.raffleJoinHelp(msg) },
        { name: 'raffle-register', aliases: [], help: (msg) => ougi.raffleRegisterHelp(msg) },
        { name: 'raffle', aliases: [], help: (msg) => ougi.raffleHelp(msg) },
        { name: 'calc', aliases: [], help: (msg) => ougi.calcHelp(msg) },
        { name: 'storytell', aliases: [], help: (msg) => ougi.storytellHelp(msg) },
        { name: 'balance', aliases: ['bal'], help: (msg) => ougi.balanceHelp(msg) },
        { name: 'work', aliases: [], help: (msg) => ougi.workHelp(msg) },
        { name: 'daily', aliases: [], help: (msg) => ougi.dailyHelp(msg) },
        { name: 'pay', aliases: [], help: (msg) => ougi.payHelp(msg) },
        { name: 'leaderboard', aliases: [], help: (msg) => ougi.leaderboardHelp(msg) },
        { name: 'coinflip', aliases: [], help: (msg) => ougi.coinflipHelp(msg) },
        { name: 'slots', aliases: [], help: (msg) => ougi.slotsHelp(msg) },
        { name: 'gamble', aliases: [], help: (msg) => ougi.gambleHelp(msg) },
        { name: 'economy', aliases: [], help: (msg) => ougi.economyHelp(msg) },
        { name: 'xp-channel', aliases: [], help: (msg) => ougi.xpChannelHelp(msg) },
        { name: 'seticon', aliases: [], help: (msg) => ougi.seticonHelp(msg) },
        { name: 'admin-register', aliases: [], help: (msg) => ougi.adminRegisterHelp(msg) },
        { name: 'minesweeper', aliases: [], help: (msg) => ougi.minesweeperHelp(msg) },
        { name: 'results', aliases: [], help: (msg) => ougi.resultsHelp(msg) }
    ],

    getNames() {
        return this.registry.map(cmd => cmd.name);
    },

    getHelpMap(args, msg) {
        const map = {};
        for (const cmd of this.registry) {
            map[cmd.name] = () => cmd.help(msg, args);
            for (const alias of cmd.aliases) {
                map[alias] = () => cmd.help(msg, args);
            }
        }
        return map;
    },

    async executeHelp(commandName, args, msg) {
        const helpMap = this.getHelpMap(args, msg);
        const cmd = commandName?.toLowerCase();
        if (cmd && helpMap[cmd]) {
            await helpMap[cmd]();
            return true;
        }
        await ougi.helpEmbed(msg);
        return false;
    }
};
