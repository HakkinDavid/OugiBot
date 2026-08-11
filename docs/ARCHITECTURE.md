# OugiBot Technical Architecture & System Design

This document details the high-level architecture, event lifecycle, data persistence model, dynamic translation engine, and conversational AI pipeline of **OugiBot**.

---

## 🛠️ System Overview & Technology Stack

OugiBot is built on **Node.js** (v18+) using **Discord.js v14** (v14.15.2 refactor). The system is structured around an event-driven, single-process runtime with modular sub-functions automatically loaded into the global scope.

```
                  +-----------------------------------+
                  |        Discord Gateway / API      |
                  +-----------------+-----------------+
                                    |
                                    v
                  +-----------------+-----------------+
                  |      fan.js (Client Entrypoint)   |
                  +-----------------+-----------------+
                                    |
      +-----------------------------+-----------------------------+
      |                             |                             |
      v                             v                             v
+-----+-----+                 +-----+-----+                 +-----+-----+
| Event     |                 |  Global   |                 | Database  |
| Handlers  |                 | Scope     |                 | & Backup  |
| (Message, |                 | (ougi.*)  |                 | Engine    |
| Reaction) |                 +-----+-----+                 +-----+-----+
+-----+-----+                       |                             |
      |                             v                             |
      |                 +-----------+-----------+                 |
      +---------------->| function/processCommand|                 |
                        +-----------+-----------+                 |
                                    |                             |
      +-----------------------------+-----------------------------+
      |                             |                             |
      v                             v                             v
+-----+-----+                 +-----+-----+                 +-----+-----+
| Command   |                 | AI & NLP  |                 | Dynamic   |
| Modules   |                 | Pipeline  |                 | Locales   |
| (140+ fn) |                 | (Tier 1-3)|                 | Engine    |
+-----------+                 +-----------+                 +-----------+
```

