const fs = require('fs');
const https = require('https');
const path = require('node:path');

module.exports = async function (channelID, messageID, filename) {
  const channel = client.channels.cache.get(channelID);
  if (!channel) {
    console.log("Skipping nonexistent channel " + channelID);
    return null;
  }

  try {
    const message = await channel.messages.fetch(messageID);
    if (!message || !message.attachments || !message.attachments.size) {
      console.log("No attachment found in message " + messageID);
      return null;
    }

    const attachment = message.attachments.first();
    const destPath = path.join(__dirname, '..', filename);

    await new Promise((resolve, reject) => {
      const file = fs.createWriteStream(destPath);
      https.get(attachment.url, (response) => {
        if (response.statusCode !== 200) {
          fs.unlink(destPath, () => {});
          return reject(new Error(`Failed to download ${attachment.url}: Status ${response.statusCode}`));
        }
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      }).on('error', (err) => {
        fs.unlink(destPath, () => reject(err));
      });
    });

    console.log(`[OK] Retrieved attachment ${filename} from message ${messageID}.`);
    return destPath;
  } catch (err) {
    console.error("Error downloading attachment in fetchAttachment.js:", err);
    return null;
  }
};
