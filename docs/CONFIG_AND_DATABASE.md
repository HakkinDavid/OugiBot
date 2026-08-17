# OugiBot Configuration & Database Specification

This document details the data structures, state persistence mechanisms, AES-256 file encryption, Discord Channel Backup topology, and environment variable requirements of **OugiBot**.

---

## 💾 Architecture Overview

OugiBot utilizes a lightweight, serverless **flat-file database system** backed by **AES-256 encryption** and synchronized to **private Discord channels**. This architecture provides high reliability, zero database maintenance costs, and automated remote cloud backups.

```
       +-------------------------------------------------------+
       |               OugiBot Runtime (fan.js)                |
       +--------------------------+----------------------------+
                                  |
            +---------------------+---------------------+
            |                                           |
            v                                           v
  +-------------------+                       +-------------------+
  | Memory (Global)   |                       | Crypto / Storage  |
  | - settingsOBJ     |                       | - readFile.js     |
  | - knowledgeBase   |                       | - writeFile.js    |
  | - dynamicLocales  |                       +---------+---------+
  | - rafflesOBJ      |                                 |
  +-------------------+                                 v
                                              +-------------------+
                                              | AES-256 File      |
                                              | Encryption        |
                                              +---------+---------+
                                                        |
            +-------------------------------------------+
            |
            v
  +-------------------+                       +-------------------+
  | Local Flat Files  |<=== Sync (30s) =======| Private Discord   |
  | (.txt files)      |==== Backup (5min) ===>| Backup Channels   |
  +-------------------+                       +-------------------+
```

---

## 📄 Data Files & Schemas

All data files are stored in the project root directory. Files ending in `.txt` are encrypted with AES-256 using `process.env.CRYPT_KEY`.

### 1. `settings.txt` (`global.settingsOBJ`)
Stores all global runtime configurations, per-guild options, user language preferences, rate limits, bans, and economy records.

```json
{
  "lang": {
    "265257341967007758": "en",
    "726927738094485534": "es"
  },
  "prefix": {
    "726927738094485534": "ougi!"
  },
  "banned": {
    "123456789012345678": {
      "until": 1750000000000,
      "reason": "Inappropriate command usage"
    }
  },
  "blacklist": {
    "726927738094485534": ["image", "minesweeper"]
  },
  "ratelimit": {
    "265257341967007758": 1720000000000
  },
  "patrons": {
    "265257341967007758": true
  },
  "economy": {
    "726927738094485534": {
      "users": {
        "265257341967007758": {
          "money": 1500,
          "inventory": [],
          "level": 3,
          "xp": 120,
          "badges": [],
          "worked": 5
        }
      },
      "multiplier": 1,
      "channels": ["726927738094485534"],
      "shop": {},
      "levels": {},
      "badges": {},
      "currency": "$",
      "xp": "XP",
      "cooldown": 10
    }
  },
  "shortcuts": {
    "726927738094485534": {
      "👍": { "action": "say Good job!" }
    }
  },
  "guildBump": {
    "726927738094485534": {
      "channel": "726927738094485534",
      "role": "726927738094485535",
      "next_bump": 1720007200000,
      "reminded": false
    }
  },
  "interactionsCounter": {
    "users": { "265257341967007758": 42 },
    "channels": { "726927738094485534": 150 }
  },
  "ignored": []
}
```

### 2. `responses.txt` (`global.knowledgeBase`)
Stores the trigger-to-response knowledge base learned through `ougi learn`.

```json
{
  "hello spooky": [
    "Welcome to our realm!",
    "Greetings, traveler."
  ],
  "who are you": [
    "I am Oshino Ougi. I don't know anything, you know."
  ]
}
```

### 3. `embedPresets.txt`
Stores saved custom embed templates created via `ougi embed ::save <name>`.

```json
{
  "welcome::265257341967007758": [
    "title Welcome to the server!",
    "description Read the rules and enjoy.",
    "color #FF008C"
  ]
}
```

### 4. `dynamicLocales.txt` (`global.dynamicLocales`)
Stores dynamically translated dynamic phrases with fuzzy matching target values.

```json
{
  "es": {
    "Welcome to our realm!": {
      "value": "¡Bienvenido a nuestro reino!",
      "fromCode": "en"
    }
  }
}
```

### 5. `localesCache.txt` (`global.localesCache`)
Stores cached translations for static localization keys missing from native language files.

```json
{
  "es": {
    "helpTitle": "Página de ayuda con Ougi"
  }
}
```

### 6. `raffles.txt` (`global.rafflesOBJ`)
Stores active and historical weighted server raffles and participant registrations per guild.

