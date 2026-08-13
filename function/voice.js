module.exports = async function (msg) {
  const { 
    joinVoiceChannel, 
    createAudioPlayer, 
    createAudioResource, 
    AudioPlayerStatus, 
    getVoiceConnection, 
    entersState, 
    VoiceConnectionStatus 
  } = Voice;

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
  if (args.length > 0 && args[0].startsWith("::")) {
    const code = args[0].replace(/^::/, "").toLowerCase();
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
    let connection = getVoiceConnection(msg.guildId);

    if (!connection || connection.state.status === VoiceConnectionStatus.Destroyed) {
      connection = joinVoiceChannel({
        channelId: memberVC.id,
        guildId: memberVC.guildId,
        adapterCreator: memberVC.guild.voiceAdapterCreator,
        selfDeaf: true,
      });
    } else if (connection.joinConfig.channelId !== memberVC.id) {
      connection = joinVoiceChannel({
        channelId: memberVC.id,
        guildId: memberVC.guildId,
        adapterCreator: memberVC.guild.voiceAdapterCreator,
        selfDeaf: true,
      });
    }

    if (connection.state.status !== VoiceConnectionStatus.Ready) {
      await entersState(connection, VoiceConnectionStatus.Ready, 5_000).catch(() => {});
    }

    const ttsUrls = googleTTS.getAllAudioUrls(textToSpeak, {
      lang: langCode,
      slow: false,
      host: 'https://translate.google.com',
      splitPunct: ',.?'
    });

    if (!ttsUrls || !ttsUrls.length) {
      return msg.channel.send("Failed to generate TTS audio.");
    }

    const player = createAudioPlayer();
    player.on('error', () => {});
    connection.subscribe(player);

    for (const chunk of ttsUrls) {
      const resource = createAudioResource(chunk.url);
      player.play(resource);

      await new Promise((resolve) => {
        const onIdle = () => {
          player.off(AudioPlayerStatus.Idle, onIdle);
          player.off('error', onError);
          resolve();
        };
        const onError = () => {
          player.off(AudioPlayerStatus.Idle, onIdle);
          player.off('error', onError);
          resolve();
        };
        player.on(AudioPlayerStatus.Idle, onIdle);
        player.on('error', onError);
      });
    }

    msg.react('🔊').catch(() => {});
  } catch (err) {
    console.error("Error in TTS voice.js:", err);
    msg.channel.send("Failed to generate TTS audio.").catch(console.error);
  }
};