const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } = require('discord.js');

module.exports = async function (msg) {
    try {
        if (!msg.guild) {
            await msg.channel.send(await ougi.text({ msg, stringID: "mustGuild" }));
            return;
        }

        const vcChannel = msg.member?.voice?.channel;
        if (!vcChannel) {
            await msg.channel.send(await ougi.text({ msg, stringID: "musicNoVC" }));
            return;
        }

        const permissions = vcChannel.permissionsFor(msg.client.user);
        if (permissions && (!permissions.has('Connect') || !permissions.has('Speak'))) {
            await msg.channel.send(await ougi.text({ msg, stringID: "voice_needPermissions" }));
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
                ttsQueue: [],
                isLooping: false,
                isRadio: false,
                isPaused: false,
                pausedAt: null,
                totalPausedMs: 0,
                isCachedPlaying: false,
                player: null,
                connection: null,
                mixer: null,
                encoder: null,
                musicProc: null,
                ytProc: null,
                currentTtsProc: null,
                isTtsPlaying: false,
                isProcessingTts: false,
                disconnectTimer: null
            };
        }

        // ==========================================
        // Command: stop
        // ==========================================
        if (command === "stop" || (command === "music" && subCommand === "stop")) {
            const { getVoiceConnection, VoiceConnectionStatus } = Voice;
            const connection = getVoiceConnection(msg.guildId);
            if (connection && connection.state.status !== VoiceConnectionStatus.Destroyed) {
                connection.destroy();
            }
            ougi.voiceManager.stop(msg.guildId);
            await msg.channel.send(await ougi.text({ msg, stringID: "musicStopped" }));
            return;
        }

        // ==========================================
        // Command: skip
        // ==========================================
        if (command === "skip" || (command === "music" && subCommand === "skip")) {
            if (!vc[msg.guildId] || vc[msg.guildId].queue.length === 0) {
                await msg.channel.send(await ougi.text({ msg, stringID: "musicNothingToSkip" }));
                return;
            }
            ougi.voiceManager.skipMusic(msg.guildId, msg, vcChannel);
            await msg.channel.send(await ougi.text({ msg, stringID: "musicSkipped" }));
            return;
        }

        // ==========================================
        // Command: pause
        // ==========================================
        if (command === "pause" || (command === "music" && subCommand === "pause")) {
            const result = ougi.voiceManager.pauseMusic(msg.guildId);
            if (!result.success) {
                if (result.reason === 'ALREADY_PAUSED') {
                    await msg.channel.send(await ougi.text({
                        msg,
                        stringID: "music_alreadyPaused",
                        values: { command: "ougi resume" }
                    }));
                } else {
                    await msg.channel.send(await ougi.text({ msg, stringID: "music_notPlayingToPause" }));
                }
                return;
            }

            const embed = new EmbedBuilder()
                .setTitle(await ougi.text({ msg, stringID: "music_pausedTitle" }))
                .setDescription(await ougi.text({
                    msg,
                    stringID: "music_pausedDesc",
                    values: {
                        title: result.song.title,
                        url: result.song.url,
                        command: "ougi resume"
                    }
                }))
                .setThumbnail(result.song.thumbnail || "https://github.com/HakkinDavid/OugiBot/blob/master/images/ougimusic.png?raw=true")
                .setColor("#230347")
                .setFooter({
                    text: await ougi.text({ msg, stringID: "music_footer" }),
                    iconURL: msg.client.user.avatarURL({ dynamic: true, size: 4096 })
                });

            await msg.channel.send({ embeds: [embed] });
            return;
        }

        // ==========================================
        // Command: resume / unpause
        // ==========================================
        if (["resume", "unpause"].includes(command) || (command === "music" && ["resume", "unpause"].includes(subCommand))) {
            const result = ougi.voiceManager.resumeMusic(msg.guildId);
            if (!result.success) {
                if (result.reason === 'NOT_PAUSED') {
                    await msg.channel.send(await ougi.text({ msg, stringID: "music_alreadyPlaying" }));
                } else {
                    await msg.channel.send(await ougi.text({ msg, stringID: "music_notPausedToResume" }));
                }
                return;
            }

            const embed = new EmbedBuilder()
                .setTitle(await ougi.text({ msg, stringID: "music_resumedTitle" }))
                .setDescription(await ougi.text({
                    msg,
                    stringID: "music_resumedDesc",
                    values: {
                        title: result.song.title,
                        url: result.song.url
                    }
                }))
                .setThumbnail(result.song.thumbnail || "https://github.com/HakkinDavid/OugiBot/blob/master/images/ougimusic.png?raw=true")
                .setColor("#230347")
                .setFooter({
                    text: await ougi.text({ msg, stringID: "music_footer" }),
                    iconURL: msg.client.user.avatarURL({ dynamic: true, size: 4096 })
                });

            await msg.channel.send({ embeds: [embed] });
            return;
        }

        // ==========================================
        // Command: now playing (np / nowplaying)
        // ==========================================
        if (["np", "nowplaying", "now-playing", "now"].includes(command) || (command === "music" && ["np", "nowplaying", "now-playing", "now"].includes(subCommand))) {
            const np = ougi.voiceManager.getNowPlaying(msg.guildId);
            if (!np || !np.song) {
                await msg.channel.send(await ougi.text({
                    msg,
                    stringID: "music_nothingPlaying",
                    values: {
                        playCmd: "ougi play <song>",
                        radioCmd: "ougi radio"
                    }
                }));
                return;
            }

            let statusText = await ougi.text({ msg, stringID: "music_statusPlaying" });
            if (np.isPaused) {
                statusText = await ougi.text({ msg, stringID: "music_statusPaused" });
            } else if (np.isRadio) {
                statusText = await ougi.text({ msg, stringID: "music_statusRadio" });
            }

            const sourceText = np.isCached
                ? await ougi.text({ msg, stringID: "music_cachedSource" })
                : await ougi.text({ msg, stringID: "music_streamSource" });

            const loopStatusText = np.isLooping
                ? await ougi.text({ msg, stringID: "music_loopEnabledTag" })
                : await ougi.text({ msg, stringID: "music_loopDisabledTag" });

            const footerText = await ougi.text({
                msg,
                stringID: "music_queueFooter",
                values: {
                    total: np.totalQueueLength,
                    loopStatus: loopStatusText
                }
            });

            const embed = new EmbedBuilder()
                .setTitle(await ougi.text({ msg, stringID: "music_nowPlayingTitle" }))
                .setDescription(`[${np.song.title}](${np.song.url})${np.isCached ? ' ⚡' : ''}`)
                .setThumbnail(np.song.thumbnail || "https://github.com/HakkinDavid/OugiBot/blob/master/images/ougimusic.png?raw=true")
                .setColor("#230347")
                .addFields(
                    {
                        name: await ougi.text({ msg, stringID: "music_statusField" }),
                        value: statusText,
                        inline: true
                    },
                    {
                        name: await ougi.text({ msg, stringID: "music_sourceField" }),
                        value: sourceText,
                        inline: true
                    },
                    {
                        name: await ougi.text({ msg, stringID: "music_durationField" }),
                        value: `\`${np.progressBar}\``,
                        inline: false
                    }
                );

            if (np.nextSong) {
                embed.addFields({
                    name: await ougi.text({ msg, stringID: "music_upNextField" }),
                    value: `[${np.nextSong.title}](${np.nextSong.url}) (\`${np.nextSong.duration}\`)`,
                    inline: false
                });
            }

            embed.setFooter({
                text: footerText,
                iconURL: msg.client.user.avatarURL({ dynamic: true, size: 4096 })
            });

            await msg.channel.send({ embeds: [embed] });
            return;
        }

        // ==========================================
        // Command: remove / dequeue / unqueue
        // ==========================================
        if (["remove", "dequeue", "unqueue"].includes(command) || (command === "music" && ["remove", "rm", "dequeue", "unqueue"].includes(subCommand))) {
            let target;
            if (["remove", "dequeue", "unqueue"].includes(command)) {
                target = tokens.slice(2).join(" ").trim();
            } else {
                target = tokens.slice(3).join(" ").trim();
            }

            if (!target) {
                await msg.channel.send(await ougi.text({
                    msg,
                    stringID: "music_removeUsage",
                    values: {
                        example1: "ougi remove 2",
                        example2: "ougi remove renai circulation"
                    }
                }));
                return;
            }

            const result = ougi.voiceManager.removeSong(msg.guildId, target, msg, vcChannel);
            if (!result.success) {
                if (result.reason === 'EMPTY_QUEUE') {
                    await msg.channel.send(await ougi.text({ msg, stringID: "music_queueEmpty" }));
                } else if (result.reason === 'INVALID_POSITION') {
                    await msg.channel.send(await ougi.text({
                        msg,
                        stringID: "music_invalidIndexToRemove",
                        values: {
                            position: result.position,
                            total: result.total
                        }
                    }));
                } else {
                    await msg.channel.send(await ougi.text({
                        msg,
                        stringID: "music_notFoundToRemove",
                        values: { query: target }
                    }));
                }
                return;
            }

            let desc;
            if (result.wasCurrent) {
                desc = await ougi.text({
                    msg,
                    stringID: "music_removedCurrentDesc",
                    values: {
                        title: result.removedSong.title,
                        url: result.removedSong.url
                    }
                });
            } else {
                desc = await ougi.text({
                    msg,
                    stringID: "music_removedDesc",
                    values: {
                        title: result.removedSong.title,
                        url: result.removedSong.url,
                        position: result.position,
                        remaining: result.remaining
                    }
                });
            }

            const embed = new EmbedBuilder()
                .setTitle(await ougi.text({ msg, stringID: "music_removedTitle" }))
                .setDescription(desc)
                .setThumbnail(result.removedSong.thumbnail || "https://github.com/HakkinDavid/OugiBot/blob/master/images/ougimusic.png?raw=true")
                .setColor("#230347")
                .setFooter({
                    text: await ougi.text({ msg, stringID: "music_footer" }),
                    iconURL: msg.client.user.avatarURL({ dynamic: true, size: 4096 })
                });

            await msg.channel.send({ embeds: [embed] });
            return;
        }

        // ==========================================
        // Command: radio / live ("Ougi's Live Radio")
        // ==========================================
        if (["radio", "live"].includes(command) || (command === "music" && ["radio", "live"].includes(subCommand))) {
            const radioResult = await ougi.voiceManager.startRadio(msg.guildId, msg, vcChannel);

            let descText;
            if (radioResult.cachedCount > 0) {
                descText = await ougi.text({
                    msg,
                    stringID: "music_radioDesc",
                    values: { count: radioResult.cachedCount }
                });
            } else {
                descText = await ougi.text({ msg, stringID: "music_radioEmptyDesc" });
            }

            const embed = new EmbedBuilder()
                .setTitle(await ougi.text({ msg, stringID: "music_radioTitle" }))
                .setDescription(descText)
                .setColor("#230347")
                .setThumbnail(radioResult.currentSong?.thumbnail || "https://github.com/HakkinDavid/OugiBot/blob/master/images/ougimusic.png?raw=true");

            if (radioResult.currentSong) {
                const nowPlayingPrefix = await ougi.text({ msg, stringID: "music_nowPlaying" });
                embed.addFields({
                    name: nowPlayingPrefix,
                    value: `[${radioResult.currentSong.title}](${radioResult.currentSong.url}) (\`${radioResult.currentSong.duration}\`)`,
                    inline: false
                });
            }

            embed.setFooter({
                text: await ougi.text({ msg, stringID: "music_radioFooter" }),
                iconURL: msg.client.user.avatarURL({ dynamic: true, size: 4096 })
            });

            await msg.channel.send({ embeds: [embed] });
            return;
        }

        // ==========================================
        // Command: loop
        // ==========================================
        if (command === "loop" || (command === "music" && subCommand === "loop")) {
            if (!vc[msg.guildId] || !vc[msg.guildId].queue || vc[msg.guildId].queue.length === 0) {
                await msg.channel.send(await ougi.text({ msg, stringID: "music_noQueueToLoop" }));
                return;
            }
            vc[msg.guildId].isLooping = true;
            vc[msg.guildId].isRadio = false;
            const embed = new EmbedBuilder()
                .setTitle(await ougi.text({ msg, stringID: "music_loopEnabledTitle" }))
                .setDescription(await ougi.text({ msg, stringID: "music_loopEnabledDesc" }))
                .setColor("#230347")
                .setFooter({ text: await ougi.text({ msg, stringID: "music_loopFooter" }), iconURL: msg.client.user.avatarURL({ dynamic: true, size: 4096 }) });
            await msg.channel.send({ embeds: [embed] });
            return;
        }

        // ==========================================
        // Command: unloop
        // ==========================================
        if (command === "unloop" || (command === "music" && subCommand === "unloop")) {
            if (!vc[msg.guildId]) {
                await msg.channel.send(await ougi.text({ msg, stringID: "music_noPlaybackToUnloop" }));
                return;
            }
            vc[msg.guildId].isLooping = false;
            const embed = new EmbedBuilder()
                .setTitle(await ougi.text({ msg, stringID: "music_loopDisabledTitle" }))
                .setDescription(await ougi.text({ msg, stringID: "music_loopDisabledDesc" }))
                .setColor("#230347")
                .setFooter({ text: await ougi.text({ msg, stringID: "music_loopFooter" }), iconURL: msg.client.user.avatarURL({ dynamic: true, size: 4096 }) });
            await msg.channel.send({ embeds: [embed] });
            return;
        }

        // ==========================================
        // Command: queue / list / playlist / q (Paginated)
        // ==========================================
        if (["queue", "list", "playlist", "q"].includes(command) || (command === "music" && ["list", "queue", "playlist", "q"].includes(subCommand))) {
            const guildQueue = vc[msg.guildId]?.queue || [];
            if (!guildQueue.length) {
                await msg.channel.send(await ougi.text({ msg, stringID: "music_queueEmpty" }));
                return;
            }

            const isLooping = !!vc[msg.guildId]?.isLooping;
            const isRadio = !!vc[msg.guildId]?.isRadio;
            const isPaused = !!vc[msg.guildId]?.isPaused;
            const nowPlayingPrefix = await ougi.text({ msg, stringID: "music_nowPlaying" });
            const itemsPerPage = 10;
            const totalPages = Math.ceil(guildQueue.length / itemsPerPage);

            const buildQueueEmbed = async (page) => {
                const start = page * itemsPerPage;
                const end = start + itemsPerPage;
                const pageItems = guildQueue.slice(start, end);

                const queueList = pageItems.map((s, idx) => {
                    const globalIdx = start + idx;
                    const cachedTag = ougi.audioCacheManager.has(s.url) ? ' ⚡' : '';
                    const pausedTag = (globalIdx === 0 && isPaused) ? ' ⏸️' : '';
                    const itemPrefix = globalIdx === 0 ? `**${nowPlayingPrefix}**` : `\`${globalIdx + 1}.\``;
                    return `${itemPrefix} [${s.title}](${s.url})${cachedTag}${pausedTag} (\`${s.duration}\`)`;
                }).join('\n');

                let loopStatusText = isLooping ? await ougi.text({ msg, stringID: "music_loopEnabledTag" }) : await ougi.text({ msg, stringID: "music_loopDisabledTag" });
                if (isRadio) {
                    loopStatusText += ' | 📻 Radio';
                }

                let pageTag = "";
                if (totalPages > 1) {
                    pageTag = ` • ${await ougi.text({ msg, stringID: "music_queuePage", values: { page: page + 1, pages: totalPages } })}`;
                }

                const footerText = `${await ougi.text({
                    msg,
                    stringID: "music_queueFooter",
                    values: {
                        total: guildQueue.length,
                        loopStatus: loopStatusText
                    }
                })}${pageTag}`;

                return new EmbedBuilder()
                    .setTitle(await ougi.text({ msg, stringID: "music_queueTitle" }))
                    .setDescription(queueList || await ougi.text({ msg, stringID: "music_queueEmpty" }))
                    .setColor("#230347")
                    .setThumbnail(guildQueue[0]?.thumbnail || "https://github.com/HakkinDavid/OugiBot/blob/master/images/ougimusic.png?raw=true")
                    .setFooter({
                        text: footerText,
                        iconURL: msg.client.user.avatarURL({ dynamic: true, size: 4096 })
                    });
            };

            const buildActionRow = (page) => {
                return new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('q_first')
                        .setEmoji('⏮️')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(page === 0),
                    new ButtonBuilder()
                        .setCustomId('q_prev')
                        .setEmoji('◀️')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page === 0),
                    new ButtonBuilder()
                        .setCustomId('q_page')
                        .setLabel(`${page + 1}/${totalPages}`)
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setCustomId('q_next')
                        .setEmoji('▶️')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page >= totalPages - 1),
                    new ButtonBuilder()
                        .setCustomId('q_last')
                        .setEmoji('⏭️')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(page >= totalPages - 1)
                );
            };

            let currentPage = 0;
            const initialEmbed = await buildQueueEmbed(currentPage);

            if (totalPages <= 1) {
                await msg.channel.send({ embeds: [initialEmbed] });
                return;
            }

            const initialRow = buildActionRow(currentPage);
            const queueMsg = await msg.channel.send({ embeds: [initialEmbed], components: [initialRow] });

            const collector = queueMsg.createMessageComponentCollector({
                componentType: ComponentType.Button,
                time: 90_000
            });

            collector.on('collect', async (interaction) => {
                if (interaction.user.id !== msg.author.id && interaction.user.id !== davidUserID) {
                    await interaction.deferUpdate().catch(() => {});
                    return;
                }

                if (interaction.customId === 'q_first') {
                    currentPage = 0;
                } else if (interaction.customId === 'q_prev') {
                    currentPage = Math.max(0, currentPage - 1);
                } else if (interaction.customId === 'q_next') {
                    currentPage = Math.min(totalPages - 1, currentPage + 1);
                } else if (interaction.customId === 'q_last') {
                    currentPage = totalPages - 1;
                }

                const updatedEmbed = await buildQueueEmbed(currentPage);
                const updatedRow = buildActionRow(currentPage);

                await interaction.update({
                    embeds: [updatedEmbed],
                    components: [updatedRow]
                }).catch(() => {});
            });

            collector.on('end', async () => {
                try {
                    const disabledRow = new ActionRowBuilder().addComponents(
                        new ButtonBuilder().setCustomId('q_first').setEmoji('⏮️').setStyle(ButtonStyle.Secondary).setDisabled(true),
                        new ButtonBuilder().setCustomId('q_prev').setEmoji('◀️').setStyle(ButtonStyle.Primary).setDisabled(true),
                        new ButtonBuilder().setCustomId('q_page').setLabel(`${currentPage + 1}/${totalPages}`).setStyle(ButtonStyle.Secondary).setDisabled(true),
                        new ButtonBuilder().setCustomId('q_next').setEmoji('▶️').setStyle(ButtonStyle.Primary).setDisabled(true),
                        new ButtonBuilder().setCustomId('q_last').setEmoji('⏭️').setStyle(ButtonStyle.Secondary).setDisabled(true)
                    );
                    await queueMsg.edit({ components: [disabledRow] }).catch(() => {});
                } catch (_) {}
            });

            return;
        }

        // ==========================================
        // Command: play / music query / URL
        // ==========================================
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
            await msg.channel.send(await ougi.text({ msg, stringID: "keywordRequired" }));
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
                    await msg.channel.send(await ougi.text({ msg, stringID: "resultsZero" }));
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
                await msg.channel.send(await ougi.text({ msg, stringID: "resultsZero" }));
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

        // If user queued a specific song, turn off background radio replenishment
        if (vc[msg.guildId].isRadio) {
            vc[msg.guildId].isRadio = false;
        }

        vc[msg.guildId].queue.push(songInfo);

        if (vc[msg.guildId].queue.length > 1) {
            ougi.audioCacheManager.prefetch(songInfo);
        }

        const isPrecached = ougi.audioCacheManager.has(songInfo.url);
        const embed = new EmbedBuilder()
            .setTitle(await ougi.text({ msg, stringID: "musicAdded" }))
            .setDescription(`[${songInfo.title}](${songInfo.url})${isPrecached ? ' ⚡' : ''}`)
            .setThumbnail(songInfo.thumbnail)
            .setColor("#230347")
            .addFields({ name: await ougi.text({ msg, stringID: "music_durationField" }), value: `\`${songInfo.duration}\``, inline: true })
            .setFooter({ text: await ougi.text({ msg, stringID: "music_footer" }), iconURL: msg.client.user.avatarURL({ dynamic: true, size: 4096 }) });

        await msg.channel.send({ embeds: [embed] });

        if (vc[msg.guildId].queue.length === 1) {
            await ougi.voiceManager.playMusic(msg, vcChannel);
        }

    } catch (error) {
        console.error("Error in voiceCallMusic:", error);
        await msg.channel.send(await ougi.text({ msg, stringID: "musicCommandError" }));
    }
};