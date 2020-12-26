module.exports =

async function (arguments, msg) {
    if (arguments == 'list' || arguments.length <= 0) {
        ougi.helpEmbed(msg)
    } else if (arguments == 'multiply') {
        msg.channel.send("I'll gladly multiply the numbers you provide me as long you input more than two values, and only if you promise me to study math.\n> ougi multiply [value] [value] ...").then().catch(console.error);
    } else if (arguments == 'add') {
        msg.channel.send("I'll do additions for you! Try\n> ougi add [value] [value] ...").then().catch(console.error);
    } else if (arguments == 'say') {
        ougi.sayHelp(msg)
    } else if (arguments == 'answer') {
        ougi.answerHelp(msg)
    } else if (arguments == 'snipe') {
        ougi.snipeHelp(msg)
    } else if (arguments == 'image') {
        ougi.imageHelp(msg)
    } else if (arguments == 'music') {
        ougi.musicHelp(msg)
    } else if (arguments == 'skip') {
        ougi.skipHelp(msg)
    } else if (arguments == 'lyrics') {
        ougi.lyricsHelp(msg)
    } else if (arguments[0] == 'embed') {
        ougi.embedHelp(arguments, msg)
    } else if (arguments == 'learn') {
        ougi.learnHelp(msg)
    } else if (arguments == 'tweet') {
        ougi.tweetHelp(msg)
    } else if (arguments == 'forget') {
        ougi.forgetHelp(msg)
    } else if (arguments == 'translate') {
        ougi.translateHelp(msg)
    } else if (arguments == 'emoji-list') {
        ougi.emojiListHelp(msg)
    } else if (arguments == 'emoji') {
        ougi.emojiHelp(msg)
    } else if (arguments == 'blacklist') {
        ougi.removeHelp(msg)
    } else if (arguments == 'allow') {
        ougi.allowHelp(msg)
    } else if (arguments == 'setlog') {
        ougi.setlogHelp(msg)
    } else if (arguments == 'setnews') {
        ougi.setnewsHelp(msg)
    } else if (arguments == 'newspaper') {
        ougi.newspaperHelp(msg)
    } else if (arguments == 'subscribe') {
        ougi.subscribeHelp(msg)
    } else if (arguments == 'unsubscribe') {
        ougi.unsubscribeHelp(msg)
    } else if (arguments == 'prefix') {
        ougi.prefixHelp(msg)
    } else if (arguments == 'acknowledgement') {
        ougi.tos(msg)
    } else if (arguments == 'info') {
        ougi.whoIsMe(arguments, msg)
    } else {
        var options = ["Be specific, please. Try asking me for help and a topic. A good start would be\n> ougi help", "Do you need help? Try\n> ougi help", "Is there anything I could help you with?\n> ougi help"];
        var response = options[Math.floor(Math.random()*options.length)];
        msg.channel.send(response).then().catch(console.error);
    }
}
