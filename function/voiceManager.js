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
        this.musicBuffers.push(chunk);
        this.musicBytes += chunk.length;
        this._process();
    }

    clearMusicBuffer() {
        this.musicBuffers = [];
        this.musicBytes = 0;
        this.isMusicActive = false;
    }

    endMusic() {
        this.isMusicActive = false;
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
            const hasTts = this.ttsBytes >= this.chunkSize || (this.ttsBytes > 0 && !this.isTtsActive);

            // Trigger flow control callback if buffer drops low
            if (this.musicBytes < 96000 && this.onBufferLow) {
                this.onBufferLow();
            }

            if (this.isTtsActive || this.ttsBytes > 0) {
                // TTS is active or playing remaining buffered chunks
                if (hasTts && hasMusic) {
                    const m = this._consumeMusic(this.chunkSize);
                    const t = this._consumeTts(this.chunkSize);
                    const mixed = this._mix(m, t, this.duckedVolume, this.ttsVolume);
                    if (!this.push(mixed)) break;
                } else if (hasTts && !this.isMusicActive && this.musicBytes === 0) {
                    const bytesToRead = Math.min(this.chunkSize, this.ttsBytes);
                    const t = this._consumeTts(bytesToRead);
                    const scaled = this._scaleVolume(t, this.ttsVolume);
                    if (!this.push(scaled)) break;
                } else if (hasTts && this.isMusicActive && !hasMusic) {
                    const bytesToRead = Math.min(this.chunkSize, this.ttsBytes);
                    const t = this._consumeTts(bytesToRead);
                    const scaled = this._scaleVolume(t, this.ttsVolume);
                    if (!this.push(scaled)) break;
                } else if (this.isTtsActive && hasMusic) {
                    // TTS stream is active but still buffering first chunk; duck music immediately
                    const m = this._consumeMusic(this.chunkSize);
                    const ducked = this._scaleVolume(m, this.duckedVolume);
                    if (!this.push(ducked)) break;
                } else {
                    break;
                }
            } else if (hasMusic) {
                // Music only (normal volume)
                const m = this._consumeMusic(this.chunkSize);
                if (!this.push(m)) break;
            } else if (!this.isMusicActive && this.musicBytes > 0) {
                const bytesToRead = Math.min(this.chunkSize, this.musicBytes);
                const m = this._consumeMusic(bytesToRead);
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
        const chunk = Buffer.alloc(aligned);
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
        const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, getVoiceConnection, entersState, VoiceConnectionStatus, StreamType } = Voice;

        if (!global.vc) global.vc = {};
        if (!vc[guildId]) {
            vc[guildId] = {
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

        const session = vc[guildId];

        // Clear any pending idle disconnect timer
        if (session.disconnectTimer) {
            clearTimeout(session.disconnectTimer);
            session.disconnectTimer = null;
        }

        let connection = getVoiceConnection(guildId);
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

        if (!connection._hasUnifiedDisconnectHandler) {
            connection._hasUnifiedDisconnectHandler = true;
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
                    this.cleanup(guildId);
                }
            });
        }

        if (connection.state.status !== VoiceConnectionStatus.Ready) {
            await entersState(connection, VoiceConnectionStatus.Ready, 15_000);
        }

        session.connection = connection;

        // Ensure Player exists
        if (!session.player) {
            session.player = createAudioPlayer();
            session.player.on('error', (err) => {
                console.error(`AudioPlayer error in guild ${guildId}:`, err);
            });
            session.player.on(AudioPlayerStatus.Idle, () => {
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
        const { createAudioResource, StreamType } = Voice;
        const session = vc[guildId];
        if (!session) return;

        if (session.mixer && !session.mixer.destroyed) {
            session.mixer.destroy();
        }
        if (session.encoder && !session.encoder.killed) {
            try { session.encoder.kill(); } catch (_) {}
        }

        const mixer = new AudioMixer();
        const encoder = spawn('ffmpeg', [
            '-loglevel', 'error',
            '-f', 's16le',
            '-ar', '48000',
            '-ac', '2',
            '-i', 'pipe:0',
            '-c:a', 'libopus',
            '-b:a', '128k',
            '-f', 'ogg',
            'pipe:1'
        ]);

        encoder.on('error', (err) => {
            console.error(`Opus encoder error in guild ${guildId}:`, err);
        });

        encoder.stdin.on('error', (err) => {
            // Ignore EPIPE when encoder closes
        });

        mixer.pipe(encoder.stdin);

        const resource = createAudioResource(encoder.stdout, {
            inputType: StreamType.OggOpus
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

        const song = session.queue[0];
        try {
            const ytOptions = {
                getUrl: true,
                format: 'bestaudio/best',
                jsRuntimes: 'node',
                extractorArgs: 'youtube:player_client=mweb,android,web',
                noWarnings: true
            };

            if (global.cachedCookiesPath) {
                ytOptions.cookies = global.cachedCookiesPath;
            }

            const rawStreamUrl = (await youtubedl(song.url, ytOptions)).trim();

            if (!session.mixer || session.mixer.destroyed || session.mixer.ended) {
                this.startMixerPipeline(msg.guildId);
            }

            const musicProc = spawn('ffmpeg', [
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

            session.musicProc = musicProc;

            musicProc.stdout.on('data', (chunk) => {
                if (session.mixer && !session.mixer.destroyed) {
                    session.mixer.writeMusic(chunk);
                    // Flow control / Backpressure: pause if buffer > 192KB (~1s)
                    if (session.mixer.musicBytes > 192000 && !musicProc.stdout.isPaused()) {
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
            });

            musicProc.on('close', (code) => {
                session.musicProc = null;
                // Only advance queue if this wasn't aborted manually by skip
                if (session.queue[0] === song) {
                    session.queue.shift();
                    if (session.queue.length > 0) {
                        this.playMusic(msg, vcChannel);
                    } else {
                        if (session.mixer) {
                            session.mixer.endMusic();
                        }
                    }
                }
            });

        } catch (err) {
            console.error(`Error streaming ${song.title}:`, err);
            msg.channel.send(`⚠️ Unable to play **${song.title}** (stream unavailable or restricted). Skipping...`).catch(() => {});
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

        if (!session.mixer || session.mixer.destroyed || session.mixer.ended) {
            this.startMixerPipeline(msg.guildId);
        }

        session.isTtsPlaying = true;
        session.mixer.startTts();

        try {
            for (const chunk of ttsUrls) {
                if (!vc[msg.guildId]) break; // stopped

                const response = await axios.get(chunk.url, {
                    responseType: 'stream',
                    headers: {
                        'User-Agent': 'stagefright/1.2 (Linux;Android 5.0)',
                        'Referer': 'https://translate.google.com/'
                    },
                    timeout: 10000
                });

                await new Promise((resolve) => {
                    const ttsProc = spawn('ffmpeg', [
                        '-loglevel', 'error',
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
                        resolve();
                    };

                    ttsProc.on('close', cleanupProc);
                    ttsProc.on('error', (e) => {
                        console.error("TTS FFmpeg process error:", e);
                        cleanupProc();
                    });
                });
            }
        } catch (err) {
            console.error("Error in TTS streaming:", err);
        } finally {
            if (session.mixer) {
                session.mixer.endTts();
            }
            session.isTtsPlaying = false;
            msg.react('🔊').catch(() => {});
        }
    },

    skipMusic(guildId, msg, vcChannel) {
        const session = vc[guildId];
        if (!session || session.queue.length === 0) return false;

        if (session.musicProc && !session.musicProc.killed) {
            try { session.musicProc.kill(); } catch (_) {}
            session.musicProc = null;
        }

        if (session.mixer) {
            session.mixer.clearMusicBuffer();
        }

        session.queue.shift();

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
        if (session.queue.length > 0 && (!session.musicProc || session.musicProc.killed)) {
            return;
        }

        // If queue empty and not speaking, schedule idle disconnect after 2 minutes
        if ((!session.queue || session.queue.length === 0) && !session.isTtsPlaying) {
            if (!session.disconnectTimer) {
                session.disconnectTimer = setTimeout(() => {
                    const currentSession = vc[guildId];
                    if (currentSession && (!currentSession.queue || currentSession.queue.length === 0) && !currentSession.isTtsPlaying) {
                        const { getVoiceConnection, VoiceConnectionStatus } = Voice;
                        const connection = getVoiceConnection(guildId);
                        if (connection && connection.state.status !== VoiceConnectionStatus.Destroyed) {
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

        if (session.disconnectTimer) {
            clearTimeout(session.disconnectTimer);
            session.disconnectTimer = null;
        }

        if (session.musicProc && !session.musicProc.killed) {
            try { session.musicProc.kill(); } catch (_) {}
            session.musicProc = null;
        }

        if (session.currentTtsProc && !session.currentTtsProc.killed) {
            try { session.currentTtsProc.kill(); } catch (_) {}
            session.currentTtsProc = null;
        }

        if (session.encoder && !session.encoder.killed) {
            try { session.encoder.kill(); } catch (_) {}
            session.encoder = null;
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
