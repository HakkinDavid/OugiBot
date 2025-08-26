const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, getVoiceConnection } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const { EmbedBuilder } = require('discord.js');

module.exports = async function(msg) {
  try {
    if (!msg.guild) {
      await msg.channel.send(await ougi.text(msg, "mustGuild"));
      return;
    }

    const args = msg.content.trim().split(/\s+/).slice(2);
    if (!args.length) {
      await msg.channel.send(await ougi.text(msg, "keywordRequired"));
      return;
    }

    const vcChannel = msg.member.voice.channel;
    if (!vcChannel) {
      await msg.channel.send(await ougi.text(msg, "musicNoVC"));
      return;
    }

    // Inicializa cola si no existe
    if (!vc[msg.guildId]) vc[msg.guildId] = { queue: [], loop: false, player: null };

    const command = args[0].toLowerCase();

    if (command === "stop") {
      const connection = getVoiceConnection(msg.guildId);
      if (connection) connection.destroy();
      delete vc[msg.guildId];
      await msg.channel.send(await ougi.text(msg, "musicStopped"));
      return;
    }

    if (command === "skip") {
      if (vc[msg.guildId].queue.length <= 1) {
        await msg.channel.send(await ougi.text(msg, "musicNothingToSkip"));
        return;
      }
      vc[msg.guildId].queue.shift(); // quita la actual
      playNext(msg, vcChannel);
      await msg.channel.send(await ougi.text(msg, "musicSkipped"));
      return;
    }

    // Agregar canción a la cola
    const url = args[0].startsWith("http") ? args[0] : null;
    let info;

    if (url && ytdl.validateURL(url)) {
      info = await ytdl.getInfo(url);
    } else {
      await msg.channel.send(await ougi.text(msg, "musicInvalidURL"));
      return;
    }

    vc[msg.guildId].queue.push(info.videoDetails);

    const embed = new EmbedBuilder()
      .setTitle(await ougi.text(msg, "musicAdded"))
      .setDescription(`[${info.videoDetails.title}](${info.videoDetails.video_url})`)
      .setThumbnail(info.videoDetails.thumbnails[0].url)
      .setColor("#230347")
      .setFooter({ text: "musicEmbed by Ougi", iconURL: msg.client.user.avatarURL({ dynamic: true, size: 4096 }) });

    await msg.channel.send({ embeds: [embed] });

    if (vc[msg.guildId].queue.length === 1) {
      playNext(msg, vcChannel);
    }

  } catch (error) {
    console.error("Error en voiceCallMusic:", error);
    await msg.channel.send(await ougi.text(msg, "musicCommandError"));
  }
};

// Función auxiliar para reproducir
async function playNext(msg, vcChannel) {
  const guildQueue = vc[msg.guildId];
  if (!guildQueue || guildQueue.queue.length === 0) return;

  const song = guildQueue.queue[0];
  const stream = ytdl(song.video_url, { filter: 'audioonly', quality: 'highestaudio' });
  const resource = createAudioResource(stream);

  if (!guildQueue.player) {
    guildQueue.player = createAudioPlayer();
    guildQueue.player.on(AudioPlayerStatus.Idle, () => {
      guildQueue.queue.shift();
      playNext(msg, vcChannel);
    });
  }

  const connection = getVoiceConnection(msg.guildId) ||
    joinVoiceChannel({
      channelId: vcChannel.id,
      guildId: vcChannel.guildId,
      adapterCreator: vcChannel.guild.voiceAdapterCreator,
    });

  connection.subscribe(guildQueue.player);
  guildQueue.player.play(resource);
}