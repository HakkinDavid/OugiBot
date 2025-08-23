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
        covidstats: () => ougi.covidstatsHelp(msg),
        healthcare: () => ougi.healthcareHelp(msg),
        md: () => ougi.medicalDefinitionHelp(msg),
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
        speak: () => ougi.speakHelp(msg)
    };

    const command = args[0]?.toLowerCase();
    if (command && helpMap[command]) {
        await helpMap[command]();
    } else {
        await ougi.helpEmbed(msg);
    }
};
