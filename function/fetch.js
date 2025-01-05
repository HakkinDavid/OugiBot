module.exports =

async function (channelID) {
  if (client.channels.cache.get(channelID) == undefined) {
    console.log("Couldn't retrieve database content from " + channelID);
    return;
  }
  let isValid = false;
  while (!isValid) {
    client.channels.cache.get(channelID).messages.fetch({ limit: 1 }).then(
      async (messages) => {
          let lastMessage = messages.first();
          let myURL = lastMessage.attachments.first().url;
          await download(myURL, {
            filename: lastMessage.attachments.first().name
          },
          (error, filename) => {
            if (error) { console.error(error); }
            else {
              try {
                JSON.parse(ougi.readFile(filename));
                isValid = true;
                console.log("Saved as " + filename);
              }
              catch {
                isValid = false;
                lastMessage.delete();
                return;
              }
            }});
            console.log("Retrieved database object at " + myURL);
          }
      ).catch(console.error);
  }
}