```json
{
  "726927738094485534": {
    "ongoingRaffles": [
      {
        "messageId": "1234567890123456789",
        "embed": {},
        "participants": [
          { "name": "UserA", "weight": 5, "confirmed": true, "id": "265257341967007758" }
        ],
        "config": {
          "title": "VIP Giveaway",
          "duration": 60,
          "winnersCount": 1,
          "mention": "@everyone",
          "channelId": "726927738094485534",
          "endsAt": 1720003600000
        },
        "winners": null,
        "finished": false
      }
    ],
    "allowedConcurrentRaffles": 1,
    "allowedParticipants": 100,
    "licensedUntil": 1750000000000,
    "presetList": null
  }
}
```

### 7. `newsChannel.txt`
Stores designated text channel IDs configured to receive news broadcasts across guilds.

### 8. `spookyWords`
A JSON array of ~1,000 curated words used for NLP dictionary lookup and word games.

---

## 🔒 AES-256 Encryption Mechanics

All file persistence logic is abstracted in [`function/readFile.js`](../function/readFile.js) and [`function/writeFile.js`](file:///Users/hakkindavid/Documents/GitHub/OugiBot/function/writeFile.js).

### Reading (`ougi.readFile`)
1. Reads raw file contents using `fs.readFileSync(path, 'utf-8')`.
2. Attempts direct `JSON.parse(raw)`. If successful, returns parsed JSON object (supports unencrypted legacy files).
3. If JSON parsing fails, executes AES decryption via CryptoJS:
   ```javascript
   JSON.parse(CryptoJS.AES.decrypt(raw, process.env.CRYPT_KEY).toString(CryptoJS.enc.Utf8));
   ```

### Writing (`ougi.writeFile`)
Encrypts content with AES-256 before saving to disk:
```javascript
await fs.writeFile(path, CryptoJS.AES.encrypt(content, process.env.CRYPT_KEY).toString(), 'utf-8', callback);
```

---

## ☁️ Discord Channel Cloud Backup ("Discord-as-a-Database")

To prevent data loss on ephemerally hosted platforms (such as Heroku or containerized deployments), OugiBot synchronizes state with private Discord channels.

### Channel Backup Map (`global.channels` & `global.database`)

| Database Identifier | File Path | Discord Channel ID | Function |
| :--- | :--- | :--- | :--- |
| `settings` | `./settings.db` | `791151086077083688` | Guild configs, user langs, prefixes |
| `backup` | `./responses.db` | `726927738094485534` | Knowledge base responses |
| `embeds` | `./embedPresets.db` | `740187317238497340` | Saved custom embed presets |
| `news` | `./newsChannel.db` | `751697345737129994` | News broadcast channel list |
| `locales` | `./localesCache.db` | `820971831992647681` | Static string translation cache |
| `dynamicLocales` | `./dynamicLocales.db` | `880322518139957299` | Dynamic phrase translation cache |
| `raffles` | `./raffles.db` | `1411177261172002906` | Weighted raffle configurations |
| `economy` | `./economy.db` | `1536866624253075527` | Guild economy & user balance/XP records |

### Background Synchronization Intervals
- **Data Backup Interval (every 5 minutes / 300,000 ms in `fan.js`)**: Executes `ougi.db().checkpointAll()` and checks each database for modifications using dirty flags (`ougi.db().isDirty()`) and SHA-256 hash comparisons (`ougi.db().hasFileChanged()`). Backups via `ougi.backup()` are only dispatched to Discord channels if changes have occurred, preventing redundant network uploads.
- **Data Sync Interval (every 30 seconds / 30,000 ms in `fan.js`)**: Executes `ougi.fetch()` for any unsynced database file to download the latest attachment from Discord if local files are missing or incomplete.

---

## 🔑 Environment Variables Specification (`.env`)

| Variable Name | Required? | Description |
| :--- | :--- | :--- |
| `TOKEN` | **Yes** | Discord Bot Authentication Token. |
| `CRYPT_KEY` | **Yes** | Encryption key used for AES-256 flat-file encryption. |
| `DEV` | Optional | Development mode identifier (e.g. `production` / `development`). |
| `KSOFTTOKEN` | Optional | KSoft API token for song lyrics lookup (`lyrics.js`). |
| `NEWS` | Optional | NewsAPI key for global news headline search (`news.js`). |
| `CKEY` | Optional | Twitter API Consumer Key (`tweet.js`). |
| `CSECRET` | Optional | Twitter API Consumer Secret Key. |
| `ACCTOKEN` | Optional | Twitter API Access Token. |
| `ACCTOKENSECRET`| Optional | Twitter API Access Token Secret. |
