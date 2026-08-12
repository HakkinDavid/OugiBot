module.exports = async function (msgOrInteraction) {
  const isInteraction = Boolean(msgOrInteraction?.isInteraction?.() || msgOrInteraction?.isMessageContextMenuCommand?.() || msgOrInteraction?.isStringSelectMenu?.());
  
  let targetMsg = null;
  let phrase = null;
  let toLang = null;
  let requester = null;
  let guildId = msgOrInteraction.guildId;
  let selectedLangFromMenu = null;

  if (isInteraction) {
    requester = msgOrInteraction.user;
    if (msgOrInteraction.isMessageContextMenuCommand()) {
      targetMsg = msgOrInteraction.targetMessage;
      phrase = targetMsg?.content;
    } else if (msgOrInteraction.isStringSelectMenu()) {
      const targetMsgId = msgOrInteraction.customId.split(':')[1];
      selectedLangFromMenu = msgOrInteraction.values[0];
      try {
        targetMsg = await msgOrInteraction.channel.messages.fetch(targetMsgId);
        phrase = targetMsg?.content;
      } catch (e) {
        phrase = null;
      }

      // Save user preference
      ougi.db().setLang(requester.id, selectedLangFromMenu);
    }

    if (!phrase || phrase.trim().length === 0) {
      const emptyError = "Could not find text to translate from that message.";
      if (msgOrInteraction.replied || msgOrInteraction.deferred) {
        await msgOrInteraction.followUp({ content: emptyError, flags: Discord.MessageFlags.Ephemeral }).catch(console.error);
      } else {
        await msgOrInteraction.reply({ content: emptyError, flags: Discord.MessageFlags.Ephemeral }).catch(console.error);
      }
      return;
    }

    toLang = selectedLangFromMenu ?? ougi.db().getLang(requester.id) ?? ougi.db().getLang(guildId);

    if (!toLang) {
      const popularCodes = ['en', 'es', 'fr', 'de', 'ja', 'zh-CN', 'zh-TW', 'pt', 'it', 'ru', 'ko', 'nl', 'tl', 'ar', 'vi', 'tr', 'hi', 'id', 'pl', 'sv', 'uk', 'th', 'he', 'el', 'cs'];
      const dynamicOptions = popularCodes
        .filter(code => ougi.langCodes[code] && code !== 'mx' && code !== 'default' && code !== 'auto')
        .map(code => ({ label: ougi.langCodes[code], value: code }));

      const selectMenu = new Discord.StringSelectMenuBuilder()
        .setCustomId(`ougi_translate_select_lang:${targetMsg.id}`)
        .setPlaceholder('Select your default target language...')
        .addOptions(dynamicOptions);

      const row = new Discord.ActionRowBuilder().addComponents(selectMenu);
      return msgOrInteraction.reply({
        content: 'Please select your target language for translation. Your selection will be saved as your personal default language setting (`ougi language`).',
        components: [row],
        flags: Discord.MessageFlags.Ephemeral
      }).catch(console.error);
    }
  } else {
    // Legacy Message or Reaction Shortcut
    const msg = msgOrInteraction;
    requester = msg.author;
    let spookyCake = msg.content;
    let spookySlices = spookyCake.replace("\n", " ").split(" ");
    let arguments = spookySlices.slice(2);

    if (arguments.length <= 1) {
      if (msg.reference) {
        try {
          targetMsg = await msg.channel.messages.fetch(msg.reference.messageId);
          toLang = (arguments?.[0] ?? ougi.db().getLang(msg.author.id) ?? ougi.db().getLang(msg.guildId) ?? "en");
          phrase = targetMsg.content;
        } catch { }
      } else {
        msg.channel.send("Please use a valid syntax for the translation. Refer to the following command if you are clueless.\n> ougi help translate").catch(console.error);
        return;
      }
    } else {
      toLang = arguments[0];
      phrase = arguments.slice(1).join(" ");
    }
  }

  if (!phrase || phrase.trim().length === 0) {
    const errorMsg = "There is no readable text in that message to translate.";
    if (isInteraction) {
      if (msgOrInteraction.replied || msgOrInteraction.deferred) {
        await msgOrInteraction.followUp({ content: errorMsg, flags: Discord.MessageFlags.Ephemeral }).catch(console.error);
      } else {
        await msgOrInteraction.reply({ content: errorMsg, flags: Discord.MessageFlags.Ephemeral }).catch(console.error);
      }
    } else {
      msgOrInteraction.channel.send(errorMsg).catch(console.error);
    }
    return;
  }

  toLang = toLang.toLowerCase().replace("-cn", "-CN").replace("-tw", "-TW");
  if (toLang === "chinese" || toLang === "chinese-s") {
    toLang = "zh-CN";
  } else if (toLang === "chinese-t") {
    toLang = "zh-TW";
  } else if (toLang.includes("mexican") || toLang.includes("mexico")) {
    toLang = "mx";
  }

  let niceLang = ougi.capitalize(toLang);
  let isLang = ougi.whereIs(ougi.langCodes, niceLang);
  let isCode = ougi.langCodes[toLang];
  if (isLang === undefined && isCode === undefined) {
    const invalidLangMsg = "Please provide a valid destination language for the translation. Refer to the following command if you are clueless.\n> ougi help translate";
    if (isInteraction) {
      if (msgOrInteraction.replied || msgOrInteraction.deferred) {
        await msgOrInteraction.followUp({ content: invalidLangMsg, flags: Discord.MessageFlags.Ephemeral }).catch(console.error);
      } else {
        await msgOrInteraction.reply({ content: invalidLangMsg, flags: Discord.MessageFlags.Ephemeral }).catch(console.error);
      }
    } else {
      msgOrInteraction.channel.send(invalidLangMsg).catch(console.error);
    }
    return;
  }

  if (isCode !== undefined && isLang === undefined) {
    niceLang = isCode;
  }
  let finalCode = ougi.whereIs(ougi.langCodes, niceLang);

  function splitIntoChunks(text, maxLength) {
    let chunks = [];
    for (let i = 0; i < text.length; i += maxLength) {
      chunks.push(text.substring(i, i + maxLength));
    }
    return chunks;
  }

  translate(phrase, { to: finalCode, client: 'gtx' }).then(async res => {
    const authorName = targetMsg?.author ? targetMsg.author.username : "Input";
    const authorPfp = targetMsg?.author ? targetMsg.author.displayAvatarURL({ dynamic: true, size: 4096 }) : "https://github.com/HakkinDavid/OugiBot/blob/master/images/ougitranslate.png?raw=true";
    const footerLogo = (msgOrInteraction.guild ? msgOrInteraction.guild.iconURL() : client.user.avatarURL({ dynamic: true, size: 4096 })) || client.user.avatarURL({ dynamic: true, size: 4096 });

    let embed = new Discord.EmbedBuilder()
      .setTitle("Ougi Translate")
      .setColor("#6254E7")
      .setAuthor({ name: "Ougi [BOT]", iconURL: client.user.avatarURL({ dynamic: true, size: 4096 }) })
      .setThumbnail(authorPfp);

    let inputChunks = splitIntoChunks(phrase, 1024);
    inputChunks.forEach((chunk, index) => {
      embed.addFields({
        name: `${authorName} said in ${ougi.langCodes[res.from.language.iso] || res.from.language.iso}` + (inputChunks.length > 1 ? ` (part ${index + 1})` : ""),
        value: chunk
      });
    });

    let outputChunks = splitIntoChunks(res.text, 1024);
    outputChunks.forEach((chunk, index) => {
      embed.addFields({
        name: `Translation to ${niceLang}` + (outputChunks.length > 1 ? ` (part ${index + 1})` : ""),
        value: chunk
      });
    });

    embed.setFooter({
      text: `Translated by Ougi for ${requester.username}`,
      iconURL: footerLogo
    });

    if (isInteraction) {
      if (msgOrInteraction.isStringSelectMenu()) {
        await msgOrInteraction.update({ content: null, embeds: [embed], components: [], flags: Discord.MessageFlags.Ephemeral }).catch(async () => {
          await msgOrInteraction.followUp({ embeds: [embed], flags: Discord.MessageFlags.Ephemeral }).catch(console.error);
        });
      } else if (msgOrInteraction.replied || msgOrInteraction.deferred) {
        await msgOrInteraction.followUp({ embeds: [embed], flags: Discord.MessageFlags.Ephemeral }).catch(console.error);
      } else {
        await msgOrInteraction.reply({ embeds: [embed], flags: Discord.MessageFlags.Ephemeral }).catch(console.error);
      }
    } else if (msgOrInteraction.isReactionShortcut) {
      // Reaction Shortcut -> Send Direct Message
      await requester.send({ embeds: [embed] }).catch(err => {
        console.error("Could not send DM translation to user:", err);
      });
    } else {
      // Standard Text Command -> Public Message
      await msgOrInteraction.channel.send({ embeds: [embed] }).catch(console.error);
    }
  }).catch(err => {
    console.error("Translation Error:", err);
    const errorMsg = "An error occurred while processing the translation.";
    if (isInteraction) {
      if (msgOrInteraction.replied || msgOrInteraction.deferred) {
        msgOrInteraction.followUp({ content: errorMsg, flags: Discord.MessageFlags.Ephemeral }).catch(console.error);
      } else {
        msgOrInteraction.reply({ content: errorMsg, flags: Discord.MessageFlags.Ephemeral }).catch(console.error);
      }
    } else {
      msgOrInteraction.channel.send(errorMsg).catch(console.error);
    }
  });
};
