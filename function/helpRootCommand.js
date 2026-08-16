module.exports =

async function (arguments, msg) {
  msg.channel.send(await ougi.text('en', "root_helpList")).catch(console.error);
}
