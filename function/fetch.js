module.exports =

async function (channelID) {
  let success = false;
  if (client.channels.cache.get(channelID) == undefined) {
    console.log("Skipping unexistent channel " + channelID);
    success = true;
  }
  else {
    await client.channels.cache.get(channelID).messages.fetch({ limit: 1 }).then(
      async (messages) => {
        let lastMessage = messages.first();
        let myURL = lastMessage.attachments.first().url;
        await download(myURL, {
          filename: lastMessage.attachments.first().name
        }, async (error, filename) => {
          if (error) {
            console.error(error);
          } else {
            console.log("Saved as " + filename + ". Checking...");
            let check_attempts = 0;
            await new Promise ((resolve, reject) => {
              let checking = setInterval(() => {
                if (!fs.existsSync(filename)) return;
                if (ougi.readFile(filename) === undefined) {
                  if (check_attempts > 25) {
                    lastMessage.delete();
                    fs.unlinkSync(filename);
                    clearInterval(checking);
                    reject("Bad file " + filename + " deleted, retrying soon...");
                  }
                  check_attempts++;
                }
                else {
                  success = true;
                  clearInterval(checking);
                  resolve(filename + " ok.");
                }
              }, 500);
            });
          }
        });
      }
    ).catch(console.error);
  }
  return success;
}
