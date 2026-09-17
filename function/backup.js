const fs = require('fs');

module.exports = async function (filename, where, force = false) {
  if (process.env.DEV == 1) {
    const skipMsg = await ougi.text({ lang: 'en', stringID: "console_backupDevSkip", values: { filename } });
    console.log(skipMsg);
    return true;
  }

  if (!fs.existsSync(filename)) {
    return false;
  }

  // Guard: unless explicitly forced, verify that the file has literally changed
  if (!force && global.ougi && typeof global.ougi.db === 'function') {
    if (!global.ougi.db().hasFileChanged(filename)) {
      console.log(`[BACKUP SKIP] File ${filename} is unchanged. Skipping upload.`);
      return true;
    }
  }

  const channel = client.channels.cache.get(where) ?? await client.channels.fetch(where).catch(() => null);
  if (!channel) {
    console.error(`Backup channel ${where} not found or inaccessible for ${filename}.`);
    return false;
  }

  try {
    await channel.send({
      files: [filename]
    });
    if (global.ougi && typeof global.ougi.db === 'function') {
      global.ougi.db().recordFileHash(filename);
    }
    return true;
  } catch (err) {
    console.error(`Error uploading backup for ${filename}:`, err);
    return false;
  }
};
