module.exports = async function (msg) {
    let spookyCake = msg.content.replace(/\s+/g, ' ').replace(/\n+/g, ' ').trim();
    let spookySlices = spookyCake.split(" ");
    let args = spookySlices.slice(2);

    let thisMessage = args.join(" ");
    let breakChocolate = thisMessage.split("::").slice(1);
    if (breakChocolate.length < 3) {
        msg.channel.send(await ougi.text({ lang: 'en', stringID: "root_statusRequired" }).catch(() => "Status command requires 3 fields: state, kind, name."));
        return;
    }

    let state = "online";
    let kind = "PLAYING";
    let actname = "void";

    for (let i = 0; i < breakChocolate.length; i++) {
        let material = breakChocolate[i].trim();
        let lower = material.toLowerCase();
        let upper = material.toUpperCase();

        if (lower === "dnd" || lower === "online" || lower === "invisible" || lower === "idle") {
            state = lower;
        } else if (upper === "WATCHING" || upper === "PLAYING" || upper === "STREAMING" || upper === "LISTENING" || upper === "COMPETING" || upper === "CUSTOM") {
            kind = upper;
        } else if (material.length > 0) {
            actname = material;
        }
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
        const logMsg = await ougi.text({ lang: 'en', stringID: "root_statusConsoleLog", values: { kind, actname } }).catch(() => `Set presence to ${kind} ${actname}`);
        const userMsg = await ougi.text({ lang: 'en', stringID: "root_statusSwitched", values: { kind, actname } }).catch(() => `Status switched to ${kind} ${actname}`);
        const logCh = client.channels.cache.get(consoleLogging) ?? await client.channels.fetch(consoleLogging).catch(() => null);
        if (logCh) logCh.send(logMsg).catch(() => {});
        msg.channel.send(userMsg).catch(console.error);
    } catch (e) {
        console.error(e);
    }
};
