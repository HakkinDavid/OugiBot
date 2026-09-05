module.exports = async function (msg) {
    if (!(await ougi.guildCheck(msg))) return;

    const embed = await ougi.helpPreset(msg, "feed-list");
    embed.setDescription(await ougi.text({ msg, stringID: "feedListHelpDesc" }))
        .addFields(
            {
                name: await ougi.text({ msg, stringID: "example" }),
                value: "`ougi feed-list`\n`ougi feed-list " + msg.channel.toString() + "`\n`ougi feed-list tt:mrbeast`"
            },
            {
                name: await ougi.text({ msg, stringID: "output" }),
                value: await ougi.text({
                    msg,
                    stringID: "feed_list_helpOutput"
                })
            }
        );

    msg.channel.send({ embeds: [embed] }).catch(console.error);
};
