const YouTube = require('youtube-sr').default;
const youtubedl = require('youtube-dl-exec');

module.exports = async function (msg) {
    const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, getVoiceConnection, entersState, VoiceConnectionStatus } = Voice;

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

        const permissions = vcChannel.permissionsFor(msg.client.user);
        if (permissions && (!permissions.has('Connect') || !permissions.has('Speak'))) {
            await msg.channel.send("I need permissions to connect and speak in your voice channel.");
            return;
        }

        const cleanedContent = msg.content.replace(/\s+/g, ' ').trim();
        const tokens = cleanedContent.split(" ");
        const command = tokens[1]?.toLowerCase();
        const subCommand = tokens[2]?.toLowerCase();

        if (!global.vc) global.vc = {};
        if (!vc[msg.guildId]) {
            vc[msg.guildId] = { queue: [], player: null, connection: null };
        }

        // Command: stop
        if (command === "stop" || (command === "music" && subCommand === "stop")) {
            const connection = getVoiceConnection(msg.guildId);
            if (connection && connection.state.status !== VoiceConnectionStatus.Destroyed) {
                connection.destroy();
            }
            delete vc[msg.guildId];
            await msg.channel.send(await ougi.text(msg, "musicStopped"));
            return;
        }

        // Command: skip
        if (command === "skip" || (command === "music" && subCommand === "skip")) {
            if (!vc[msg.guildId] || vc[msg.guildId].queue.length === 0) {
                await msg.channel.send(await ougi.text(msg, "musicNothingToSkip"));
                return;
            }
            vc[msg.guildId].player?.stop();
            await msg.channel.send(await ougi.text(msg, "musicSkipped"));
            return;
        }

        // Command: queue / list / playlist
        if (command === "queue" || (command === "music" && ["list", "queue", "playlist"].includes(subCommand))) {
            const guildQueue = vc[msg.guildId]?.queue || [];
            if (!guildQueue.length) {
                await msg.channel.send("The music queue is currently empty.");
                return;
            }

            const queueList = guildQueue.map((s, idx) => `${idx === 0 ? '**Now Playing:**' : `\`${idx}.\``} [${s.title}](${s.url}) (\`${s.duration}\`)`).slice(0, 10).join('\n');
            const queueEmbed = new Discord.EmbedBuilder()
                .setTitle("Ougi Music Queue")
                .setDescription(queueList)
                .setColor("#230347")
                .setFooter({ text: `Total songs in queue: ${guildQueue.length}`, iconURL: msg.client.user.avatarURL({ dynamic: true, size: 4096 }) });

            await msg.channel.send({ embeds: [queueEmbed] });
            return;
        }

        // Extract query args
        let queryArgs = tokens.slice(2);
        if (["play", "p"].includes(command)) {
            queryArgs = tokens.slice(2);
        } else if (command === "music" && ["play", "p"].includes(subCommand)) {
            queryArgs = tokens.slice(3);
        } else if (command === "music") {
            queryArgs = tokens.slice(2);
        }

        const query = queryArgs.join(" ").trim();
        if (!query) {
            await msg.channel.send(await ougi.text(msg, "keywordRequired"));
            return;
        }

        let songInfo;
        const isUrl = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)/i.test(query);

        if (isUrl) {
            try {
                const video = await YouTube.getVideo(query);
                songInfo = {
                    title: video.title,
                    url: video.url,
                    duration: video.durationFormatted || "Live",
                    thumbnail: video.thumbnail?.url || "https://github.com/HakkinDavid/OugiBot/blob/master/images/ougimusic.png?raw=true"
                };
            } catch {
                const searchResults = await YouTube.search(query, { limit: 1, type: 'video' });
                if (!searchResults || !searchResults.length) {
                    await msg.channel.send(await ougi.text(msg, "resultsZero"));
                    return;
                }
                const video = searchResults[0];
                songInfo = {
                    title: video.title,
                    url: video.url,
                    duration: video.durationFormatted || "Live",
                    thumbnail: video.thumbnail?.url || "https://github.com/HakkinDavid/OugiBot/blob/master/images/ougimusic.png?raw=true"
                };
            }
        } else {
            const searchResults = await YouTube.search(query, { limit: 1, type: 'video' });
            if (!searchResults || !searchResults.length) {
                await msg.channel.send(await ougi.text(msg, "resultsZero"));
                return;
            }
            const video = searchResults[0];
            songInfo = {
                title: video.title,
                url: video.url,
                duration: video.durationFormatted || "Live",
                thumbnail: video.thumbnail?.url || "https://github.com/HakkinDavid/OugiBot/blob/master/images/ougimusic.png?raw=true"
            };
        }

        vc[msg.guildId].queue.push(songInfo);

        const embed = new Discord.EmbedBuilder()
            .setTitle(await ougi.text(msg, "musicAdded"))
            .setDescription(`[${songInfo.title}](${songInfo.url})`)
            .setThumbnail(songInfo.thumbnail)
            .setColor("#230347")
            .addFields({ name: "Duration", value: `\`${songInfo.duration}\``, inline: true })
            .setFooter({ text: "musicEmbed by Ougi", iconURL: msg.client.user.avatarURL({ dynamic: true, size: 4096 }) });

        await msg.channel.send({ embeds: [embed] });

        if (vc[msg.guildId].queue.length === 1) {
            playNext(msg, vcChannel);
        }

    } catch (error) {
        console.error("Error in voiceCallMusic:", error);
        await msg.channel.send(await ougi.text(msg, "musicCommandError"));
    }
};

