module.exports =

async function (arguments, msg) {
  if (!(await ougi.guildCheck(msg))) return;

  if (!(await ougi.adminCheck(msg))) return;

  let prefix = arguments.join(" ");

  if (arguments.length < 1) {
    msg.channel.send(await ougi.text(msg, "prefix_specifyNew"));
    return;
  }
  const prefixSuccessTemplate = await ougi.text(msg, "prefix_setSuccess");
  msg.channel.send(
    prefixSuccessTemplate
      .replace(/{guild}/g, msg.guild.toString())
      .replace(/{prefix}/g, prefix)
  );

  ougi.db().setPrefix(msg.guildId, prefix);
}
