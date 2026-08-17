const { spawn } = require('child_process');
const { Readable } = require('stream');
const axios = require('axios');

function parseDurationToSec(durationStr) {
    if (!durationStr || typeof durationStr !== 'string') return 0;
    if (durationStr.toLowerCase() === 'live') return 0;
    const parts = durationStr.split(':').map(p => parseInt(p, 10));
    if (parts.some(isNaN)) return 0;
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 1) return parts[0];
    return 0;
}

function formatSecondsToTime(sec) {
    if (isNaN(sec) || sec < 0) sec = 0;
    const s = Math.floor(sec % 60);
    const m = Math.floor((sec / 60) % 60);
    const h = Math.floor(sec / 3600);
    const sStr = s < 10 ? `0${s}` : `${s}`;
    const mStr = m < 10 ? `0${m}` : `${m}`;
    if (h > 0) {
        const hStr = h < 10 ? `0${h}` : `${h}`;
        return `${hStr}:${mStr}:${sStr}`;
    }
    return `${mStr}:${sStr}`;
}

function generateProgressBar(elapsedSec, totalSec, length = 15) {
    if (!totalSec || totalSec <= 0) {
        return `🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬ [${formatSecondsToTime(elapsedSec)} / Live]`;
    }
    const ratio = Math.max(0, Math.min(1, elapsedSec / totalSec));
    const position = Math.min(length - 1, Math.floor(ratio * length));
    let bar = '';
    for (let i = 0; i < length; i++) {
        if (i === position) bar += '🔘';
        else bar += '▬';
    }
    return `${bar} [${formatSecondsToTime(elapsedSec)} / ${formatSecondsToTime(totalSec)}]`;
}

class AudioMixer extends Readable {
    constructor(options = {}) {
        super(options);
        this.musicBuffers = [];
        this.musicBytes = 0;
        this.ttsBuffers = [];
        this.ttsBytes = 0;

        this.isMusicActive = false;
        this.isTtsActive = false;
        this.isMusicEof = false;

        this.duckedVolume = 0.20; // Volume of music when TTS is speaking
        this.ttsVolume = 1.00;    // Volume of TTS (predominant)
        this.musicVolume = 1.00;  // Normal volume of music

        this.chunkSize = 3840; // 20ms @ 48000Hz 16-bit stereo PCM
        this.destroyed = false;
        this.ended = false;

        this.onBufferLow = null;
    }

    writeMusic(chunk) {
        if (this.destroyed || this.ended) return;
        this.isMusicActive = true;
        this.isMusicEof = false;
        this.musicBuffers.push(chunk);
        this.musicBytes += chunk.length;
        this._process();
    }

    notifyMusicEof() {
        this.isMusicEof = true;
        this._process();
    }

    clearMusicBuffer() {
        this.musicBuffers = [];
        this.musicBytes = 0;
        this.isMusicActive = false;
        this.isMusicEof = false;
    }

    endMusic() {
        this.isMusicActive = false;
        this.isMusicEof = true;
        this._process();
        this._checkEnd();
    }

    startTts() {
        if (this.destroyed || this.ended) return;
        this.isTtsActive = true;
        this._process();
    }

    writeTts(chunk) {
        if (this.destroyed || this.ended) return;
        this.isTtsActive = true;
        this.ttsBuffers.push(chunk);
        this.ttsBytes += chunk.length;
        this._process();
    }

    endTts() {
        this.isTtsActive = false;
        this._process();
        this._checkEnd();
    }

    _checkEnd() {
        if (!this.isMusicActive && !this.isTtsActive && this.musicBytes === 0 && this.ttsBytes === 0 && !this.ended) {
            this.ended = true;
            this.push(null);
        }
    }

    _read(size) {
        this._process();
    }

