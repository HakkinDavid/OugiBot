module.exports =

async function (msg) {
  let curlRandom = ["server", msg.author.toString(), "@spookypeoplerole", "guild", "<:ougi:730355760864952401>", "#general"];
  let embed = await ougi.helpPreset(msg, "curl");
  embed.setDescription(await ougi.text(msg, "curlHelpDesc"))
    .addField(await ougi.text(msg, "example"), "`ougi curl " + curlRandom[Math.floor(Math.random()*curlRandom.length)] + "`");

  msg.channel.send({embed}).catch(console.error);
}
