const fs = require('fs');
const path = require('path');

const textFileMap = {
  'settings.db': 'settings.txt',
  'responses.db': 'responses.txt',
  'embedPresets.db': 'embedPresets.txt',
  'newsChannel.db': 'newsChannel.txt',
  'localesCache.db': 'localesCache.txt',
  'dynamicLocales.db': 'dynamicLocales.txt',
  'raffles.db': 'raffles.txt',
  'economy.db': 'settings.txt'
};

module.exports = async function (channelID, filename, data_obj_name = undefined) {
  const channel = client.channels.cache.get(channelID);
  if (!channel) {
    console.log("Skipping nonexistent channel " + channelID);
    if (data_obj_name && database[data_obj_name]) database[data_obj_name].done = true;
    return;
  }

  try {
    const messages = await channel.messages.fetch({ limit: 5 });
    const lastMessage = messages.find(m => m.attachments && m.attachments.size > 0);

    if (!lastMessage || !lastMessage.attachments.size) {
      if (data_obj_name && database[data_obj_name]) database[data_obj_name].done = true;
      return;
    }

    const attachment = lastMessage.attachments.first();
    await download(attachment.url, { filename }, (error) => {
      if (error) {
        console.error("Error downloading file:", error);
      } else {
        // Inspect downloaded file header
        let isSqlite = false;
        try {
          if (fs.existsSync(filename)) {
            const fd = fs.openSync(filename, 'r');
            const buffer = Buffer.alloc(16);
            fs.readSync(fd, buffer, 0, 16, 0);
            fs.closeSync(fd);
            isSqlite = buffer.toString('utf-8', 0, 15) === "SQLite format 3";
          }
        } catch (e) {
          isSqlite = false;
        }

        if (isSqlite) {
          console.log(colors.green("[OK] Retrieved SQLite database file " + filename + "."));
        } else {
          // Downloaded legacy text attachment
          const txtFilename = textFileMap[path.basename(filename)] || filename.replace(/\.db$/, '.txt');
          console.log(colors.yellow(`[FETCH] Legacy text attachment detected for ${filename}. Saving as ${txtFilename} and executing SQLite migration...`));
          try {
            fs.copyFileSync(filename, txtFilename);
            fs.unlinkSync(filename);
            require('../migrateToSqlite');
          } catch (mErr) {
            console.error("Migration error in fetch.js:", mErr);
          }
        }

        if (data_obj_name && database[data_obj_name]) database[data_obj_name].done = true;
      }
    });
  } catch (err) {
    console.error("Error fetching attachment in fetch.js:", err);
  }
};
