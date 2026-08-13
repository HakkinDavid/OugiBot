const axios = require('axios');

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

    if (!connection._hasTtsDisconnectHandler) {
      connection._hasTtsDisconnectHandler = true;
      connection.on(VoiceConnectionStatus.Disconnected, async () => {
        try {
          await Promise.race([
            entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
            entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
          ]);
        } catch {
          if (connection.state.status !== VoiceConnectionStatus.Destroyed) {
            connection.destroy();
          }
        }
      });
    }

    if (connection.state.status !== VoiceConnectionStatus.Ready) {
      try {
        await entersState(connection, VoiceConnectionStatus.Ready, 15_000);
      } catch (err) {
        console.error("Failed to connect to voice channel within 15 seconds:", err);
        if (connection.state.status !== VoiceConnectionStatus.Destroyed) {
          connection.destroy();
        }
        return msg.channel.send("Could not connect to the voice channel in time.");
      }
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
    player.on('error', (error) => {
      console.error("TTS Audio Player Error:", error);
    });

    connection.subscribe(player);

    for (const chunk of ttsUrls) {
      try {
        const response = await axios.get(chunk.url, {
          responseType: 'stream',
          headers: {
            'User-Agent': 'stagefright/1.2 (Linux;Android 5.0)',
            'Referer': 'https://translate.google.com/'
          },
          timeout: 10000
        });

        const resource = createAudioResource(response.data);
        player.play(resource);

        await new Promise((resolve) => {
          const onIdle = () => {
            cleanup();
            resolve();
          };
          const onError = (err) => {
            console.error("TTS Stream Error:", err);
            cleanup();
            resolve();
          };
          function cleanup() {
            player.off(AudioPlayerStatus.Idle, onIdle);
            player.off('error', onError);
          }
          player.on(AudioPlayerStatus.Idle, onIdle);
          player.on('error', onError);
        });
      } catch (chunkError) {
        console.error("Error fetching or playing TTS chunk:", chunkError);
      }
    }

    msg.react('🔊').catch(() => {});
  } catch (err) {
    console.error("Error in TTS voice.js:", err);
    msg.channel.send("Failed to generate TTS audio.").catch(console.error);
  }
};