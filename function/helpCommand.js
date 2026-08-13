module.exports = async function (args, msg) {
    const helpMap = {
        say: () => ougi.sayHelp(msg),
        answer: () => ougi.answerHelp(msg),
        snipe: () => ougi.snipeHelp(msg, false),
        editsnipe: () => ougi.snipeHelp(msg, true),
        image: () => ougi.imageHelp(msg),
        dice: () => ougi.diceHelp(msg),
        music: () => ougi.musicHelp(msg),
        skip: () => ougi.skipHelp(msg),
        curl: () => ougi.curlHelp(msg),
        lyrics: () => ougi.lyricsHelp(msg),
        language: () => ougi.languageHelp(msg),
        guildlanguage: () => ougi.languageHelp(msg, 1),
        survey: () => ougi.surveyHelp(msg, 1),
        embed: () => ougi.embedHelp(args, msg),
        recipe: () => ougi.recipeHelp(msg),
        stats: () => ougi.statsCommand(msg),
        learn: () => ougi.learnHelp(msg),
        tweet: () => ougi.tweetHelp(msg),
        forget: () => ougi.forgetHelp(msg),
        translate: () => ougi.translateHelp(msg),
        'emoji-list': () => ougi.emojiListHelp(msg),
        emoji: () => ougi.emojiHelp(msg),
        blacklist: () => ougi.removeHelp(msg),
        news: () => ougi.newsHelp(msg),
        stop: () => ougi.stopHelp(msg),
        react: () => ougi.reactHelp(msg),
        reminder: () => ougi.reminderHelp(msg),
        "raffle-execute": () => ougi.raffleExecuteHelp(msg),
        allow: () => ougi.allowHelp(msg),
        setlog: () => ougi.setlogHelp(msg),
        setnews: () => ougi.setnewsHelp(msg),
        newspaper: () => ougi.newspaperHelp(msg),
        subscribe: () => ougi.subscribeHelp(msg),
        unsubscribe: () => ougi.unsubscribeHelp(msg),
        prefix: () => ougi.prefixHelp(msg),
        acknowledgement: () => ougi.tos(msg),
        info: () => ougi.whoIsMe(msg),
        remindbump: () => ougi.remindbumpHelp(msg),
        speak: () => ougi.speakHelp(msg),
        patreon: () => ougi.patreonCommand(msg),
        shortcut: () => ougi.shortcutHelp(msg),
        "raffle-join": () => ougi.raffleJoinHelp(msg),
        "raffle-register": () => ougi.raffleRegisterHelp(msg),
        raffle: () => ougi.raffleHelp(msg),
        calc: () => {}, // missing dedicated help embed.
        storytell: () => {}, // missing dedicated help embed.
        balance: () => {}, // missing dedicated help embed.
        bal: () => {}, // missing dedicated help embed.
        work: () => {}, // missing dedicated help embed.
        daily: () => {}, // missing dedicated help embed.
        pay: () => {}, // missing dedicated help embed.
        leaderboard: () => {}, // missing dedicated help embed.
        coinflip: () => {}, // missing dedicated help embed.
        slots: () => {}, // missing dedicated help embed.
        gamble: () => {}, // missing dedicated help embed.
        economy: () => {}, // missing dedicated help embed.
        'xp-channel': () => {}, // missing dedicated help embed.
        seticon: () => {}, // missing dedicated help embed.
        'admin-register': () => {}, // missing dedicated help embed.
        minesweeper: () => ougi.minesweeperHelp(msg),
        results: () => {} // missing dedicated help embed.

    };

    const command = args[0]?.toLowerCase();
    if (command && helpMap[command]) {
        await helpMap[command]();
    } else {
        await ougi.helpEmbed(msg);
    }
};
