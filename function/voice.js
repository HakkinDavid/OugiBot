module.exports = async function (msg) {
  if (!msg.guild) {
    return msg.channel.send(await ougi.text(msg, "mustGuild"));
  }

  const memberVC = msg.member?.voice?.channel;
  if (!memberVC) {
    return msg.channel.send(await ougi.text(msg, "musicNoVC"));
  }

  const permissions = memberVC.permissionsFor(msg.client.user);
  if (permissions && (!permissions.has('Connect') || !permissions.has('Speak'))) {
    return msg.channel.send("I need permissions to connect and speak in your voice channel.");
  }

  const cleanedContent = msg.content.replace(/\s+/g, ' ').trim();
  let args = cleanedContent.split(" ").slice(2);

  let langCode = (ougi.db().getLang(msg.guildId)) ?? 'en';
  if (args.length > 0 && args[0].startsWith("::")) {
    const code = args[0].replace(/^::/, "").toLowerCase();
    if (ougi.langCodes && ougi.langCodes[code]) {
      langCode = code.replace(/mx/i, "es").replace(/default|auto/i, "en");
      args = args.slice(1);
    }
  }

  let textToSpeak = args.join(" ").replace(/[\+\*\?\^\$\(\)\[\]\{\}\|\\\&\/\@]/g, "").trim();
  if (!textToSpeak) {
    return msg.channel.send("Please specify a sentence for me to read out loud.");
  }

  try {
    const ttsUrls = googleTTS.getAllAudioUrls(textToSpeak, {
      lang: langCode,
      slow: false,
      host: 'https://translate.google.com',
      splitPunct: ',.?'
    });

    if (!ttsUrls || !ttsUrls.length) {
      return msg.channel.send("Failed to generate TTS audio.");
    }

    await ougi.voiceManager.playTts(msg, memberVC, ttsUrls);

  } catch (err) {
    console.error("Error in TTS voice.js:", err);
    msg.channel.send("Failed to generate TTS audio.").catch(console.error);
  }
};