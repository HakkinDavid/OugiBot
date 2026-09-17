const fs = require('fs');
const https = require('https');
const path = require('node:path');
const crypto = require('node:crypto');

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

function downloadFile(url, dest, remoteTimestamp = 0) {
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
            const isDb = dest.endsWith('.db');
            if (isDb) {
              if (!isSqliteHeader(tempDest)) {
                fs.unlink(tempDest, () => {});
                return reject(new Error(`Downloaded file ${tempDest} is not a valid SQLite database.`));
              }
            }

            const tempHash = crypto.createHash('sha256').update(fs.readFileSync(tempDest)).digest('hex');

            if (fs.existsSync(dest)) {
              const localHash = crypto.createHash('sha256').update(fs.readFileSync(dest)).digest('hex');
              if (tempHash === localHash) {
                fs.unlinkSync(tempDest);
                if (global.ougi && typeof global.ougi.db === 'function') {
                  global.ougi.db().recordFileHash(dest);
                }
                return resolve();
              }

              const localMtime = fs.statSync(dest).mtimeMs;
              if (remoteTimestamp && localMtime > remoteTimestamp) {
                fs.unlinkSync(tempDest);
                if (global.ougi && typeof global.ougi.db === 'function') {
                  const key = global.ougi.db().getCanonicalKey(dest);
                  global.ougi.db().fileHashes[key] = tempHash;
                }
                return resolve();
              }
            }

            if (isDb) {
              try {
                ougi.db().closeDb(path.basename(dest, '.db'));
              } catch {}
            }

            fs.renameSync(tempDest, dest);

            if (dest.includes('cookies') && typeof global.updateCookiesCache === 'function') {
              global.cachedCookiesPath = global.updateCookiesCache();
            }

            if (global.ougi && typeof global.ougi.db === 'function') {
              global.ougi.db().recordFileHash(dest);
            }

            resolve();
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

  const channel = client.channels.cache.get(channelID) ?? await client.channels.fetch(channelID).catch(() => null);
  if (!channel) {
    console.log("Skipping nonexistent channel " + channelID);
    if (data_obj_name && global.database && global.database[data_obj_name]) global.database[data_obj_name].done = true;
    return;
  }

  try {
    const messages = await channel.messages.fetch({ limit: 10 });
    const lastMessage = messages.find(m => m.attachments && m.attachments.size > 0);

    if (!lastMessage || !lastMessage.attachments.size) {
      if (data_obj_name && global.database && global.database[data_obj_name]) global.database[data_obj_name].done = true;
      return;
    }

    const attachment = lastMessage.attachments.first();
    await downloadFile(attachment.url, filename, lastMessage.createdTimestamp || 0);
    const label = filename.endsWith('.db') ? 'database file' : 'attachment';
    console.log(`[OK] Retrieved ${label} ${filename}.`);
    if (data_obj_name && global.database && global.database[data_obj_name]) global.database[data_obj_name].done = true;
  } catch (err) {
    console.error("Error fetching attachment in fetch.js:", err);
  }
};

