module.exports = {
    /**
     * Checks if a message or text string starts with a valid top-level or guild prefix.
     * Top-level prefixes: ["ougi", "#ougi", "扇"] as well as bot mentions.
     * Guild prefix: ougi.db().getPrefix(guildId) if available.
     *
     * @param {object|string} input - Discord Message object or text string.
     * @param {object|string} [msgContext] - Optional Discord Message object if input is string.
     * @returns {object|null} Match object with { matched: true, prefix, isCustom, isRoot, isTopLevel, isMention } or null.
     */
    checkForPrefix(input, msgContext) {
        if (!input) return null;

        let content = "";
        let guildId = null;
        let messageObj = null;

        if (typeof input === 'string') {
            content = input;
            if (msgContext && typeof msgContext === 'object') {
                messageObj = msgContext;
                guildId = msgContext.guildId ?? msgContext.guild?.id ?? null;
            }
        } else if (typeof input === 'object') {
            messageObj = input;
            content = input.content ?? input.text ?? "";
            guildId = input.guildId ?? input.guild?.id ?? null;
        }

        if (!content) return null;
        const lower = content.toLowerCase();

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
        if (messageObj && typeof client !== 'undefined' && client.user) {
            if (messageObj.mentions?.has?.(client.user)) {
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
     * Ensures input text/message starts with 'ougi '.
     * If prefixToStrip is provided, it is removed from the start of input before prepending 'ougi '.
     * If input already starts with 'ougi ', it is returned normalized.
     *
     * @param {object|string} input - Message object or text string.
     * @param {string} [prefixToStrip] - Optional prefix to strip before prepending.
     * @returns {string} Content starting with 'ougi '.
     */
    prependPrefix(input, prefixToStrip) {
        let raw = typeof input === 'string' ? input : (input?.content ?? '');
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
     * Replaces bot mention tags and "扇" with "ougi".
     * @param {string} content - Text content.
     * @returns {string} Text with mentions normalized to "ougi".
     */
    normalizeMentions(content) {
        if (typeof content !== 'string') return '';
        let result = content.replace(/<@!?629837958123356172>/g, 'ougi').replace(/扇/g, 'ougi');
        if (typeof client !== 'undefined' && client.user?.id) {
            const botTagRegex = new RegExp(`<@!?${client.user.id}>`, 'g');
            result = result.replace(botTagRegex, 'ougi');
        }
        return result;
    },

    /**
     * Strips any leading prefix or bot mention from a text string or message.
     * @param {object|string} input - Message object or text string.
     * @param {object} [msgContext] - Optional message object context.
     * @returns {string} The content with leading prefix/mention removed.
     */
    stripPrefix(input, msgContext) {
        let str = typeof input === 'string' ? input : (input?.content ?? '');
        str = this.normalizeMentions(str);

        let match = this.checkForPrefix(str, msgContext);
        while (match) {
            str = str.slice(match.prefix.length).trimStart();
            match = this.checkForPrefix(str, msgContext);
        }
        return str.trim();
    }
};
