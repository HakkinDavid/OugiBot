module.exports =

function (arguments, msg) {
    if (msg.content.includes("@everyone") || msg.content.includes("@here")) {
      msg.channel.send("Ora ora ora ora! Remove that massive ping.").then().catch(console.error);
      return
    }

    const sayMessage = arguments.join(" ");

    while(sayMessage.startsWith(' ')) {
      sayMessage = sayMessage.substring(1, sayMessage.length)
    }

    if (sayMessage.length <= 0) {
      var options = ["Say what ???", "Can anyone lend me some emptiness? This homie wants some but I ate all of mine yesterday.", "Imagine talking", "Ara ara", "?"];
      var response = options[Math.floor(Math.random()*options.length)];
      msg.channel.send(response).then().catch(console.error);
      return
    }

    if (sayMessage.includes("<@") && msg.content.includes(">")) {
      msg.channel.send("Avoid pings and custom emoji. What? Isn't that one of those?").then().catch(console.error);
      return
    }

    var finalMessage = sayMessage.toString();
    if (msg.channel.type != "dm") {
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
