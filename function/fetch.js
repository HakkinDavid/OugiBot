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
        console.log(colors.green("[OK] Retrieved database file " + filename + "."));
        if (data_obj_name && database[data_obj_name]) database[data_obj_name].done = true;
      }
    });
  } catch (err) {
    console.error("Error fetching attachment in fetch.js:", err);
  }
};
