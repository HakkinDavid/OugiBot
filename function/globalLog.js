module.exports =

async function (msg) {
    let embed = new Discord.MessageEmbed()
    .setColor("#FF008C")
    .setFooter("globalLogEmbed by Ougi", client.user.avatarURL({dynamic: true, size: 4096}))
    .setTimestamp();
    if (typeof msg === "string") {
        embed.setAuthor("Ougi through Console Log", client.user.avatarURL({dynamic: true, size: 4096})).setDescription(msg);
    }
    else {
        embed.setAuthor(msg.author.tag, msg.author.avatarURL({dynamic: true, size: 4096})).setDescription("ID `" + msg.author.id + "`");
        let spookyCake = msg.content;
        let spookySlices = spookyCake.split(" ");
        let spookyCommand = spookySlices[1];
        let arguments = spookySlices.slice(2);
        if (spookyCommand == undefined) {
            embed.addField("No trigger was specified", "\u200b");
        }
        else {
            embed.addField("Command", spookyCommand);
        }
        if (arguments != "") {
            arguments = arguments.join(" ");
            if (arguments.length < 1024) {
                embed.addField("Arguments", arguments);
            }
            else {
                embed.addField("Arguments", arguments.slice(0, 1024));
                embed.addField("\u200b", arguments.slice(1024));
            }
        }
    }

    client.channels.cache.get(consoleLogging).send({embed});
}
