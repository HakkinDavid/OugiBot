module.exports =
    async function (msg) {
        let embed = await ougi.helpPreset(msg, "raffle");
        if (msg.channel.type !== Discord.ChannelType.GuildText) {
            embed.addFields({ name: await ougi.text(msg, "onlyGuilds"), value: ":warning: " + await ougi.text(msg, "mustGuild") })
        }
        embed.setDescription(await ougi.text(msg, "raffleHelpDesc"))
            .addFields(
                { name: await ougi.text(msg, "specialPermission"), value: ":warning: " + await ougi.text(msg, "onlyOwner") }
            )
            .addFields({
                name: await ougi.text(msg, "example"),
                value: "`ougi raffle ::title Event Raffle ::list Alice 10\nBob 5 ::duration 10m ::winners 2`"
            })
            .addFields({
                name: await ougi.text(msg, "output"),
                value: await ougi.text(msg, "raffleHelpOutput")
            })
            .addFields({
                name: await ougi.text(msg, "note"),
                value: (await ougi.text(msg, "raffleHelpClear")) + "\n`ougi raffle clear`"
            });
        msg.channel.send({ embeds: [embed] }).catch(console.error);
    }