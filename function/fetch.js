const fs = require('fs');
const https = require('https');
const path = require('node:path');

function isSqliteHeader(filepath) {
  if (!fs.existsSync(filepath)) return false;
  try {
    const fd = fs.openSync(filepath, 'r');
    const buffer = Buffer.alloc(16);
    fs.readSync(fd, buffer, 0, 16, 0);
    fs.closeSync(fd);
    return buffer.toString('utf-8', 0, 15) === "SQLite format 3";
  } catch {
    return false;
  }
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const tempDest = `${dest}.tmp`;
    const file = fs.createWriteStream(tempDest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        fs.unlink(tempDest, () => {});
        return reject(new Error(`Failed to download ${url}: Status ${response.statusCode}`));
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          try {
            if (isSqliteHeader(tempDest)) {
              try {
                const dbName = path.basename(dest, '.db');
                if (global.ougi && typeof global.ougi.db === 'function') {
                  const dbManager = global.ougi.db();
                  if (dbManager && typeof dbManager.closeDb === 'function') {
                    dbManager.closeDb(dbName);
                  }
                }
              } catch {}
              fs.renameSync(tempDest, dest);
              resolve();
            } else {
              fs.unlink(tempDest, () => {});
              reject(new Error(`Downloaded file ${tempDest} is not a valid SQLite database.`));
            }
          } catch (e) {
            reject(e);
          }
        });
      });
    }).on('error', (err) => {
      fs.unlink(tempDest, () => reject(err));
    });
  });
}

module.exports = async function (channelID, filename, data_obj_name = undefined) {

  const channel = client.channels.cache.get(channelID);
  if (!channel) {
    console.log("Skipping nonexistent channel " + channelID);
    if (data_obj_name && database[data_obj_name]) database[data_obj_name].done = true;
    return;
  }

  try {
    const messages = await channel.messages.fetch({ limit: 10 });
    const lastMessage = messages.find(m => m.attachments && m.attachments.size > 0);

    if (!lastMessage || !lastMessage.attachments.size) {
      if (data_obj_name && database[data_obj_name]) database[data_obj_name].done = true;
      return;
    }

    const attachment = lastMessage.attachments.first();
    await downloadFile(attachment.url, filename);
    console.log("[OK] Retrieved database file " + filename + ".");
    if (data_obj_name && database[data_obj_name]) database[data_obj_name].done = true;
  } catch (err) {
    console.error("Error fetching attachment in fetch.js:", err);
  }
};

