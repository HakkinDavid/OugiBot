const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

class AudioCacheManager {
    constructor() {
        this.cacheDir = path.join(__dirname, '../cachedvoice/audio_cache');
        this.maxSizeBytes = 500 * 1024 * 1024; // 500 MB max total disk cache
        this.maxAgeMs = 24 * 60 * 60 * 1000;  // 24-hour TTL
        this.cacheMap = new Map(); // videoId -> { filePath, sizeBytes, lastAccessedAt, createdAt }
        this.metadataPath = path.join(this.cacheDir, 'metadata.json');
        this.metadataMap = new Map(); // videoId -> { title, duration, thumbnail, url }
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

            // Load persistent metadata map
            if (fs.existsSync(this.metadataPath)) {
                try {
                    const rawMeta = fs.readFileSync(this.metadataPath, 'utf8');
                    const parsed = JSON.parse(rawMeta);
                    for (const [k, v] of Object.entries(parsed)) {
                        this.metadataMap.set(k, v);
                    }
                } catch (_) {}
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
                            this.metadataMap.delete(videoId);
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
            global.ougi?.text({ lang: 'en', stringID: "console_cacheInitError" }).then(msg => console.error(msg, err));
        }
    }

    saveMetadata(videoId, meta) {
        if (!videoId || !meta) return;
        const existing = this.metadataMap.get(videoId) || {};
        this.metadataMap.set(videoId, {
            title: meta.title || existing.title || `Cached Track (${videoId})`,
            duration: meta.duration || existing.duration || "Live",
            thumbnail: meta.thumbnail || existing.thumbnail || "https://github.com/HakkinDavid/OugiBot/blob/master/images/ougimusic.png?raw=true",
            url: meta.url || existing.url || `https://www.youtube.com/watch?v=${videoId}`
        });

        try {
            const obj = {};
            for (const [k, v] of this.metadataMap.entries()) {
                if (this.cacheMap.has(k)) {
                    obj[k] = v;
                }
            }
            fs.writeFileSync(this.metadataPath, JSON.stringify(obj, null, 2), 'utf8');
        } catch (_) {}
    }

    getMetadata(videoId) {
        return this.metadataMap.get(videoId) || null;
    }

    getAllCached() {
        const list = [];
        for (const [videoId, entry] of this.cacheMap.entries()) {
            if (fs.existsSync(entry.filePath)) {
                const meta = this.getMetadata(videoId) || {};
                list.push({
                    videoId,
                    filePath: entry.filePath,
                    sizeBytes: entry.sizeBytes,
                    title: meta.title || `Cached Track (${videoId})`,
                    duration: meta.duration || "Live",
                    thumbnail: meta.thumbnail || "https://github.com/HakkinDavid/OugiBot/blob/master/images/ougimusic.png?raw=true",
                    url: meta.url || `https://www.youtube.com/watch?v=${videoId}`
                });
            }
        }
        return list;
    }

