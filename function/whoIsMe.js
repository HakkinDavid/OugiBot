module.exports =

async function (arguments, msg) {
  var embed = new Discord.EmbedBuilder()
  .setTitle("by " + client.users.cache.get(davidUserID).username)
  .setAuthor({name: "Ougi [BOT]", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setColor("#000000")
  .setDescription("A simple chat bot with an undefined personality: If you had to describe it on the shortest phrase, it would be \"Oshino Ougi is Oshino Ougi\", even an entire encyclopedia about Ougi would just require that sentence.")
  .setFooter({text: "HauntedEmbed by Ougi", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setThumbnail(client.users.cache.get(davidUserID).avatarURL({dynamic: true, size: 4096}))
  .setURL("https://twitter.com/HakkinDavid")
  .addFields({name: "Who's Ougi?", value: "Ougi."})
  .addFields({name: "What's Ougi's prefix?", value: "`ougi`"})
  .addFields({name: "What does Ougi do?", value: "Ask Ougi.\nTry `ougi help`."})
  .addFields({name: "What does Ougi know?", value: "Ougi doesn't know anything, it is you who knows."})
  .addFields({name: "What does Ougi log in it's console?", value: "Ougi logs commands containing it's prefix with their respective arguments or DMs you send to it, plus any information that might be useful for further debugging."})
  .addFields({name: "Can I invite Ougi to my server?", value: "Of course! Here's Ougi's page link.\nhttps://top.gg/bot/629837958123356172"})
  .addFields({name: "Does Ougi have a GitHub repository?", value: "Yes, it does.\nGitHub: https://github.com/HakkinDavid/OugiBot"})
  .addFields({name: "Wait! Is Ougi in Twitter?!", value: "Yup, and it's saying nonsense.\nhttps://twitter.com/OugiBotto"})
  .addFields({name: "Can I send any feedback?", value: "Sure! David, the developer of Ougi, is always glad to receive it. Feel free to DM him or to reach him out in Twitter.\n**Twitter:** https://twitter.com/HakkinDavid\n**Discord:** " + client.users.cache.get(davidUserID).username});

  msg.channel.send({embeds: [embed]}).catch(console.error);
}
