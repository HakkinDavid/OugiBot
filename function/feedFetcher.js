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

const userPkCache = new Map();
let cookieCooldownUntil = 0;

const CRAWLER_USER_AGENTS = [
    'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
    'Twitterbot/1.0',
    'Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)',
    'TelegramBot (like TwitterBot)'
];

function shortcodeToId(shortcode) {
    if (!shortcode || typeof shortcode !== 'string') return null;
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    let id = 0n;
    for (let i = 0; i < shortcode.length; i++) {
        const char = shortcode[i];
        const val = BigInt(alphabet.indexOf(char));
        if (val === -1n) return null;
        id = id * 64n + val;
    }
    return id.toString();
}

function idToShortcode(idStr) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    try {
        let id = BigInt(String(idStr).split('_')[0]);
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

function fetchInstagramProfileSSR(username, userAgent = CRAWLER_USER_AGENTS[0], maxRedirects = 5) {
    const https = require('https');
    return new Promise((resolve) => {
        try {
            const cleanUser = String(username).replace(/^https?:\/\/(?:www\.)?instagram\.com\//i, '').replace(/\/+$/, '').trim();
            const url = `https://www.instagram.com/${cleanUser}/`;
            const u = new URL(url);
            const req = https.get({
                protocol: u.protocol,
                hostname: u.hostname,
                path: u.pathname + u.search,
                headers: {
                    'User-Agent': userAgent,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Sec-Fetch-Dest': 'document',
                    'Sec-Fetch-Mode': 'navigate',
                    'Sec-Fetch-Site': 'none',
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                },
                timeout: 10000
            }, (res) => {
                // If challenged or redirected to login (datacenter IP block), fallback to Google Relay
                if (res.statusCode === 302 || (res.headers.location && res.headers.location.includes('/accounts/login/'))) {
                    return resolve(fetchInstagramViaGoogleRelay(cleanUser, userAgent));
                }

                if ([301, 303, 307, 308].includes(res.statusCode) && res.headers.location && maxRedirects > 0) {
                    const nextUrl = new URL(res.headers.location, url).toString();
                    return resolve(fetchInstagramProfileSSR(nextUrl, userAgent, maxRedirects - 1));
                }
                let data = '';
                res.on('data', c => data += c);
                res.on('end', () => {
                    if (!data || data.length < 5000 || data.includes('/accounts/login/')) {
                        return resolve(fetchInstagramViaGoogleRelay(cleanUser, userAgent));
                    }
                    resolve({ statusCode: res.statusCode, rawHtml: data });
                });
            });

            req.on('error', () => resolve(fetchInstagramViaGoogleRelay(cleanUser, userAgent)));
            req.on('timeout', () => {
                req.destroy();
                resolve(fetchInstagramViaGoogleRelay(cleanUser, userAgent));
            });
        } catch (e) {
            resolve(fetchInstagramViaGoogleRelay(username, userAgent));
        }
    });
}

function fetchInstagramViaGoogleRelay(username, userAgent = CRAWLER_USER_AGENTS[0], maxRedirects = 5, targetUrl = null) {
    const https = require('https');
    return new Promise((resolve) => {
        try {
            const cleanUser = String(username).replace(/^https?:\/\/(?:www\.)?instagram\.com\//i, '').replace(/\/+$/, '').trim();
            const reqUrl = targetUrl || `https://translate.google.com/translate?sl=auto&tl=en&u=${encodeURIComponent(`https://www.instagram.com/${cleanUser}/`)}`;
            const u = new URL(reqUrl);
            const req = https.get({
                protocol: u.protocol,
                hostname: u.hostname,
                path: u.pathname + u.search,
                headers: {
                    'User-Agent': userAgent,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9'
                },
                timeout: 15000
            }, (res) => {
                if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && maxRedirects > 0) {
                    const nextUrl = new URL(res.headers.location, reqUrl).toString();
                    return resolve(fetchInstagramViaGoogleRelay(cleanUser, userAgent, maxRedirects - 1, nextUrl));
                }
                let data = '';
                res.on('data', c => data += c);
                res.on('end', () => resolve({ statusCode: res.statusCode, rawHtml: data }));
            });
            req.on('error', () => resolve({ statusCode: 0, rawHtml: '' }));
            req.on('timeout', () => { req.destroy(); resolve({ statusCode: 0, rawHtml: '' }); });
        } catch (e) {
            resolve({ statusCode: 0, rawHtml: '' });
        }
    });
}

/**
 * Extracts complete structured post and author data from Instagram's SSR RelayPrefetchedStreamCache JSON.
 * Sorts posts chronologically by Snowflake ID to ensure pinned posts do not mask new publications.
 * Zero cookies required, 100% immune to account flagging.
 */
function extractPostsFromSSR(html, handle, limit = 10) {
    if (!html) return [];
    const items = [];
    let authorInfo = { username: handle, full_name: handle, avatar: null };

    // 1. Extract Profile Info from scripts
    const scripts = [...html.matchAll(/<script[^>]*data-sjs[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]);
    for (const jsonStr of scripts) {
        if (!jsonStr.includes('full_name') && !jsonStr.includes('profile_pic_url') && !jsonStr.includes('profile_pic_url_hd')) continue;
        try {
            const parsed = JSON.parse(jsonStr);
            const findUser = (obj) => {
                if (!obj || typeof obj !== 'object') return null;
                if (obj.username && (obj.full_name || obj.profile_pic_url_hd || obj.profile_pic_url)) return obj;
                for (const k of Object.keys(obj)) {
                    const found = findUser(obj[k]);
                    if (found) return found;
                }
                return null;
            };
            const u = findUser(parsed);
            if (u) {
                authorInfo.username = u.username || handle;
                authorInfo.full_name = u.full_name || u.username || handle;
                authorInfo.avatar = u.profile_pic_url_hd || u.profile_pic_url || null;
                break;
            }
        } catch {}
    }

    // 2. Extract Timeline Posts from RelayPrefetchedStreamCache
    for (const jsonStr of scripts) {
        if (!jsonStr.includes('polaris_timeline_connection') && !jsonStr.includes('RelayPrefetchedStreamCache')) continue;
        try {
            const parsed = JSON.parse(jsonStr);
            const findEdges = (obj) => {
                if (!obj || typeof obj !== 'object') return [];
                if (obj.polaris_timeline_connection && Array.isArray(obj.polaris_timeline_connection.edges)) {
                    return obj.polaris_timeline_connection.edges;
                }
                if (Array.isArray(obj.edges) && obj.edges[0]?.node?.pk) {
                    return obj.edges;
                }
                for (const key of Object.keys(obj)) {
                    const res = findEdges(obj[key]);
                    if (res && res.length > 0) return res;
                }
                return [];
            };

            const edges = findEdges(parsed);
            for (const edge of edges) {
                const node = edge.node;
                if (!node || (!node.pk && !node.code)) continue;

                const shortcode = node.code || idToShortcode(node.pk);
                if (!shortcode) continue;

                const isVideo = node.__typename === 'XIGPolarisVideoMedia' || node.is_video === true || node.media_type === 2 || node.product_type === 'clips';
                const isCarousel = node.__typename === 'XIGPolarisCarouselMedia' || node.media_type === 8;
                const mediaType = isVideo ? 'video' : (isCarousel ? 'carousel' : 'image');

                const coverImg = node.display_uri || node.display_url || node.image_versions2?.candidates?.[0]?.url || null;
                const caption = node.caption?.text || (typeof node.caption === 'string' ? node.caption : '') || node.edge_media_to_caption?.edges?.[0]?.node?.text || '';
                
                // Calculate timestamp accurately via Snowflake PK or taken_at
                const rawPk = node.pk ? BigInt(String(node.pk).split('_')[0]) : BigInt(shortcodeToId(shortcode) || '0');
                const snowflakeTs = rawPk > 0n ? Number((rawPk >> 23n) + 1314220021000n) : null;
                const takenAt = node.taken_at ? node.taken_at : (snowflakeTs ? Math.floor(snowflakeTs / 1000) : Math.floor(Date.now() / 1000));

                const viewCount = node.play_count || node.video_view_count || node.view_count || 0;
                const likeCount = node.like_count || node.edge_media_preview_like?.count || 0;
                const commentCount = node.comment_count || node.edge_media_to_comment?.count || 0;

                const directUrl = `https://www.instagram.com/p/${shortcode}/`;
                const embedUrl = `https://kkinstagram.com/p/${shortcode}/`;

                items.push({
                    id: `instagram:${shortcode}`,
                    platform: 'instagram',
                    handle: authorInfo.username,
                    post_id: shortcode,
                    numeric_id: rawPk,
                    author_name: authorInfo.full_name,
                    author_avatar: authorInfo.avatar,
                    url: directUrl,
                    embed_url: embedUrl,
                    caption: caption,
                    media_type: mediaType,
                    media_urls: coverImg ? [coverImg] : [],
                    thumbnail_url: coverImg,
                    published_at: takenAt,
                    is_pinned: Boolean(node.is_timeline_pinned),
                    metrics: {
                        views: viewCount,
                        likes: likeCount,
                        comments: commentCount
                    }
                });
            }
        } catch {}
    }

    // Deduplicate by post_id
    const seen = new Set();
    const uniqueItems = [];
    for (const it of items) {
        if (!seen.has(it.post_id)) {
            seen.add(it.post_id);
            uniqueItems.push(it);
        }
    }

    // Sort strictly chronologically descending (newest post first, ignoring pin status)
    uniqueItems.sort((a, b) => {
        if (b.numeric_id && a.numeric_id) {
            return b.numeric_id > a.numeric_id ? 1 : (b.numeric_id < a.numeric_id ? -1 : 0);
        }
        return (b.published_at || 0) - (a.published_at || 0);
    });

    return uniqueItems.slice(0, limit);
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
    if (Date.now() < cookieCooldownUntil) {
        return { cookieHeader: '', csrfToken: '', cookiePath: null };
    }

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
 * Fallback: Fetches user profile feed via Private Mobile API with trail obfuscation & PK caching.
 */
async function fetchInstagramViaMobileApi(handle, limit = 10) {
    const sanitized = handle.replace(/^@/, '').toLowerCase();
    const { cookieHeader, csrfToken } = getInstagramCookies();
    if (!cookieHeader) return null;

    try {
        let userId = userPkCache.get(sanitized) || null;
        let authorAvatar = null;
        let authorName = sanitized;

        // Resolve PK only if not already cached
        if (!userId) {
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

            if (searchRes && (searchRes.status === 401 || searchRes.status === 403 || searchRes.status === 429)) {
                console.warn(`[Instagram Mobile API] Session challenged (status ${searchRes.status}). Cooling down cookie usage for 1h.`);
                cookieCooldownUntil = Date.now() + 3600000;
                return null;
            }

            if (searchRes && searchRes.data && Array.isArray(searchRes.data.users)) {
                const exact = searchRes.data.users.find(u => u.user?.username?.toLowerCase() === sanitized);
                const userObj = exact?.user || searchRes.data.users[0]?.user;
                if (userObj) {
                    userId = userObj.pk;
                    authorName = userObj.full_name || userObj.username || sanitized;
                    authorAvatar = userObj.profile_pic_url || null;
                    userPkCache.set(sanitized, userId);
                }
            }
        }

        if (!userId) return null;

        // Fetch user feed via iOS endpoint
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

        if (feedRes && (feedRes.status === 401 || feedRes.status === 403)) {
            console.warn(`[Instagram Mobile API] Endpoint rejected cookies (status ${feedRes.status}). Cooling down cookies.`);
            cookieCooldownUntil = Date.now() + 3600000;
            return null;
        }

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
 * Fetches latest posts from an Instagram user profile using the resilient multi-tiered architecture:
 * Tier 1: Zero-Cookie OpenGraph SSR Relay Parser (Primary)
 * Tier 2: Crawler Shortcode regex + single post resolver
 * Tier 3: Obfuscated Mobile API (Fallback)
 */
async function fetchInstagramProfile(handle, limit = 10) {
    const sanitized = handle.replace(/^@/, '').toLowerCase();

    // ─────────────────────────────────────────────────────────────
    // TIER 1: Primary Zero-Cookie OpenGraph SSR Relay Parser
    // ─────────────────────────────────────────────────────────────
    for (const userAgent of CRAWLER_USER_AGENTS) {
        try {
            const { rawHtml } = await fetchInstagramProfileSSR(sanitized, userAgent);
            if (rawHtml && rawHtml.length > 5000) {
                const ssrPosts = extractPostsFromSSR(rawHtml, sanitized, limit);
                if (ssrPosts && ssrPosts.length > 0) {
                    return ssrPosts;
                }
            }
        } catch (e) {}
    }

    // ─────────────────────────────────────────────────────────────
    // TIER 2: Secondary SSR shortcode regex discovery
    // ─────────────────────────────────────────────────────────────
    try {
        const { rawHtml } = await fetchInstagramProfileSSR(sanitized);
        if (rawHtml) {
            const shortcodes = [];
            const cacheKeys = [
                ...rawHtml.matchAll(/ig_cache_key=([A-Za-z0-9%_-]+)/g),
                ...rawHtml.matchAll(/ig_cache_key%3D([A-Za-z0-9%_-]+)/g),
                ...rawHtml.matchAll(/ig_cache_key["\s:=]+([A-Za-z0-9%_-]+)/g)
            ].map(m => decodeURIComponent(m[1]));

            for (const k of cacheKeys) {
                try {
                    const raw = Buffer.from(k, 'base64').toString('utf-8');
                    const mediaId = raw.split('_')[0].slice(0, 19);
                    if (/^\d+$/.test(mediaId)) {
                        const code = idToShortcode(mediaId);
                        if (code && !shortcodes.includes(code)) shortcodes.push(code);
                    }
                } catch (e) {}
            }

            const directMatches = [
                ...rawHtml.matchAll(/\/p\/([A-Za-z0-9_-]{11})/g),
                ...rawHtml.matchAll(/\/reel\/([A-Za-z0-9_-]{11})/g),
                ...rawHtml.matchAll(/"shortcode":"([A-Za-z0-9_-]{11})"/g)
            ].map(m => m[1]);

            for (const code of directMatches) {
                if (code && !shortcodes.includes(code)) shortcodes.push(code);
            }

            if (shortcodes.length > 0) {
                const items = [];
                const targetCodes = shortcodes.slice(0, Math.min(limit, 10));
                for (const code of targetCodes) {
                    const postUrl = `https://www.instagram.com/p/${code}/`;
                    items.push({
                        id: `instagram:${code}`,
                        platform: 'instagram',
                        handle: sanitized,
                        post_id: code,
                        author_name: sanitized,
                        author_avatar: null,
                        url: postUrl,
                        embed_url: `https://kkinstagram.com/p/${code}/`,
                        caption: '',
                        media_type: 'image',
                        media_urls: [],
                        thumbnail_url: null,
                        published_at: Math.floor(Date.now() / 1000),
                        metrics: { views: 0, likes: 0, comments: 0 }
                    });
                }
                return items;
            }
        }
    } catch (e) {}

    // ─────────────────────────────────────────────────────────────
    // TIER 3: Obfuscated Mobile API (Fallback if cookies are present)
    // ─────────────────────────────────────────────────────────────
    try {
        const mobileItems = await fetchInstagramViaMobileApi(sanitized, limit);
        if (mobileItems && mobileItems.length > 0) {
            return mobileItems;
        }
    } catch (e) {
        console.error(`[Instagram Mobile Strategy Error @${sanitized}]:`, e.message?.slice(0, 160));
    }

    return [];
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
