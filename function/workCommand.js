module.exports =

async function (msg) {
    if (!ougi.guildCheck(msg)) return;

    if (!settingsOBJ.economy.hasOwnProperty(msg.guildId) || settingsOBJ.economy[msg.guildId].disabled) {
        msg.channel.send("Economy is not enabled in this Discord server.");
        return
    }

    if (!settingsOBJ.economy[msg.guildId].users[msg.author.id] || !settingsOBJ.economy[msg.guildId].users[msg.author.id].worked) {
        await ougi.economy('reset_user', msg);
    }

    let rn = new Date;

    if (!((rn.getTime() - settingsOBJ.economy[msg.guildId].users[msg.author.id].worked) > settingsOBJ.economy[msg.guildId].cooldown*1000)) {
        msg.channel.send("You're working too often, get some rest. `Cooldown: " + (settingsOBJ.economy[msg.guildId].cooldown*1000 - (rn.getTime() - settingsOBJ.economy[msg.guildId].users[msg.author.id].worked))/1000 + " seconds`");
        return
    }

    settingsOBJ.economy[msg.guildId].users[msg.author.id].worked = rn.getTime();
    
    let embed = new Discord.EmbedBuilder()
    .setTitle(msg.author.username + " is working...")
    .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/loading.gif?raw=true")
    .setColor("#00D0D0");

    msg.channel.send({embeds: [embed]}).then(message => {
        setTimeout(
            function () {
                message.delete();
                let workEmbed = new Discord.EmbedBuilder()
                .setTitle("Here's your well deserved money " + msg.author.username + "!")
                .setThumbnail(msg.author.avatarURL({dynamic: true, size: 4096}))
                .setDescription("You've earned " + settingsOBJ.economy[msg.guildId].currency + ougi.economy('add', msg, {reason: 'work'}))
                .setColor("#281E87");
                message.channel.send({embeds: [workEmbed]});
            }, Math.floor(Math.random()*10000)
        )
    });
}