    _process() {
        if (this.destroyed || this.ended) return;

        while (true) {
            const hasMusic = this.musicBytes >= this.chunkSize;
            const hasTts = this.ttsBytes > 0;

            // Trigger flow control callback if buffer drops low
            if (this.musicBytes < 24000 && this.onBufferLow) {
                this.onBufferLow();
            }

            if (hasTts && hasMusic) {
                // Both active: mix music (ducked) and TTS (predominant)
                const m = this._consumeMusic(this.chunkSize);
                const t = this._consumeTts(this.chunkSize);
                const mixed = this._mix(m, t, this.duckedVolume, this.ttsVolume);
                if (!this.push(mixed)) break;
            } else if (hasTts && !this.isMusicActive && this.musicBytes === 0) {
                // TTS only (no music active)
                const t = this._consumeTts(Math.min(this.chunkSize, this.ttsBytes));
                const scaled = this._scaleVolume(t, this.ttsVolume);
                if (!this.push(scaled)) break;
            } else if (hasTts && this.isMusicActive && !hasMusic) {
                // TTS available, music stream buffering; output TTS
                const t = this._consumeTts(Math.min(this.chunkSize, this.ttsBytes));
                const scaled = this._scaleVolume(t, this.ttsVolume);
                if (!this.push(scaled)) break;
            } else if (!hasTts && this.isTtsActive && hasMusic) {
                // TTS is active but chunk hasn't arrived yet; duck music
                const m = this._consumeMusic(this.chunkSize);
                const ducked = this._scaleVolume(m, this.duckedVolume);
                if (!this.push(ducked)) break;
            } else if (hasMusic) {
                // Music only at full volume
                const m = this._consumeMusic(this.chunkSize);
                if (!this.push(m)) break;
            } else if (this.isMusicEof && this.musicBytes > 0) {
                // End of music stream reached: flush remaining bytes zero-padded to full 3840 frame
                const m = this._consumeMusic(this.chunkSize);
                this.musicBytes = 0;
                this.musicBuffers = [];
                if (!this.push(m)) break;
            } else if (!this.isMusicActive && this.musicBytes > 0) {
                const m = this._consumeMusic(this.chunkSize);
                this.musicBytes = 0;
                this.musicBuffers = [];
                if (!this.push(m)) break;
            } else {
                break;
            }
        }
    }

    _consumeMusic(bytes) {
        const aligned = bytes - (bytes % 2);
        const chunk = Buffer.alloc(aligned);
        let offset = 0;
        while (offset < aligned && this.musicBuffers.length > 0) {
            const buf = this.musicBuffers[0];
            const needed = aligned - offset;
            if (buf.length <= needed) {
                buf.copy(chunk, offset);
                offset += buf.length;
                this.musicBuffers.shift();
            } else {
                buf.copy(chunk, offset, 0, needed);
                this.musicBuffers[0] = buf.subarray(needed);
                offset += needed;
            }
        }
        this.musicBytes -= offset;
        return chunk;
    }

    _consumeTts(bytes) {
        const aligned = bytes - (bytes % 2);
        const chunk = Buffer.alloc(aligned); // Zero-filled (silence padding for partial chunks)
        let offset = 0;
        while (offset < aligned && this.ttsBuffers.length > 0) {
            const buf = this.ttsBuffers[0];
            const needed = aligned - offset;
            if (buf.length <= needed) {
                buf.copy(chunk, offset);
                offset += buf.length;
                this.ttsBuffers.shift();
            } else {
                buf.copy(chunk, offset, 0, needed);
                this.ttsBuffers[0] = buf.subarray(needed);
                offset += needed;
            }
        }
        this.ttsBytes -= offset;
        if (this.ttsBytes < 0) this.ttsBytes = 0;
        return chunk;
    }

    _mix(bufA, bufB, volA, volB) {
        const len = Math.min(bufA.length, bufB.length);
        const byteLen = len - (len % 2);
        const out = Buffer.alloc(byteLen);
        for (let i = 0; i < byteLen; i += 2) {
            const sA = bufA.readInt16LE(i);
            const sB = bufB.readInt16LE(i);
            let mixed = Math.round(sA * volA + sB * volB);
            if (mixed > 32767) mixed = 32767;
            else if (mixed < -32768) mixed = -32768;
            out.writeInt16LE(mixed, i);
        }
        return out;
    }

    _scaleVolume(buf, vol) {
        if (vol === 1.0) return buf;
        const byteLen = buf.length - (buf.length % 2);
        const out = Buffer.alloc(byteLen);
        for (let i = 0; i < byteLen; i += 2) {
            const sample = buf.readInt16LE(i);
            let scaled = Math.round(sample * vol);
            if (scaled > 32767) scaled = 32767;
            else if (scaled < -32768) scaled = -32768;
            out.writeInt16LE(scaled, i);
        }
        return out;
    }

    destroy() {
        this.destroyed = true;
        this.ended = true;
        this.musicBuffers = [];
        this.ttsBuffers = [];
        this.push(null);
    }
}

