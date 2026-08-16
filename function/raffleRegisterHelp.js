// raffleRegisterHelp.js
module.exports =
    async function (msg) {
        let embed = await ougi.helpPreset(msg, "raffle-register");
        if (msg.channel.type !== Discord.ChannelType.GuildText) {
            embed.addFields({ name: await ougi.text({ msg, stringID: "onlyGuilds" }), value: ":warning: " + await ougi.text({ msg, stringID: "mustGuild" }) })
        }
        embed.setDescription(await ougi.text({ msg, stringID: "raffleRegisterHelpDesc" }))
            .addFields({
                name: await ougi.text({ msg, stringID: "example" }),
                value: "`ougi raffle-register AliceTheGreat`"
            })
            .addFields({
                name: await ougi.text({ msg, stringID: "output" }),
                value: await ougi.text({ msg, stringID: "raffleRegisterHelpOutput" })
            });

        msg.channel.send({ embeds: [embed] }).catch(console.error);
    }