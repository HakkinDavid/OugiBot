const { ChannelType } = require('discord.js');
const stringSimilarity = require('string-similarity');
const translate = require('@vitalets/google-translate-api');

module.exports = async function text(msg, stringID, dynamic = false, raw = false) {
    let langCode = 'en';

    if (typeof msg === 'object') {
        if (settingsOBJ.lang[msg.author.id]) langCode = settingsOBJ.lang[msg.author.id];
        if (msg.channel?.type === ChannelType.GuildText && settingsOBJ.lang[msg.guildId]) {
            langCode = settingsOBJ.lang[msg.guildId];
        }
    } else if (typeof msg === 'string') {
        langCode = msg;
    }

    if (dynamic) {
        if (langCode === 'mx') langCode = 'es';
        let returnableString = stringID;
        let fromCode;
        const potentialLinks = returnableString.match(/https?:\/\//gi) || [];
        if (potentialLinks.length > 0) return raw ? { value: returnableString } : returnableString;

        dynamicLocales[langCode] = dynamicLocales[langCode] || {};
        if (dynamicLocales[langCode][stringID]) {
            returnableString = dynamicLocales[langCode][stringID].value;
            if (raw) return { value: returnableString, fromCode: dynamicLocales[langCode][stringID].fromCode };
            return returnableString;
        }

        const keyedTranslations = Object.keys(dynamicLocales[langCode]);
        const mostSimilar = stringSimilarity.findBestMatch(stringID, keyedTranslations).bestMatch;
        if (mostSimilar.rating * 100 > 75) {
            returnableString = dynamicLocales[langCode][mostSimilar.target].value;
            if (raw) return { value: returnableString, fromCode: dynamicLocales[langCode][mostSimilar.target].fromCode };
            return returnableString;
        }

        const stringEmoji = returnableString.match(/<:[A-Za-z0-9_]+:[0-9]+>/g) || [];
        const stringDiscordEmoji = returnableString.match(/(?<!\<):[A-Za-z0-9_]+:(?![0-9]+\>)/g) || [];

        try {
            const res = await translate(returnableString, { to: langCode, client: 'gtx' });
            if (res.from.language.iso !== langCode) {
                fromCode = res.from.language.iso;
                returnableString = res.text;

                const translatedEmoji = returnableString.match(/<\s*:[A-Za-z0-9_ ]+:\s*[0-9]+>/g) || [];
                for (let i = 0; i < translatedEmoji.length; i++) {
                    returnableString = returnableString.replace(translatedEmoji[i], stringEmoji[i] || '');
                }

                const translatedDiscordEmoji = returnableString.match(/(?<!\<):\s*[A-Za-z0-9_]+:(?![0-9]+\>)/g) || [];
                for (let i = 0; i < translatedDiscordEmoji.length; i++) {
                    returnableString = returnableString.replace(translatedDiscordEmoji[i], stringDiscordEmoji[i] || '');
                }
            }
        } catch (err) {
            console.error(err);
        }

        dynamicLocales[langCode][stringID] = { value: returnableString, fromCode };
        await ougi.writeFile(database.dynamicLocales.file, JSON.stringify(dynamicLocales, null, 4), console.error);
        await ougi.backup(database.dynamicLocales.file, channels.dynamicLocales);
        return raw ? { value: returnableString, fromCode, stringEmoji, stringDiscordEmoji } : returnableString;
    }

    if (!ougi.localization.en[stringID]) stringID = 'undeclaredString';
    let returnableString = ougi.localization[langCode]?.[stringID] || null;

    if (returnableString === null && ougi.localization.en[stringID]) {
        if (langCode === 'mx') langCode = 'es';
        localesCache[langCode] = localesCache[langCode] || {};

        if (localesCache[langCode][stringID]) return localesCache[langCode][stringID];

        try {
            const res = await translate(ougi.localization.en[stringID], { to: langCode, client: 'gtx' });
            returnableString = res.text;
        } catch (err) {
            console.error(err);
        }

        localesCache[langCode][stringID] = returnableString;
        await ougi.writeFile(database.locales.file, JSON.stringify(localesCache, null, 4), console.error);
        await ougi.backup(database.locales.file, channels.locales);
    }

    return returnableString;
};
