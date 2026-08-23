const { ChannelType } = require('discord.js');
const stringSimilarity = require('string-similarity');
const translate = require('@vitalets/google-translate-api');

function maskTokens(str) {
    if (!str || typeof str !== 'string') return { masked: str, tokens: [] };
    const tokens = [];
    const masked = str.replace(/\{([a-zA-Z0-9_]+)\}/g, (match, varName) => {
        const idx = tokens.length;
        tokens.push(varName);
        return `⟪${idx}⟫`;
    });
    return { masked, tokens };
}

function unmaskTokens(str, tokens) {
    if (!str || typeof str !== 'string' || !tokens || tokens.length === 0) return str;
    return str.replace(/⟪\s*(\d+)\s*⟫/g, (match, idxStr) => {
        const idx = parseInt(idxStr, 10);
        if (idx >= 0 && idx < tokens.length) {
            return `{${tokens[idx]}}`;
        }
        return match;
    });
}

function interpolateValues(templateStr, values) {
    if (!templateStr || typeof templateStr !== 'string' || !values || typeof values !== 'object') {
        return templateStr;
    }
    let result = templateStr;
    for (const [k, v] of Object.entries(values)) {
        const strVal = v === null ? "null" : (v === undefined ? "undefined" : String(v));
        result = result.replace(new RegExp(`\\{${k}\\}`, 'g'), strVal);
    }
    return result;
}

module.exports = async function text(options) {
    if (!options || typeof options !== 'object' || Array.isArray(options) || !options.stringID) {
        throw new TypeError('ougi.text requires an options object with at least stringID specified');
    }

    const { msg, lang, dynamic = false, raw = false, values = null } = options;
    let stringID = options.stringID;
    let langCode = 'en';

    if (lang && typeof lang === 'string') {
        langCode = lang;
    } else if (msg) {
        if (typeof msg === 'object') {
            const userId = msg.author?.id ?? msg.user?.id;
            if (userId) {
                const userLang = ougi.db().getLang(userId);
                if (userLang) langCode = userLang;
            }
            const guildId = msg.guildId ?? msg.guild?.id;
            if (guildId && (msg.channel?.type === ChannelType.GuildText || !msg.channel)) {
                const guildLang = ougi.db().getLang(guildId);
                if (guildLang) langCode = guildLang;
            }
        } else if (typeof msg === 'string') {
            langCode = msg;
        }
    }

    if (dynamic) {
        if (langCode === 'mx') langCode = 'es';
        let returnableString = stringID;
        let fromCode;
        const potentialLinks = returnableString.match(/https?:\/\//gi) || [];
        if (potentialLinks.length > 0) {
            const finalStr = interpolateValues(returnableString, values);
            return raw ? { value: finalStr } : finalStr;
        }

        const cachedDynamic = ougi.db().getDynamicLocale(langCode, stringID);
        if (cachedDynamic) {
            returnableString = cachedDynamic.value;
            const finalStr = interpolateValues(returnableString, values);
            if (raw) return { value: finalStr, fromCode: cachedDynamic.fromCode };
            return finalStr;
        }

        const langPhrases = ougi.db().getDynamicLocalesForLang(langCode);
        const keyedTranslations = Object.keys(langPhrases);
        if (keyedTranslations.length > 0) {
            const mostSimilar = stringSimilarity.findBestMatch(stringID, keyedTranslations).bestMatch;
            if (mostSimilar.rating * 100 > 75) {
                returnableString = langPhrases[mostSimilar.target].value;
                const finalStr = interpolateValues(returnableString, values);
                if (raw) return { value: finalStr, fromCode: langPhrases[mostSimilar.target].fromCode };
                return finalStr;
            }
        }

        const { masked, tokens } = maskTokens(returnableString);
        const stringEmoji = masked.match(/<:[A-Za-z0-9_]+:[0-9]+>/g) || [];
        const stringDiscordEmoji = masked.match(/(?<!\<):[A-Za-z0-9_]+:(?![0-9]+\>)/g) || [];

        try {
            const res = await translate(masked, { to: langCode, client: 'gtx' });
            if (res.from.language.iso !== langCode) {
                fromCode = res.from.language.iso;
                let translatedText = res.text;

                const translatedEmoji = translatedText.match(/<\s*:[A-Za-z0-9_ ]+:\s*[0-9]+>/g) || [];
                for (let i = 0; i < translatedEmoji.length; i++) {
                    translatedText = translatedText.replace(translatedEmoji[i], stringEmoji[i] || '');
                }

                const translatedDiscordEmoji = translatedText.match(/(?<!\<):\s*[A-Za-z0-9_]+:(?![0-9]+\>)/g) || [];
                for (let i = 0; i < translatedDiscordEmoji.length; i++) {
                    translatedText = translatedText.replace(translatedDiscordEmoji[i], stringDiscordEmoji[i] || '');
                }

                returnableString = unmaskTokens(translatedText, tokens);
            }
        } catch (err) {
            console.error(err);
            returnableString = "oooh spooky.";
            return;
        }

        ougi.db().saveDynamicLocale(langCode, stringID, returnableString, fromCode);
        const finalStr = interpolateValues(returnableString, values);
        return raw ? { value: finalStr, fromCode, stringEmoji, stringDiscordEmoji } : finalStr;
    }

    if (!ougi.localization.en[stringID]) stringID = 'undeclaredString';
    let returnableString = ougi.localization[langCode]?.[stringID] || null;

    if (returnableString === null && ougi.localization.en[stringID]) {
        if (langCode === 'mx') langCode = 'es';
        const cachedStatic = ougi.db().getStaticLocale(langCode, stringID);
        if (cachedStatic) {
            return interpolateValues(cachedStatic, values);
        }

        try {
            const { masked, tokens } = maskTokens(ougi.localization.en[stringID]);
            const res = await translate(masked, { to: langCode, client: 'gtx' });
            returnableString = unmaskTokens(res.text, tokens);
        } catch (err) {
            console.error(err);
            returnableString = "oooh spooky.";
            return;
        }

        ougi.db().saveStaticLocale(langCode, stringID, returnableString);
    }

    return interpolateValues(returnableString, values);
};
