module.exports =

async function (channelID, filename, data_obj_name = undefined) {
  if (client.channels.cache.get(channelID) == undefined) {
    console.log("Skipping unexistent channel " + channelID);
    if (data_obj_name) database[data_obj_name].done = true;
  }
  else {
    lastMessage = (await client.channels.cache.get(channelID).messages.fetch({ limit: 1 })).first();
    await download(lastMessage.attachments.first().url, {
      filename
    }, (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log("Saved as " + filename + ". Checking...");
        let checking = setInterval(() => {
          if (!fs.existsSync(filename)) return;
          if (ougi.readFile(filename) === undefined) {
            lastMessage.delete();
            fs.unlinkSync(filename);
            console.log(colors.yellow("[EH] Bad file " + filename + " deleted, retrying soon..."));
            if (data_obj_name) database[data_obj_name].done = false;
          }
          else {
            console.log(colors.green("[OK] Retrieved " + filename + "."));
            if (data_obj_name) database[data_obj_name].done = true;
          }
          clearInterval(checking);
        }, 500);
      }
    });
  }
}
