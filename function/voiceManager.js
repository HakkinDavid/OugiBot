const { spawn } = require('child_process');
const { Readable } = require('stream');
const axios = require('axios');

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

    async getOrCreateSession(guildId, vcChannel) {
        const V = global.Voice || require('@discordjs/voice');
        const { createAudioPlayer, VoiceConnectionStatus } = V;

        if (!global.vc) global.vc = {};
        if (!vc[guildId]) {
            vc[guildId] = {
                queue: [],
                ttsQueue: [],
                isLooping: false,
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

                // Advance or rotate queue
                if (session.queue && session.queue[0] === song) {
                    if (session.isLooping) {
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

            // Strategy 2: In-Memory Cached PCM (Loop Replay)
            if (song.cachedPcm && song.cachedPcm.length > 0) {
                session.isCachedPlaying = true;
                let chunkIndex = 0;
                let isFeeding = false;

                const feedCachedChunks = () => {
                    if (isFeeding || !session.queue || session.queue[0] !== song) return;
                    isFeeding = true;

                    while (chunkIndex < song.cachedPcm.length) {
                        if (session.mixer && !session.mixer.destroyed) {
                            const chunk = song.cachedPcm[chunkIndex++];
                            session.mixer.writeMusic(chunk);
                            if (session.mixer.musicBytes > 48000) {
                                break;
                            }
                        } else {
                            break;
                        }
                    }

                    isFeeding = false;

                    if (chunkIndex >= song.cachedPcm.length) {
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
                    }
                };

                session.mixer.onBufferLow = () => {
                    if (chunkIndex < song.cachedPcm.length) {
                        feedCachedChunks();
                    }
                };

                feedCachedChunks();

                // Background prefetch next track in queue
                if (session.queue.length > 1) {
                    ougi.audioCacheManager.prefetch(session.queue[1]);
                }
                return;
            }

            // Strategy 3: Network stream + Cache Write (Disk & In-Memory)
            song.cachedPcm = [];
            let totalPcmCached = 0;
            const cacheWriter = ougi.audioCacheManager.createCacheWriteStream(song.url);
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

                    // Write to in-memory cache for immediate loops
                    if (totalPcmCached < 100 * 1024 * 1024) {
                        song.cachedPcm.push(chunk);
                        totalPcmCached += chunk.length;
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
            const unableMsgTemplate = await ougi.text(msg, "music_unableToPlay");
            msg.channel.send(unableMsgTemplate.replace(/{title}/g, song.title)).catch(() => {});
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

            // Wait until the decoded speech has been completely played by the mixer
            while (session.mixer && !session.mixer.destroyed && session.mixer.ttsBytes > 0) {
                await new Promise(r => setTimeout(r, 100));
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

        session.isCachedPlaying = false;
        session.isLooping = false;

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
