module.exports =

function sayCommand(arguments, msg) {
    if (msg.content.includes("@everyone") || msg.content.includes("@here")) {
      msg.channel.send("Ora ora ora ora! Remove that massive ping.");
      return
    }

    const sayMessage = arguments.join(" ");

    if (sayMessage.includes("<@!") && msg.content.includes(">")) {
      msg.channel.send("Avoid pings. What? Isn't that a ping?");
      return
    }

    var finalMessage = sayMessage.toString();
    msg.delete().catch(O_o=>{});
    msg.channel.send(finalMessage);
}
