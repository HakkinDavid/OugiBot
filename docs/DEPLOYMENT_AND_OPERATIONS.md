# OugiBot Deployment & Operations Guide

This guide describes how to configure, deploy, run, and maintain **OugiBot** across production environments, cloud providers (Heroku, VPS), and local development environments.

---

## 📋 System Prerequisites

- **Node.js**: Version 18.0.0 or higher (`>=18.0.0`).
- **NPM**: Version 8.0.0 or higher.
- **Git**: Required for automated startup pulls if using `npm start`.
- **System Memory**: 512 MB minimum, 1 GB recommended.

---

## ⚙️ Environment Configuration

Create a `.env` file in the project root directory (copy from `example.env`):

```bash
cp example.env .env
```

Populate the `.env` file with your credentials:

```ini
TOKEN=your_discord_bot_token_here
CRYPT_KEY=your_aes256_encryption_key_here
DEV=production
KSOFTTOKEN=your_ksoft_api_key_here
NEWS=your_news_api_key_here
CKEY=your_twitter_consumer_key_here
CSECRET=your_twitter_consumer_secret_here
ACCTOKEN=your_twitter_access_token_here
ACCTOKENSECRET=your_twitter_access_token_secret_here
```

---

## 🚀 Execution Modes

OugiBot supports two runtime modes controlled via command-line arguments:

### 1. Normal Production Mode
Bot actively listens and responds to all users across all joined Discord servers.

```bash
npm start
# Equivalent to: git pull && node fan.js
```

### 2. Silent / Maintenance Mode
Bot ignores commands from all standard users and only responds to the developer (`davidUserID` = `"265257341967007758"`) or commands prefixed with instance ID (`<instanceID>::<command>`). Useful for debugging live code without affecting public users.

```bash
npm run silent
# Equivalent to: node fan.js silent
```

---

## ☁️ Deployment Strategies

### Strategy A: Heroku Cloud Deployment
OugiBot includes a pre-configured [`Procfile`](file:///Users/hakkindavid/Documents/GitHub/OugiBot/Procfile) for Heroku:

```procfile
worker: npm start
```

1. Create a Heroku application:
   ```bash
   heroku create ougi-discord-bot
   ```
2. Configure Heroku Config Vars:
   ```bash
   heroku config:set TOKEN="your_token" CRYPT_KEY="your_key" DEV="production"
   ```
3. Scale worker dyno:
   ```bash
   heroku ps:scale worker=1
   ```

### Strategy B: PM2 (Bare Metal / VPS Deployment)
For running OugiBot on Ubuntu/Debian/macOS VPS using PM2 process manager:

1. Install PM2 globally:
   ```bash
   npm install -g pm2
   ```
2. Start process with auto-restart on crash:
   ```bash
   pm2 start fan.js --name "OugiBot"
   pm2 save
   ```
3. Enable PM2 system startup hook:
   ```bash
   pm2 startup
   ```

### Strategy C: Docker Containerization
Create a `Dockerfile` in root:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
CMD ["node", "fan.js"]
```

Build and run container:
```bash
docker build -t ougi-bot .
docker run -d --env-file .env --name ougi-container ougi-bot
```

---

## 📊 Error Webhooks & System Monitoring

OugiBot features automated real-time error reporting through Discord Webhooks and DMs:

### 1. Discord Error Log Webhook
All `console.error` invocations are caught, formatted into red Discord Embeds, and automatically dispatched to the developer's console channel (`consoleLogging` = `"1140457399673688176"`).

### 2. Uncaught Exception Direct Message Handler
In `fan.js`, unhandled runtime exceptions trigger an emergency catch block that slices error tracebacks into 2000-character chunks and sends direct messages to `davidUserID`:

```javascript
process.on('uncaughtException', async (e) => {
    let trimmed = JSON.stringify(e, Object.getOwnPropertyNames(e), 4);
    // Transmits error stack trace directly to David's DMs
    await client.users.cache.get(davidUserID)?.send("```" + trimmed.slice(0, 1994) + "```");
});
```

---

## 🧹 Maintenance Scripts

### 1. Word List Generator (`jsonthis.js`)
Generates the encrypted dictionary array file `./spookyWords` used by NLP games and profanity filters.

```bash
node jsonthis.js
```

### 2. Knowledge Base URL Auditor (`auditresponses.js`)
Audits all responses stored in `responses.txt` (`knowledgeBase`), extracts any embedded HTTP/HTTPS URLs, and saves an audit report to `linksInReplies.txt`.

```bash
node auditresponses.js
```

### 3. Cloud Database Upload Script (`uploadBackups.js`)
Uploads all updated local database files directly to designated Discord backup channels so that production Ougi instances can fetch and synchronize fresh data on boot.

```bash
npm run upload-backups
# Or: node uploadBackups.js
```

### 4. End-to-End Sync-Migrate-Upload Pipeline (`syncMigrateUpload.js`)
Wipes any pre-existing local flat text files, pulls current live production channel attachments, downloads them, converts/migrates them to SQLite databases (`*.db`), re-uploads the updated files back to production channels, and cleans up local flat text files in a single operation.

```bash
npm run sync-migrate-upload
# Or: node syncMigrateUpload.js
```
