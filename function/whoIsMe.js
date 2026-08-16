module.exports =

async function (arguments, msg) {
  const creator = client.users.cache.get(davidUserID).username;

  var embed = new Discord.EmbedBuilder()
  .setTitle(await ougi.text({ msg, stringID: "about_title", values: { creator } }))
  .setAuthor({name: "Ougi [BOT]", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setColor("#000000")
  .setDescription(await ougi.text({ msg, stringID: "about_desc" }))
  .setFooter({text: await ougi.text({ msg, stringID: "about_footer" }), icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setThumbnail(client.users.cache.get(davidUserID).avatarURL({dynamic: true, size: 4096}))
  .setURL("https://www.instagram.com/hakkindavid/")
  .addFields({name: await ougi.text({ msg, stringID: "about_q1" }), value: await ougi.text({ msg, stringID: "about_a1" })})
  .addFields({name: await ougi.text({ msg, stringID: "about_q2" }), value: await ougi.text({ msg, stringID: "about_a2" })})
  .addFields({name: await ougi.text({ msg, stringID: "about_q3" }), value: await ougi.text({ msg, stringID: "about_a3" })})
  .addFields({name: await ougi.text({ msg, stringID: "about_q4" }), value: await ougi.text({ msg, stringID: "about_a4" })})
  .addFields({name: await ougi.text({ msg, stringID: "about_q5" }), value: await ougi.text({ msg, stringID: "about_a5" })})
  .addFields({name: await ougi.text({ msg, stringID: "about_q6" }), value: await ougi.text({ msg, stringID: "about_a6" })})
  .addFields({name: await ougi.text({ msg, stringID: "about_q7" }), value: await ougi.text({ msg, stringID: "about_a7" })})
  .addFields({name: await ougi.text({ msg, stringID: "about_q8" }), value: await ougi.text({ msg, stringID: "about_a8", values: { creator } })});

  msg.channel.send({embeds: [embed]}).catch(console.error);
}
