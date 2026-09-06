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

function getCookieFilePath() {
    const candidates = [
        path.join(process.cwd(), 'cookies.txt'),
        path.join(process.cwd(), 'cookies.txt.clean'),
        path.join(__dirname, '..', 'cookies.txt'),
        path.join(__dirname, '..', 'cookies.txt.clean')
    ];
    for (const p of candidates) {
        if (fs.existsSync(p)) return p;
    }
    return null;
}

function getInstagramCookies() {
    const cookiePath = getCookieFilePath();
    if (!cookiePath) return { cookieHeader: '', csrfToken: '', cookiePath: null };

    try {
        const content = fs.readFileSync(cookiePath, 'utf8');
        const cookieMap = {};
        for (const line of content.split('\n')) {
            if (!line || line.startsWith('#')) continue;
            const parts = line.split('\t');
            if (parts.length >= 7 && parts[0].includes('instagram.com')) {
                cookieMap[parts[5].trim()] = parts[6].trim();
            }
        }
        if (Object.keys(cookieMap).length > 0) {
            return {
                cookieHeader: Object.entries(cookieMap).map(([k, v]) => `${k}=${v}`).join('; '),
                csrfToken: cookieMap['csrftoken'] || '',
                cookiePath
            };
        }
    } catch (e) {}

    return { cookieHeader: '', csrfToken: '', cookiePath: null };
}

function httpsJsonRequest(options) {
    const https = require('https');
    return new Promise((resolve) => {
        try {
            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', c => data += c);
                res.on('end', () => {
                    try {
                        resolve({ status: res.statusCode, headers: res.headers, data: JSON.parse(data) });
                    } catch (e) {
                        resolve({ status: res.statusCode, headers: res.headers, raw: data });
                    }
                });
            });
            req.on('error', () => resolve(null));
            req.on('timeout', () => { req.destroy(); resolve(null); });
            req.setTimeout(options.timeout || 8000);
            req.end();
        } catch (e) {
            resolve(null);
        }
    });
}

/**
 * Fetches user profile feed via Instagram Private Mobile API (iOS App ID).
 * Completely immune to datacenter IP blocks when valid cookies are loaded.
 */
async function fetchInstagramViaMobileApi(handle, limit = 10) {
    const sanitized = handle.replace(/^@/, '').toLowerCase();
    const { cookieHeader, csrfToken } = getInstagramCookies();
    if (!cookieHeader) return null;

    try {
        // 1. Resolve username to pk via topsearch
        const searchRes = await httpsJsonRequest({
            hostname: 'www.instagram.com',
            path: `/web/search/topsearch/?query=${encodeURIComponent(sanitized)}`,
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
                'Accept': '*/*',
                'X-CSRFToken': csrfToken,
                'X-IG-App-ID': '936619743392459',
                'X-ASBD-ID': '129477',
                'X-IG-WWW-Claim': '0',
                'X-Requested-With': 'XMLHttpRequest',
                'Referer': 'https://www.instagram.com/',
                'Cookie': cookieHeader
            },
            timeout: 8000
        });

        let userId = null;
        let authorAvatar = null;
        let authorName = sanitized;

        if (searchRes && searchRes.data && Array.isArray(searchRes.data.users)) {
            const exact = searchRes.data.users.find(u => u.user?.username?.toLowerCase() === sanitized);
            const userObj = exact?.user || searchRes.data.users[0]?.user;
            if (userObj) {
                userId = userObj.pk;
                authorName = userObj.full_name || userObj.username || sanitized;
                authorAvatar = userObj.profile_pic_url || null;
            }
        }

        if (!userId) return null;

        // 2. Fetch user feed via iOS endpoint
        const feedRes = await httpsJsonRequest({
            hostname: 'i.instagram.com',
            path: `/api/v1/feed/user/${userId}/?count=${Math.max(12, limit)}`,
            method: 'GET',
            headers: {
                'User-Agent': 'Instagram 320.0.0.18.106 (iPhone14,3; iOS 16_6; en_US; en-US; scale=3.00; 1284x2778; 564947094)',
                'Accept': '*/*',
                'X-IG-App-ID': '124024574287414',
                'X-ASBD-ID': '359341',
                'X-IG-WWW-Claim': '0',
                'Cookie': cookieHeader
            },
            timeout: 8000
        });

        if (!feedRes || !feedRes.data || !Array.isArray(feedRes.data.items)) return null;

        const items = [];
        for (const item of feedRes.data.items.slice(0, limit)) {
            if (!item || !item.code) continue;

            const isVideo = item.media_type === 2;
            const isCarousel = item.media_type === 8;
            const mediaType = isVideo ? 'video' : (isCarousel ? 'carousel' : 'image');

            const coverImg = item.image_versions2?.candidates?.[0]?.url || null;
            const videoUrl = item.video_versions?.[0]?.url || null;

            const mediaUrls = [];
            if (isVideo && videoUrl) mediaUrls.push(videoUrl);
            else if (coverImg) mediaUrls.push(coverImg);

            items.push({
                id: `instagram:${item.code}`,
                platform: 'instagram',
                handle: item.user?.username?.toLowerCase() || sanitized,
                post_id: item.code,
                author_name: item.user?.full_name || item.user?.username || authorName,
                author_avatar: item.user?.profile_pic_url || authorAvatar,
                url: `https://www.instagram.com/p/${item.code}/`,
                embed_url: `https://kkinstagram.com/p/${item.code}/`,
                caption: item.caption?.text || '',
                media_type: mediaType,
                media_urls: mediaUrls,
                thumbnail_url: coverImg,
                published_at: item.taken_at || Math.floor(Date.now() / 1000),
                metrics: {
                    views: item.view_count || item.play_count || 0,
                    likes: item.like_count || 0,
                    comments: item.comment_count || 0
                }
            });
        }

        return items;
    } catch (e) {
        console.error(`[Instagram Mobile API Error @${sanitized}]:`, e.message?.slice(0, 160));
        return null;
    }
}

/**
 * Fetches latest posts from an Instagram user profile using hybrid mobile API and SSR fallback.
 */
async function fetchInstagramProfile(handle, limit = 10) {
    const sanitized = handle.replace(/^@/, '').toLowerCase();

    // 1. Primary Strategy: Native Mobile API with cookies
    try {
        const mobileItems = await fetchInstagramViaMobileApi(sanitized, limit);
        if (mobileItems && mobileItems.length > 0) {
            return mobileItems;
        }
    } catch (e) {
        console.error(`[Instagram Mobile Strategy Error @${sanitized}]:`, e.message?.slice(0, 160));
    }

    // 2. Fallback Strategy: SSR crawler discovery + single-post resolution
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
            const cookiePath = getCookieFilePath();
            const ytdlOpts = { dumpSingleJson: true, noWarnings: true };
            if (cookiePath) ytdlOpts.cookies = cookiePath;
            
            // Extract post metadata for discovered shortcodes
            for (const code of targetCodes) {
                const postUrl = `https://www.instagram.com/p/${code}/`;
                try {
                    const data = await youtubedl(postUrl, ytdlOpts);

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
    getInstagramCookies,
    fetchInstagramViaMobileApi,
    fetchTikTokProfile,
    fetchInstagramProfile,
    fetchProfile
};
