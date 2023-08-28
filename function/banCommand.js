const { fstat } = require("fs");

module.exports =

async function (msg) {
    let spookyCake = msg.content;
    let spookySlices = spookyCake.split(" ");
    let hauntedCommand = spookySlices[1];
    let arguments = spookySlices.slice(2);
    let users, reason, until;
    let thisMessage = arguments.join(" ");
    let breakChocolate = thisMessage.split("::").slice(1);
    if (breakChocolate.length < 3) {
        msg.channel.send("You must include the user(s), a reason and ban expiration date.")
        return
    }
    let spookyConstructor = new Discord.EmbedBuilder()
        .setFooter({text: "banningEmbed by Ougi"})
        .setTimestamp()
        .setColor("#021959");
    for (i=0; breakChocolate.length > i; i++) {
        while (breakChocolate[i].startsWith(" ")) {
            breakChocolate[i] = breakChocolate[i].slice(1);
        }
        while (breakChocolate[i].endsWith(" ")) {
            breakChocolate[i] = breakChocolate[i].slice(0, -1);
        }
        if (breakChocolate[i].startsWith("user")) {
            users = breakChocolate[i].match(/[0-9]{17,}/gi);
            if (users.length === 0) {
                msg.channel.send("Invalid user provided.");
                return
            }
        }
        else if (breakChocolate[i].startsWith("reason")) {
            reason = breakChocolate[i].slice(7);
        }
        else if (breakChocolate[i].startsWith("until")) {
            until = breakChocolate[i].slice(6);
            date = Date.parse(until.replace(/[^0-9A-Za-z\:\-]+/gi, " "));
            if (!isNaN(date)) until = date;
        }
    }
    if (typeof users === 'undefined' || typeof reason === 'undefined' || typeof until === 'undefined') {
        msg.channel.send("You must include the user(s), a reason and ban expiration date.")
        return
    }
    for (i=0; users.length > i; i++) {
        settingsOBJ.banned[users[i]] = {
            reason,
            until
        };
    }
    msg.channel.send("Banned users\n```" + users.join(", ") + " = " + JSON.stringify({reason, until}, null, 4) + "```");
    await ougi.writeFile('./settings.txt', JSON.stringify(settingsOBJ, null, 4), console.error);
    await ougi.backup('./settings.txt', settingsChannel);
}