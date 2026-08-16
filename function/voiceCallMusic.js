module.exports = async function (msg) {
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
            await msg.channel.send(await ougi.text(msg, "voice_needPermissions"));
            return;
        }

        const cleanedContent = msg.content.replace(/\s+/g, ' ').trim();
        const tokens = cleanedContent.split(" ");
        const command = tokens[1]?.toLowerCase();
        const subCommand = tokens[2]?.toLowerCase();

        if (!global.vc) global.vc = {};
        if (!vc[msg.guildId]) {
            vc[msg.guildId] = {
                queue: [],
                player: null,
                connection: null,
                mixer: null,
                encoder: null,
                musicProc: null,
                currentTtsProc: null,
                isTtsPlaying: false,
                disconnectTimer: null
            };
        }

        // Command: stop
        if (command === "stop" || (command === "music" && subCommand === "stop")) {
            const { getVoiceConnection, VoiceConnectionStatus } = Voice;
            const connection = getVoiceConnection(msg.guildId);
            if (connection && connection.state.status !== VoiceConnectionStatus.Destroyed) {
                connection.destroy();
            }
            ougi.voiceManager.stop(msg.guildId);
            await msg.channel.send(await ougi.text(msg, "musicStopped"));
            return;
        }

        // Command: skip
        if (command === "skip" || (command === "music" && subCommand === "skip")) {
            if (!vc[msg.guildId] || vc[msg.guildId].queue.length === 0) {
                await msg.channel.send(await ougi.text(msg, "musicNothingToSkip"));
                return;
            }
            ougi.voiceManager.skipMusic(msg.guildId, msg, vcChannel);
            await msg.channel.send(await ougi.text(msg, "musicSkipped"));
            return;
        }

        // Command: loop
        if (command === "loop" || (command === "music" && subCommand === "loop")) {
            if (!vc[msg.guildId] || !vc[msg.guildId].queue || vc[msg.guildId].queue.length === 0) {
                await msg.channel.send(await ougi.text(msg, "music_noQueueToLoop"));
                return;
            }
            vc[msg.guildId].isLooping = true;
            const embed = new Discord.EmbedBuilder()
                .setTitle(await ougi.text(msg, "music_loopEnabledTitle"))
                .setDescription(await ougi.text(msg, "music_loopEnabledDesc"))
                .setColor("#230347")
                .setFooter({ text: await ougi.text(msg, "music_loopFooter"), iconURL: msg.client.user.avatarURL({ dynamic: true, size: 4096 }) });
            await msg.channel.send({ embeds: [embed] });
            return;
        }

        // Command: unloop
        if (command === "unloop" || (command === "music" && subCommand === "unloop")) {
            if (!vc[msg.guildId]) {
                await msg.channel.send(await ougi.text(msg, "music_noPlaybackToUnloop"));
                return;
            }
            vc[msg.guildId].isLooping = false;
            const embed = new Discord.EmbedBuilder()
                .setTitle(await ougi.text(msg, "music_loopDisabledTitle"))
                .setDescription(await ougi.text(msg, "music_loopDisabledDesc"))
                .setColor("#230347")
                .setFooter({ text: await ougi.text(msg, "music_loopFooter"), iconURL: msg.client.user.avatarURL({ dynamic: true, size: 4096 }) });
            await msg.channel.send({ embeds: [embed] });
            return;
        }

        // Command: queue / list / playlist
        if (command === "queue" || (command === "music" && ["list", "queue", "playlist"].includes(subCommand))) {
            const guildQueue = vc[msg.guildId]?.queue || [];
            if (!guildQueue.length) {
                await msg.channel.send(await ougi.text(msg, "music_queueEmpty"));
                return;
            }

            const isLooping = !!vc[msg.guildId]?.isLooping;
            const nowPlayingPrefix = await ougi.text(msg, "music_nowPlaying");
            const queueList = guildQueue.map((s, idx) => {
                const cachedTag = ougi.audioCacheManager.has(s.url) ? ' ⚡' : '';
                return `${idx === 0 ? `**${nowPlayingPrefix}**` : `\`${idx}.\``} [${s.title}](${s.url})${cachedTag} (\`${s.duration}\`)`;
            }).slice(0, 10).join('\n');

            const queueFooterTemplate = await ougi.text(msg, "music_queueFooter");
            const loopStatusText = isLooping ? await ougi.text(msg, "music_loopEnabledTag") : await ougi.text(msg, "music_loopDisabledTag");

            const queueEmbed = new Discord.EmbedBuilder()
                .setTitle(await ougi.text(msg, "music_queueTitle"))
                .setDescription(queueList)
                .setColor("#230347")
                .setFooter({
                    text: queueFooterTemplate
                        .replace(/{total}/g, guildQueue.length)
                        .replace(/{loopStatus}/g, loopStatusText),
                    iconURL: msg.client.user.avatarURL({ dynamic: true, size: 4096 })
                });

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

        if (vc[msg.guildId].queue.length > 1) {
            ougi.audioCacheManager.prefetch(songInfo);
        }

        const isPrecached = ougi.audioCacheManager.has(songInfo.url);
        const embed = new Discord.EmbedBuilder()
            .setTitle(await ougi.text(msg, "musicAdded"))
            .setDescription(`[${songInfo.title}](${songInfo.url})${isPrecached ? ' ⚡' : ''}`)
            .setThumbnail(songInfo.thumbnail)
            .setColor("#230347")
            .addFields({ name: await ougi.text(msg, "music_durationField"), value: `\`${songInfo.duration}\``, inline: true })
            .setFooter({ text: await ougi.text(msg, "music_footer"), iconURL: msg.client.user.avatarURL({ dynamic: true, size: 4096 }) });

        await msg.channel.send({ embeds: [embed] });

        if (vc[msg.guildId].queue.length === 1) {
            await ougi.voiceManager.playMusic(msg, vcChannel);
        }

    } catch (error) {
        console.error("Error in voiceCallMusic:", error);
        await msg.channel.send(await ougi.text(msg, "musicCommandError"));
    }
};