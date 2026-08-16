# OugiBot Documentation Hub

Welcome to the comprehensive technical documentation for **OugiBot** (also known as *Oshino Ougi*), a feature-rich, multi-functional Discord bot inspired by the *Monogatari Series* character Oshino Ougi, active and continuously evolving since 2019.

---

## 📚 Documentation Index

| Document | Description |
| :--- | :--- |
| [**Architecture & System Design**](../docs/ARCHITECTURE.md) | High-level system architecture, Discord.js v14 refactor, global state lifecycle, event routing, dynamic translation engine, and AI/NLP pipeline. |
| [**Command Reference**](file:///Users/hakkindavid/Documents/GitHub/OugiBot/docs/COMMAND_REFERENCE.md) | Exhaustive, categorized reference of all bot commands (User, Admin, Owner/Root), parameters, permissions, aliases, and usage examples. |
| [**Configuration & Database**](file:///Users/hakkindavid/Documents/GitHub/OugiBot/docs/CONFIG_AND_DATABASE.md) | In-depth breakdown of flat-file storage, AES-256 state encryption, Discord Channel Backup architecture, `.env` parameters, and data structures. |
| [**Modules & Function Directory**](file:///Users/hakkindavid/Documents/GitHub/OugiBot/docs/MODULES_AND_FUNCTIONS.md) | Complete directory and API mapping of all 140+ function files in `function/`, organized by system responsibility. |
| [**Localization & Translation Guide**](../docs/LOCALIZATION_GUIDE.md) | Comprehensive manual on `localization.js`, `text.js`, string migration directives, rules for AI agents, and exception justifications. |
| [**Deployment & Operations**](../docs/DEPLOYMENT_AND_OPERATIONS.md) | Operational guide covering Node.js requirements, Heroku deployment via `Procfile`, PM2, Winston logging, error webhooks, and maintenance scripts. |
| [**Development Guide**](file:///Users/hakkindavid/Documents/GitHub/OugiBot/docs/DEVELOPMENT_GUIDE.md) | Guidelines for developers contributing to OugiBot, code conventions, state management patterns, and instructions for adding commands or languages. |

---

## 🌟 Core Highlights of OugiBot

- **7+ Years of Continuous History**: Built originally around 2019 and modernised with a Discord.js v14 refactor.
- **Flat-File DB with Discord Channel Cloud Backups**: Stores configuration, user responses, dynamic locales, and active raffles in local files encrypted with AES-256 and synchronized via private Discord channel attachments.
- **Dual Conversational AI Engine**: Combines Pollinations AI (`openai-fast`) LLM capability with a fuzzy rule-based NLP engine (`judgementAbility`) powered by Levenshtein distance and Dice's Coefficient trigger matching against user-taught response knowledge bases.
- **Dynamic On-the-Fly Localization**: Translates commands and user-facing messages dynamically across any language using Google Translate with fuzzy string caching to minimize latency and API calls.
- **Rich Interactive Features**: Cryptographically secure server raffles, custom embed creation with shareable presets, reaction-emoji command shortcuts, server economy with XP and custom icons, YouTube music streaming, and Disboard bump reminders.

---

## 📄 Privacy & Licensing

- **Privacy Policy**: [Word Document](file:///Users/hakkindavid/Documents/GitHub/OugiBot/docs/Ougi%20BOT%20Privacy%20Policy.docx) | [PDF Version](file:///Users/hakkindavid/Documents/GitHub/OugiBot/docs/Ougi%20BOT%20Privacy%20Policy.pdf)
- **License**: ISC (HakkinDavid)
