module.exports =

function whoIsMe(arguments, msg) {
  var embed = new Discord.RichEmbed()
  .setTitle("by " + client.users.get("265257341967007758").tag)
  .setAuthor("Ougi [BOT]", client.user.avatarURL)
  .setColor("#000000")
  .setDescription("A simple chat bot with an undefined personality: If you had to describe it on the shortest phrase, it would be \"Oshino Ougi is Oshino Ougi\", even an entire encyclopedia about Ougi would just require that sentence.")
  .setFooter("HauntedEmbed by Ougi", client.user.avatarURL)
  .setThumbnail(client.users.get("265257341967007758").avatarURL)
  .setURL("https://twitter.com/HakkinDavid")
  .addField("Who's Ougi?", "Ougi.")
  .addField("What's Ougi's prefix?", "`ougi`")
  .addField("What does Ougi do?", "Ask Ougi.\nA good start is `ougi help`")
  .addField("What does Ougi know?", "Ougi doesn't know anything, it is you who knows.")
  .addField("What does Ougi log in it's console?", "Ougi logs commands containing it's prefix with their respective arguments or DMs you send to it, plus any information that might be useful for further debugging.")
  .addField("Can I invite Ougi to my server?", "Of course! Here's Ougi's page link.\nhttps://top.gg/bot/629837958123356172")
  .addField("Does Ougi have a GitHub repository?", "Yes, it does.\nGitHub: https://github.com/HakkinDavid/OugiBot")
  .addField("Wait! Is Ougi in Twitter?!", "Yup, and it's saying nonsense.\nhttps://twitter.com/OugiBotto")
  .addField("Can I send any feedback?", "Sure! David, developer of Ougi, is always glad to receive it. Feel free to DM him or to reach him out in Twitter.\n**Twitter:** https://twitter.com/HakkinDavid\n**Discord:** " + client.users.get("265257341967007758").tag);

  msg.channel.send({embed}).catch(console.error);
}
