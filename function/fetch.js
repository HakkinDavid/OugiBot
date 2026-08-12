const fs = require('fs');
const https = require('https');

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
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: Status ${response.statusCode}`));
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

module.exports = async function (channelID, filename, data_obj_name = undefined) {
  // If local SQLite database file already exists and is valid, do not overwrite it on boot
  if (fs.existsSync(filename) && isSqliteHeader(filename) && fs.statSync(filename).size > 4096) {
    console.log("[OK] Existing database file " + filename + " found locally.");
    if (data_obj_name && database[data_obj_name]) database[data_obj_name].done = true;
    return;
  }

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
