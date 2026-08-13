### 1. Standard Commands (`ougi <command>` / Configured Prefix)

Dispatched via `commandMap` and command conditions in [processCommand.js](../function/processCommand.js).

#### Utility & General
| Command | Syntax / Subcommands | Description | File |
| :--- | :--- | :--- | :--- |
| **`help`** | `ougi help [command]` | Display the interactive help menu or specific command instructions. | [helpCommand.js](../function/helpCommand.js) | ✅
| **`calc`** | `ougi calc <expression>` | Evaluate a mathematical expression. | [calculateCommand.js](../function/calculateCommand.js) | ✅
| **`curl`** | `ougi curl <@user\|#channel\|@role\|emoji\|ID>` | Fetch Discord entity. | [curlCommand.js](../function/curlCommand.js) | ✅
| **`translate`** | `ougi translate <lang> <text>`<br>*(or reply to a message)* | Translate text to a target language. Usually paired with `ougi shortcut create 🌐 translate` | [translateCommand.js](../function/translateCommand.js) | ✅
| **`info`** | `ougi info` | View bot information. | [whoIsMe.js](../function/whoIsMe.js) | ✅
| **`stats`** | `ougi stats` | Users in touch. Discord servers Ougi's in. Emoji available for Ougi's usage. | [statsCommand.js](../function/statsCommand.js) | ✅
| **`acknowledgement`** | `ougi acknowledgement` | Display OugiBot Terms of Service and Privacy Policy. | [tos.js](../function/tos.js) | ✅
| **`patreon`** | `ougi patreon` | Show Patreon/support info and donation links. | [patreonCommand.js](../function/patreonCommand.js) | ✅
| **`language`** | `ougi language <lang_code\|default>` | Set or reset personal user language preferences. | [lang.js](../function/lang.js) | ✅

#### AI & Knowledge Base
| Command | Syntax / Subcommands | Description | File |
| :--- | :--- | :--- | :--- |
| **`learn`** | `ougi learn <trigger> :: <response>` | Teach Ougi a custom reply trigger and response. | [talkLearn.js](../function/talkLearn.js) | ✅
| **`forget`** | `ougi forget <trigger> :: <response>` | Remove a previously learned custom reply. | [talkForget.js](../function/talkForget.js) | ✅
| *(Fallback)* | `ougi <anything else>` | Fallback handler that routes unmatched input to Ougi's generative AI core. | [genAIAbility.js](../function/genAIAbility.js) | ⚠️ (pollinations is unavailable because it somehow thinks i'm authenticated with a key i cannot find anywhere)

