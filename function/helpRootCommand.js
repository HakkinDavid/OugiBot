module.exports =

async function (arguments, msg) {
  msg.channel.send(await ougi.text({ lang: 'en', stringID: "root_helpList" })).catch(console.error);
}
