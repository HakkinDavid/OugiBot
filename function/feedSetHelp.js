module.exports = async function (msg) {
    if (!(await ougi.guildCheck(msg))) return;

    const embed = await ougi.helpPreset(msg, "feed-set");
    embed.setDescription(await ougi.text({ msg, stringID: "feedSetHelpDesc" }))
        .addFields(
            {
                name: await ougi.text({ msg, stringID: "specialPermission" }),
                value: ":warning: " + (await ougi.text({ msg, stringID: "mustOwnOrAdmin" }) || "You must be an administrator to perform this action.")
            },
            {
                name: await ougi.text({ msg, stringID: "example" }),
                value: "`ougi feed-set https://tiktok.com/@mrbeast " + msg.channel.toString() + "`\n`ougi feed-set instagram:natgeo " + msg.channel.toString() + " @Notificaciones`"
            },
            {
                name: await ougi.text({ msg, stringID: "output" }),
                value: await ougi.text({
                    msg,
                    stringID: "feed_set_helpOutput",
                    values: { channel: msg.channel.toString() }
                })
            }
        );

    msg.channel.send({ embeds: [embed] }).catch(console.error);
};
