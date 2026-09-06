const youtubedl = require('youtube-dl-exec');
const path = require('node:path');
const fs = require('fs');

/**
 * Normalizes user input (URL, prefixed handle, or raw handle) into a standard platform + handle object.
 */
function normalizeFeedInput(input) {
    if (!input || typeof input !== 'string') return null;
    let text = input.trim();

    // 1. Check for Instagram URLs
    const igMatch = text.match(/(?:https?:\/\/)?(?:www\.)?instagram\.com\/([A-Za-z0-9_.-]+)/i);
    if (igMatch) {
        const handle = igMatch[1].replace(/^(?:p|reel|stories|explore|tv|reels)$/i, '');
        if (handle) {
            return {
                platform: 'instagram',
                handle: handle.toLowerCase(),
                rawUrl: `https://www.instagram.com/${handle}/`
            };
        }
    }

    // 2. Check for TikTok URLs
    const ttMatch = text.match(/(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@?([A-Za-z0-9_.-]+)/i);
    if (ttMatch) {
        const handle = ttMatch[1].replace(/^(?:video|tag|music|discover)$/i, '');
        if (handle) {
            return {
                platform: 'tiktok',
                handle: handle.toLowerCase(),
                rawUrl: `https://www.tiktok.com/@${handle}`
            };
        }
    }

    // 3. Prefixed inputs: "ig:handle", "ig:@handle", "tt:handle", "tt:@handle", "instagram:handle", "tiktok:handle", "insta:handle"
    const prefixMatch = text.match(/^(ig|instagram|insta|tt|tiktok)[:\/=\s]+@?([A-Za-z0-9_.-]+)$/i);
    if (prefixMatch) {
        const prefix = prefixMatch[1].toLowerCase();
        const isIg = prefix === 'ig' || prefix === 'instagram' || prefix === 'insta';
        const plat = isIg ? 'instagram' : 'tiktok';
        const handle = prefixMatch[2].toLowerCase();
        return {
            platform: plat,
            handle: handle,
            rawUrl: isIg ? `https://www.instagram.com/${handle}/` : `https://www.tiktok.com/@${handle}`
        };
    }

    // Unprefixed raw handles without platform cannot be reliably attributed and are rejected
    return null;
}

/**
 * Fetches latest video posts from a TikTok user profile using yt-dlp.
 */
async function fetchTikTokProfile(handle, limit = 10) {
    const sanitized = handle.replace(/^@/, '').toLowerCase();
    const url = `https://www.tiktok.com/@${sanitized}`;

    try {
        const data = await youtubedl(url, {
            dumpSingleJson: true,
            flatPlaylist: true,
            playlistEnd: limit,
            noWarnings: true
        });

        if (!data || !data.entries) return [];

        const items = [];
        for (const entry of data.entries) {
            if (!entry || !entry.id) continue;
            const videoId = entry.id;
            const directUrl = entry.url || `https://www.tiktok.com/@${sanitized}/video/${videoId}`;
            const embedUrl = `https://kktiktok.com/@${sanitized}/video/${videoId}`;
            const coverImg = entry.thumbnails?.[0]?.url || null;

            items.push({
                id: `tiktok:${videoId}`,
                platform: 'tiktok',
                handle: sanitized,
                post_id: videoId,
                author_name: entry.uploader || entry.channel || sanitized,
                author_avatar: null,
                url: directUrl,
                embed_url: embedUrl,
                caption: entry.title || entry.description || '',
                media_type: 'video',
                media_urls: coverImg ? [coverImg] : [],
                thumbnail_url: coverImg,
                published_at: entry.timestamp || Math.floor(Date.now() / 1000),
                metrics: {
                    views: entry.view_count || 0,
                    likes: entry.like_count || 0,
                    comments: entry.comment_count || 0,
                    reposts: entry.repost_count || 0
                }
            });
        }
        return items;
    } catch (e) {
        console.error(`[TikTok Fetch Error @${sanitized}]:`, e.message?.slice(0, 160));
        return [];
    }
}

function idToShortcode(idStr) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    try {
        let id = BigInt(idStr.split('_')[0]);
        let shortcode = '';
        while (id > 0n) {
            const remainder = Number(id % 64n);
            id = id / 64n;
            shortcode = alphabet[remainder] + shortcode;
        }
        return shortcode;
    } catch {
        return null;
    }
}

