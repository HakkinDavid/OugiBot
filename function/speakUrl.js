const axios = require('axios');
const cheerio = require('cheerio');
const { EmbedBuilder } = require('discord.js');

/**
 * Checks if a string is a valid HTTP/HTTPS URL
 */
function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

/**
 * Checks if the URL belongs to a Reddit post
 */
function isRedditPostUrl(urlStr) {
  try {
    const url = new URL(urlStr);
    const host = url.hostname.toLowerCase();
    const isRedditHost = host === 'reddit.com' || host.endsWith('.reddit.com') || host === 'redd.it';
    if (!isRedditHost) return false;

    // Matches /r/subreddit/comments/id/... or /comments/id/... or redd.it/id
    if (host === 'redd.it') return true;
    if (url.pathname.includes('/comments/')) return true;

    return false;
  } catch (_) {
    return false;
  }
}

/**
 * Cleans extracted text for TTS speech
 */
function sanitizeTextForTts(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/https?:\/\/\S+/gi, '') // Remove URLs
    .replace(/[\+\*\?\^\$\(\)\[\]\{\}\|\\\&\/\@_~`#><]/g, ' ') // Strip special markup chars
    .replace(/\s+/g, ' ')
    .trim();
}

function getRedditPostId(urlStr) {
  try {
    const url = new URL(urlStr);
    if (url.hostname.toLowerCase() === 'redd.it') {
      return url.pathname.replace(/^\/+/, '').split('/')[0];
    }
    const match = url.pathname.match(/\/comments\/([a-z0-9]+)/i);
    if (match) return match[1];
  } catch (_) {}
  return null;
}

function isValidRedditTitle(title) {
  if (!title || typeof title !== 'string') return false;
  const clean = title.trim().toLowerCase();
  return clean !== '' && clean !== 'reddit' && clean !== 'reddit - dive into anything' && !clean.includes('blocked by network security') && !clean.includes('access denied');
}

/**
 * Extracts content from Reddit posts via Reddit Post APIs (Arctic Shift / Pullpush)
 */
async function extractRedditContent(urlStr) {
  let title = '';
  let body = '';
  const postId = getRedditPostId(urlStr);

  if (!postId) {
    return { title: '', body: '' };
  }

  // 1. Fetch from Arctic Shift Reddit API
  try {
    const arcticRes = await axios.get(`https://arctic-shift.photon-reddit.com/api/posts/ids?ids=${postId}`, {
      headers: { 'User-Agent': 'OugiBot/2.0' },
      timeout: 8000
    });
    const postData = arcticRes.data?.data?.[0];
    if (postData) {
      if (postData.title && isValidRedditTitle(postData.title)) title = postData.title;
      if (postData.selftext) body = postData.selftext;
    }
  } catch (err) {}

  // 2. Fallback: Pullpush Reddit API
  if (!title || !body) {
    try {
      const ppRes = await axios.get(`https://api.pullpush.io/reddit/search/submission/?ids=${postId}`, {
        headers: { 'User-Agent': 'OugiBot/2.0' },
        timeout: 8000
      });
      const postData = ppRes.data?.data?.[0];
      if (postData) {
        if (!title && postData.title && isValidRedditTitle(postData.title)) title = postData.title;
        if (!body && postData.selftext) body = postData.selftext;
      }
    } catch (err) {}
  }

  return { title: title.trim(), body: body.trim() };
}

/**
 * Extracts content from generic HTML pages with selector or atomic div fallback
 */
async function extractGenericHtmlContent(urlStr, selector) {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9,es;q=0.8'
  };

  const response = await axios.get(urlStr, {
    headers,
    timeout: 15000,
    maxRedirects: 5
  });

  const $ = cheerio.load(response.data);

  // Extract page title
  let pageTitle = $('title').text().trim();
  if (!pageTitle) {
    pageTitle = $('h1').first().text().trim() || new URL(urlStr).hostname;
  }

  // Clean noise elements before searching for text/divs
  $('script, style, noscript, svg, nav, footer, header, iframe, template').remove();

  // If a specific selector or tag/id was provided
  if (selector) {
    const target = $(selector);
    if (target.length === 0) {
      return { pageTitle, text: '', selectorNotFound: true };
    }
    const text = target.text().trim();
    return { pageTitle, text, selectorNotFound: false };
  }

  // Default: Choose atomic div (a <div> that does NOT contain any descendant <div>)
  // Find all atomic divs
  const atomicDivs = $('div').filter((i, el) => {
    return $(el).find('div').length === 0;
  });

  let bestText = '';
  atomicDivs.each((i, el) => {
    const text = $(el).text().replace(/\s+/g, ' ').trim();
    if (text.length > bestText.length) {
      bestText = text;
    }
  });

  // Fallback to main / article / body if no atomic div with text was found
  if (!bestText) {
    bestText = $('main').text().replace(/\s+/g, ' ').trim() ||
               $('article').text().replace(/\s+/g, ' ').trim() ||
               $('body').text().replace(/\s+/g, ' ').trim();
  }

  return { pageTitle, text: bestText, selectorNotFound: false };
}

