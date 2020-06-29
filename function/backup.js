module.exports =

function backup(filename, where){
  var event = new Date();

  client.channels.get(where).send("backup of __**" + event.toLocaleTimeString('en-US') + "**__", {
    files: [{
      attachment: filename,
      name: filename
    }]
  })
  .then()
  .catch(console.error);
}
