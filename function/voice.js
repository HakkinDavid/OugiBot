const googleTTS = require('google-tts-api');
const { 
  joinVoiceChannel, 
  createAudioPlayer, 
  createAudioResource, 
  AudioPlayerStatus, 
  getVoiceConnection, 
  entersState, 
  VoiceConnectionStatus 
} = require('@discordjs/voice');

module.exports = async function (msg) {
  if (!msg.guild) {
    return msg.channel.send(await ougi.text(msg, "mustGuild"));
  }

  const memberVC = msg.member?.voice?.channel;
  if (!memberVC) {
    return msg.channel.send(await ougi.text(msg, "musicNoVC"));
  }

  const cleanedContent = msg.content.replace(/\s+/g, ' ').trim();
  let args = cleanedContent.split(" ").slice(2);

  let langCode = (ougi.db().getLang(msg.guildId)) ?? 'en';
  if (args.length > 1 && args[0].startsWith("::")) {
    const code = args[0].replace(/::/, "").toLowerCase();
    if (ougi.langCodes[code]) {
      langCode = code.replace(/mx/i, "es").replace(/default|auto/i, "en");
      args = args.slice(1);
    }
  }

  let textToSpeak = args.join(" ").replace(/[\+\*\?\^\$\(\)\[\]\{\}\|\\\&\/\@]/g, "").trim();
  if (!textToSpeak) {
    return msg.channel.send("Please specify a sentence for me to read out loud.");
  }

  try {
    const url = googleTTS.getAudioUrl(textToSpeak.slice(0, 200), {
      lang: langCode,
      slow: false,
      host: 'https://translate.google.com',
      timeout: 10000,
    });

    const connection = getVoiceConnection(msg.guildId) || joinVoiceChannel({
      channelId: memberVC.id,
      guildId: memberVC.guildId,
      adapterCreator: memberVC.guild.voiceAdapterCreator,
    });

    await entersState(connection, VoiceConnectionStatus.Ready, 10_000);

    const player = createAudioPlayer();
    connection.subscribe(player);

    const resource = createAudioResource(url);
    player.play(resource);

    msg.react('🔊').catch(() => {});
  } catch (err) {
    console.error("Error in TTS voice.js:", err);
    msg.channel.send("Failed to generate TTS audio.").catch(console.error);
  }
};