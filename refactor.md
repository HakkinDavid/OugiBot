# OugiBot Codebase Refactoring & Sanitization Implementation Plan

This implementation plan details the complete refactoring, database migration, subsystem rebuilds, security fixes, and economy completion for **OugiBot** following our thorough command audit.

---

## 🎯 Primary Goal & Constraints

- **MAXIMA**: Maintain **$0 Hosting & Operating Cost** ("If it can't be done for free, it won't be done").
- **Database Modernization**: Upgrade flat text/JSON files to separate **SQLite** databases (`better-sqlite3`) while preserving automated **Discord Channel Cloud Backups**.
- **Voice & Music Rebuild**: Completely rewrite voice, music streaming, and TTS from scratch at $0 cost.
- **Economy System Completion**: Finish the 5+ year WIP economy system, adding `work`, `daily`, `pay`, `leaderboard`, `shop`/`buy`/`sell`, gambling mini-games (`slots`, `coinflip`, `gamble`), and the interactive `storytell` RPG session.
- **Security & Deprecated Code Sanitization**: Fix `eval()` vulnerability in `calc`, remove broken Twitter API posting and COVID commands, replace defunct KSoft lyrics API, replace RapidAPI recipe endpoint with free TheMealDB API, fix `remindMe` stub code, and cap snipe memory buffers.

---

## 🏗️ Proposed Architecture & Changes

### 1. Database Architecture Migration (SQLite + Discord Backups)

Replace `ougi.readFile` / `ougi.writeFile` flat file storage with a unified SQLite module (`database.js` using `better-sqlite3`) supporting separate SQLite database files for each domain, while keeping the background cloud backup system to Discord channels:

- `settings.db` (Guild settings, user languages, prefixes, rate limits, banned users, shortcuts, bump reminders, ignored users)
- `responses.db` (Learned trigger-response pairs for `knowledgeBase`)
- `embedPresets.db` (Saved and shared custom embed presets)
- `newsChannel.db` (Guild news broadcast channel mappings)
- `localesCache.db` (Static localized string cache)
- `dynamicLocales.db` (Dynamic translated phrase cache)
- `raffles.db` (Raffle configurations, ongoing raffles, participant lists, Patreon licenses)
- `economy.db` (Guild economy balances, levels, XP, inventories, shop items, cooldowns)
- `reminders.db` (Active user reminders with target execution timestamps)
- `surveys.db` (Active survey definitions, response logs, newsletter subscribers)

**Cloud Backup Engine**: Every 5 minutes, database tables serialize/export and back up to respective Discord cloud channels (`channels.*`). Every 30 seconds, `ougi.fetch` verifies local state against Discord channel attachments.

---

### 2. Voice & Music Subsystem Rebuild

