Ougi is a cross-language conversational chatbot with utility & game modules on top. Its main purpose is to deliver fun to Discord servers by partaking in chats whenever it's explicitly mentioned (or named by prefix) and providing a fresh user-provided curated set of replies based on an hybrid Levenshtein distance + Sørensen Dice coefficient algorithm of my own, thus enabling for the chatbot to function without relying on the overhead and gray-line ethics (data-wise, environmental-wise, etc.) of a fully LLM-based chatbot. The bot has been around since 2019 and has found its niche amongst 128,831 users. All the data stays on Discord and is always handled encrypted; no data is ever stored, processed or handled "automatically" without user's intent (i.e. the bot's conversational knowledge must be explicitly taught by using a command).

Commands
1. acknowledgement - Display OugiBot Terms of Service and Privacy Policy.
2. blacklist - Blacklist any command or trigger in the Discord server, stopping any related processing.
3. editsnipe - Retrieve the last edited message in the channel. This module, as any other, can be disabled in its entirety by `blacklist`.
4. forget - Remove a previously learned custom reply.
5. learn - Teach Ougi a custom reply trigger and response.
6. say - Make Ougi repeat a message.
7. shortcut - Map an emoji reaction on messages to run a command.
8. snipe - Retrieve the last deleted message in the channel. This module, as any other, can be disabled in its entirety by `blacklist`.
9. translate - Translate a message or text to a target language.

Other functions
1. `Apps > Ougi > Translate` (Context menu) — Translate the target message text into the user's default language.
2. `I want to opt out from using Ougi [BOT].` (DM) — Opt out from Ougi data processing and commands, effectively making the user invisible to the bot.

Omitted non-data related features for conciseness.

https://github.com/HakkinDavid/OugiBot/blob/master/images/usage.gif

---

The privacy policy is available in the bot's help command main embed, with the legend "Ougi has a privacy policy regarding how it uses your data, check it out by using `ougi acknowledgement`!". A summarized version is sent by using `ougi acknowledgement` command and also contains a link to the full public document.

---

https://github.com/HakkinDavid/OugiBot/blob/master/docs/Ougi%20BOT%20Privacy%20Policy.pdf

---

Message Content Intent is fundamental to Ougi because the bot operates as an active participant within Discord communities, providing immediate, natural, and uninterrupted text engagement.

Ougi’s core identity is its conversational engine, allowing members to converse with the bot as they would with any fellow user. When addressed in chat, the bot evaluates natural phrasing, colloquialisms, and typos against a community-curated conversational repository. For interactions to remain authentic and fluid, the bot must read message text at the moment it is addressed; without this, it cannot evaluate context or return relevant dialogue, breaking the core user experience.

In multilingual and multicultural servers, this access is vital for conversational continuity. When members speak different languages in shared channels, Ougi provides in-situ translation to keep discussions inclusive. Reading message text directly enables instant translation without requiring users to copy, paste, or switch interfaces, preserving the natural cadence of chat and resolving language barriers in real time.

Additionally, Ougi's conversational knowledge base is built collaboratively. Members teach and refine dialogue pairs directly within chat, enabling the bot to reflect local server culture and humor on demand.

Context recovery features, such as retrieving recently deleted or edited messages, similarly require capturing text at the moment of modification. Retaining only recent edits in temporary, volatile memory allows members and moderators to recover lost discussion points.

All processing follows strict privacy boundaries. Ougi never harvests or stores user data; data is processed strictly in-flight upon direct interaction. Administrators can disable any text-reading feature guild-wide via blacklist controls, and users can permanently opt out so they become inaccessible to the bot's processes.

No data is stored outside of Discord and all processing occurs encrypted within the bot.

---

Message Intent
https://cdn.bonsanbec.dev/ougi/intents/translate_bringing_users_together.png
https://cdn.bonsanbec.dev/ougi/intents/snipe.png
https://cdn.bonsanbec.dev/ougi/intents/blacklist.png
https://cdn.bonsanbec.dev/ougi/intents/conversation.png