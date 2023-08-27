module.exports =

async function (msg) {
    if (msg.channel.type !== "text") {
        msg.channel.send(await ougi.text(msg, "mustGuild"));
        return
    }

    if (!settingsOBJ.economy.hasOwnProperty(msg.guild.id)) {
        msg.channel.send("Economy is not enabled in this Discord server.");
        return
    }

    if (typeof settingsOBJ.economy[msg.guild.id].users[msg.author.id] === undefined) {
        ougi.economy('reset_user', msg)
    }

    let rn = new Date;

    if (!((rn.getTime() - settingsOBJ.economy[msg.guild.id].users[msg.author.id].worked) > settingsOBJ.economy[msg.guild.id].cooldown*1000)) {
        msg.channel.send("You're working too often, get some rest. `Cooldown: " + (settingsOBJ.economy[msg.guild.id].cooldown*1000 - (rn.getTime() - settingsOBJ.economy[msg.guild.id].users[msg.author.id].worked))/1000 + " seconds`");
        return
    }

    settingsOBJ.economy[msg.guild.id].users[msg.author.id].worked = rn.getTime();
    
    let embed = new Discord.MessageEmbed()
    .setTitle(msg.author.username + " is working...")
    .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/loading.gif?raw=true")
    .setColor("#00D0D0");

    msg.channel.send(embed).then(message => {
        setTimeout(
            function () {
                message.delete();
                let workEmbed = new Discord.MessageEmbed()
                .setTitle("Here's your well deserved money " + msg.author.username + "!")
                .setThumbnail(msg.author.avatarURL({dynamic: true, size: 4096}))
                .setDescription("You've earned " + settingsOBJ.economy[msg.guild.id].currency + ougi.economy('add', msg, {reason: 'work'}))
                .setColor("#281E87");
                message.channel.send(workEmbed);
            }, Math.floor(Math.random()*10000)
        )
    });
}