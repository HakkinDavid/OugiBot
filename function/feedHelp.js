module.exports = async function (msg) {
    const embed = await ougi.helpPreset(msg, "feed");
    embed.setDescription(await ougi.text({ msg, stringID: "feedHelpDesc" }))
        .addFields(
            {
                name: await ougi.text({ msg, stringID: "example" }),
                value: "`ougi feed`\n`ougi feed 2`\n`ougi feed tt:mrbeast`\n`ougi feed https://instagram.com/natgeo 3`"
            },
            {
                name: await ougi.text({ msg, stringID: "output" }),
                value: await ougi.text({
                    msg,
                    stringID: "feed_helpOutput"
                })
            }
        );

    msg.channel.send({ embeds: [embed] }).catch(console.error);
};