function fetchInstagramProfileSSR(username, userAgent = 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', maxRedirects = 5) {
    const https = require('https');
    return new Promise((resolve) => {
        try {
            const url = `https://www.instagram.com/${username}/`;
            const u = new URL(url);
            const req = https.get({
                protocol: u.protocol,
                hostname: u.hostname,
                path: u.pathname + u.search,
                headers: {
                    'User-Agent': userAgent,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                },
                timeout: 10000
            }, (res) => {
                if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && maxRedirects > 0) {
                    const nextUrl = new URL(res.headers.location, url).toString();
                    return resolve(fetchInstagramProfileSSR(nextUrl, userAgent, maxRedirects - 1));
                }
                let data = '';
                res.on('data', c => data += c);
                res.on('end', () => {
                    const shortcodes = [];

                    // Extract shortcodes via ig_cache_key (Base64 media ID)
                    const cacheKeys = [
                        ...data.matchAll(/ig_cache_key=([A-Za-z0-9%_-]+)/g),
                        ...data.matchAll(/ig_cache_key%3D([A-Za-z0-9%_-]+)/g),
                        ...data.matchAll(/ig_cache_key["\s:=]+([A-Za-z0-9%_-]+)/g)
                    ].map(m => decodeURIComponent(m[1]));

                    for (const k of cacheKeys) {
                        try {
                            const raw = Buffer.from(k, 'base64').toString('utf-8');
                            const mediaId = raw.split('_')[0].slice(0, 19);
                            if (/^\d+$/.test(mediaId)) {
                                const code = idToShortcode(mediaId);
                                if (code && !shortcodes.includes(code)) {
                                    shortcodes.push(code);
                                }
                            }
                        } catch (e) {}
                    }

                    // Extract direct post or reel links from HTML
                    const directMatches = [
                        ...data.matchAll(/\/p\/([A-Za-z0-9_-]{11})/g),
                        ...data.matchAll(/\/reel\/([A-Za-z0-9_-]{11})/g),
                        ...data.matchAll(/"shortcode":"([A-Za-z0-9_-]{11})"/g)
                    ].map(m => m[1]);

                    for (const code of directMatches) {
                        if (code && !shortcodes.includes(code)) {
                            shortcodes.push(code);
                        }
                    }

                    resolve({ shortcodes, rawHtml: data });
                });
            });

            req.on('error', () => resolve({ shortcodes: [], rawHtml: '' }));
            req.on('timeout', () => {
                req.destroy();
                resolve({ shortcodes: [], rawHtml: '' });
            });
        } catch (e) {
            resolve({ shortcodes: [], rawHtml: '' });
        }
    });
}

/**
 * Fetches latest posts from an Instagram user profile using hybrid SSR shortcode discovery and single-post metadata resolution.
 */
async function fetchInstagramProfile(handle, limit = 10) {
    const sanitized = handle.replace(/^@/, '').toLowerCase();
    const items = [];

    try {
        let { shortcodes } = await fetchInstagramProfileSSR(sanitized);

        if (!shortcodes || shortcodes.length === 0) {
            // Fallback 1: Try Discordbot crawler UA
            const resDiscord = await fetchInstagramProfileSSR(sanitized, 'Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)');
            shortcodes = resDiscord.shortcodes;
        }

        if (!shortcodes || shortcodes.length === 0) {
            // Fallback 2: Try Twitterbot crawler UA
            const resTwitter = await fetchInstagramProfileSSR(sanitized, 'Twitterbot/1.0');
            shortcodes = resTwitter.shortcodes;
        }

        if (shortcodes && shortcodes.length > 0) {
            const targetCodes = shortcodes.slice(0, Math.min(limit, 10));
            
            // Extract post metadata for discovered shortcodes
            for (const code of targetCodes) {
                const postUrl = `https://www.instagram.com/p/${code}/`;
                try {
                    const data = await youtubedl(postUrl, {
                        dumpSingleJson: true,
                        noWarnings: true
                    });

                    if (data && data.id) {
                        const coverImg = data.thumbnail || data.thumbnails?.[0]?.url || null;
                        items.push({
                            id: `instagram:${data.id}`,
                            platform: 'instagram',
                            handle: sanitized,
                            post_id: data.id,
                            author_name: data.uploader || sanitized,
                            author_avatar: null,
                            url: postUrl,
                            embed_url: `https://kkinstagram.com/p/${data.id}/`,
                            caption: data.title || data.description || '',
                            media_type: data._type === 'video' || data.vcodec !== 'none' ? 'video' : 'image',
                            media_urls: coverImg ? [coverImg] : [],
                            thumbnail_url: coverImg,
                            published_at: data.timestamp || Math.floor(Date.now() / 1000),
                            metrics: {
                                views: data.view_count || 0,
                                likes: data.like_count || 0,
                                comments: data.comment_count || 0
                            }
                        });
                    }
                } catch (err) {
                    // If single-post yt-dlp fails, still return basic post reference
                    items.push({
                        id: `instagram:${code}`,
                        platform: 'instagram',
                        handle: sanitized,
                        post_id: code,
                        author_name: sanitized,
                        author_avatar: null,
                        url: postUrl,
                        embed_url: `https://kkinstagram.com/p/${code}/`,
                        caption: `Instagram post by @${sanitized}`,
                        media_type: 'image',
                        media_urls: [],
                        thumbnail_url: null,
                        published_at: Math.floor(Date.now() / 1000),
                        metrics: { views: 0, likes: 0, comments: 0 }
                    });
                }
            }
        }
    } catch (e) {
        console.error(`[Instagram Fetch Error @${sanitized}]:`, e.message?.slice(0, 160));
    }

    return items;
}

/**
 * Unified profile fetcher.
 */
async function fetchProfile(platform, handle, limit = 10) {
    const plat = platform?.toLowerCase();
    if (plat === 'tiktok' || plat === 'tt') {
        return await fetchTikTokProfile(handle, limit);
    } else if (plat === 'instagram' || plat === 'ig') {
        return await fetchInstagramProfile(handle, limit);
    }
    return [];
}

module.exports = {
    normalizeFeedInput,
    idToShortcode,
    fetchTikTokProfile,
    fetchInstagramProfile,
    fetchProfile
};