### Key Technologies
- **Runtime**: Node.js (>= 18.0.0)
- **Discord Library**: `discord.js` v14.15.2, `@discordjs/voice` v0.16.1
- **State Encryption**: `crypto-js` (AES-256 encryption for flat files)
- **AI / LLM Integration**: Pollinations AI (`https://text.pollinations.ai/` - `openai-fast` model)
- **NLP / String Matching**: `string-similarity` (Dice's Coefficient), `levenary` & `leven` (Levenshtein distance)
- **Translation**: `@vitalets/google-translate-api`
- **Audio / Video**: `ytdl-core-discord`, `scrape-yt`, `opusscript`
- **Logging**: `winston` + Discord Embed Webhook Logging (`consoleLogging` channel)

---

## 🌐 Global Scope & Module Initialization

Upon launch, `fan.js` initializes required npm packages into Node's `global` object to eliminate circular dependency issues across the modular codebase.

### Primary Global Bindings

```javascript
global.Discord = require('discord.js');
global.fs = require('fs');
global.CryptoJS = require('crypto-js');
global.requireAll = require('require-all');
global.client = new Discord.Client({ intents: [...], partials: [...] });

// Dynamically attaches all ~140 exported JS functions from /function to global.ougi
global.ougi = requireAll(path.join(__dirname, 'function'));
```

### Global State Objects
- `global.settingsOBJ`: Guild settings, user preferences, banned users, rate limits, custom prefixes, economy data.
- `global.knowledgeBase`: User-taught response knowledge base loaded from `responses.txt`.
- `global.localesCache`: Static translation cache generated dynamically.
- `global.dynamicLocales`: Dynamic phrase translation cache with fuzzy matching index.
- `global.rafflesOBJ`: Guild raffle definitions, ongoing raffle states, participant lists, licensing information.
- `global.interactions`: Per-channel conversation history for AI dialogue context (retains last 5 interactions).

---

## ⚡ Event Lifecycle & Dispatch Flow

### 1. Gateway Client Intents & Partials
OugiBot uses a comprehensive set of gateway intents and partials to enable full functionality across server text channels, voice channels, DMs, thread channels, and reactions:

- **Intents**: `Guilds`, `GuildMessages`, `MessageContent`, `DirectMessages`, `GuildMessageReactions`, `DirectMessageReactions`, `GuildBans`, `GuildModeration`, `GuildWebhooks`, `GuildVoiceStates`, `GuildScheduledEvents`, `AutoModerationConfiguration`, `AutoModerationExecution`.
- **Partials**: `User`, `Channel`, `Message`, `GuildMember`, `Reaction`, `ThreadMember`, `GuildScheduledEvent`.

### 2. Message Event Routing (`messageCreate`)

```
Incoming Message
      |
      v
Is Author Bot (except specific ID)? ---> Yes ---> Ignore
      | No
      v
Is Bot in Silent Mode & User != David? ---> Yes ---> Ignore
      | No
      v
Is User Ignored? ---> Yes ---> Check opt-back statement
      | No
      v
Does Message mention @everyone? ---> Yes ---> Ignore
      | No
      v
Does Message start with "ougi", "扇", or Bot Mention?
      ├── Yes -------------------------------------> ougi.processCommand(msg)
      v No
Does Message start with "#ougi"?
      ├── Yes -------------------------------------> ougi.rootCommands(msg)
      v No
Is Channel Type DM?
      ├── Yes -------------------------------------> ougi.genAIAbility(msg)
      v No
Is Channel GuildText?
      ├── Prefixed command? -----------------------> ougi.processCommand(msg)
      ├── Replied to Ougi? ------------------------> ougi.genAIAbility(msg)
      └── Economy active in channel? ---------------> ougi.economy('xp', msg)
```

### 3. Reaction Shortcuts (`messageReactionAdd`)
When a user reacts with an emoji on a message in a guild:
1. Resolves `emojiKey` (custom emoji ID or standard Unicode character).
2. Looks up `settingsOBJ.shortcuts[guildId][emojiKey]`.
3. Constructs a synthetic message object (`pseudoMSG`) populated with `ougi <shortcut.action>`.
4. Dispatches `pseudoMSG` to `ougi.processCommand(msg)`.

### 4. Sniping Engine (`messageDelete` & `messageUpdate`)
Captures recently deleted or edited text messages in memory per channel using `ougi.loadSniper(msg, isEdit)`. Respects guild blacklists (`snipe` / `editsnipe`).

---

## 💾 Flat-File & Discord Channel Backup Database Model

OugiBot uses a hybrid **"Discord-as-a-Database"** architecture combined with local AES-256 encrypted flat files.

```
   Local Encrypted Files                     Discord Cloud Channels
   (settings.txt, responses.txt,             (Private Backup Channels)
    raffles.txt, dynamicLocales.txt, etc.)
               |                                        ^
               |--- Write & AES Encrypt (every 5 min) --|
               |                                        |
               |<-- Read & Sync Attachment (every 30s) -|
```

### AES-256 State Encryption
State read/write operations use `ougi.readFile` and `ougi.writeFile`:
- Data written to disk is encrypted via `CryptoJS.AES.encrypt(content, process.env.CRYPT_KEY)`.
- Data read from disk attempts plain JSON parsing first; if unparseable, decrypts using `process.env.CRYPT_KEY`.

### Backup Channels (`global.channels`)
- **Settings Channel (`791151086077083688`)**: `settings.txt`
- **Backup Channel (`726927738094485534`)**: `responses.txt` (knowledge base)
- **Embeds Channel (`740187317238497340`)**: `embedPresets.txt`
- **News Channel (`751697345737129994`)**: `newsChannel.txt`
- **Locales Channel (`820971831992647681`)**: `localesCache.txt`
- **Dynamic Locales Channel (`880322518139957299`)**: `dynamicLocales.txt`
- **Raffles Channel (`1411177261172002906`)**: `raffles.txt`

---

## 🌐 Dynamic Localization Pipeline

OugiBot features an advanced multi-tiered localization engine managed through `ougi.text(msg, stringID, dynamic, raw)`.

```
                        ougi.text(msg, phrase, dynamic)
                                       |
                   +-------------------+-------------------+
                   |                                       |
                   v (dynamic = false)                     v (dynamic = true)
        Check Static Dictionary                 Check Dynamic Locales Cache
        (ougi.localization[lang])             (dynamicLocales[lang][phrase])
                   |                                       |
        Found? ----+---- Not Found?              Found? ---+--- Not Found?
          |                |                       |               |
          v                v                       v               v
    Return String   Translate via GT           Return String   Fuzzy Match Check
                    & Cache in localesCache                    (stringSimilarity > 0.75)
                                                                   |
                                                         Matched? -+- Unmatched?
                                                            |           |
                                                            v           v
                                                       Return Cached   Translate via GT,
                                                                       preserve emojis,
                                                                       cache & backup
```

1. **Static Dictionary (`localization.js`)**: Hardcoded strings in English (`en`), Spanish (`es`), and Mexican Spanish (`mx`).
2. **Static Locales Cache (`localesCache.txt`)**: Translates missing English keys into target user/guild language using Google Translate API and caches results permanently.
3. **Dynamic Phrase Translation (`dynamicLocales.txt`)**: Translates arbitrary runtime strings. Uses `string-similarity` to find cached translations with >75% similarity. Replaces Discord custom emojis (`<:name:id>`) safely around translation steps.

---

## 🤖 Conversational AI & NLP Pipeline

When Ougi receives a conversational message (mention, DM, reply, or unknown command), it routes through a 3-tiered response resolution hierarchy:

```
[Conversational Message] ---> Tier 1: Pollinations AI (genAIAbility)
                                    |
                            Failed / Invalid Output?
                                    v
                              Tier 2: Algorithmic Fuzzy NLP (judgementAbility)
                                    |
                             Similarity < 33%?
                                    v
                              Tier 3: Bad Words & Standard Fallback (checkBadWords)
```

### Tier 1: Pollinations AI (`genAIAbility.js` & `genAIText.js`)
- Sends request to `https://text.pollinations.ai/` using model `openai-fast`.
- Includes system persona (`whoAmI`, `instructions`, `contextTextChannel` / `contextDM`), character introduction (`introductionAI`), and channel interaction history (last 5 messages).
- Validates response: if response is invalid, HTML document error, Pollinations brand leakage, or >1024 chars, passes to Tier 2.

### Tier 2: Algorithmic Fuzzy NLP (`judgementAbility.js`)
- Translates incoming message to English if necessary.
- Evaluates candidate trigger keys in `knowledgeBase` (`responses.txt`) using dual similarity algorithms:
  - **Levenshtein Distance**: `levenary` & `leven`
  - **Dice's Coefficient**: `string-similarity`
- If composite match similarity >= 33%, selects a response from `knowledgeBase`, censors inappropriate terms for public channels, translates response back to user's native language, and posts reply.

### Tier 3: Bad Words & Standard Fallback (`checkBadWords.js`)
- Checks message content against curated bad word patterns and spooky word dictionaries (`spookyWords`).
- Responds with fallback spooky responses or Easter egg reactions.

---

## 🛡️ Security, Rate Limiting & Admin Controls

1. **Rate Limiting**: Enforces a 250ms per-command cooldown per user (`settingsOBJ.ratelimit`). Suppressed for Patreon donors.
2. **User Ban Engine**: Banned users in `settingsOBJ.banned` receive an expired ban auto-lift check or an Embed notification stating ban expiry date and reason.
3. **Channel Blacklisting**: Commands in `settingsOBJ.blacklist[guildId]` are rejected with server notification.
4. **Permission Engine (`checkPerms.js`)**: Verifies required channel permissions (`SendMessages`, `EmbedLinks`, `AttachFiles`, `ManageMessages`, `UseExternalEmojis`, etc.) before executing commands.
5. **Root Commands (`rootCommands.js`)**: `#ougi` commands reserved exclusively for bot owner ID (`davidUserID` = `"265257341967007758"`).
