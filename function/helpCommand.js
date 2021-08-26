module.exports =

function (arguments, msg) {
    switch (arguments[0]) {
      case 'say':
        ougi.sayHelp(msg)
      break;
      case 'answer':
        ougi.answerHelp(msg)
      break;
      case 'snipe':
        ougi.snipeHelp(msg, false)
      break;
      case 'editsnipe':
        ougi.snipeHelp(msg, true)
      break;
      case 'image':
        ougi.imageHelp(msg)
      break;
      case 'dice':
        ougi.diceHelp(msg)
      break;
      case 'music':
        ougi.musicHelp(msg)
      break;
      case 'skip':
        ougi.skipHelp(msg)
      break;
      case 'curl':
        ougi.curlHelp(msg)
      break;
      case 'lyrics':
        ougi.lyricsHelp(msg)
      break;
      case 'language':
        ougi.languageHelp(msg)
      break;
      case 'guildlanguage':
        ougi.languageHelp(msg, 1)
      break;
      case 'survey':
        ougi.surveyHelp(msg, 1)
      break;
      case 'embed':
        ougi.embedHelp(arguments, msg)
      break;
      case 'recipe':
        ougi.recipeHelp(msg)
      break;
      case 'stats':
        ougi.statsCommand(msg)
      break;
      case 'learn':
        ougi.learnHelp(msg)
      break;
      case 'tweet':
        ougi.tweetHelp(msg)
      break;
      case 'forget':
        ougi.forgetHelp(msg)
      break;
      case 'translate':
        ougi.translateHelp(msg)
      break;
      case 'emoji-list':
        ougi.emojiListHelp(msg)
      break;
      case 'emoji':
        ougi.emojiHelp(msg)
      break;
      case 'blacklist':
        ougi.removeHelp(msg)
      break;
      case 'news':
        ougi.newsHelp(msg)
      break;
      case 'covidstats':
        ougi.covidstatsHelp(msg)
      break;
      case 'healthcare':
        ougi.healthcareHelp(msg)
      break;
      case 'md':
        ougi.medicalDefinitionHelp(msg)
      break;
      case 'allow':
        ougi.allowHelp(msg)
      break;
      case 'setlog':
        ougi.setlogHelp(msg)
      break;
      case 'setnews':
        ougi.setnewsHelp(msg)
      break;
      case 'newspaper':
        ougi.newspaperHelp(msg)
      break;
      case 'subscribe':
        ougi.subscribeHelp(msg)
      break;
      case 'unsubscribe':
        ougi.unsubscribeHelp(msg)
      break;
      case 'prefix':
        ougi.prefixHelp(msg)
      break;
      case 'acknowledgement':
        ougi.tos(msg)
      break;
      case 'info':
        ougi.whoIsMe(msg)
      break;
      case 'speak':
        ougi.speakHelp(msg)
      break;
      default:
        ougi.helpEmbed(msg)
      break;
    }
}
