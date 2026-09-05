module.exports = async function (msg) {
    if (!(await ougi.guildCheck(msg))) return;

    const embed = await ougi.helpPreset(msg, "feed-remove");
    embed.setDescription(await ougi.text({ msg, stringID: "feedRemoveHelpDesc" }))
        .addFields(
            {
                name: await ougi.text({ msg, stringID: "specialPermission" }),
                value: ":warning: " + (await ougi.text({ msg, stringID: "mustOwnOrAdmin" }) || "You must be an administrator to perform this action.")
            },
            {
                name: await ougi.text({ msg, stringID: "example" }),
                value: "`ougi feed-remove tt:mrbeast`\n`ougi feed-remove ig:natgeo " + msg.channel.toString() + "`\n`ougi feed-remove https://instagram.com/natgeo " + msg.channel.toString() + " @Notificaciones`"
            },
            {
                name: await ougi.text({ msg, stringID: "output" }),
                value: await ougi.text({
                    msg,
                    stringID: "feed_remove_helpOutput",
                    values: { handle: "@mrbeast" }
                })
            }
        );

    msg.channel.send({ embeds: [embed] }).catch(console.error);
};
