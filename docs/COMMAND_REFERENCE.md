# OugiBot Command Reference Catalog

This document provides an exhaustive reference for all user, administrative, and root owner commands available in **OugiBot**.

Default Prefix: `ougi ` (or `扇`, mention `@Ougi`, or custom guild prefix). Root prefix: `#ougi `.

---

## 📌 Table of Contents

- [General & Information Commands](#-general--information-commands)
- [AI, Conversational & Knowledge Base Commands](#-ai-conversational--knowledge-base-commands)
- [Voice, Music & Text-To-Speech (TTS)](#-voice-music--text-to-speech-tts)
- [Economy, Gambling & Server Raffles](#-economy-gambling--server-raffles)
- [Reactions, Emojis & Custom Embed Builder](#-reactions-emojis--custom-embed-builder)
- [Utilities, Search & Web Services](#-utilities-search--web-services)
- [Reminders, Bumps & Surveys](#-reminders-bumps--surveys)
- [Server Administration & Moderation](#-server-administration--moderation)
- [Bot Owner / Root Commands (#ougi)](#-bot-owner--root-commands-ougi)

---

## ℹ️ General & Information Commands

### `help [command]`
- **Description**: Displays the main interactive help menu or detailed documentation for a specified command.
- **Parameters**: `[command]` *(optional)* - Target command name to view detailed help for.
- **Example**: `ougi help embed`, `ougi help raffle`

### `info` / `whoIsMe`
- **Description**: Displays user information, profile metadata, account creation date, and server join date.

### `stats`
- **Description**: Displays runtime statistics of OugiBot (Uptime, Node.js version, Memory usage, Active guilds, Cached users).

### `acknowledgement`
- **Description**: Displays OugiBot's Terms of Service and Data Privacy Policy information.

### `patreon`
- **Description**: Displays Patreon donation tiers, bot hosting support information, and patron links.

---

## 🧠 AI, Conversational & Knowledge Base Commands

### `learn <trigger> :: <response>`
- **Description**: Teaches OugiBot a new response to a specific trigger phrase.
- **Example**: `ougi learn hello spooky :: Welcome to our realm!`

### `forget <trigger> :: <response>`
- **Description**: Removes a previously learned response from OugiBot's knowledge base.

### `answer <question>`
- **Description**: Asks Ougi a yes-or-no question. Uses localized random responses.

### `image <keywords>`
- **Description**: Generates an AI image using Pollinations AI ($0 cost). NSFW prompts require execution in NSFW-flagged text channels.

---

## 🔊 Voice, Music & Text-To-Speech (TTS)

### `music` / `play` / `p <url | search terms>`
- **Description**: Connects Ougi to the user's current voice channel and streams audio from YouTube using `@discordjs/voice` and `play-dl` ($0 cost).

### `skip`
- **Description**: Skips the currently playing YouTube track in the guild music queue.

### `stop`
- **Description**: Stops music playback, clears the guild queue, and disconnects Ougi from the voice channel.

### `lyrics [song title]`
- **Description**: Searches and displays song lyrics via Genius API scraper ($0 cost).

### `speak <phrase> [:: lang]`
- **Description**: Makes Ougi join the user's voice channel and speak the provided phrase using `google-tts-api`.

---

## 🪙 Economy, Gambling & Server Raffles

### `work`
- **Description**: Perform a work task to earn server currency ($) with a 1-hour cooldown timer.

### `daily`
- **Description**: Claims daily currency bonus every 24 hours (`ougi daily`).

### `pay <@user> <amount>`
- **Description**: Transfers server currency to another member (`ougi pay @User 100`).

### `balance` / `bal`
- **Description**: Check current currency balance, level, XP, inventory, and badges.

### `leaderboard`
- **Description**: Displays server top balance ($) and level/XP rankings (`ougi leaderboard`).

### `slots <bet>`
- **Description**: Play the slot machine for a chance to win multiplier payouts.

### `coinflip <bet> <heads|tails>`
- **Description**: Bet currency on a coin flip outcome.

### `gamble <bet>`
- **Description**: Roll high (>55/100) to double your bet.

### `storytell`
- **Description**: Server-public RPG roleplay session where participants take turns building a scenario, and Ougi judges final rewards or penalties!

### `economy <option>`
- **Description**: Guild economy management. Configure multipliers, enable/disable economy, reset user balances.

### `xp-channel <add | remove> <#channel>`
- **Description**: Enable or disable XP gain for text messages sent in specific text channels.

### `seticon <symbol>`
- **Description**: Sets custom currency icon/symbol for the guild economy.

### `raffle ::title <name> ::list <participants> ::duration <time> ::winners <count>`
- **Description**: Creates a weighted server raffle (Patreon license enabled).

### `raffle-register <display_name>`
- **Description**: Registers a participant display name to link with Discord account for server raffles.

### `raffle-join`
- **Description**: Confirms user participation in an ongoing server raffle.

### `raffle-execute`
- **Description**: Manually triggers raffle winner selection on a referenced raffle message.

---

## 🎨 Reactions, Emojis & Custom Embed Builder

### `say <message>`
- **Description**: Makes Ougi repeat the given message text in the channel (cleans pings).

### `react <emoji> <message_id>`
- **Description**: Adds a specified emoji reaction to a target message.

### `emoji <emoji_name>`
- **Description**: Sends a custom emoji from Ougi's available emoji cache.

### `emoji-list [page]`
- **Description**: Browses all custom emojis accessible by OugiBot across servers.

### `embed <options>`
- **Description**: Advanced interactive custom embed builder with preset loading/saving.

### `shortcut <create | delete> <emoji> <command>`
- **Description**: Maps an emoji reaction to trigger an Ougi command execution automatically.

---

## 🔍 Utilities, Search & Web Services

### `calc <expression>`
- **Description**: Evaluates mathematical expressions safely using `mathjs` sandbox (preventing code execution).

### `curl <@user | #channel | @role | emoji | ID>`
- **Description**: Inspects detailed Discord API metadata for users, channels, roles, or emojis.

### `news <topic>`
- **Description**: Searches recent news headlines via NewsAPI in user's preferred language.

### `newspaper [category]`
- **Description**: Generates a formatted front-page newspaper embed of current world events.

### `recipe <food_item>`
- **Description**: Searches recipe ingredients and instructions using free TheMealDB API.

### `translate <text>`
- **Description**: Translates input text into user/guild target language using Google Translate.

---

## ⏰ Reminders, Bumps & Surveys

### `reminder <duration> :: <message>`
- **Description**: Sets a personal reminder supporting human durations (`10m`, `2h`, `1d`).

### `remindbump <channel> [@role]`
- **Description**: Sets up an automated Disboard bump reminder every 2 hours in the specified channel.

### `survey`
- **Description**: Checks for pending community feedback surveys.

### `results`
- **Description**: Displays summary results of completed community surveys.

### `subscribe` / `unsubscribe`
- **Description**: Opt-in or opt-out of receiving bot updates and news announcements via DMs.

---

## 🛡️ Server Administration & Moderation

### `prefix <new_prefix | reset>`
- **Description**: Changes or resets custom server prefix for OugiBot commands.

### `language <lang_code>` / `guildlanguage <lang_code>`
- **Description**: Sets user (`language`) or guild-wide (`guildlanguage`) default language.

### `setlog <#channel | disable>`
- **Description**: Designates a server audit logging channel for bot command usage.

### `setnews <#channel | disable>`
- **Description**: Configures channel for receiving Ougi news broadcasts.

### `blacklist <add | remove> <command_name>`
- **Description**: Blacklists or un-blacklists specific commands from execution in the server.

### `allow <command_name>`
- **Description**: Whitelists a previously blacklisted command.

### `admin-register <@user>`
- **Description**: Registers a guild member as an OugiBot Administrator. Members with Discord `Administrator` or `ManageServer` permissions are automatically granted admin access.

### `snipe [index]`
- **Description**: Displays recently deleted messages in the current text channel (buffer capped at 10 messages with 1-hour expiration).

### `editsnipe [index]`
- **Description**: Displays original content of recently edited messages in the current channel.

---

## 👑 Bot Owner / Root Commands (#ougi)

*Accessible strictly by bot author (`davidUserID` = `"265257341967007758"`).*

| Root Command | Description |
| :--- | :--- |
| `#ougi help` | Displays root administrative menu. |
| `#ougi status <status_text>` | Updates Ougi's Discord status / activity message. |
| `#ougi log <lines>` | Fetches real-time system logs. |
| `#ougi shutdown` | Forces emergency shutdown (`vibeCheckReallyHard`). |
| `#ougi notifysurvey` | Broadcasts new survey notification to subscribers. |
| `#ougi haunt <server_id>` | Remote server diagnostic inspection. |
| `#ougi newsletter <message>` | Broadcasts announcement to all subscribed users. |
| `#ougi switch <feature> <on|off>` | Toggles global system feature flags. |
| `#ougi survey` | Opens global survey creation workflow. |
| `#ougi ban <user_id> <duration> <reason>` | Issues global bot ban to target user. |
| `#ougi patron <user_id> <tier>` | Grants patron status to user ID. |
| `#ougi inspect <user_id | guild_id>` | Deep inspection of user/guild data structures. |
