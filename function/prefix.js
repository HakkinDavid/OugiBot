module.exports =

async function (arguments, msg) {
  if (!(await ougi.guildCheck(msg))) return;

  if (!(await ougi.adminCheck(msg))) return;

  let prefix = arguments.join(" ");

  if (arguments.length < 1) {
    msg.channel.send(await ougi.text({ msg, stringID: "prefix_specifyNew" }));
    return;
  }
  msg.channel.send(
    await ougi.text({
      msg,
      stringID: "prefix_setSuccess",
      values: {
        guild: msg.guild.toString(),
        prefix
      }
    })
  );

  ougi.db().setPrefix(msg.guildId, prefix);
}
