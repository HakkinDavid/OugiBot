module.exports =

async function (arguments, msg) {
  msg.channel.send("Current root commands: `help`, `do`, `status` and `log`.").then().catch(console.error);
}