module.exports = {
    AudioMixer,
    parseDurationToSec,
    formatSecondsToTime,
    generateProgressBar,

    async getOrCreateSession(guildId, vcChannel) {
        const V = global.Voice || require('@discordjs/voice');
        const { createAudioPlayer, VoiceConnectionStatus } = V;

        if (!global.vc) global.vc = {};
        if (!vc[guildId]) {
            vc[guildId] = {
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

        const session = vc[guildId];
        if (!session.queue) session.queue = [];
        if (!session.ttsQueue) session.ttsQueue = [];
        if (typeof session.isLooping !== 'boolean') session.isLooping = false;
        if (typeof session.isRadio !== 'boolean') session.isRadio = false;
        if (typeof session.isPaused !== 'boolean') session.isPaused = false;
        if (typeof session.isCachedPlaying !== 'boolean') session.isCachedPlaying = false;

        // Clear any pending idle disconnect timer
        if (session.disconnectTimer) {
            clearTimeout(session.disconnectTimer);
            session.disconnectTimer = null;
        }

        let connection = V.getVoiceConnection(guildId);
        if (!connection || connection.state.status === VoiceConnectionStatus.Destroyed) {
            connection = V.joinVoiceChannel({
                channelId: vcChannel.id,
                guildId: vcChannel.guildId,
                adapterCreator: vcChannel.guild.voiceAdapterCreator,
                selfDeaf: true,
            });
        } else if (connection.joinConfig && connection.joinConfig.channelId !== vcChannel.id) {
            connection = V.joinVoiceChannel({
                channelId: vcChannel.id,
                guildId: vcChannel.guildId,
                adapterCreator: vcChannel.guild.voiceAdapterCreator,
                selfDeaf: true,
            });
        }

        if (!connection._hasUnifiedDisconnectHandler) {
            connection._hasUnifiedDisconnectHandler = true;
            connection.on(VoiceConnectionStatus.Disconnected, async () => {
                try {
                    await Promise.race([
                        V.entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
                        V.entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
                    ]);
                } catch {
                    if (connection.state.status !== VoiceConnectionStatus.Destroyed) {
                        connection.destroy();
                    }
                    this.cleanup(guildId);
                }
            });
        }

        if (connection.state.status !== VoiceConnectionStatus.Ready) {
            await V.entersState(connection, VoiceConnectionStatus.Ready, 15_000);
        }

        session.connection = connection;

        // Ensure Player exists
        if (!session.player) {
            session.player = createAudioPlayer();
            session.player.on('error', (err) => {
                console.error(`AudioPlayer error in guild ${guildId}:`, err);
            });
            session.player.on(V.AudioPlayerStatus.Idle, () => {
                this.handlePlayerIdle(guildId, vcChannel);
            });
            connection.subscribe(session.player);
        }

        // Ensure active Mixer & Encoder pipeline
        if (!session.mixer || session.mixer.destroyed || session.mixer.ended) {
            this.startMixerPipeline(guildId);
        }

        return session;
    },

    startMixerPipeline(guildId) {
        const V = global.Voice || require('@discordjs/voice');
        const session = vc[guildId];
        if (!session) return;

        if (session.mixer && !session.mixer.destroyed) {
            session.mixer.destroy();
        }
        if (session.encoder && !session.encoder.killed) {
            try { session.encoder.kill(); } catch (_) {}
        }

        const mixer = new AudioMixer();
        // WebM container with instant cluster limits emits Opus frames with 0ms buffering delay
        const encoder = spawn('ffmpeg', [
            '-loglevel', 'error',
            '-f', 's16le',
            '-ar', '48000',
            '-ac', '2',
            '-i', 'pipe:0',
            '-c:a', 'libopus',
            '-b:a', '128k',
            '-f', 'webm',
            '-cluster_size_limit', '0',
            '-cluster_time_limit', '20',
            'pipe:1'
        ]);

        encoder.on('error', (err) => {
            console.error(`Opus encoder error in guild ${guildId}:`, err);
        });

        encoder.stdin.on('error', (err) => {
            // Ignore EPIPE when encoder closes
        });

        mixer.onBufferLow = () => {
            if (session.diskReadStream && session.diskReadStream.isPaused()) {
                session.diskReadStream.resume();
            }
            if (session.musicProc && session.musicProc.stdout && session.musicProc.stdout.isPaused()) {
                session.musicProc.stdout.resume();
            }
        };

        mixer.pipe(encoder.stdin);

        const resource = V.createAudioResource(encoder.stdout, {
            inputType: V.StreamType.WebmOpus
        });

        session.mixer = mixer;
        session.encoder = encoder;

        session.player.play(resource);
    },

    async playMusic(msg, vcChannel) {
        const session = await this.getOrCreateSession(msg.guildId, vcChannel);
        if (!session.queue || session.queue.length === 0) return;

        // If music is already playing, do nothing (it will advance naturally)
        if (session.musicProc && !session.musicProc.killed) return;
        if (session.isCachedPlaying) return;

        const song = session.queue[0];
        song.startTime = Date.now();
        song.pausedAt = null;
        song.totalPausedMs = 0;
        song.durationSec = parseDurationToSec(song.duration);
        session.isPaused = false;
        session.pausedAt = null;

        try {
            if (!session.mixer || session.mixer.destroyed || session.mixer.ended) {
                this.startMixerPipeline(msg.guildId);
            }

            const onSongComplete = () => {
                session.musicProc = null;
                session.isCachedPlaying = false;
                if (session.diskReadStream) {
                    try { session.diskReadStream.destroy(); } catch (_) {}
                    session.diskReadStream = null;
                }
                if (session.ytProc && !session.ytProc.killed) {
                    try { session.ytProc.kill(); } catch (_) {}
                    session.ytProc = null;
                }

                if (!session.queue || session.queue.length === 0) {
                    if (session.mixer) {
                        session.mixer.endMusic();
                    }
                    return;
                }

                // Advance or rotate queue
                if (session.queue[0] === song) {
                    if (session.isRadio) {
                        session.queue.shift();
                        this.replenishRadioQueue(msg.guildId);
                    } else if (session.isLooping) {
                        const finishedSong = session.queue.shift();
                        session.queue.push(finishedSong);
                    } else {
                        session.queue.shift();
                    }

                    if (session.queue.length > 0) {
                        this.playMusic(msg, vcChannel);
                    } else {
                        if (session.mixer) {
                            session.mixer.endMusic();
                        }
                    }
                }
            };

            // Strategy 1: Global Persistent Disk/LRU Cache (0ms latency, zero network)
            if (ougi.audioCacheManager.has(song.url)) {
                const diskReadStream = ougi.audioCacheManager.createReadStream(song.url);
                if (diskReadStream) {
                    session.isCachedPlaying = true;
                    session.diskReadStream = diskReadStream;

                    diskReadStream.on('data', (chunk) => {
                        if (session.mixer && !session.mixer.destroyed) {
                            session.mixer.writeMusic(chunk);
                            if (session.mixer.musicBytes > 48000 && !diskReadStream.isPaused()) {
                                diskReadStream.pause();
                            }
                        }
                    });

                    session.mixer.onBufferLow = () => {
                        if (session.diskReadStream && session.diskReadStream.isPaused()) {
                            session.diskReadStream.resume();
                        }
                    };

                    diskReadStream.on('end', () => {
                        if (session.mixer && !session.mixer.destroyed) {
                            session.mixer.notifyMusicEof();
                        }
                        const checkMixerDrain = () => {
                            if (!session.queue || session.queue[0] !== song) return;
                            if (session.mixer && session.mixer.musicBytes > 0 && !session.mixer.destroyed) {
                                setTimeout(checkMixerDrain, 100);
                            } else {
                                onSongComplete();
                            }
                        };
                        checkMixerDrain();
                    });

                    diskReadStream.on('error', (err) => {
                        console.error(`[VoiceManager] Disk cache stream error for ${song.title}:`, err);
                        onSongComplete();
                    });

                    // Background prefetch next track in queue
                    if (session.queue.length > 1) {
                        ougi.audioCacheManager.prefetch(session.queue[1]);
                    }
                    return;
                }
            }

            // Strategy 2: Network stream + Cache Write to Disk LRU Cache
            const cacheWriter = ougi.audioCacheManager.createCacheWriteStream(song.url, song);
            session.cacheWriter = cacheWriter;

            let musicProc = null;
            let ytProc = null;

            // Authenticated streaming with cookies via yt-dlp stdout pipe
            if (global.cachedCookiesPath) {
                try {
                    ytProc = youtubedl.exec(song.url, {
                        output: '-',
                        format: 'bestaudio/best',
                        jsRuntimes: 'node',
                        cookies: global.cachedCookiesPath,
                        noWarnings: true
                    });

                    // Catch SIGTERM / process kill cleanly to avoid ChildProcessError
                    ytProc.catch(() => {});

                    musicProc = spawn('ffmpeg', [
                        '-loglevel', 'error',
                        '-i', 'pipe:0',
                        '-f', 's16le',
                        '-ar', '48000',
                        '-ac', '2',
                        '-vn',
                        'pipe:1'
                    ]);

                    ytProc.stdout.pipe(musicProc.stdin);
                    session.ytProc = ytProc;

                    ytProc.on('error', (err) => {
                        console.error(`yt-dlp stream error for ${song.title}:`, err);
                    });
                } catch (cookieErr) {
                    console.warn(`[VoiceManager] Direct yt-dlp cookie pipe failed for "${song.title}", falling back to client extractors:`, cookieErr.message);
                }
            }

            // Fallback: direct stream URL extraction without cookies
            if (!musicProc) {
                const rawStreamUrl = (await youtubedl(song.url, {
                    getUrl: true,
                    format: 'bestaudio/best',
                    extractorArgs: 'youtube:player_client=android,tv_embedded',
                    noWarnings: true
                })).trim();

                musicProc = spawn('ffmpeg', [
                    '-loglevel', 'error',
                    '-reconnect', '1',
                    '-reconnect_streamed', '1',
                    '-reconnect_delay_max', '5',
                    '-i', rawStreamUrl,
                    '-f', 's16le',
                    '-ar', '48000',
                    '-ac', '2',
                    '-vn',
                    'pipe:1'
                ]);
            }

            session.musicProc = musicProc;

            musicProc.stdout.on('data', (chunk) => {
                if (session.mixer && !session.mixer.destroyed) {
                    session.mixer.writeMusic(chunk);

                    // Write to global disk cache
                    if (session.cacheWriter) {
                        session.cacheWriter.write(chunk);
                    }

                    // Flow control / Backpressure: pause if buffer > 48KB (~250ms)
                    if (session.mixer.musicBytes > 48000 && !musicProc.stdout.isPaused()) {
                        musicProc.stdout.pause();
                    }
                }
            });

            session.mixer.onBufferLow = () => {
                if (session.musicProc && session.musicProc.stdout.isPaused()) {
                    session.musicProc.stdout.resume();
                }
            };

            musicProc.on('error', (err) => {
                console.error(`Music decoder error for ${song.title}:`, err);
                if (session.cacheWriter) {
                    session.cacheWriter.abort();
                    session.cacheWriter = null;
                }
            });

            musicProc.on('close', (code) => {
                if (session.cacheWriter) {
                    if (code === 0 && !musicProc.killed) {
                        session.cacheWriter.end();
                    } else {
                        session.cacheWriter.abort();
                    }
                    session.cacheWriter = null;
                }
                onSongComplete();
            });

            // Trigger background prefetch for next track in queue
            if (session.queue.length > 1) {
                ougi.audioCacheManager.prefetch(session.queue[1]);
            }

        } catch (err) {
            console.error(`Error streaming ${song.title}:`, err);
            const unableMsg = await ougi.text({
                msg,
                stringID: "music_unableToPlay",
                values: { title: song.title }
            });
            msg.channel.send(unableMsg).catch(() => {});
            session.queue.shift();
            if (session.queue.length > 0) {
                this.playMusic(msg, vcChannel);
            } else {
                if (session.mixer) {
                    session.mixer.endMusic();
                }
            }
        }
    },

    async playTts(msg, vcChannel, ttsUrls) {
        const session = await this.getOrCreateSession(msg.guildId, vcChannel);

        return new Promise((resolve, reject) => {
            session.ttsQueue.push({
                msg,
                vcChannel,
                ttsUrls,
                resolve,
                reject
            });

            if (!session.isProcessingTts) {
                this.processTtsQueue(msg.guildId, vcChannel);
            }
        });
    },

    async processTtsQueue(guildId, vcChannel) {
        const session = vc[guildId];
        if (!session) return;

        session.isProcessingTts = true;
        session.isTtsPlaying = true;

        if (!session.mixer || session.mixer.destroyed || session.mixer.ended) {
            this.startMixerPipeline(guildId);
        }

        session.mixer.startTts();

        while (session.ttsQueue && session.ttsQueue.length > 0) {
            const currentItem = session.ttsQueue[0];
            const { msg, ttsUrls, resolve } = currentItem;

            try {
                for (const chunk of ttsUrls) {
                    if (!vc[guildId]) break; // stopped / disconnected

                    const response = await axios.get(chunk.url, {
                        responseType: 'stream',
                        headers: {
                            'User-Agent': 'stagefright/1.2 (Linux;Android 5.0)',
                            'Referer': 'https://translate.google.com/'
                        },
                        timeout: 10000
                    });
                    await new Promise((chunkResolve) => {
                        const ttsProc = spawn('ffmpeg', [
                            '-loglevel', 'error',
                            '-fflags', '+nobuffer',
                            '-flags', 'low_delay',
                            '-analyzeduration', '0',
                            '-probesize', '32',
                            '-i', 'pipe:0',
                            '-af', 'volume=2.2,alimiter=limit=0.95',
                            '-f', 's16le',
                            '-ar', '48000',
                            '-ac', '2',
                            '-vn',
                            'pipe:1'
                        ]);

                        session.currentTtsProc = ttsProc;

                        response.data.pipe(ttsProc.stdin);

                        ttsProc.stdout.on('data', (pcmChunk) => {
                            if (session.mixer && !session.mixer.destroyed) {
                                session.mixer.writeTts(pcmChunk);
                            }
                        });

                        ttsProc.stdin.on('error', () => {});
                        ttsProc.stdout.on('error', () => {});

                        const cleanupProc = () => {
                            session.currentTtsProc = null;
                            chunkResolve();
                        };

                        ttsProc.on('close', cleanupProc);
                        ttsProc.on('error', (e) => {
                            console.error("TTS FFmpeg process error:", e);
                            cleanupProc();
                        });
                    });
                }
            } catch (err) {
                console.error("Error in TTS streaming queue item:", err);
            }

            const wasPaused = session.isPaused;
            if (wasPaused && session.player) {
                session.player.unpause();
            }

            // Wait until the decoded speech has been completely played by the mixer
            while (session.mixer && !session.mixer.destroyed && session.mixer.ttsBytes > 0) {
                await new Promise(r => setTimeout(r, 100));
            }

            if (wasPaused && session.isPaused && session.player) {
                session.player.pause(true);
            }

            msg?.react?.('🔊').catch(() => {});
            resolve?.();

            if (session.ttsQueue) {
                session.ttsQueue.shift();
            }
        }

        if (session.mixer) {
            session.mixer.endTts();
        }

        session.isTtsPlaying = false;
        session.isProcessingTts = false;

        this.handlePlayerIdle(guildId, vcChannel);
    },

    skipMusic(guildId, msg, vcChannel) {
        const session = vc[guildId];
        if (!session || session.queue.length === 0) return false;

        session.isCachedPlaying = false;

        if (session.cacheWriter) {
            try { session.cacheWriter.abort(); } catch (_) {}
            session.cacheWriter = null;
        }

        if (session.diskReadStream) {
            try { session.diskReadStream.destroy(); } catch (_) {}
            session.diskReadStream = null;
        }

        if (session.musicProc && !session.musicProc.killed) {
            try { session.musicProc.kill(); } catch (_) {}
            session.musicProc = null;
        }

        if (session.ytProc && !session.ytProc.killed) {
            try { session.ytProc.kill(); } catch (_) {}
            session.ytProc = null;
        }

        if (session.mixer) {
            session.mixer.clearMusicBuffer();
        }

        if (session.isLooping) {
            const skippedSong = session.queue.shift();
            session.queue.push(skippedSong);
        } else {
            session.queue.shift();
        }

        if (session.queue.length > 0) {
            this.playMusic(msg, vcChannel);
        } else {
            if (session.mixer) {
                session.mixer.endMusic();
            }
        }
        return true;
    },

    pauseMusic(guildId) {
        const session = global.vc?.[guildId];
        if (!session || !session.queue || session.queue.length === 0) {
            return { success: false, reason: 'NOT_PLAYING' };
        }
        if (session.isPaused) {
            return { success: false, reason: 'ALREADY_PAUSED', song: session.queue[0] };
        }

        session.isPaused = true;
        session.pausedAt = Date.now();

        if (session.player) {
            session.player.pause(true);
        }
        if (session.diskReadStream && !session.diskReadStream.isPaused()) {
            session.diskReadStream.pause();
        }
        if (session.musicProc && session.musicProc.stdout && !session.musicProc.stdout.isPaused()) {
            session.musicProc.stdout.pause();
        }

        return { success: true, song: session.queue[0] };
    },

    resumeMusic(guildId) {
        const session = global.vc?.[guildId];
        if (!session || !session.queue || session.queue.length === 0) {
            return { success: false, reason: 'NOT_PLAYING' };
        }
        if (!session.isPaused) {
            return { success: false, reason: 'NOT_PAUSED', song: session.queue[0] };
        }

        if (session.pausedAt) {
            session.totalPausedMs = (session.totalPausedMs || 0) + (Date.now() - session.pausedAt);
            session.pausedAt = null;
        }
        session.isPaused = false;

        if (session.player) {
            session.player.unpause();
        }
        if (session.diskReadStream && session.diskReadStream.isPaused()) {
            session.diskReadStream.resume();
        }
        if (session.musicProc && session.musicProc.stdout && session.musicProc.stdout.isPaused()) {
            session.musicProc.stdout.resume();
        }

        return { success: true, song: session.queue[0] };
    },

    getNowPlaying(guildId) {
        const session = global.vc?.[guildId];
        if (!session || !session.queue || session.queue.length === 0) {
            return null;
        }

        const song = session.queue[0];
        let elapsedMs = 0;
        if (song.startTime) {
            let totalPaused = (song.totalPausedMs || 0);
            if (session.isPaused && session.pausedAt) {
                totalPaused += (Date.now() - session.pausedAt);
            }
            elapsedMs = Math.max(0, Date.now() - song.startTime - totalPaused);
        }

        const elapsedSec = Math.floor(elapsedMs / 1000);
        const totalSec = song.durationSec || parseDurationToSec(song.duration);
        const progressBar = generateProgressBar(elapsedSec, totalSec, 15);
        const isCached = ougi.audioCacheManager.has(song.url);

        return {
            song,
            isPaused: !!session.isPaused,
            isLooping: !!session.isLooping,
            isRadio: !!session.isRadio,
            isCached,
            elapsedSec,
            totalSec,
            progressBar,
            nextSong: session.queue.length > 1 ? session.queue[1] : null,
            totalQueueLength: session.queue.length
        };
    },

    removeSong(guildId, target, msg, vcChannel) {
        const session = global.vc?.[guildId];
        if (!session || !session.queue || session.queue.length === 0) {
            return { success: false, reason: 'EMPTY_QUEUE' };
        }

        const queue = session.queue;
        const targetStr = String(target || '').trim();

        // Check if numeric position (1-based index)
        if (/^\d+$/.test(targetStr)) {
            const position = parseInt(targetStr, 10);
            if (position <= 0 || position > queue.length) {
                return { success: false, reason: 'INVALID_POSITION', position, total: queue.length };
            }

            if (position === 1) {
                const removedSong = queue[0];
                this.skipMusic(guildId, msg, vcChannel);
                return { success: true, removedSong, position: 1, wasCurrent: true, remaining: session.queue?.length || 0 };
            }

            const removedSong = queue.splice(position - 1, 1)[0];
            return { success: true, removedSong, position, wasCurrent: false, remaining: queue.length };
        }

        // Match by title substring or fuzzy match
        const query = targetStr.toLowerCase();
        let matchIndex = -1;
        let bestScore = -1;

        for (let i = 0; i < queue.length; i++) {
            const trackTitle = (queue[i].title || '').toLowerCase();
            const trackUrl = (queue[i].url || '').toLowerCase();
            if (trackTitle.includes(query) || trackUrl.includes(query)) {
                matchIndex = i;
                break;
            }
            if (global.stringSimilarity) {
                const score = global.stringSimilarity.compareTwoStrings(query, trackTitle);
                if (score > bestScore && score >= 0.35) {
                    bestScore = score;
                    matchIndex = i;
                }
            }
        }

        if (matchIndex === -1) {
            return { success: false, reason: 'NOT_FOUND', query: targetStr };
        }

        const removedSong = queue[matchIndex];
        if (matchIndex === 0) {
            this.skipMusic(guildId, msg, vcChannel);
            return { success: true, removedSong, position: 1, wasCurrent: true, remaining: session.queue?.length || 0 };
        }

        queue.splice(matchIndex, 1);
        return { success: true, removedSong, position: matchIndex + 1, wasCurrent: false, remaining: queue.length };
    },

    async startRadio(guildId, msg, vcChannel) {
        const session = await this.getOrCreateSession(guildId, vcChannel);
        session.isRadio = true;
        session.isLooping = false;

        const cachedTracks = ougi.audioCacheManager.getAllCached();
        await this.replenishRadioQueue(guildId, 5);

        if (!session.musicProc && !session.isCachedPlaying && session.queue.length > 0) {
            await this.playMusic(msg, vcChannel);
        }

        return {
            success: true,
            cachedCount: cachedTracks.length,
            currentSong: session.queue[0]
        };
    },

    async replenishRadioQueue(guildId, targetCount = 3) {
        const session = global.vc?.[guildId];
        if (!session || !session.isRadio) return;

        const cachedTracks = ougi.audioCacheManager.getAllCached();
        const seeds = ougi.audioCacheManager.getRadioSeeds();

        while (session.queue.length < targetCount) {
            let nextTrack = null;
            if (cachedTracks.length > 0) {
                const randomIndex = Math.floor(Math.random() * cachedTracks.length);
                const candidate = cachedTracks[randomIndex];
                nextTrack = {
                    title: candidate.title,
                    url: candidate.url,
                    duration: candidate.duration,
                    thumbnail: candidate.thumbnail
                };
            } else if (seeds.length > 0) {
                const randomIndex = Math.floor(Math.random() * seeds.length);
                const candidate = seeds[randomIndex];
                nextTrack = {
                    title: candidate.title,
                    url: candidate.url,
                    duration: candidate.duration,
                    thumbnail: "https://github.com/HakkinDavid/OugiBot/blob/master/images/ougimusic.png?raw=true"
                };
            }

            if (nextTrack) {
                session.queue.push(nextTrack);
            } else {
                break;
            }
        }
    },

    stop(guildId) {
        this.cleanup(guildId);
    },

    handlePlayerIdle(guildId, vcChannel) {
        const session = vc[guildId];
        if (!session) return;

        // If music in queue, restart playback
        if (session.queue && session.queue.length > 0 && (!session.musicProc || session.musicProc.killed) && !session.isCachedPlaying) {
            return;
        }

        // If queue empty and not speaking, schedule idle disconnect after 2 minutes
        if ((!session.queue || session.queue.length === 0) && !session.isTtsPlaying && (!session.ttsQueue || session.ttsQueue.length === 0)) {
            if (!session.disconnectTimer) {
                session.disconnectTimer = setTimeout(() => {
                    const currentSession = vc[guildId];
                    if (currentSession && (!currentSession.queue || currentSession.queue.length === 0) && !currentSession.isTtsPlaying && (!currentSession.ttsQueue || currentSession.ttsQueue.length === 0)) {
                        const V = global.Voice || require('@discordjs/voice');
                        const connection = V.getVoiceConnection(guildId);
                        if (connection && connection.state.status !== V.VoiceConnectionStatus.Destroyed) {
                            connection.destroy();
                        }
                        this.cleanup(guildId);
                    }
                }, 120_000);
            }
        }
    },

    cleanup(guildId) {
        if (!global.vc || !vc[guildId]) return;
        const session = vc[guildId];

        session.queue = [];
        session.isCachedPlaying = false;
        session.isLooping = false;
        session.isRadio = false;
        session.isPaused = false;
        session.pausedAt = null;
        session.totalPausedMs = 0;

        if (session.disconnectTimer) {
            clearTimeout(session.disconnectTimer);
            session.disconnectTimer = null;
        }

        if (session.cacheWriter) {
            try { session.cacheWriter.abort(); } catch (_) {}
            session.cacheWriter = null;
        }

        if (session.diskReadStream) {
            try { session.diskReadStream.destroy(); } catch (_) {}
            session.diskReadStream = null;
        }

        if (session.musicProc && !session.musicProc.killed) {
            try { session.musicProc.kill(); } catch (_) {}
            session.musicProc = null;
        }

        if (session.ytProc && !session.ytProc.killed) {
            try { session.ytProc.kill(); } catch (_) {}
            session.ytProc = null;
        }

        if (session.currentTtsProc && !session.currentTtsProc.killed) {
            try { session.currentTtsProc.kill(); } catch (_) {}
            session.currentTtsProc = null;
        }

        if (session.encoder && !session.encoder.killed) {
            try { session.encoder.kill(); } catch (_) {}
            session.encoder = null;
        }

        if (session.ttsQueue) {
            for (const item of session.ttsQueue) {
                item.resolve?.();
            }
            session.ttsQueue = [];
        }

        if (session.mixer) {
            session.mixer.destroy();
            session.mixer = null;
        }

        if (session.player) {
            session.player.stop();
            session.player = null;
        }

        delete vc[guildId];
    }
};
