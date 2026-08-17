module.exports = async function (arguments, msg) {
    if (msg.content.includes("@everyone") || msg.content.includes("@here")) {
      msg.channel.send("Ora ora ora ora! Remove that massive ping.").catch(console.error);
      return;
    }

    let sayMessage = Array.isArray(arguments) ? arguments.join(" ").trim() : "";

    if (sayMessage.length <= 0) {
      const options = [
        await ougi.text({ msg, stringID: "say_empty1" }),
        await ougi.text({ msg, stringID: "say_empty2" }),
        await ougi.text({ msg, stringID: "say_empty3" }),
        await ougi.text({ msg, stringID: "say_empty4" }),
        await ougi.text({ msg, stringID: "say_empty5" })
      ];
      const response = options[Math.floor(Math.random() * options.length)];
      msg.channel.send(response).catch(console.error);
      return;
    }

    if (sayMessage.includes("<@") && msg.content.includes(">")) {
      msg.channel.send(await ougi.text({ msg, stringID: "say_avoidPings" })).catch(console.error);
      return;
    }

    let finalMessage = sayMessage;
    if (msg.channel.type !== Discord.ChannelType.DM) {
      finalMessage = finalMessage
        .replace(/nigga/gi, "unwhite")
        .replace(/nigger/gi, "unwhiter")
        .replace(/gay/gi, "unstraight")
        .replace(/cock/gi, "coke")
        .replace(/penis/gi, "coke")
        .replace(/n word/gi, "word starting with n");
    }
    if (msg.delete) msg.delete().catch(() => {});
    msg.channel.send(finalMessage).catch(console.error);
};
