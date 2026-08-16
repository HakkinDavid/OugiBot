const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

class AudioCacheManager {
    constructor() {
        this.cacheDir = path.join(__dirname, '../cachedvoice/audio_cache');
        this.maxSizeBytes = 500 * 1024 * 1024; // 500 MB max total disk cache
        this.maxAgeMs = 24 * 60 * 60 * 1000;  // 24-hour TTL
        this.cacheMap = new Map(); // videoId -> { filePath, sizeBytes, lastAccessedAt, createdAt }
        this.prefetchQueue = [];
        this.activePrefetch = null;
        this.isInitialized = false;

        this.init();
    }

    init() {
        if (this.isInitialized) return;
        try {
            if (!fs.existsSync(this.cacheDir)) {
                fs.mkdirSync(this.cacheDir, { recursive: true });
            }

            const files = fs.readdirSync(this.cacheDir);
            const now = Date.now();

            for (const file of files) {
                const fullPath = path.join(this.cacheDir, file);
                if (file.endsWith('.temp')) {
                    // Remove incomplete temp files from previous bot sessions
                    try { fs.unlinkSync(fullPath); } catch (_) {}
                    continue;
                }

                if (file.endsWith('.pcm')) {
                    const videoId = path.basename(file, '.pcm');
                    try {
                        const stat = fs.statSync(fullPath);
                        if (now - stat.mtimeMs > this.maxAgeMs) {
                            fs.unlinkSync(fullPath);
                        } else {
                            this.cacheMap.set(videoId, {
                                filePath: fullPath,
                                sizeBytes: stat.size,
                                lastAccessedAt: stat.mtimeMs,
                                createdAt: stat.ctimeMs
                            });
                        }
                    } catch (_) {}
                }
            }

            this.enforceSizeLimit();
            this.isInitialized = true;
        } catch (err) {
            global.ougi?.text('en', "console_cacheInitError").then(msg => console.error(msg, err));
        }
    }

    extractVideoId(urlOrId) {
        if (!urlOrId || typeof urlOrId !== 'string') return null;
        const urlStr = urlOrId.trim();

        // 11-char YouTube ID directly
        if (/^[a-zA-Z0-9_-]{11}$/.test(urlStr)) {
            return urlStr;
        }

        // Standard YouTube URL formats
        const match = urlStr.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/i);
        if (match && match[1]) {
            return match[1];
        }

