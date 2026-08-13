module.exports = {
    /**
     * Checks if a Discord Message object starts with a top-level or guild prefix.
     * @param {object} msg - Discord Message object.
     * @returns {object|null} Match object with { matched: true, prefix, isCustom, isRoot, isTopLevel, isMention } or null.
     */
    checkForPrefixMsg(msg) {
        if (!msg || typeof msg !== 'object') return null;
        const content = msg.content ?? msg.text ?? '';
        const guildId = msg.guildId ?? msg.guild?.id ?? null;
        return this.checkForPrefixStr(content, guildId, msg);
    },

    /**
     * Checks if a text string starts with a top-level or guild prefix.
     * @param {string} text - Raw text string.
     * @param {string} [guildId] - Optional Guild ID.
     * @param {object} [msgObj] - Optional Discord Message object for mention checks.
     * @returns {object|null} Match object with { matched: true, prefix, isCustom, isRoot, isTopLevel, isMention } or null.
     */
    checkForPrefixStr(text, guildId = null, msgObj = null) {
        if (typeof text !== 'string' || !text) return null;
        const lower = text.toLowerCase();

        // 1. Top-level prefixes
        const topPrefixes = ["ougi", "#ougi", "扇"];

        for (const p of topPrefixes) {
            if (lower.startsWith(p.toLowerCase())) {
                return {
                    matched: true,
                    prefix: p,
                    isCustom: false,
                    isRoot: p === "#ougi",
                    isTopLevel: true,
                    isMention: false
                };
            }
        }

        // 2. Mention check
        if (msgObj && typeof client !== 'undefined' && client.user) {
            if (msgObj.mentions?.has?.(client.user)) {
                return {
                    matched: true,
                    prefix: client.user.toString(),
                    isCustom: false,
                    isRoot: false,
                    isTopLevel: true,
                    isMention: true
                };
            }
        }

        const botMentionPatterns = [
            '<@629837958123356172>',
            '<@!629837958123356172>',
            '@ougi'
        ];
        if (typeof client !== 'undefined' && client.user?.id) {
            botMentionPatterns.push(`<@${client.user.id}>`, `<@!${client.user.id}>`);
        }

        for (const p of botMentionPatterns) {
            if (lower.startsWith(p.toLowerCase())) {
                return {
                    matched: true,
                    prefix: p,
                    isCustom: false,
                    isRoot: false,
                    isTopLevel: true,
                    isMention: true
                };
            }
        }

        // 3. Guild custom prefix check
        if (guildId && typeof ougi !== 'undefined' && ougi.db) {
            const customPrefix = ougi.db().getPrefix(guildId);
            if (customPrefix && lower.startsWith(customPrefix.toLowerCase())) {
                return {
                    matched: true,
                    prefix: customPrefix,
                    isCustom: true,
                    isRoot: false,
                    isTopLevel: false,
                    isMention: false
                };
            }
        }

        return null;
    },

    /**
     * Primary convenience function @ checkForPrefix(msg).
     * Delegates to checkForPrefixMsg if given a Message object, or checkForPrefixStr if given a string.
     * @param {object|string} input - Discord Message object or text string.
     * @param {string} [guildId] - Optional Guild ID if input is string.
     * @returns {object|null} Match object or null.
     */
    checkForPrefix(input, guildId = null) {
        if (!input) return null;
        if (typeof input === 'string') {
            return this.checkForPrefixStr(input, guildId);
        }
        return this.checkForPrefixMsg(input);
    },

    /**
     * Prepares string command content ensuring it starts with 'ougi '.
     * Strips prefixToStrip from start of text if provided.
     * @param {string} text - Command text string.
     * @param {string} [prefixToStrip] - Optional prefix to strip.
     * @returns {string} Normalized string starting with 'ougi '.
     */
    prependPrefix(text, prefixToStrip = null) {
        let raw = typeof text === 'string' ? text : '';
        raw = raw.trim();

        if (prefixToStrip && raw.toLowerCase().startsWith(prefixToStrip.toLowerCase())) {
            raw = raw.slice(prefixToStrip.length).trim();
        }

        if (raw.toLowerCase().startsWith('ougi ')) {
            return raw;
        }
        if (raw.toLowerCase() === 'ougi') {
            return 'ougi';
        }

        return ('ougi ' + raw).trim();
    },

    /**
     * Prepares Message object content ensuring it starts with 'ougi '.
     * Strips prefixToStrip from start of message content if provided.
     * @param {object} msg - Discord Message object.
     * @param {string} [prefixToStrip] - Optional prefix to strip.
     * @returns {string} Normalized string starting with 'ougi '.
     */
    prependPrefixMsg(msg, prefixToStrip = null) {
        const content = msg?.content ?? msg?.text ?? '';
        return this.prependPrefix(content, prefixToStrip);
    },

    /**
     * Replaces bot mention tags and "扇" with "ougi".
     * @param {string} text - Text content.
     * @returns {string} Text with mentions normalized to "ougi".
     */
    normalizeMentions(text) {
        if (typeof text !== 'string') return '';
        let result = text.replace(/<@!?629837958123356172>/g, 'ougi').replace(/扇/g, 'ougi');
        if (typeof client !== 'undefined' && client.user?.id) {
            const botTagRegex = new RegExp(`<@!?${client.user.id}>`, 'g');
            result = result.replace(botTagRegex, 'ougi');
        }
        return result;
    },

    /**
     * Strips any leading prefix or bot mention from a text string.
     * @param {string} text - Text string.
     * @param {string} [guildId] - Optional Guild ID.
     * @returns {string} Content with leading prefix/mention removed.
     */
    stripPrefixStr(text, guildId = null) {
        if (typeof text !== 'string') return '';
        let str = this.normalizeMentions(text);

        let match = this.checkForPrefixStr(str, guildId);
        while (match) {
            str = str.slice(match.prefix.length).trimStart();
            match = this.checkForPrefixStr(str, guildId);
        }
        return str.trim();
    },

    /**
     * Strips any leading prefix or bot mention from a Discord Message object.
     * @param {object} msg - Discord Message object.
     * @returns {string} Content with leading prefix/mention removed.
     */
    stripPrefixMsg(msg) {
        if (!msg || typeof msg !== 'object') return '';
        const content = msg.content ?? msg.text ?? '';
        const guildId = msg.guildId ?? msg.guild?.id ?? null;
        let str = this.normalizeMentions(content);

        let match = this.checkForPrefixStr(str, guildId, msg);
        while (match) {
            str = str.slice(match.prefix.length).trimStart();
            match = this.checkForPrefixStr(str, guildId, msg);
        }
        return str.trim();
    }
};
