# OugiBot Codebase Function & Module Directory

This document provides a complete directory of all 140+ function files contained within the [`function/`](file:///Users/hakkindavid/Documents/GitHub/OugiBot/function) directory, categorized by system subsystem.

In OugiBot, files inside `function/` are loaded dynamically via `requireAll` at launch (`fan.js`) and bound directly to `global.ougi.<filename>`.

---

## 🗂️ Subsystem Categories

1. [Core Infrastructure & System Operations](#1-core-infrastructure--system-operations)
2. [Dynamic Localization & Language Engine](#2-dynamic-localization--language-engine)
3. [Conversational AI, NLP & Knowledge Base](#3-conversational-ai-nlp--knowledge-base)
4. [Economy, Gambling & Server Raffles](#4-economy-gambling--server-raffles)
5. [Voice, Music & TTS Subsystem](#5-voice-music--tts-subsystem)
6. [Utilities, Information & Search Commands](#6-utilities-information--search-commands)
7. [Reactions, Custom Emojis & Embed Builder](#7-reactions-custom-emojis--embed-builder)
8. [Reminders, Bumps & Survey Management](#8-reminders-bumps--survey-management)
9. [Sniping, Moderation & Root Remote Control](#9-sniping-moderation--root-remote-control)
10. [Help Subsystem Modules](#10-help-subsystem-modules)

---

## 1. Core Infrastructure & System Operations

| Function File | Exported Signature / Purpose | Description |
| :--- | :--- | :--- |
| [`startup.js`](../function/startup.js) | `ougi.startup()` | Validates and loads encrypted flat files into global memory objects on client ready. |
| [`fetch.js`](../function/fetch.js) | `ougi.fetch(channelID, filename, key)` | Synchronizes flat database files from Discord backup channel attachments. |
| [`backup.js`](../function/backup.js) | `ougi.backup(filename, channelID)` | Uploads encrypted flat database files to designated Discord backup channels. |
| [`readFile.js`](../function/readFile.js) | `ougi.readFile(path, encoding)` | Decrypts (AES-256 via CryptoJS) and reads state files into memory objects. |
| [`writeFile.js`](../function/writeFile.js) | `ougi.writeFile(path, content)` | AES-256 encrypts and writes string content to disk. |
| [`globalLog.js`](../function/globalLog.js) | `ougi.globalLog(msg)` | Logs command execution activity to global console channel via Embed. |
| [`guildLog.js`](../function/guildLog.js) | `ougi.guildLog(msg, options)` | Sends audit logs to configured server logging channels. |
| [`setLog.js`](../function/setLog.js) | `ougi.setLog(args, msg)` | Configures or disables server audit logging channels (`ougi setlog`). |
| [`checkPerms.js`](../function/checkPerms.js) | `ougi.checkPerms(msg, requiredPerms)` | Verifies Bot text channel permissions before executing commands. |
| [`adminCheck.js`](../function/adminCheck.js) | `ougi.adminCheck(msg, ownerOnly)` | Verifies if author is guild owner or registered bot administrator. |
| [`adminRegister.js`](../function/adminRegister.js) | `ougi.adminRegister(args, msg)` | Registers user as server OugiBot administrator. |
| [`isAdmin.js`](../function/isAdmin.js) | `ougi.isAdmin(msg)` | Evaluates administrator status boolean for member. |
| [`guildCheck.js`](../function/guildCheck.js) | `ougi.guildCheck(msg)` | Validates that command invocation occurred inside a guild text channel. |
| [`allowCommand.js`](../function/allowCommand.js) | `ougi.allowCommand(args, msg)` | Whitelists previously blacklisted guild commands. |
| [`rm.js`](../function/rm.js) | `ougi.rm(args, msg)` | Handles command blacklisting per guild (`ougi blacklist`). |
| [`optout.js`](../function/optout.js) | `ougi.optout(msg)` | Processes user opt-out request from OugiBot data tracking. |
| [`optback.js`](../function/optback.js) | `ougi.optback(msg)` | Resumes bot interactions for an opted-out user. |
| [`tos.js`](../function/tos.js) | `ougi.tos(msg)` | Displays terms of service and privacy statement (`ougi acknowledgement`). |
| [`vibeCheckReallyHard.js`](../function/vibeCheckReallyHard.js) | `ougi.vibeCheckReallyHard(msg)` | Initiates bot emergency process exit (shutdown). |

---

## 2. Dynamic Localization & Language Engine

| Function File | Exported Signature / Purpose | Description |
| :--- | :--- | :--- |
| [`localization.js`](../function/localization.js) | `ougi.localization` | Dictionary object containing static translations (`en`, `es`, `mx`). |
| [`text.js`](../function/text.js) | `ougi.text(msg, stringID, dynamic)` | Main multi-tiered localization engine with Google Translate fallback. |
| [`lang.js`](../function/lang.js) | `ougi.lang(args, msg, isGuild)` | Changes preferred language for user or guild (`ougi language`). |
| [`langCodes.js`](../function/langCodes.js) | `ougi.langCodes` | Supported ISO language codes mapping dictionary. |
| [`getNestedString.js`](../function/getNestedString.js) | `ougi.getNestedString(obj, path)` | Helper function to extract dot-notated nested property strings. |

---

## 3. Conversational AI, NLP & Knowledge Base

| Function File | Exported Signature / Purpose | Description |
| :--- | :--- | :--- |
| [`processCommand.js`](../function/processCommand.js) | `ougi.processCommand(msg)` | Main command parser, rate limiter, ban checker, and dispatcher. |
| [`rootCommands.js`](../function/rootCommands.js) | `ougi.rootCommands(msg)` | Dispatcher for owner `#ougi` system administration commands. |
| [`genAIAbility.js`](../function/genAIAbility.js) | `ougi.genAIAbility(msg)` | Primary LLM conversational handler with context memory. |
| [`genAIText.js`](../function/genAIText.js) | `ougi.genAIText(inputMessages)` | API client for Pollinations AI (`openai-fast` model). |
| [`talkLearn.js`](../function/talkLearn.js) | `ougi.talkLearn(args, msg)` | Teaches Ougi new trigger-response pairs (`ougi learn`). |
| [`talkForget.js`](../function/talkForget.js) | `ougi.talkForget(args, msg)` | Deletes trigger-response pairs (`ougi forget`). |
| [`judgementAbility.js`](../function/judgementAbility.js) | `ougi.judgementAbility(msg)` | Fuzzy NLP response engine (Levenshtein + Dice's Coefficient). |
| [`checkBadWords.js`](../function/checkBadWords.js) | `ougi.checkBadWords(msg)` | Profanity filter and spooky word fallback handler. |
| [`mimicAbility.js`](../function/mimicAbility.js) | `ougi.mimicAbility(msg)` | Formats spooky text mimic responses. |
| [`ideaCoreProcessor.js`](../function/ideaCoreProcessor.js) | `ougi.ideaCoreProcessor(text)` | Pre-processes text inputs for algorithmic intent matching. |

---

## 4. Economy, Gambling & Server Raffles

| Function File | Exported Signature / Purpose | Description |
| :--- | :--- | :--- |
| [`economy.js`](../function/economy.js) | `ougi.economy(action, msg, options)` | Core XP, balance, leveling, and currency transaction logic. |
| [`manageEconomy.js`](../function/manageEconomy.js) | `ougi.manageEconomy(type, msg, args)`| Server economy configuration & XP channel manager. |
| [`economyIcons.js`](../function/economyIcons.js) | `ougi.economyIcons(args, msg)` | Sets custom guild currency symbol (`ougi seticon`). |
| [`balanceCheck.js`](../function/balanceCheck.js) | `ougi.balanceCheck(args, msg)` | Displays user balance, level, and inventory (`ougi balance`). |
| [`workCommand.js`](../function/workCommand.js) | `ougi.workCommand(msg)` | Executes daily work command to earn currency (`ougi work`). |
| [`diceCommand.js`](../function/diceCommand.js) | `ougi.diceCommand(msg)` | Simulates dice rolling (`ougi dice`). |
| [`minesweeper.js`](../function/minesweeper.js) | `ougi.minesweeper(msg)` | Generates interactive Minesweeper spoiler board (`ougi minesweeper`). |
| [`raffleCommand.js`](../function/raffleCommand.js) | `ougi.raffleCommand(args, msg)` | Creates and manages weighted server raffles (`ougi raffle`). |
| [`raffleRegister.js`](../function/raffleRegister.js) | `ougi.raffleRegister(args, msg)`| Registers user display name for raffles (`ougi raffle-register`). |
| [`raffleJoin.js`](../function/raffleJoin.js) | `ougi.raffleJoin(args, msg)` | Confirms user entry into active raffle (`ougi raffle-join`). |
| [`raffleExecute.js`](../function/raffleExecute.js) | `ougi.raffleExecute(guildId, idx)` | Executes weighted raffle winner drawing algorithm. |
| [`pickWinners.js`](../function/pickWinners.js) | `ougi.pickWinners(participants, count)`| Weighted random distribution selection helper. |

---

## 5. Voice, Music & TTS Subsystem

| Function File | Exported Signature / Purpose | Description |
| :--- | :--- | :--- |
| [`voice.js`](../function/voice.js) | `ougi.voice(msg)` | Connects to voice channel and speaks text via TTS (`ougi speak`). |
| [`voiceCallMusic.js`](../function/voiceCallMusic.js)| `ougi.voiceCallMusic(msg)` | YouTube voice channel music player (`play`, `skip`, `stop`). |
| [`tts.js`](../function/tts.js) | `ougi.tts(text, lang)` | Text-To-Speech audio stream generator. |
| [`queue.js`](../function/queue.js) | `ougi.queue(msg)` | Manages audio track queue structure per guild. |
| [`lyrics.js`](../function/lyrics.js) | `ougi.lyrics(msg)` | Fetches song lyrics via KSoft API (`ougi lyrics`). |

---

## 6. Utilities, Information & Search Commands

| Function File | Exported Signature / Purpose | Description |
| :--- | :--- | :--- |
| [`calculateCommand.js`](../function/calculateCommand.js)| `ougi.calculateCommand(args, msg)`| Evaluates math expressions (`ougi calc`). |
| [`covidstats.js`](../function/covidstats.js) | `ougi.covidstats(args, msg)` | Fetches country COVID-19 pandemic statistics. |
| [`curlCommand.js`](../function/curlCommand.js) | `ougi.curlCommand(msg)` | Inspects Discord entity API metadata (`ougi curl`). |
| [`imageCommand.js`](../function/imageCommand.js) | `ougi.imageCommand(args, msg)` | Generates AI images based on prompt (`ougi image`). |
| [`medicalDefinition.js`](../function/medicalDefinition.js)| `ougi.medicalDefinition(args, msg)`| Provides medical definitions (`ougi md`). |
| [`newsCommand.js`](../function/newsCommand.js) | `ougi.newsCommand(args, msg)` | Searches news headlines via NewsAPI (`ougi news`). |
| [`newspaper.js`](../function/newspaper.js) | `ougi.newspaper(args, msg)` | Generates formatted front-page news embed (`ougi newspaper`). |
| [`recipeCommand.js`](../function/recipeCommand.js) | `ougi.recipeCommand(args, msg)` | Fetches food recipe information (`ougi recipe`). |
| [`translateCommand.js`](../function/translateCommand.js)| `ougi.translateCommand(msg)` | Translates prompt text into target language (`ougi translate`). |
| [`whoIsMe.js`](../function/whoIsMe.js) | `ougi.whoIsMe(args, msg)` | Displays user profile info (`ougi info`). |
| [`statsCommand.js`](../function/statsCommand.js) | `ougi.statsCommand(msg)` | Displays bot process uptime & statistics (`ougi stats`). |
| [`toHumanTime.js`](../function/toHumanTime.js) | `ougi.toHumanTime(ms)` | Converts milliseconds into human-readable time string format. |
| [`sleep.js`](../function/sleep.js) | `ougi.sleep(ms)` | Synchronous delay execution helper. |
| [`capitalize.js`](../function/capitalize.js) | `ougi.capitalize(str)` | Capitalizes first letter of string. |

---

## 7. Reactions, Custom Emojis & Embed Builder

| Function File | Exported Signature / Purpose | Description |
| :--- | :--- | :--- |
| [`spookyEmbed.js`](../function/spookyEmbed.js) | `ougi.spookyEmbed(msg)` | Advanced interactive embed builder with preset saving (`ougi embed`). |
| [`sayCommand.js`](../function/sayCommand.js) | `ougi.sayCommand(args, msg)` | Repeats clean text in channel (`ougi say`). |
| [`answerCommand.js`](../function/answerCommand.js) | `ougi.answerCommand(msg)` | Answers 8ball yes-no questions (`ougi answer`). |
| [`reactCommand.js`](../function/reactCommand.js) | `ougi.reactCommand(args, msg)` | Adds reaction emoji to target message (`ougi react`). |
| [`customEmoji.js`](../function/customEmoji.js) | `ougi.customEmoji(args, msg)` | Sends custom emoji by name (`ougi emoji`). |
| [`emojiList.js`](../function/emojiList.js) | `ougi.emojiList(args, msg)` | Lists available custom emojis (`ougi emoji-list`). |
| [`shortcutCommand.js`](../function/shortcutCommand.js) | `ougi.shortcutCommand(args, msg)`| Maps emoji reactions to command execution (`ougi shortcut`). |

---

## 8. Reminders, Bumps & Survey Management

| Function File | Exported Signature / Purpose | Description |
| :--- | :--- | :--- |
| [`remindMe.js`](../function/remindMe.js) | `ougi.remindMe(msg)` | Sets user timer reminder (`ougi reminder`). |
| [`remindBump.js`](../function/remindBump.js) | `ougi.remindBump(args, msg)` | Sets automated Disboard bump reminder (`ougi remindbump`). |
| [`feedback.js`](../function/feedback.js) | `ougi.feedback(msg)` | Collects user feedback survey responses (`ougi survey`). |
| [`results.js`](../function/results.js) | `ougi.results(msg)` | Displays survey results (`ougi results`). |
| [`createSurvey.js`](../function/createSurvey.js) | `ougi.createSurvey(msg)` | Owner root command to create survey questions. |
| [`notifySurvey.js`](../function/notifySurvey.js) | `ougi.notifySurvey(msg)` | Owner root command to notify subscribers of new survey. |
| [`patreonCommand.js`](../function/patreonCommand.js) | `ougi.patreonCommand(msg, tease)`| Displays Patreon donation embed or ad tease. |

---

## 9. Sniping, Moderation & Root Remote Control

| Function File | Exported Signature / Purpose | Description |
| :--- | :--- | :--- |
| [`loadSniper.js`](../function/loadSniper.js) | `ougi.loadSniper(msg, isEdit)` | Stores deleted or edited text messages in sniping buffer. |
| [`shootSniper.js`](../function/shootSniper.js) | `ougi.shootSniper(args, msg, edit)`| Retrieves sniped messages (`ougi snipe` / `editsnipe`). |
| [`banCommand.js`](../function/banCommand.js) | `ougi.banCommand(msg)` | Root owner command to ban user globally from OugiBot. |
| [`inspectCommand.js`](../function/inspectCommand.js) | `ougi.inspectCommand(msg)` | Root owner command to inspect user/guild data structures. |
| [`hauntRootCommand.js`](../function/hauntRootCommand.js)| `ougi.hauntRootCommand(args, msg)`| Root owner command for remote guild diagnostic inspection. |
| [`statusRootCommand.js`](../function/statusRootCommand.js)| `ougi.statusRootCommand(msg)`| Root owner command to update bot status activity. |
| [`logRootCommand.js`](../function/logRootCommand.js) | `ougi.logRootCommand(args, msg)` | Root owner command to view system logs remotely. |
| [`tweet.js`](../function/tweet.js) | `ougi.tweet(msg)` | Posts tweet via Twitter API (`ougi tweet`). |
| [`tweetRootCommand.js`](../function/tweetRootCommand.js)| `ougi.tweetRootCommand(msg)` | Root owner command for official bot Twitter posts. |

---

## 10. Help Subsystem Modules

`helpCommand.js`, `helpEmbed.js`, `helpPreset.js`, `helpRootCommand.js`, along with **37 individual command help modules** (`allowHelp.js`, `answerHelp.js`, `covidstatsHelp.js`, `curlHelp.js`, `diceHelp.js`, `embedHelp.js`, `emojiHelp.js`, `emojiListHelp.js`, `forgetHelp.js`, `healthcareHelp.js`, `imageHelp.js`, `languageHelp.js`, `learnHelp.js`, `lyricsHelp.js`, `medicalDefinitionHelp.js`, `musicHelp.js`, `newsHelp.js`, `newspaperHelp.js`, `prefixHelp.js`, `raffleHelp.js`, `raffleJoinHelp.js`, `raffleRegisterHelp.js`, `recipeHelp.js`, `remindbumpHelp.js`, `removeHelp.js`, `sayHelp.js`, `setlogHelp.js`, `setnewsHelp.js`, `shortcutHelp.js`, `skipHelp.js`, `snipeHelp.js`, `speakHelp.js`, `subscribeHelp.js`, `surveyHelp.js`, `translateHelp.js`, `tweetHelp.js`, `unsubscribeHelp.js`).
