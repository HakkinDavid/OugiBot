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
            let checking = setInterval(async () => {
              if (!(await fs.exists(filename))) return;
              if (ougi.readFile(filename) === undefined) {
                lastMessage.delete();
                fs.unlinkSync(filename);
                console.log("Bad file " + filename + " deleted, retrying soon...");
              }
              else {
                console.log(filename + " ok.");
                success = true;
              }
              clearInterval(checking);
            }, 500);
          }
        });
      }
    ).catch(console.error);
  }
  return success;
}
