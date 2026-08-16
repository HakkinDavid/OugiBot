# OugiBot Development & Extension Guide

This guide outlines code conventions, architectural patterns, state modification rules, and step-by-step instructions for developers adding new features or commands to **OugiBot**.

---

## 📐 Code Conventions & Architecture Rules

### 1. Function File Resolution
OugiBot uses `require-all` in [`fan.js`](../fan.js) to dynamically bind all files in [`function/`](file:///Users/hakkindavid/Documents/GitHub/OugiBot/function) to `global.ougi.<filename>`:

- File names **must** use camelCase (e.g. `myNewCommand.js`).
- The exported function is accessible anywhere in the project via `ougi.myNewCommand(...)`.
- Avoid `require()` calls for other internal sub-functions; invoke them directly from `ougi.*`.

### 2. State & Database Mutation Rules
Never mutate global state objects (`settingsOBJ`, `knowledgeBase`, `rafflesOBJ`) without persisting and backing up the changes:

```javascript
// 1. Mutate global object
settingsOBJ.customFeature[guildId] = newConfig;

// 2. Encrypt & write to local disk
await ougi.writeFile(database.settings.file, JSON.stringify(settingsOBJ, null, 4), console.error);

// 3. Backup attachment to Discord cloud channel
await ougi.backup(database.settings.file, channels.settings);
```

---

## 🛠️ Step-by-Step: Adding a New Command

To add a new command (e.g. `ougi coinflip`), follow these steps:

### Step 1: Create Command File (`function/coinflipCommand.js`)

Create a new file in `function/`:

```javascript
// function/coinflipCommand.js
module.exports = async function (args, msg) {
    const outcome = Math.random() > 0.5 ? "Heads" : "Tails";
    const localizedText = await ougi.text(msg, `Coin flipped! Result: ${outcome}`, true);
    await msg.channel.send(localizedText);
};
```

### Step 2: Register Command in Router (`function/processCommand.js`)

Open [`function/processCommand.js`](../function/processCommand.js) and add `coinflip` to `commandMap`:

```javascript
const commandMap = {
    // ... existing commands
    coinflip: async () => ougi.coinflipCommand(args, msg),
};
```

### Step 3: Add Command Localization (`function/localization.js`)

Add localization strings to [`function/localization.js`](../function/localization.js):

```javascript
"en": {
    "coinflipHelpDesc": "Flips a virtual coin and returns Heads or Tails."
}
```

### Step 4: Create Help Module (`function/coinflipHelp.js`)

Create a help helper file to handle `ougi help coinflip`:

```javascript
// function/coinflipHelp.js
module.exports = async function (msg) {
    const embed = new Discord.EmbedBuilder()
        .setTitle(await ougi.text({ msg, stringID: "specificHelpTitle", values: { commandName: "coinflip" } }))
        .setDescription(await ougi.text({ msg, stringID: "coinflipHelpDesc" }))
        .setColor("#FF008C");
    await msg.channel.send({ embeds: [embed] });
};
```

---

## 🌍 Working with the Localization Engine

Always process user-facing text through `ougi.text`:

```javascript
// Static key lookup
const greeting = await ougi.text({ msg, stringID: "helpTitle" });

// Static key lookup with variable interpolation
const balance = await ougi.text({
    msg,
    stringID: "balance_output",
    values: {
        user: msg.author.username,
        amount: 500,
        currency: "🪙"
    }
});

// Dynamic phrase translation (translates to user/guild preferred language)
const dynamicResponse = await ougi.text({ msg, stringID: "Welcome to the custom arena!", dynamic: true });
```

- Pass `dynamic: true` to translate arbitrary runtime strings.
- Custom Discord emojis (`<:name:id>`) and placeholder tokens (`{variableName}`) inside dynamic text are shielded automatically.

---

## 🧪 Testing & Debugging Workflows

1. **Local Silent Testing**: Run the bot in silent mode so it ignores public messages and only responds to your developer account:
   ```bash
   npm run silent
   ```
2. **Instance ID Prefixing**: When running multiple local instances, invoke commands with your unique 4-digit instance ID shown on startup log:
   ```
   1234::ougi status
   ```
3. **Inspecting Log Errors**: View real-time error logs sent directly to your Discord developer logging channel or via console output.