        // Fallback: sanitized alphanumeric string
        const clean = urlStr.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 32);
        return clean || 'unknown_audio';
    }

    has(urlOrId) {
        const videoId = this.extractVideoId(urlOrId);
        if (!videoId) return false;

        const entry = this.cacheMap.get(videoId);
        if (!entry) return false;

        if (!fs.existsSync(entry.filePath)) {
            this.cacheMap.delete(videoId);
            return false;
        }

        return true;
    }

    get(urlOrId) {
        const videoId = this.extractVideoId(urlOrId);
        if (!videoId) return null;

        const entry = this.cacheMap.get(videoId);
        if (!entry) return null;

        if (!fs.existsSync(entry.filePath)) {
            this.cacheMap.delete(videoId);
            return null;
        }

        entry.lastAccessedAt = Date.now();
        return entry;
    }

    createReadStream(urlOrId) {
        const entry = this.get(urlOrId);
        if (!entry) return null;

        return fs.createReadStream(entry.filePath, {
            highWaterMark: 3840 * 8 // 160ms chunks
        });
    }

    createCacheWriteStream(urlOrId) {
        const videoId = this.extractVideoId(urlOrId);
        if (!videoId) return null;

        const targetFile = path.join(this.cacheDir, `${videoId}.pcm`);
        const tempFile = path.join(this.cacheDir, `${videoId}.${Date.now()}.temp`);

        let writeStream;
        try {
            writeStream = fs.createWriteStream(tempFile);
        } catch (err) {
            global.ougi?.text('en', "console_cacheFailedStream").then(tpl => {
                console.error(tpl.replace(/{id}/g, videoId), err);
            });
            return null;
        }

        let totalBytesWritten = 0;
        let isClosed = false;

        const finishWrite = async () => {
            if (isClosed) return;
            isClosed = true;

            try {
                if (fs.existsSync(tempFile) && totalBytesWritten >= 3840) {
                    fs.renameSync(tempFile, targetFile);
                    this.cacheMap.set(videoId, {
                        filePath: targetFile,
                        sizeBytes: totalBytesWritten,
                        lastAccessedAt: Date.now(),
                        createdAt: Date.now()
                    });
                    this.enforceSizeLimit();
                    const cachedMsg = (await global.ougi?.text('en', "console_cacheTrackSuccess"))
                        ?.replace(/{id}/g, videoId)
                        ?.replace(/{mb}/g, Math.round(totalBytesWritten / 1024 / 1024 * 10) / 10);
                    if (cachedMsg) console.log(cachedMsg);
                } else if (fs.existsSync(tempFile)) {
                    fs.unlinkSync(tempFile);
                }
            } catch (err) {
                const finalizeErrMsg = (await global.ougi?.text('en', "console_cacheFinalizeError"))?.replace(/{id}/g, videoId);
                if (finalizeErrMsg) console.error(finalizeErrMsg, err);
                try { if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile); } catch (_) {}
            }
        };

        const abortWrite = () => {
            if (isClosed) return;
            isClosed = true;
            try {
                writeStream.destroy();
            } catch (_) {}
            try {
                if (fs.existsSync(tempFile)) {
                    fs.unlinkSync(tempFile);
                }
            } catch (_) {}
        };

        return {
            write(chunk) {
                if (isClosed) return;
                totalBytesWritten += chunk.length;
                // Limit maximum file cache to 80MB (~7 mins of raw audio) to avoid unbounded disk
                if (totalBytesWritten > 80 * 1024 * 1024) {
                    abortWrite();
                    return;
                }
                try {
                    writeStream.write(chunk);
                } catch (_) {}
            },
            end() {
                if (isClosed) return;
                writeStream.end(() => {
                    finishWrite();
                });
            },
            abort: abortWrite
        };
    }

    enforceSizeLimit() {
        let totalSize = 0;
        const entries = [];

        for (const [id, entry] of this.cacheMap.entries()) {
            totalSize += entry.sizeBytes;
            entries.push({ id, ...entry });
        }

        if (totalSize <= this.maxSizeBytes) return;

        // Sort LRU: oldest accessed first
        entries.sort((a, b) => a.lastAccessedAt - b.lastAccessedAt);

        for (const entry of entries) {
            if (totalSize <= this.maxSizeBytes) break;
            try {
                if (fs.existsSync(entry.filePath)) {
                    fs.unlinkSync(entry.filePath);
                }
                this.cacheMap.delete(entry.id);
                totalSize -= entry.sizeBytes;
                global.ougi?.text('en', "console_cacheEvicted").then(tpl => {
                    const msg = tpl?.replace(/{id}/g, entry.id)?.replace(/{mb}/g, Math.round(entry.sizeBytes / 1024 / 1024 * 10) / 10);
                    if (msg) console.log(msg);
                });
            } catch (_) {}
        }
    }

    prefetch(song) {
        if (!song || !song.url) return;
        const videoId = this.extractVideoId(song.url);
        if (!videoId || this.has(videoId)) return;

        // Check if already queued or prefetching
        if (this.activePrefetch?.videoId === videoId) return;
        if (this.prefetchQueue.some(item => item.videoId === videoId)) return;

        this.prefetchQueue.push({ videoId, song });
        this.processNextPrefetch();
    }

    async processNextPrefetch() {
        if (this.activePrefetch || this.prefetchQueue.length === 0) return;

        const nextItem = this.prefetchQueue.shift();
        const { videoId, song } = nextItem;

        if (this.has(videoId)) {
            this.processNextPrefetch();
            return;
        }

        this.activePrefetch = nextItem;
        const prefetchMsg = (await global.ougi?.text('en', "console_cachePrefetching"))
            ?.replace(/{title}/g, song.title)
            ?.replace(/{id}/g, videoId);
        if (prefetchMsg) console.log(prefetchMsg);

        try {
            const cacheWriter = this.createCacheWriteStream(videoId);
            if (!cacheWriter) {
                this.activePrefetch = null;
                this.processNextPrefetch();
                return;
            }

            const youtubedl = global.youtubedl || require('youtube-dl-exec');
            let ytProc = null;
            let ffmpegProc = null;

            if (global.cachedCookiesPath) {
                try {
                    ytProc = youtubedl.exec(song.url, {
                        output: '-',
                        format: 'bestaudio/best',
                        jsRuntimes: 'node',
                        cookies: global.cachedCookiesPath,
                        noWarnings: true
                    });

                    // Catch SIGTERM / tinyspawn rejection cleanly
                    ytProc.catch(() => {});

                    ffmpegProc = spawn('ffmpeg', [
                        '-loglevel', 'error',
                        '-i', 'pipe:0',
                        '-f', 's16le',
                        '-ar', '48000',
                        '-ac', '2',
                        '-vn',
                        'pipe:1'
                    ]);

                    ytProc.stdout.pipe(ffmpegProc.stdin);
                } catch (e) {
                    ytProc = null;
                    ffmpegProc = null;
                }
            }

            if (!ffmpegProc) {
                const rawStreamUrl = (await youtubedl(song.url, {
                    getUrl: true,
                    format: 'bestaudio/best',
                    extractorArgs: 'youtube:player_client=android,tv_embedded',
                    noWarnings: true
                })).trim();

                ffmpegProc = spawn('ffmpeg', [
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

            ffmpegProc.stdout.on('data', (chunk) => {
                cacheWriter.write(chunk);
            });

            const finishPrefetch = () => {
                cacheWriter.end();
                this.activePrefetch = null;
                this.processNextPrefetch();
            };

            ffmpegProc.on('close', finishPrefetch);
            ffmpegProc.on('error', () => {
                cacheWriter.abort();
                this.activePrefetch = null;
                this.processNextPrefetch();
            });

        } catch (err) {
            const prefetchErrMsg = (await global.ougi?.text('en', "console_cachePrefetchError"))?.replace(/{id}/g, videoId);
            if (prefetchErrMsg) console.warn(prefetchErrMsg, err.message);
            this.activePrefetch = null;
            this.processNextPrefetch();
        }
    }
}

module.exports = new AudioCacheManager();
