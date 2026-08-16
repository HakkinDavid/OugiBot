module.exports =

async function (arguments, msg) {
    if (msg.content.includes("@everyone") || msg.content.includes("@here")) {
      msg.channel.send("Ora ora ora ora! Remove that massive ping.").catch(console.error);
      return
    }

    const sayMessage = arguments.join(" ");

    while(sayMessage.startsWith(' ')) {
      sayMessage = sayMessage.substring(1, sayMessage.length)
    }

    if (sayMessage.length <= 0) {
      var options = [
        await ougi.text(msg, "say_empty1"),
        await ougi.text(msg, "say_empty2"),
        await ougi.text(msg, "say_empty3"),
        await ougi.text(msg, "say_empty4"),
        await ougi.text(msg, "say_empty5")
      ];
      var response = options[Math.floor(Math.random()*options.length)];
      msg.channel.send(response).catch(console.error);
      return;
    }

    if (sayMessage.includes("<@") && msg.content.includes(">")) {
      msg.channel.send(await ougi.text(msg, "say_avoidPings")).catch(console.error);
      return;
    }

    var finalMessage = sayMessage.toString();
    if (msg.channel.type !== Discord.ChannelType.DM) {
      while(finalMessage.includes("nigga") || finalMessage.includes("nigger") || finalMessage.includes("gay") || finalMessage.includes("cock") || finalMessage.includes("penis") || finalMessage.includes("n word")){
        finalMessage = finalMessage
        .replace("nigga", "unwhite")
        .replace("nigger", "unwhiter")
        .replace("gay", "unstraight")
        .replace("cock", "coke")
        .replace("penis", "coke")
        .replace("n word", "word starting with n")
      }
    }
    msg.delete().catch(O_o=>{});
    msg.channel.send(finalMessage).catch(console.error);
}
