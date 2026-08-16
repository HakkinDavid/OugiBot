module.exports =

    async function (msg) {
        /*-----------------------------------*/
        while (msg.content.includes('  ')) {
            msg.content = msg.content.replace('  ', ' ')
        }
        while (msg.content.includes('\n\n')) {
            msg.content = msg.content.replace('\n\n', '\n')
        }
        while (msg.content.includes('\n')) {
            msg.content = msg.content.replace('\n', ' ')
        }
        let spookyCake = msg.content;
        let spookySlices = spookyCake.split(" ");
        let spookyCommand = spookySlices[1];
        var arguments = spookySlices.slice(2);
        /*-----------------------------------*/

        var thisMessage = arguments.join(" ");
        var breakChocolate = thisMessage.split("::").slice(1);
        if (breakChocolate.length < 3) {
            msg.channel.send(await ougi.text('en', "root_statusRequired"))
            return
        }
        for (i = 0; breakChocolate.length > i; i++) {
            let material = breakChocolate[i];
            if (material.endsWith(" ")) {
                material = material.slice(0, material.length - 1)
            }
            if (material == ("dnd") || material == ("online") || material == ("invisible") || material == ("idle")) {
                var state = material;
            }
            else if (material.toUpperCase() == ("WATCHING") || material.toUpperCase() == ("PLAYING") || material.toUpperCase() == ("STREAMING") || material.toUpperCase() == ("LISTENING")) {
                var kind = material;
            }
            else {
                var actname = material;
            }
        }
        if (state == undefined) {
            var state = "online"
        }
        if (kind == undefined) {
            var kind = "PLAYING"
        }
        if (actname == "") {
            actname = "void"
        }
        const typeMap = {
            PLAYING: Discord.ActivityType.Playing,
            STREAMING: Discord.ActivityType.Streaming,
            LISTENING: Discord.ActivityType.Listening,
            WATCHING: Discord.ActivityType.Watching,
            CUSTOM: Discord.ActivityType.Custom,
            COMPETING: Discord.ActivityType.Competing
        };
        const activityType = typeMap[kind.toUpperCase()] ?? Discord.ActivityType.Playing;
        try {
            client.user.setPresence({ activities: [{ name: actname, type: activityType }], status: state });
            const logMsg = (await ougi.text('en', "root_statusConsoleLog")).replace(/{kind}/g, kind).replace(/{actname}/g, actname);
            const userMsg = (await ougi.text('en', "root_statusSwitched")).replace(/{kind}/g, kind).replace(/{actname}/g, actname);
            client.channels.cache.get(consoleLogging).send(logMsg);
            msg.channel.send(userMsg).catch(console.error);
        }
        catch (e) {
            console.error(e)
        }
    }
