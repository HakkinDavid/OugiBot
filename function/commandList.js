module.exports = {
    registry: [
        { name: 'help', aliases: [], help: (msg) => ougi.helpEmbed(msg), execute: (args, msg) => ougi.helpCommand(args, msg) },
        { name: 'calc', aliases: [], help: (msg) => ougi.calcHelp(msg), execute: (args, msg) => ougi.calculateCommand(args, msg) },
        { name: 'say', aliases: [], help: (msg) => ougi.sayHelp(msg), execute: (args, msg) => ougi.sayCommand(args, msg) },
        { name: 'dice', aliases: [], help: (msg) => ougi.diceHelp(msg), execute: (args, msg) => ougi.diceCommand(msg) },
        { name: 'answer', aliases: [], help: (msg) => ougi.answerHelp(msg), execute: (args, msg) => ougi.answerCommand(msg) },
        { name: 'image', aliases: [], help: (msg) => ougi.imageHelp(msg), execute: (args, msg) => ougi.imageCommand(args, msg) },
        { name: 'curl', aliases: [], help: (msg) => ougi.curlHelp(msg), execute: (args, msg) => ougi.curlCommand(msg) },
        { name: 'embed', aliases: [], help: (msg, args) => ougi.embedHelp(args, msg), execute: (args, msg) => ougi.spookyEmbed(msg) },
        { name: 'news', aliases: [], help: (msg) => ougi.newsHelp(msg), execute: (args, msg) => ougi.newsCommand(args, msg) },
        { name: 'work', aliases: [], help: (msg) => ougi.workHelp(msg), execute: (args, msg) => ougi.workCommand(msg) },
        { name: 'daily', aliases: [], help: (msg) => ougi.dailyHelp(msg), execute: (args, msg) => ougi.dailyCommand(args, msg) },
        { name: 'pay', aliases: [], help: (msg) => ougi.payHelp(msg), execute: (args, msg) => ougi.payCommand(args, msg) },
        { name: 'leaderboard', aliases: [], help: (msg) => ougi.leaderboardHelp(msg), execute: (args, msg) => ougi.leaderboardCommand(args, msg) },
        { name: 'slots', aliases: [], help: (msg) => ougi.slotsHelp(msg), execute: (args, msg) => ougi.gamblingCommands(args, msg, 'slots') },
        { name: 'coinflip', aliases: [], help: (msg) => ougi.coinflipHelp(msg), execute: (args, msg) => ougi.gamblingCommands(args, msg, 'coinflip') },
        { name: 'gamble', aliases: [], help: (msg) => ougi.gambleHelp(msg), execute: (args, msg) => ougi.gamblingCommands(args, msg, 'gamble') },
        { name: 'storytell', aliases: [], help: (msg) => ougi.storytellHelp(msg), execute: (args, msg) => ougi.storytellCommand(args, msg) },
        { name: 'balance', aliases: ['bal'], help: (msg) => ougi.balanceHelp(msg), execute: (args, msg) => ougi.balanceCheck(args, msg) },
        { name: 'stats', aliases: [], help: (msg) => ougi.statsCommand(msg), execute: (args, msg) => ougi.statsCommand(msg) },
        { name: 'tweet', aliases: [], help: (msg) => ougi.tweetHelp(msg), execute: (args, msg) => ougi.tweet(msg) },
        { name: 'minesweeper', aliases: [], help: (msg) => ougi.minesweeperHelp(msg), execute: (args, msg) => ougi.minesweeper(msg) },
        { name: 'newspaper', aliases: [], help: (msg) => ougi.newspaperHelp(msg), execute: (args, msg) => ougi.newspaper(args, msg) },
        { name: 'recipe', aliases: [], help: (msg) => ougi.recipeHelp(msg), execute: (args, msg) => ougi.recipeCommand(args, msg) },
        { name: 'react', aliases: [], help: (msg) => ougi.reactHelp(msg), execute: (args, msg) => ougi.reactCommand(args, msg) },
        { name: 'learn', aliases: [], help: (msg) => ougi.learnHelp(msg), execute: (args, msg) => ougi.talkLearn(args, msg) },
        { name: 'forget', aliases: [], help: (msg) => ougi.forgetHelp(msg), execute: (args, msg) => ougi.talkForget(args, msg) },
        { name: 'info', aliases: [], help: (msg) => ougi.whoIsMe(msg), execute: (args, msg) => ougi.whoIsMe(args, msg) },
        { name: 'acknowledgement', aliases: [], help: (msg) => ougi.tos(msg), execute: (args, msg) => ougi.tos(msg) },
        { name: 'translate', aliases: [], help: (msg) => ougi.translateHelp(msg), execute: (args, msg) => ougi.translateCommand(msg) },
        { name: 'emoji', aliases: [], help: (msg) => ougi.emojiHelp(msg), execute: (args, msg) => ougi.customEmoji(args, msg) },
        { name: 'emoji-list', aliases: [], help: (msg) => ougi.emojiListHelp(msg), execute: (args, msg) => ougi.emojiList(args, msg) },
        { name: 'snipe', aliases: [], help: (msg) => ougi.snipeHelp(msg, false), execute: (args, msg) => ougi.shootSniper(args, msg, false) },
        { name: 'editsnipe', aliases: [], help: (msg) => ougi.snipeHelp(msg, true), execute: (args, msg) => ougi.shootSniper(args, msg, true) },
        { name: 'speak', aliases: [], help: (msg) => ougi.speakHelp(msg), execute: (args, msg) => ougi.voice(msg) },
        { name: 'lyrics', aliases: [], help: (msg) => ougi.lyricsHelp(msg), execute: (args, msg) => ougi.lyrics(args, msg) },
        { name: 'reminder', aliases: [], help: (msg) => ougi.reminderHelp(msg), execute: (args, msg) => ougi.remindMe(msg) },
        { name: 'prefix', aliases: [], help: (msg) => ougi.prefixHelp(msg), execute: (args, msg) => ougi.prefix(args, msg) },
        { name: 'setlog', aliases: [], help: (msg) => ougi.setlogHelp(msg), execute: (args, msg) => ougi.setLog(args, msg) },
        { name: 'setnews', aliases: [], help: (msg) => ougi.setnewsHelp(msg), execute: (args, msg) => ougi.setNews(args, msg) },
        { name: 'blacklist', aliases: [], help: (msg) => ougi.removeHelp(msg), execute: (args, msg) => ougi.rm(args, msg) },
        { name: 'allow', aliases: [], help: (msg) => ougi.allowHelp(msg), execute: (args, msg) => ougi.allowCommand(args, msg) },
        { name: 'language', aliases: [], help: (msg) => ougi.languageHelp(msg), execute: (args, msg) => ougi.lang(args, msg, false) },
        { name: 'survey', aliases: [], help: (msg) => ougi.surveyHelp(msg, 1), execute: (args, msg) => ougi.feedback(msg, true) },
        { name: 'results', aliases: [], help: (msg) => ougi.resultsHelp(msg), execute: (args, msg) => ougi.results(msg) },
        { name: 'guildlanguage', aliases: [], help: (msg) => ougi.languageHelp(msg, 1), execute: (args, msg) => ougi.lang(args, msg, true) },
        { name: 'xp-channel', aliases: [], help: (msg) => ougi.xpChannelHelp(msg), execute: (args, msg) => ougi.manageEconomy('channel', msg, args) },
        { name: 'economy', aliases: [], help: (msg) => ougi.economyHelp(msg), execute: (args, msg) => ougi.manageEconomy('economy', msg, args) },
        { name: 'seticon', aliases: [], help: (msg) => ougi.seticonHelp(msg), execute: (args, msg) => ougi.economyIcons(args, msg) },
        { name: 'remindbump', aliases: [], help: (msg) => ougi.remindbumpHelp(msg), execute: (args, msg) => ougi.remindBump(args, msg) },
        { name: 'patreon', aliases: [], help: (msg) => ougi.patreonCommand(msg), execute: (args, msg) => ougi.patreonCommand(msg) },
        { name: 'shortcut', aliases: [], help: (msg) => ougi.shortcutHelp(msg), execute: (args, msg) => ougi.shortcutCommand(args, msg) },
        { name: 'music', aliases: ['play', 'p'], help: (msg) => ougi.musicHelp(msg) },
        { name: 'skip', aliases: [], help: (msg) => ougi.skipHelp(msg) },
        { name: 'stop', aliases: [], help: (msg) => ougi.stopHelp(msg) },
        { name: 'news', aliases: [], help: (msg) => ougi.newsHelp(msg) },
        { name: 'subscribe', aliases: [], help: (msg) => ougi.subscribeHelp(msg) },
        { name: 'unsubscribe', aliases: [], help: (msg) => ougi.unsubscribeHelp(msg) },
        { name: 'raffle', aliases: [], help: (msg) => ougi.raffleHelp(msg), execute: (args, msg) => ougi.raffleCommand(args, msg) },
        { name: 'raffle-register', aliases: [], help: (msg) => ougi.raffleRegisterHelp(msg), execute: (args, msg) => ougi.raffleRegister(args, msg) },
        { name: 'raffle-join', aliases: [], help: (msg) => ougi.raffleJoinHelp(msg), execute: (args, msg) => ougi.raffleJoin(args, msg) },
        {
            name: 'raffle-execute',
            aliases: [],
            help: (msg) => ougi.raffleExecuteHelp(msg),
            execute: async (args, msg) => {
                if (!(await ougi.guildCheck(msg))) return;
                if (!(await ougi.adminCheck(msg, true))) return;
                const guildRaffles = ougi.db().getGuildRaffles(msg.guildId);
                await ougi.raffleExecute(msg.guildId, guildRaffles?.ongoingRaffles?.findIndex(r => r.messageId == msg.reference?.messageId));
            }
        },
        { name: 'admin-register', aliases: [], help: (msg) => ougi.adminRegisterHelp(msg), execute: (args, msg) => ougi.adminRegister(args, msg) }
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

    getCommandMap(args, msg) {
        const map = {};
        for (const cmd of this.registry) {
            if (cmd.execute) {
                map[cmd.name] = () => cmd.execute(args, msg);
                for (const alias of cmd.aliases) {
                    map[alias] = () => cmd.execute(args, msg);
                }
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
