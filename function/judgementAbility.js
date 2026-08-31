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
      let embed = new Discord.EmbedBuilder()
      .setTitle(await ougi.text({ lang: 'en', stringID: "log_judgementTitle", values: { type: msg.channel.type } }))
      .setAuthor({name: msg.author.username, icon: msg.author.avatarURL({dynamic: true, size: 4096})})
      .setColor("#FF008C")
      .setFooter({text: await ougi.text({ lang: 'en', stringID: "log_globalEmbedFooter" }), icon: client.user.avatarURL({dynamic: true, size: 4096})});
    
      let stringsArray = ougi.db().getKBTriggers();
      let notSpookyDM = msg.content.toLowerCase();
      let usedLang;
      notSpookyDM = replied_to_ougi ? notSpookyDM : ougi.helperFunctions.stripPrefixMsg(msg);
      embed.addFields({name: await ougi.text({ lang: 'en', stringID: "log_contentField" }), value: notSpookyDM.slice(0, 1024)});
      
      let prevSimilarity = stringSimilarity.findBestMatch(notSpookyDM, stringsArray).bestMatch.rating;
      if (prevSimilarity * 100 < 90) {
        let msgTranslation = await ougi.text({ lang: 'en', stringID: notSpookyDM, dynamic: true, raw: true });
        notSpookyDM = msgTranslation.value;
        usedLang = msgTranslation.fromCode || msg;
        embed.addFields({name: await ougi.text({ lang: 'en', stringID: "log_judgementTranslated" }), value: notSpookyDM.slice(0, 1024)});
      }
    
      ougi.ideaCoreProcessor(notSpookyDM);
      ougi.sleep(500);
      let levenaryIdea = levenary(notSpookyDM, stringsArray);
      let myLevU = leven(notSpookyDM, levenaryIdea);
      embed.addFields({name: await ougi.text({ lang: 'en', stringID: "log_judgementLevTrigger", values: { units: myLevU } }), value: levenaryIdea})
      let judgeThis = stringSimilarity.findBestMatch(notSpookyDM, stringsArray);
      let minSimilarity = 0.33;
      let similarity = judgeThis.bestMatch.rating;
      let comparisonThreshold = 0.25;
      let diceString = judgeThis.bestMatch.target;
      embed.addFields({name: await ougi.text({ lang: 'en', stringID: "log_judgementDiceTrigger", values: { similarity: similarity*100 } }), value: diceString});
      let compareLevDice = stringSimilarity.compareTwoStrings(levenaryIdea, diceString);
      let compareDiceLev = leven(levenaryIdea, diceString);
      embed.addFields({
        name: await ougi.text({ lang: 'en', stringID: "log_judgementLevDiceShare" }),
        value: await ougi.text({ lang: 'en', stringID: "log_judgementLevDiceShareValue", values: { units: compareDiceLev, similarity: compareLevDice*100 } })
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
      embed.addFields({name: await ougi.text({ lang: 'en', stringID: "log_judgementChosen" }), value: thisString});
      embed.addFields({
        name: await ougi.text({ lang: 'en', stringID: "log_judgementChosenDetails" }),
        value: await ougi.text({
          lang: 'en',
          stringID: "log_judgementChosenDetailsValue",
          values: {
            similarity: finalSimilarity*100,
            min: minSimilarity*100,
            units: finalLevU
          }
        })
      });
      if (finalSimilarity >= minSimilarity){
        let options = ougi.db().getKBReplies(thisString);
        let response = options[Math.floor(Math.random()*options.length)];
        if (msg.channel.type !== Discord.ChannelType.DM) {
          response = response
          .replace(/nigga|nigger/gi, "unwhiter")
          .replace(/cock|dick|penis/gi, "coke");
        }
        
        embed.addFields({name: await ougi.text({ lang: 'en', stringID: "log_judgementReply" }), value: response});
        if (prevSimilarity * 100 < 90) {
          response = await ougi.text({ lang: usedLang, stringID: response, dynamic: true });
          embed.addFields({name: await ougi.text({ lang: 'en', stringID: "log_judgementLocalized" }), value: response});
        }
        
        if (replied_to_ougi) { msg.reply(response).catch(console.error); }
        else { msg.channel.send(response).catch(console.error); }
        client.channels.cache.get(consoleLogging).send({embeds: [embed]});
      }
      else {
        embed.addFields({
          name: await ougi.text({ lang: 'en', stringID: "log_judgementUnsatisfied" }),
          value: await ougi.text({ lang: 'en', stringID: "log_judgementUnsatisfiedValue" })
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
