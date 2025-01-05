module.exports =

async function (channelID) {
  let success = false;
  if (client.channels.cache.get(channelID) == undefined) {
    console.log("Skipping unexistent channel " + channelID);
    success = true;
  }
  else {
    client.channels.cache.get(channelID).messages.fetch({ limit: 1 }).then(
      async (messages) => {
        let lastMessage = messages.first();
        let myURL = lastMessage.attachments.first().url;
        await download(myURL, {
          filename: lastMessage.attachments.first().name
        }, (error, filename) => {
          if (error) {
            console.error(error);
          } else {
            console.log("Saved as " + filename + ". Checking...");
            if (ougi.readFile(filename) === undefined) {
              lastMessage.delete();
              fs.unlinkSync(filename);
              console.log("Bad file " + filename + " deleted, retrying soon...");
            }
            else {
              console.log(filename + " ok.");
              success = true;
            }
          }
        });
      }
    ).catch(console.error);
  }
  return success;
}