async function playNext(msg, vcChannel) {
    const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, getVoiceConnection, entersState, VoiceConnectionStatus } = Voice;
    const guildQueue = vc[msg.guildId];
    if (!guildQueue || guildQueue.queue.length === 0) {
        const connection = getVoiceConnection(msg.guildId);
        if (connection && connection.state.status !== VoiceConnectionStatus.Destroyed) {
            connection.destroy();
        }
        delete vc[msg.guildId];
        return;
    }

    const song = guildQueue.queue[0];

    try {
        const rawStreamUrl = (await youtubedl(song.url, { getUrl: true, format: 'bestaudio' })).trim();
        const resource = createAudioResource(rawStreamUrl);

        if (!guildQueue.player) {
            guildQueue.player = createAudioPlayer();

            guildQueue.player.on(AudioPlayerStatus.Idle, () => {
                guildQueue.queue.shift();
                playNext(msg, vcChannel);
            });

            guildQueue.player.on('error', (err) => {
                console.error("Audio player error in playNext:", err);
                msg.channel.send(`⚠️ Stream error playing **${song.title}**. Skipping...`).catch(() => {});
                guildQueue.queue.shift();
                playNext(msg, vcChannel);
            });
        }

        let connection = getVoiceConnection(msg.guildId);
        if (!connection || connection.state.status === VoiceConnectionStatus.Destroyed) {
            connection = joinVoiceChannel({
                channelId: vcChannel.id,
                guildId: vcChannel.guildId,
                adapterCreator: vcChannel.guild.voiceAdapterCreator,
                selfDeaf: true,
            });
        } else if (connection.joinConfig.channelId !== vcChannel.id) {
            connection = joinVoiceChannel({
                channelId: vcChannel.id,
                guildId: vcChannel.guildId,
                adapterCreator: vcChannel.guild.voiceAdapterCreator,
                selfDeaf: true,
            });
        }

        if (!connection._hasMusicDisconnectHandler) {
            connection._hasMusicDisconnectHandler = true;
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
            await entersState(connection, VoiceConnectionStatus.Ready, 15_000);
        }

        connection.subscribe(guildQueue.player);
        guildQueue.player.play(resource);

    } catch (err) {
        console.error("Stream error in playNext:", err);
        msg.channel.send(`⚠️ Unable to play **${song.title}** (stream unavailable or restricted). Skipping...`).catch(() => {});
        guildQueue.queue.shift();
        playNext(msg, vcChannel);
    }
}