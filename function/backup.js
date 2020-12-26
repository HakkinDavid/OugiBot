module.exports =

async function (filename, where){
  var event = new Date();

  client.channels.cache.get(where).send("backup of __**" + event.toLocaleTimeString('en-US') + "**__", {
    files: [{
      attachment: filename,
      name: filename
    }]
  })
  .then()
  .catch(console.error);
}
