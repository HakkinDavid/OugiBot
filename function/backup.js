const fs = require('fs');

module.exports = async function (filename, where) {
  if (process.env.DEV == 1) {
    const skipMsg = await ougi.text({ lang: 'en', stringID: "console_backupDevSkip", values: { filename } });
    console.log(skipMsg);
    return true;
  }

  if (!fs.existsSync(filename)) {
    return false;
  }

  const channel = client.channels.cache.get(where);
  if (!channel) {
    console.error(`Backup channel ${where} not found or inaccessible for ${filename}.`);
    return false;
  }

  try {
    await channel.send({
      files: [filename]
    });
    return true;
  } catch (err) {
    console.error(`Error uploading backup for ${filename}:`, err);
    return false;
  }
};
