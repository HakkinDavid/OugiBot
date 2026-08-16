module.exports =
    async function (msg) {
        let embed = await ougi.helpPreset(msg, "raffle");
        if (msg.channel.type !== Discord.ChannelType.GuildText) {
            embed.addFields({ name: await ougi.text({ msg, stringID: "onlyGuilds" }), value: ":warning: " + await ougi.text({ msg, stringID: "mustGuild" }) })
        }
        embed.setDescription(await ougi.text({ msg, stringID: "raffleHelpDesc" }))
            .addFields(
                { name: await ougi.text({ msg, stringID: "specialPermission" }), value: ":warning: " + await ougi.text({ msg, stringID: "onlyOwner" }) }
            )
            .addFields({
                name: await ougi.text({ msg, stringID: "example" }),
                value: "`ougi raffle ::title Event Raffle ::list Alice 10\nBob 5 ::duration 10m ::winners 2 ::channel `" + msg.channel.toString() + "` `"
            })
            .addFields({
                name: await ougi.text({ msg, stringID: "output" }),
                value: await ougi.text({ msg, stringID: "raffleHelpOutput" })
            })
            .addFields({
                name: await ougi.text({ msg, stringID: "note" }),
                value: (await ougi.text({ msg, stringID: "raffleHelpClear" })) + "\n`ougi raffle clear`"
            });
        msg.channel.send({ embeds: [embed] }).catch(console.error);
    }