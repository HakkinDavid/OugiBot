// raffleRegisterHelp.js
module.exports =
    async function (msg) {
        let embed = await ougi.helpPreset(msg, "raffle-register");
        if (msg.channel.type !== Discord.ChannelType.GuildText) {
            embed.addFields({ name: await ougi.text(msg, "onlyGuilds"), value: ":warning: " + await ougi.text(msg, "mustGuild") })
        }
        embed.setDescription(await ougi.text(msg, "raffleRegisterHelpDesc"))
            .addFields({
                name: await ougi.text(msg, "example"),
                value: "`ougi raffle-register AliceTheGreat`"
            })
            .addFields({
                name: await ougi.text(msg, "output"),
                value: await ougi.text(msg, "raffleRegisterHelpOutput")
            });

        msg.channel.send({ embeds: [embed] }).catch(console.error);
    }