- **[NEW] [`function/voiceEngine.js`](file:///Users/hakkindavid/Documents/GitHub/OugiBot/function/voiceEngine.js)**: Replaces broken voice/music implementation from scratch using `@discordjs/voice` and `@distube/ytdl-core` / `play-dl`.
  - Supports `ougi play <url | query>`, `ougi skip`, `ougi stop`, `ougi queue`.
  - Implements queue management, connection error auto-recovery, and idle disconnect timers.
- **[MODIFY] [`function/voice.js`](file:///Users/hakkindavid/Documents/GitHub/OugiBot/function/voice.js)**: Rebuild TTS (`ougi speak`) using `google-tts-api` (100% free) with `@discordjs/voice` audio resource pipeline.

---

### 3. Third-Party API Sanitization & Replacements

- **[MODIFY] [`function/lyrics.js`](file:///Users/hakkindavid/Documents/GitHub/OugiBot/function/lyrics.js)**: Replace defunct KSoft.Si API with free Genius lyrics scraper / public Genius API.
- **[MODIFY] [`function/recipeCommand.js`](file:///Users/hakkindavid/Documents/GitHub/OugiBot/function/recipeCommand.js)**: Replace RapidAPI (`edamam-recipe-search.p.rapidapi.com`) with free TheMealDB API (`https://www.themealdb.com/api/json/v1/1/search.php?s=...`).
- **[DELETE] [`function/covidstats.js`](file:///Users/hakkindavid/Documents/GitHub/OugiBot/function/covidstats.js)**, **[`function/covidstatsHelp.js`](file:///Users/hakkindavid/Documents/GitHub/OugiBot/function/covidstatsHelp.js)**, **[`function/healthcare.js`](file:///Users/hakkindavid/Documents/GitHub/OugiBot/function/healthcare.js)**, **[`function/healthcareHelp.js`](file:///Users/hakkindavid/Documents/GitHub/OugiBot/function/healthcareHelp.js)**, **[`function/medicalDefinition.js`](file:///Users/hakkindavid/Documents/GitHub/OugiBot/function/medicalDefinition.js)**, **[`function/medicalDefinitionHelp.js`](file:///Users/hakkindavid/Documents/GitHub/OugiBot/function/medicalDefinitionHelp.js)**: Completely remove deprecated COVID-19 commands.
- **[DELETE] [`function/tweetRootCommand.js`](file:///Users/hakkindavid/Documents/GitHub/OugiBot/function/tweetRootCommand.js)**: Remove broken Twitter API v1.1 posting command.
- **[PRESERVE] [`function/tweet.js`](file:///Users/hakkindavid/Documents/GitHub/OugiBot/function/tweet.js)**: Retain local fake Twitter/X embed generator (`ougi tweet`).
- **[MODIFY] [`function/newsCommand.js`](file:///Users/hakkindavid/Documents/GitHub/OugiBot/function/newsCommand.js)** & **[`function/newspaper.js`](file:///Users/hakkindavid/Documents/GitHub/OugiBot/function/newspaper.js)**: Ensure free NewsAPI tier is handled gracefully with error fallbacks.
- **[PRESERVE] [`function/imageCommand.js`](file:///Users/hakkindavid/Documents/GitHub/OugiBot/function/imageCommand.js)**: Retain Pollinations AI free image generation (`https://image.pollinations.ai/`).

---

### 4. Security & Memory Leak Fixes

- **[MODIFY] [`function/calculateCommand.js`](file:///Users/hakkindavid/Documents/GitHub/OugiBot/function/calculateCommand.js)**: Remove unsafe `Function("return (" + expression + ")")()` execution (`eval()`). Implement sandboxed math expression evaluator using math token parsing (e.g. `mathjs` or safe regex tokenization).
- **[MODIFY] [`function/loadSniper.js`](file:///Users/hakkindavid/Documents/GitHub/OugiBot/function/loadSniper.js)** & **[`function/shootSniper.js`](file:///Users/hakkindavid/Documents/GitHub/OugiBot/function/shootSniper.js)**: Cap snipe buffer to a maximum of 10 messages per channel and add a 1-hour auto-expiration timer to prevent memory leaks.
- **[MODIFY] [`function/genAIAbility.js`](file:///Users/hakkindavid/Documents/GitHub/OugiBot/function/genAIAbility.js)**: Cap channel interaction history (`interactions[channelId]`) and prune idle channels.

---

### 5. Economy Subsystem Completion

Complete the 5+ year WIP Economy system in [`function/economy.js`](file:///Users/hakkindavid/Documents/GitHub/OugiBot/function/economy.js) and associated modules:

- **[MODIFY] [`function/workCommand.js`](file:///Users/hakkindavid/Documents/GitHub/OugiBot/function/workCommand.js)**: Add configurable cooldown timer (e.g. 1 hour) with localized cooldown messaging.
- **[NEW] [`function/dailyCommand.js`](file:///Users/hakkindavid/Documents/GitHub/OugiBot/function/dailyCommand.js)**: Claim daily currency bonus (`ougi daily`) every 24 hours.
- **[NEW] [`function/payCommand.js`](file:///Users/hakkindavid/Documents/GitHub/OugiBot/function/payCommand.js)**: Transfer currency between server members (`ougi pay @user <amount>`).
- **[NEW] [`function/leaderboardCommand.js`](file:///Users/hakkindavid/Documents/GitHub/OugiBot/function/leaderboardCommand.js)**: Displays top balance ($) and XP/Level rankings per guild (`ougi leaderboard`).
- **[NEW] [`function/shopCommand.js`](file:///Users/hakkindavid/Documents/GitHub/OugiBot/function/shopCommand.js)**: Server shop manager to list, buy, and sell custom items or roles (`ougi shop`, `ougi buy`, `ougi sell`).
- **[NEW] [`function/gamblingCommands.js`](file:///Users/hakkindavid/Documents/GitHub/OugiBot/function/gamblingCommands.js)**: Mini-games (`ougi slots <bet>`, `ougi coinflip <bet> <heads|tails>`, `ougi gamble <bet>`).
- **[NEW] [`function/storytellCommand.js`](file:///Users/hakkindavid/Documents/GitHub/OugiBot/function/storytellCommand.js)**: Server-public RPG roleplay session (`ougi storytell`):
  - Initiates a funny random scenario leading to either a glorious reward or a penalty.
  - Grants 1 turn per active participant with a 5-minute inactivity window.
  - Ougi (via AI / judgement engine) evaluates the story conclusion and distributes rewards/penalties!

---

### 6. Raffles, Reminders & Administration

- **[PRESERVE] [`function/raffleCommand.js`](file:///Users/hakkindavid/Documents/GitHub/OugiBot/function/raffleCommand.js)**: Retain Patreon subscription licensing time-limits as core to the business model.
- **[MODIFY] [`function/remindMe.js`](file:///Users/hakkindavid/Documents/GitHub/OugiBot/function/remindMe.js)**: Finish incomplete stub code to support human relative durations (`10m`, `2h`, `1d`), persisting active timers in SQLite database across bot restarts.
- **[MODIFY] [`function/remindBump.js`](file:///Users/hakkindavid/Documents/GitHub/OugiBot/function/remindBump.js)**: Fix Disboard bump detection logic and scheduled reminders.
- **[MODIFY] [`function/adminCheck.js`](file:///Users/hakkindavid/Documents/GitHub/OugiBot/function/adminCheck.js)**: Automatically grant admin status to members with Discord `Administrator` or `ManageGuild` permissions while retaining `admin-register` for custom delegations.
- **[MODIFY] [`function/rootCommands.js`](file:///Users/hakkindavid/Documents/GitHub/OugiBot/function/rootCommands.js)**: Enforce strict bot author check (`davidUserID` = `"265257341967007758"`) for all `#ougi` root operations.

---

## 🔬 Verification Plan

### Automated Build & Syntax Verification
1. Run syntax verification on all JS files:
   ```bash
   node -c fan.js
   ```
2. Verify SQLite database schema creation and file persistence.
3. Test command dispatcher routing (`processCommand.js`).

### Manual & Behavioral Testing
1. **Security & Input Sanitization**: Verify `ougi calc` safely evaluates math expressions without executing arbitrary JS.
2. **Music & Voice**: Verify YouTube voice streaming (`ougi play`), skipping, stopping, and TTS (`ougi speak`).
3. **Economy System**: Test `work`, `daily`, `pay`, `leaderboard`, `shop`, `slots`, `coinflip`, and `storytell` RPG session.
4. **Reminders**: Test `ougi reminder 1m :: test` and verify persistence across bot restarts.
5. **Dynamic Locales & AI**: Verify Pollinations AI fallback to `judgementAbility` and localized string output.