#### Economy & Gambling
| Command | Syntax / Subcommands | Description | File |
| :--- | :--- | :--- | :--- |
| **`balance`** / **`bal`** | `ougi balance [@user]` | Check user currency balance. | [balanceCheck.js](../function/balanceCheck.js) | ✅
| **`work`** | `ougi work` | Perform work to earn server currency. | [workCommand.js](../function/workCommand.js) | ✅
| **`daily`** | `ougi daily` | Claim daily currency rewards. | [dailyCommand.js](../function/dailyCommand.js) | ✅
| **`pay`** | `ougi pay <amount> <@user>` | Transfer currency to another server member. | [payCommand.js](../function/payCommand.js) | ✅
| **`leaderboard`** | `ougi leaderboard` | View the server currency/economy leaderboard. | [leaderboardCommand.js](../function/leaderboardCommand.js) | ✅
| **`coinflip`** | `ougi coinflip <bet amount> <[heads]\|tails>` | Bet currency on a coinflip. | [gamblingCommands.js](../function/gamblingCommands.js) | ✅
| **`slots`** | `ougi slots <bet>` | Spin the slot machine for currency rewards. | [gamblingCommands.js](../function/gamblingCommands.js) | ✅
| **`gamble`** | `ougi gamble <bet>` | High-roll dice gamble (win on roll > 55). | [gamblingCommands.js](../function/gamblingCommands.js) | ✅
| **`storytell`** | `ougi storytell` | Interactive Storytelling RPG Session with an economic outcome! | [storytellCommand.js](../function/storytellCommand.js) | ⚠️ (pollinations is unavailable because it somehow thinks i'm authenticated with a key i cannot find anywhere)

#### Server Administration & Configuration (requires to be run in a guild with admin privileges)
| Command | Syntax / Subcommands | Description | File |
| :--- | :--- | :--- | :--- |
| **`economy`** | `ougi economy <enable\|disable\|reset\|cooldown <sec>>` | Admin management of guild economy state. | [manageEconomy.js](../function/manageEconomy.js) | ✅
| **`xp-channel`** | `ougi xp-channel <add\|remove> <#channel\|all>` | Enable or disable XP gain in specific channels. | [manageEconomy.js](../function/manageEconomy.js) | ✅
| **`seticon`** | `ougi seticon <type> <symbol\|emoji>` | Customize the currency and xp symbols for the server. | [economyIcons.js](../function/economyIcons.js) | ✅
| **`prefix`** | `ougi prefix <new_prefix>` | Set the server's custom command prefix. | [prefix.js](../function/prefix.js) | ✅
| **`guildlanguage`** | `ougi guildlanguage [lang_code\|default]` | Set or reset the server-wide default language. | [lang.js](../function/lang.js) | ✅
| **`setlog`** | `ougi setlog [#channel\|disable]` | Set or disable the audit logging channel for commands. | [setLog.js](../function/setLog.js) | ✅
| **`setnews`** | `ougi setnews [#channel\|disable]` | Set or disable the Ougi development news broadcast channel. | [setNews.js](../function/setNews.js) | ✅
| **`blacklist`** | `ougi blacklist <command\|trigger>` | Blacklist specific commands or triggers in the guild. | [rm.js](../function/rm.js) | ✅
| **`allow`** | `ougi allow <command\|trigger>` | Whitelist/unblacklist a previously blacklisted trigger. | [allowCommand.js](../function/allowCommand.js) | ✅
| **`shortcut`** | `ougi shortcut <create\|delete> <emoji> <[create] action>` | Map an emoji reaction on messages to run a command. | [shortcutCommand.js](../function/shortcutCommand.js) | ✅
| **`raffle`** | `ougi raffle ::title <title> [::list <participant nicknames [required when no preset list has been set], each with a number of entries>] [::duration <XXh YYm>] [::winners <n>] [::mention <role>] [::channel <#ch>]`<br>Subcommands: `ougi raffle list <clear\|participant nicknames, each with a number of entries>`, `ougi raffle clear` | Create and manage weighted raffles with custom criteria. | [raffleCommand.js](../function/raffleCommand.js) | ✅
| **`admin-register`** | `ougi admin-register <add\|remove> <user_id>` | Register or remove in-server Ougi administrators. | [adminRegister.js](../function/adminRegister.js) | ✅

#### Embed Builder (`spookyEmbed`)
| Command | Syntax / Subcommands | Description | File |
| :--- | :--- | :--- | :--- |
| **`embed`** | `ougi embed ::<option> <val> ::<option> ...`<br><br>Options:<br>• `title <text>`<br>• `description` / `desc <text>`<br>• `field <text>`<br>• `subtitle <text>`<br>• `deletefield <idx>`<br>• `deletesubtitle <idx>`<br>• `author <name>`<br>• `authorurl <url>`<br>• `avatar <url\|mention\|file\|guild\|myself\|ougi>`<br>• `footer <text>`<br>• `icon <url\|mention\|file\|guild\|myself\|ougi>`<br>• `thumbnail <url\|mention\|file\|guild\|myself\|ougi>`<br>• `image <url\|mention\|file\|guild\|myself\|ougi>`<br>• `url <https_url>`<br>• `color <hex\|rgb\|name\|random>`<br>• `timestamp`<br>• `save <preset_name>`<br>• `load <preset_name>`<br>• `list`<br>• `delete <preset_name>`<br>• `share <@user>` | Create, customize, store, share, and post rich Discord embeds. | [spookyEmbed.js](../function/spookyEmbed.js) | ✅

#### Raffles
| Command | Syntax / Subcommands | Description | File |
| :--- | :--- | :--- | :--- |
| **`raffle-register`** | `ougi raffle-register` | Register own raffle nickname for the server. | [raffleRegister.js](../function/raffleRegister.js) | ✅
| **`raffle-join`** | `ougi raffle-join` | Join an ongoing raffle by replying to it. Usually paired with `ougi shortcut create 🎟️ raffle-join`. | [raffleJoin.js](../function/raffleJoin.js) | ✅
| **`raffle-execute`** | `ougi raffle-execute` | Manually execute a raffle by replying to it. | [raffleExecute.js](../function/raffleExecute.js) | ✅

#### Voice, Audio & Music
| Command | Syntax / Subcommands | Description | File |
| :--- | :--- | :--- | :--- |
| **`speak`** | `ougi speak [::lang_code] <text>` | Text-To-Speech (TTS) audio output in voice channel. | [voice.js](../function/voice.js) | ❌ Error in TTS voice.js: AbortError: The operation was aborted     at AbortSignal.abortListener (node:events:995:14)     at [nodejs.internal.kHybridDispatch] (node:internal/event_target:845:20)     at AbortSignal.dispatchEvent (node:internal/event_target:778:26)     at runAbort (node:internal/abort_controller:488:10)     at abortSignal (node:internal/abort_controller:459:3)     at AbortController.abort (node:internal/abort_controller:507:5)     at Timeout.<anonymous> (/home/ubuntu/OugiBot/node_modules/@discordjs/voice/dist/index.js:2533:39)     at listOnTimeout (node:internal/timers:608:17)     at process.processTimers (node:internal/timers:543:7) {   code: 'ABORT_ERR',   [cause]: DOMException [AbortError]: This operation was aborted       at new DOMException (node:internal/per_context/domexception:76:18)       at AbortController.abort (node:internal/abort_controller:506:18)       at Timeout.<anonymous> (/home/ubuntu/OugiBot/node_modules/@discordjs/voice/dist/index.js:2533:39)       at listOnTimeout (node:internal/timers:608:17)       at process.processTimers (node:internal/timers:543:7) }
| **`music`** / **`play`** / **`p`** | `ougi music <query\|URL>` | Play or queue audio in the user's voice channel. | [voiceCallMusic.js](../function/voiceCallMusic.js) | ❌ Stream error in playNext: Error: While getting info from url Sign in to confirm you’re not a bot     at video_stream_info (/home/ubuntu/OugiBot/node_modules/play-dl/dist/index.js:2:5802)     at process.processTicksAndRejections (node:internal/process/task_queues:105:5)     at async stream (/home/ubuntu/OugiBot/node_modules/play-dl/dist/index.js:7:16453)     at async Object.stream (/home/ubuntu/OugiBot/node_modules/play-dl/dist/index.js:15:3190)     at async playNext (/home/ubuntu/OugiBot/function/voiceCallMusic.js:103:24) & not an URL error even so
| **`skip`** | `ougi skip` | Skip the currently playing track. | [voiceCallMusic.js](../function/voiceCallMusic.js) | ⚠️ (to be tested after music fix)
| **`stop`** | `ougi stop` | Stop playback and disconnect from the voice channel. | [voiceCallMusic.js](../function/voiceCallMusic.js) | ⚠️ (to be tested after music fix)
| *(URL Trigger)* | `ougi https://(www.)?youtube.com...` | Directly passing a YouTube link triggers music playback/queue. | [voiceCallMusic.js](../function/voiceCallMusic.js) | ⚠️ (to be tested after music fix)

#### Media, News & Content
| Command | Syntax / Subcommands | Description | File |
| :--- | :--- | :--- | :--- |
| **`image`** | `ougi image <query>` | Generate a Pollinations AI image. | [imageCommand.js](../function/imageCommand.js) | ✅
| **`news`** | `ougi news <query>` | Get news by topic. | [newsCommand.js](../function/newsCommand.js) | ✅
| **`newspaper`** | `ougi newspaper [page]` | Revisit the Ougi's development news. | [newspaper.js](../function/newspaper.js) | ✅
| **`subscribe`** | `ougi subscribe` | Subscribe own user to Ougi's development news by DM. | [subscribeCommand.js](../function/subscribeCommand.js) | ✅
| **`unsubscribe`** | `ougi unsubscribe` | Unsubscribe from DM news. | [unsubscribeCommand.js](../function/unsubscribeCommand.js) | ✅
| **`lyrics`** | `ougi lyrics <song_title>` | Fetch lyrics for a song via KSoft API. | [lyrics.js](../function/lyrics.js) | ❌ non functional
| **`recipe`** | `ougi recipe <name>` | Find cooking recipes by name. | [recipeCommand.js](../function/recipeCommand.js) | ✅
| **`tweet`** | `ougi tweet [@user] <text>` | Generate a custom fake X (Twitter) post embed. | [tweet.js](../function/tweet.js) | ✅
| **`emoji`** | `ougi emoji <name\|random> [... name\|random]` | Makes Ougi send custom emojis by name or random. | [customEmoji.js](../function/customEmoji.js) | ✅
| **`emoji-list`** | `ougi emoji-list` | Display a list of custom emojis available. | [emojiList.js](../function/emojiList.js) | ✅

#### Fun, Games & Message Utilities
| Command | Syntax / Subcommands | Description | File |
| :--- | :--- | :--- | :--- |
| **`say`** | `ougi say <text>` | Make Ougi repeat a message. | [sayCommand.js](../function/sayCommand.js) | ✅
| **`answer`** | `ougi answer <question>` | Ask Ougi a 8ball-style yes/no question. | [answerCommand.js](../function/answerCommand.js) | ✅
| **`dice`** | `ougi dice` | Roll a standard dice with no consequences. | [diceCommand.js](../function/diceCommand.js) | ✅
| **`react`** | `ougi react <emoji>` | Add reaction to the replied message. | [reactCommand.js](../function/reactCommand.js) | ✅
| **`minesweeper`** | `ougi minesweeper [::title <text>] [::fill <other emoji/text>] [::treasure <emoji/text>] [::difficulty <1-10>]` | Generate an embed Discord minesweeper grid. | [minesweeper.js](../function/minesweeper.js) | ✅
| **`snipe`** | `ougi snipe [index]` | Retrieve the last deleted message in the channel. | [shootSniper.js](../function/shootSniper.js) | ✅
| **`editsnipe`** | `ougi editsnipe [index]` | Retrieve the last edited message in the channel. | [shootSniper.js](../function/shootSniper.js) | ✅
| **`reminder`** | `ougi reminder <time> <message>` | Set a personal reminder message. | [remindMe.js](../function/remindMe.js) | ✅
| **`remindbump`** | `ougi remindbump [#channel] [@role]` | Set DISBOARD bump reminder notifications. | [remindBump.js](../function/remindBump.js) |  ✅
| **`survey`** | `ougi survey` | Participate in active survey(s). | [feedback.js](../function/feedback.js) | ✅
| **`results`** | `ougi results <survey>` | View survey results. | [results.js](../function/results.js) | ✅

---

### 2. Developer Root Commands (`#ougi <command>`)

Restricted exclusively to bot owner (`davidUserID`) in [rootCommands.js](../function/rootCommands.js).

| Root Command | Syntax / Arguments | Description | File |
| :--- | :--- | :--- | :--- |
| **`#ougi help`** | `#ougi help` | Show root administration help commands. | [helpRootCommand.js](../function/helpRootCommand.js) | ✅
| **`#ougi status`** | `#ougi status ::<dnd\|online\|invisible\|idle> ::<WATCHING\|PLAYING\|STREAMING\|LISTENING\|CUSTOM\|COMPETING> ::<name>` | Change bot presence status, activity type, and activity text. | [statusRootCommand.js](../function/statusRootCommand.js) | ✅
| **`#ougi log`** | `#ougi log <emoji\|guilds>` | Generate log files (`allEmoji.txt` / `allGuilds.txt`) and send to storage. | [logRootCommand.js](../function/logRootCommand.js) | ✅
| **`#ougi inspect`** | `#ougi inspect <path> [= value]` | Dynamically inspect or update global JavaScript variables/objects at runtime. | [inspectCommand.js](../function/inspectCommand.js) | ✅
| **`#ougi ban`** | `#ougi ban ::user <ids> ::reason <text> ::until <date>` | Ban users globally from accessing Ougi commands. | [banCommand.js](../function/banCommand.js) | ✅
| **`#ougi patron`** | `#ougi patron ::user <ids> ::amount <val> ::recurrence <type> ::since <date>` | Register or update user patron tier status in database. | [patronCommand.js](../function/patronCommand.js) | ✅
| **`#ougi haunt`** | `#ougi haunt <user_id> <message>` | Send a direct message to a user via the bot. | [hauntRootCommand.js](../function/hauntRootCommand.js) | ✅
| **`#ougi newsletter`** | `#ougi newsletter` | Dispatch global newsletter updates to subscribed channels and users. | [newsletter.js](../function/newsletter.js) | ✅ (DiscordAPIError[50278]: Cannot send messages to this user due to having no mutual guilds & DiscordAPIError[50013]: Missing Permissions could be prevented by checking)
| **`#ougi survey`** | `#ougi survey ::question <q> ::id <id> ::description <d> [::url <u>] [::color <c>]` | Create a global feedback survey popup. | [createSurvey.js](../function/createSurvey.js) | ✅
| **`#ougi notifysurvey`** | `#ougi notifysurvey ::id <id> ::description <description>` | Broadcast survey notification to users. | [notifySurvey.js](../function/notifySurvey.js) | ✅
| **`#ougi switch`** | `#ougi switch <instance_id>` | Toggle silent/testing mode for the current bot process instance. | [switchy.js](../function/switchy.js) | ✅
| **`#ougi shutdown`** | `#ougi shutdown` | Forcefully exit / shut down the bot process. | [vibeCheckReallyHard.js](../function/vibeCheckReallyHard.js) | ✅
| **`#ougi raffle-license`** | `#ougi raffle-license <guild_id> [duration_hours] [concurrent_limit] [participant_limit]` | Grant or update server raffle licenses. | [raffleLicenseCommand.js](../function/raffleLicenseCommand.js) | ✅

---

### 3. Application Interactions & Context Menu Commands

Handled in [processInteraction.js](../function/processInteraction.js) and [fan.js](file:///Users/hakkindavid/Documents/GitHub/OugiBot/fan.js).

| Interaction | Type | Action / Description | File |
| :--- | :--- | :--- | :--- |
| **`Translate`** | Message Context Menu | Translate target message text into user's default language. | [translateCommand.js](../function/translateCommand.js) | ✅
| **`ougi_translate_select_lang:<msg_id>`** | String Select Menu | Target language dropdown selector for translations. | [translateCommand.js](../function/translateCommand.js) | ✅ (fix that this list should be exhaustive and use full [langCodes.js](../function/langCodes.js) with any adequations made by translate command)

---

### 4. Direct Message & Opt-In System Statements

Handled in [fan.js](../fan.js).

| Statement / Trigger | Location | Action | File |
| :--- | :--- | :--- | :--- |
| `I want to opt out from using Ougi [BOT].` | Direct Messages | Opt out user from Ougi data collection and commands. | [optout.js](../function/optout.js) | ✅
| `I want to start using Ougi [BOT].` | Server / Direct Messages | Opt back in to enable Ougi usage. | [optback.js](../function/optback.js) | ✅