module.exports = async function (msg, args, langCode, memberVC) {
  if (!args || !args.length) {
    return msg.channel.send(await ougi.text({ msg, stringID: "voice_specifySentence" }));
  }

  const rawUrl = args[0].replace(/^<|>$/g, '').trim();
  if (!isValidUrl(rawUrl)) {
    return msg.channel.send(await ougi.text({ msg, stringID: "voice_speakUrlFetchFail" }));
  }

  // Parse optional selector: [tag] [id] or [css_selector]
  let selector = null;
  const remainingArgs = args.slice(1);
  if (remainingArgs.length >= 2) {
    const tag = remainingArgs[0].trim();
    const id = remainingArgs[1].replace(/^#/, '').trim();
    selector = `${tag}#${id}`;
  } else if (remainingArgs.length === 1) {
    selector = remainingArgs[0].trim();
  }

  let textToSpeak = '';
  let pageTitle = '';
  const domain = new URL(rawUrl).hostname.replace(/^www\./, '');

  try {
    if (isRedditPostUrl(rawUrl)) {
      const redditData = await extractRedditContent(rawUrl);
      pageTitle = redditData.title || (await ougi.text({ msg, stringID: "voice_speakUrlReddit" }));
      if (redditData.title && redditData.body) {
        textToSpeak = `${redditData.title}. ${redditData.body}`;
      } else if (redditData.title) {
        textToSpeak = redditData.title;
      } else if (redditData.body) {
        textToSpeak = redditData.body;
      }
    } else {
      const genericData = await extractGenericHtmlContent(rawUrl, selector);
      if (genericData.selectorNotFound) {
        return msg.channel.send(await ougi.text({
          msg,
          stringID: "voice_speakUrlSelectorFail",
          values: { selector }
        }));
      }
      pageTitle = genericData.pageTitle;
      textToSpeak = genericData.text;
    }

    textToSpeak = sanitizeTextForTts(textToSpeak);

    if (!textToSpeak) {
      return msg.channel.send(await ougi.text({ msg, stringID: "voice_speakUrlNoText" }));
    }

    const ttsUrls = googleTTS.getAllAudioUrls(textToSpeak, {
      lang: langCode,
      slow: false,
      host: 'https://translate.google.com',
      splitPunct: ',.?'
    });

    if (!ttsUrls || !ttsUrls.length) {
      return msg.channel.send(await ougi.text({ msg, stringID: "voice_ttsFail" }));
    }

    // Build informative Discord Embed
    const previewText = textToSpeak.length > 250 ? textToSpeak.slice(0, 247) + '...' : textToSpeak;
    const embed = new EmbedBuilder()
      .setColor('#20064F')
      .setTitle((pageTitle || (await ougi.text({ msg, stringID: "voice_speakUrlTitle" }))).slice(0, 256))
      .setURL(rawUrl)
      .setDescription(previewText)
      .addFields(
        { name: await ougi.text({ msg, stringID: "voice_speakUrlSource" }), value: `[${domain}](${rawUrl})`, inline: true },
        { name: await ougi.text({ msg, stringID: "voice_speakUrlChunks" }), value: `${ttsUrls.length}`, inline: true }
      )
      .setFooter({ text: 'ougi speak', iconURL: msg.client?.user?.displayAvatarURL?.() || undefined });

    await msg.channel.send({ embeds: [embed] }).catch(console.error);

    // Enqueue audio chunks in voice channel
    await ougi.voiceManager.playTts(msg, memberVC, ttsUrls);

  } catch (err) {
    console.error("Error in speakUrl.js:", err);
    return msg.channel.send(await ougi.text({ msg, stringID: "voice_speakUrlFetchFail" })).catch(console.error);
  }
};
