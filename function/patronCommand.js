module.exports =

async function (msg) {
    let spookyCake = msg.content;
    let spookySlices = spookyCake.split(" ");
    let hauntedCommand = spookySlices[1];
    let arguments = spookySlices.slice(2);
    let thisMessage = arguments.join(" ");
    let breakChocolate = thisMessage.split("::").slice(1);

    if (breakChocolate.length < 1) {
        msg.channel.send("You must include the user(s) to register as patrons.")
        return
    }

    let users;
    let amount;
    let recurrence;
    let since;

    for (i = 0; breakChocolate.length > i; i++) {
        while (breakChocolate[i].startsWith(" ")) {
            breakChocolate[i] = breakChocolate[i].slice(1);
        }
        while (breakChocolate[i].endsWith(" ")) {
            breakChocolate[i] = breakChocolate[i].slice(0, -1);
        }
        if (breakChocolate[i].startsWith("user")) {
            users = breakChocolate[i].match(/[0-9]{17,}/gi);
            if (!users || users.length === 0) {
                msg.channel.send("Invalid user provided.");
                return
            }
        } else if (breakChocolate[i].startsWith("amount")) {
            amount = breakChocolate[i].slice("amount".length).trim();
        } else if (breakChocolate[i].startsWith("recurrence")) {
            recurrence = breakChocolate[i].slice("recurrence".length).trim();
        } else if (breakChocolate[i].startsWith("since")) {
            since = breakChocolate[i].slice("since".length).trim();
        }
    }

    if (typeof users === 'undefined') {
        msg.channel.send("You must include the user(s) to register as patrons.")
        return
    }

    settingsOBJ.patrons = settingsOBJ.patrons || {};
    for (i = 0; users.length > i; i++) {
        settingsOBJ.patrons[users[i]] = settingsOBJ.patrons[users[i]] || {};
        settingsOBJ.patrons[users[i]].amount = amount || settingsOBJ.patrons[users[i]].amount;
        settingsOBJ.patrons[users[i]].recurrence = recurrence || settingsOBJ.patrons[users[i]].recurrence;
        settingsOBJ.patrons[users[i]].since = since || settingsOBJ.patrons[users[i]].since;
    }

    msg.channel.send("Registered patrons\n```" + users.map(u => u + " = " + JSON.stringify(settingsOBJ.patrons[u], null, 4)).join("\n") + "```");
    await ougi.writeFile(database.settings.file, JSON.stringify(settingsOBJ, null, 4), console.error);
    await ougi.backup(database.settings.file, channels.settings);
}