    getRadioSeeds() {
        return [
            { title: "Decent Black - Ougi Oshino (Monogatari Series)", query: "Decent Black Ougi Oshino Monogatari", duration: "04:36", url: "https://www.youtube.com/watch?v=HPOKr-Wyscw" },
            { title: "Mathemagics - Sodachi Oikura (Owarimonogatari)", query: "Mathemagics Sodachi Oikura Monogatari", duration: "04:04", url: "https://www.youtube.com/watch?v=Q2yderDJKJA" },
            { title: "Dark Cherry Mystery - Ougi Oshino (Owarimonogatari S2)", query: "Dark Cherry Mystery Ougi Oshino", duration: "04:18", url: "https://www.youtube.com/watch?v=MsHk2Z41riE" },
            { title: "Renai Circulation - Nadeko Sengoku (Bakemonogatari)", query: "Renai Circulation Nadeko Sengoku", duration: "04:12", url: "https://www.youtube.com/watch?v=uKxyLmbOc0Q" },
            { title: "Chocolate Insomnia - Tsubasa Hanekawa (Nekomonogatari Shiro)", query: "Chocolate Insomnia Tsubasa Hanekawa", duration: "04:36", url: "https://www.youtube.com/watch?v=7qZugJCf2eI" },
            { title: "Staple Stable - Hitagi Senjougahara (Bakemonogatari)", query: "Staple Stable Hitagi Senjougahara", duration: "04:34", url: "https://www.youtube.com/watch?v=63vQ2g2fU4o" },
            { title: "Orange Mint - Yotsugi Ononoki (Tsukimonogatari)", query: "Orange Mint Yotsugi Ononoki", duration: "04:34", url: "https://www.youtube.com/watch?v=uD9g0j93_gI" },
            { title: "Platinum Disco - Tsukihi Araragi (Nisemonogatari)", query: "Platinum Disco Tsukihi Araragi", duration: "04:14", url: "https://www.youtube.com/watch?v=Y8SwZJgxF40" },
            { title: "Sugar Sweet Nightmare - Tsubasa Hanekawa (Bakemonogatari)", query: "Sugar Sweet Nightmare Tsubasa Hanekawa", duration: "04:28", url: "https://www.youtube.com/watch?v=yYm_gQ55j6A" },
            { title: "Marshmallow Justice - Karen Araragi (Nisemonogatari)", query: "Marshmallow Justice Karen Araragi", duration: "04:14", url: "https://www.youtube.com/watch?v=UqQY94PcvqA" },
            { title: "Terminal Terminal - Mayoi Hachikuji (Owarimonogatari S2)", query: "Terminal Terminal Mayoi Hachikuji", duration: "04:29", url: "https://www.youtube.com/watch?v=rUj241wW49E" },
            { title: "Dreamy Date Drive - Hitagi Senjougahara (Owarimonogatari S2)", query: "Dreamy Date Drive Hitagi Senjougahara", duration: "04:42", url: "https://www.youtube.com/watch?v=9jDkGz6-Q7g" }
        ];
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

    createCacheWriteStream(urlOrId, meta = null) {
        const videoId = this.extractVideoId(urlOrId);
        if (!videoId) return null;

        const targetFile = path.join(this.cacheDir, `${videoId}.pcm`);
        const tempFile = path.join(this.cacheDir, `${videoId}.${Date.now()}.temp`);

        let writeStream;
        try {
            writeStream = fs.createWriteStream(tempFile);
        } catch (err) {
            global.ougi?.text({ lang: 'en', stringID: "console_cacheFailedStream", values: { id: videoId } }).then(msg => {
                console.error(msg, err);
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
                    if (meta) {
                        this.saveMetadata(videoId, meta);
                    }
                    this.enforceSizeLimit();
                    const cachedMsg = await global.ougi?.text({
                        lang: 'en',
                        stringID: "console_cacheTrackSuccess",
                        values: {
                            id: videoId,
                            mb: Math.round(totalBytesWritten / 1024 / 1024 * 10) / 10
                        }
                    });
                    if (cachedMsg) console.log(cachedMsg);
                } else if (fs.existsSync(tempFile)) {
                    fs.unlinkSync(tempFile);
                }
            } catch (err) {
                const finalizeErrMsg = await global.ougi?.text({
                    lang: 'en',
                    stringID: "console_cacheFinalizeError",
                    values: { id: videoId }
                });
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
                global.ougi?.text({
                    lang: 'en',
                    stringID: "console_cacheEvicted",
                    values: {
                        id: entry.id,
                        mb: Math.round(entry.sizeBytes / 1024 / 1024 * 10) / 10
                    }
                }).then(msg => {
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
        const prefetchMsg = await global.ougi?.text({
            lang: 'en',
            stringID: "console_cachePrefetching",
            values: {
                title: song.title,
                id: videoId
            }
        });
        if (prefetchMsg) console.log(prefetchMsg);

        try {
            const cacheWriter = this.createCacheWriteStream(videoId, song);
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
            const prefetchErrMsg = await global.ougi?.text({
                lang: 'en',
                stringID: "console_cachePrefetchError",
                values: { id: videoId }
            });
            if (prefetchErrMsg) console.warn(prefetchErrMsg, err.message);
            this.activePrefetch = null;
            this.processNextPrefetch();
        }
    }
}

module.exports = new AudioCacheManager();
