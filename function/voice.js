module.exports = async function (msg) {
  if (!msg.guild) {
    return msg.channel.send(await ougi.text({ msg, stringID: "mustGuild" }));
  }

  let member = msg.member;
  if (!member && msg.guild && msg.author) {
    member = msg.guild.members?.cache?.get(msg.author.id) || await msg.guild.members?.fetch(msg.author.id).catch(() => null);
  }

  const memberVC = member?.voice?.channel;
  if (!memberVC) {
    return msg.channel.send(await ougi.text({ msg, stringID: "musicNoVC" }));
  }

  const permissions = memberVC.permissionsFor(msg.client?.user || client?.user);
  if (permissions && (!permissions.has('Connect') || !permissions.has('Speak'))) {
    return msg.channel.send(await ougi.text({ msg, stringID: "voice_needPermissions" }));
  }

  const cleanedContent = msg.content.replace(/\s+/g, ' ').trim();
  let args = cleanedContent.split(" ").slice(2);

  let langCode = (ougi.db().getLang(msg.author?.id)) ?? (ougi.db().getLang(msg.guildId)) ?? 'en';
  if (args.length > 0 && args[0].startsWith("::")) {
    const code = args[0].replace(/^::/, "").toLowerCase();
    if (ougi.langCodes && ougi.langCodes[code]) {
      langCode = code.replace(/mx/i, "es").replace(/default|auto/i, "en");
      args = args.slice(1);
    }
  }

  if (args.length > 0 && /^<?https?:\/\//i.test(args[0])) {
    return await ougi.speakUrl(msg, args, langCode, memberVC);
  }

  let textToSpeak = args.join(" ");

  if ((!textToSpeak || textToSpeak.trim().length === 0) && msg.reference) {
    try {
      const targetMsg = await msg.channel.messages.fetch(msg.reference.messageId);
      if (targetMsg?.content) {
        textToSpeak = targetMsg.content;
      }
    } catch (e) {}
  }

  textToSpeak = textToSpeak.replace(/[\+\*\?\^\$\(\)\[\]\{\}\|\\\&\/\@]/g, "").trim();
  if (!textToSpeak) {
    return msg.channel.send(await ougi.text({ msg, stringID: "voice_specifySentence" }));
  }

  try {
    const ttsUrls = googleTTS.getAllAudioUrls(textToSpeak, {
      lang: langCode,
      slow: false,
      host: 'https://translate.google.com',
      splitPunct: ',.?'
    });

    if (!ttsUrls || !ttsUrls.length) {
      return msg.channel.send(await ougi.text({ msg, stringID: "voice_ttsFail" }));
    }

    await ougi.voiceManager.playTts(msg, memberVC, ttsUrls);

  } catch (err) {
    console.error("Error in TTS voice.js:", err);
    msg.channel.send("Failed to generate TTS audio.").catch(console.error);
  }
};