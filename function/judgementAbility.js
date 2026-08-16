module.exports =

async function (msg, replied_to_ougi) {
  while (msg.content.includes('  ')) {
    msg.content = msg.content.replace('  ', ' ')
  }
  while (msg.content.includes('\n\n')) {
    msg.content = msg.content.replace('\n\n', '\n')
  }
  while (msg.content.includes('\n')) {
    msg.content = msg.content.replace('\n', ' ')
  }
  try {
      const titleTemplate = await ougi.text('en', "log_judgementTitle");
      let embed = new Discord.EmbedBuilder()
      .setTitle(titleTemplate.replace(/{type}/g, msg.channel.type))
      .setAuthor({name: msg.author.username, icon: msg.author.avatarURL({dynamic: true, size: 4096})})
      .setColor("#FF008C")
      .setFooter({text: await ougi.text('en', "log_globalEmbedFooter"), icon: client.user.avatarURL({dynamic: true, size: 4096})});
    
      let stringsArray = ougi.db().getKBTriggers();
      let notSpookyDM = msg.content.toLowerCase();
      let usedLang;
      notSpookyDM = ougi.helperFunctions.stripPrefixMsg(msg);
      embed.addFields({name: await ougi.text('en', "log_contentField"), value: notSpookyDM.slice(0, 1024)});
      
      let prevSimilarity = stringSimilarity.findBestMatch(notSpookyDM, stringsArray).bestMatch.rating;
      if (prevSimilarity * 100 < 90) {
        let msgTranslation = await ougi.text('en', notSpookyDM, true, true);
        notSpookyDM = msgTranslation.value;
        usedLang = msgTranslation.fromCode || msg;
        embed.addFields({name: await ougi.text('en', "log_judgementTranslated"), value: notSpookyDM.slice(0, 1024)});
      }
    
      ougi.ideaCoreProcessor(notSpookyDM);
      ougi.sleep(500);
      let levenaryIdea = levenary(notSpookyDM, stringsArray);
      let myLevU = leven(notSpookyDM, levenaryIdea);
      const levFieldTemplate = await ougi.text('en', "log_judgementLevTrigger");
      embed.addFields({name: levFieldTemplate.replace(/{units}/g, myLevU), value: levenaryIdea})
      let judgeThis = stringSimilarity.findBestMatch(notSpookyDM, stringsArray);
      let minSimilarity = 0.33;
      let similarity = judgeThis.bestMatch.rating;
      let comparisonThreshold = 0.25;
      let diceString = judgeThis.bestMatch.target;
      const diceFieldTemplate = await ougi.text('en', "log_judgementDiceTrigger");
      embed.addFields({name: diceFieldTemplate.replace(/{similarity}/g, similarity*100), value: diceString});
      let compareLevDice = stringSimilarity.compareTwoStrings(levenaryIdea, diceString);
      let compareDiceLev = leven(levenaryIdea, diceString);
      const shareValTemplate = await ougi.text('en', "log_judgementLevDiceShareValue");
      embed.addFields({
        name: await ougi.text('en', "log_judgementLevDiceShare"),
        value: shareValTemplate.replace(/{units}/g, compareDiceLev).replace(/{similarity}/g, compareLevDice*100)
      });
      let tellLevAboutDice = leven(notSpookyDM, diceString);
      let thisString;
      if (compareLevDice > comparisonThreshold) {
        if (tellLevAboutDice >= notSpookyDM.length/2) {
          thisString = levenaryIdea;
        }
        else {
          thisString = diceString;
        }
      }
      else {
        thisString = diceString;
      }
      let finalSimilarity = stringSimilarity.compareTwoStrings(notSpookyDM, thisString);
      let finalLevU = leven(notSpookyDM, thisString);
      embed.addFields({name: await ougi.text('en', "log_judgementChosen"), value: thisString});
      const chosenDetailsValTemplate = await ougi.text('en', "log_judgementChosenDetailsValue");
      embed.addFields({
        name: await ougi.text('en', "log_judgementChosenDetails"),
        value: chosenDetailsValTemplate.replace(/{similarity}/g, finalSimilarity*100).replace(/{min}/g, minSimilarity*100).replace(/{units}/g, finalLevU)
      });
      if (finalSimilarity >= minSimilarity){
        let options = ougi.db().getKBReplies(thisString);
        let response = options[Math.floor(Math.random()*options.length)];
        if (msg.channel.type !== Discord.ChannelType.DM) {
          response = response
          .replace(/nigga|nigger/gi, "unwhiter")
          .replace(/cock|dick|penis/gi, "coke");
        }
        
        embed.addFields({name: await ougi.text('en', "log_judgementReply"), value: response});
        if (prevSimilarity * 100 < 90) {
          response = await ougi.text(usedLang, response, true);
          embed.addFields({name: await ougi.text('en', "log_judgementLocalized"), value: response});
        }
        
        if (replied_to_ougi) { msg.reply(response).catch(console.error); }
        else { msg.channel.send(response).catch(console.error); }
        client.channels.cache.get(consoleLogging).send({embeds: [embed]});
      }
      else {
        embed.addFields({
          name: await ougi.text('en', "log_judgementUnsatisfied"),
          value: await ougi.text('en', "log_judgementUnsatisfiedValue")
        });
        client.channels.cache.get(consoleLogging).send({embeds: [embed]});
        await ougi.checkBadWords(msg, replied_to_ougi);
      }
  }
  catch (e) {
    console.error(e);
    await ougi.checkBadWords(msg, replied_to_ougi);
  }
}
