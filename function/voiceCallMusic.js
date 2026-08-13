module.exports = async function (msg) {
    const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, getVoiceConnection } = Voice;

    try {
        if (!msg.guild) {
            await msg.channel.send(await ougi.text(msg, "mustGuild"));
            return;
        }

        const vcChannel = msg.member?.voice?.channel;
        if (!vcChannel) {
            await msg.channel.send(await ougi.text(msg, "musicNoVC"));
            return;
        }

        const args = msg.content.trim().split(/\s+/).slice(2);
        const command = msg.content.trim().split(/\s+/)[1]?.toLowerCase();

        if (!vc[msg.guildId]) {
            vc[msg.guildId] = { queue: [], player: null, connection: null };
        }

        if (command === "stop") {
            const connection = getVoiceConnection(msg.guildId);
            if (connection) connection.destroy();
            delete vc[msg.guildId];
            await msg.channel.send(await ougi.text(msg, "musicStopped"));
            return;
        }

        if (command === "skip") {
            if (!vc[msg.guildId] || vc[msg.guildId].queue.length <= 1) {
                await msg.channel.send(await ougi.text(msg, "musicNothingToSkip"));
                return;
            }
            vc[msg.guildId].player?.stop();
            await msg.channel.send(await ougi.text(msg, "musicSkipped"));
            return;
        }

        if (!args.length) {
            await msg.channel.send(await ougi.text(msg, "keywordRequired"));
            return;
        }

        const query = args.join(" ");
        let ytInfo;

        if (play.yt_validate(query) === 'video') {
            const info = await play.video_info(query);
            ytInfo = info.video_details;
        } else {
            const search = await play.search(query, { limit: 1 });
            if (!search || !search.length) {
                await msg.channel.send(await ougi.text(msg, "resultsZero"));
                return;
            }
            ytInfo = search[0];
        }

        const song = {
            title: ytInfo.title,
            url: ytInfo.url,
            duration: ytInfo.durationRaw || `${ytInfo.durationInSec}s`,
            thumbnail: ytInfo.thumbnails?.[0]?.url || "https://github.com/HakkinDavid/OugiBot/blob/master/images/ougimusic.png?raw=true"
        };

        vc[msg.guildId].queue.push(song);

        const embed = new Discord.EmbedBuilder()
            .setTitle(await ougi.text(msg, "musicAdded"))
            .setDescription(`[${song.title}](${song.url})`)
            .setThumbnail(song.thumbnail)
            .setColor("#230347")
            .setFooter({ text: "musicEmbed by Ougi", iconURL: msg.client.user.avatarURL({ dynamic: true, size: 4096 }) });

        await msg.channel.send({ embeds: [embed] });

        if (vc[msg.guildId].queue.length === 1) {
            playNext(msg, vcChannel, play);
        }

    } catch (error) {
        console.error("Error in voiceCallMusic:", error);
        await msg.channel.send(await ougi.text(msg, "musicCommandError"));
    }
};

async function playNext(msg, vcChannel, play) {
    const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, getVoiceConnection } = Voice;
    const guildQueue = vc[msg.guildId];
    if (!guildQueue || guildQueue.queue.length === 0) {
        const connection = getVoiceConnection(msg.guildId);
        if (connection) connection.destroy();
        delete vc[msg.guildId];
        return;
    }

    const song = guildQueue.queue[0];

    try {
        const stream = await play.stream(song.url);
        const resource = createAudioResource(stream.stream, { inputType: stream.type });

        if (!guildQueue.player) {
            guildQueue.player = createAudioPlayer();
            guildQueue.player.on(AudioPlayerStatus.Idle, () => {
                guildQueue.queue.shift();
                playNext(msg, vcChannel, play);
            });
            guildQueue.player.on('error', (err) => {
                console.error("Audio player error:", err);
                guildQueue.queue.shift();
                playNext(msg, vcChannel, play);
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
    } catch (err) {
        console.error("Stream error in playNext:", err);
        msg.channel.send(`⚠️ Unable to play **${song.title}** (stream unavailable or restricted). Skipping...`).catch(() => {});
        guildQueue.queue.shift();
        playNext(msg, vcChannel, play);
    }
}