module.exports =

async function (msg) {
  var phrases = ["johnny", "foo", "never gonna give, never gonna give"];
  var matchingreply = ["test", "bar", "(give you up)"];
  var trigger = phrases[Math.floor(Math.random()*phrases.length)];
  var response = matchingreply[phrases.indexOf(trigger)];
  var afterOptions = [
    "I'll start replying `" + response + "` when anyone says `" + trigger + "`",
    "Of course I already knew I should say `" + response + "` when anyone says `" + trigger + "`, I was just making sure you knew too~"
  ];
  var answer = afterOptions[Math.floor(Math.random()*afterOptions.length)];
  var embed = new Discord.EmbedBuilder()
  .setTitle("Ougi's `learn` command")
  .setAuthor({name: "Ougi [BOT]", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setColor("#230347")
  .setDescription("Make Ougi learn something new! You just gotta provide a trigger phrase and the desired response, separated by two colons (::).")
  .setFooter({text: "helpEmbed by Ougi", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true")
  .addFields({name: await ougi.text(msg, "example"), value: "`ougi learn " + trigger + " :: " + response + "`"})
  .addFields({name: await ougi.text(msg, "output"), value: answer})
  .addFields({name: "Note", value: "In order to use the content you taught Ougi, write a message starting with `ougi`, followed by whatever the trigger phrase was. There's also the option to DM Ougi, in which using the prefix for this matter is optional."})
  .addFields({name: "Using the trigger phrase", value: "`ougi " + trigger + "`"})
  .addFields({name: "Ougi will reply", value: response})
  .addFields({name: "Trying to make Ougi forget something? Execute the following command for more information", value: "`ougi help forget`"})

  msg.channel.send({embeds: [embed]}).catch(console.error);
}
