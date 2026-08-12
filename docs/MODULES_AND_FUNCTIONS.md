# OugiBot Codebase Function & Module Directory

This document provides a complete directory of all 140+ function files contained within the [`function/`](file:///Users/hakkindavid/Documents/GitHub/OugiBot/function) directory, categorized by system subsystem.

In OugiBot, files inside `function/` are loaded dynamically via `requireAll` at launch (`fan.js`) and bound directly to `global.ougi.<filename>`.

---

## 🗂️ Subsystem Categories

- [OugiBot Codebase Function \& Module Directory](#ougibot-codebase-function--module-directory)
  - [🗂️ Subsystem Categories](#️-subsystem-categories)
  - [1. Core Infrastructure \& System Operations](#1-core-infrastructure--system-operations)
  - [2. Dynamic Localization \& Language Engine](#2-dynamic-localization--language-engine)
  - [3. Conversational AI, NLP \& Knowledge Base](#3-conversational-ai-nlp--knowledge-base)
  - [6. Utilities, Information \& Search Commands](#6-utilities-information--search-commands)

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
| [`checkPerms.js`](../function/checkPerms.js) | `ougi.checkPerms(msg, requiredPerms)` | Verifies Bot text channel permissions before executing commands. |
| [`adminCheck.js`](../function/adminCheck.js) | `ougi.adminCheck(msg, ownerOnly)` | Verifies if author is guild owner or registered bot administrator. |
| [`isAdmin.js`](../function/isAdmin.js) | `ougi.isAdmin(msg)` | Evaluates administrator status boolean for member. |
| [`guildCheck.js`](../function/guildCheck.js) | `ougi.guildCheck(msg)` | Validates that command invocation occurred inside a guild text channel. |

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
| [`judgementAbility.js`](../function/judgementAbility.js) | `ougi.judgementAbility(msg)` | Fuzzy NLP response engine (Levenshtein + Dice's Coefficient). |
| [`checkBadWords.js`](../function/checkBadWords.js) | `ougi.checkBadWords(msg)` | Profanity filter and spooky word fallback handler. |
| [`mimicAbility.js`](../function/mimicAbility.js) | `ougi.mimicAbility(msg)` | Formats spooky text mimic responses. |
| [`ideaCoreProcessor.js`](../function/ideaCoreProcessor.js) | `ougi.ideaCoreProcessor(text)` | Pre-processes text inputs for algorithmic intent matching. |

---

## 6. Utilities, Information & Search Commands

| Function File | Exported Signature / Purpose | Description |
| :--- | :--- | :--- |
| [`toHumanTime.js`](../function/toHumanTime.js) | `ougi.toHumanTime(ms)` | Converts milliseconds into human-readable time string format. |
| [`sleep.js`](../function/sleep.js) | `ougi.sleep(ms)` | Synchronous delay execution helper. |
| [`capitalize.js`](../function/capitalize.js) | `ougi.capitalize(str)` | Capitalizes first letter of string. |
