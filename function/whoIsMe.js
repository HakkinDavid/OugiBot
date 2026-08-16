module.exports =

async function (arguments, msg) {
  const creator = client.users.cache.get(davidUserID).username;
  const titleTemplate = await ougi.text(msg, "about_title");
  const feedbackValueTemplate = await ougi.text(msg, "about_a8");

  var embed = new Discord.EmbedBuilder()
  .setTitle(titleTemplate.replace(/{creator}/g, creator))
  .setAuthor({name: "Ougi [BOT]", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setColor("#000000")
  .setDescription(await ougi.text(msg, "about_desc"))
  .setFooter({text: await ougi.text(msg, "about_footer"), icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setThumbnail(client.users.cache.get(davidUserID).avatarURL({dynamic: true, size: 4096}))
  .setURL("https://www.instagram.com/hakkindavid/")
  .addFields({name: await ougi.text(msg, "about_q1"), value: await ougi.text(msg, "about_a1")})
  .addFields({name: await ougi.text(msg, "about_q2"), value: await ougi.text(msg, "about_a2")})
  .addFields({name: await ougi.text(msg, "about_q3"), value: await ougi.text(msg, "about_a3")})
  .addFields({name: await ougi.text(msg, "about_q4"), value: await ougi.text(msg, "about_a4")})
  .addFields({name: await ougi.text(msg, "about_q5"), value: await ougi.text(msg, "about_a5")})
  .addFields({name: await ougi.text(msg, "about_q6"), value: await ougi.text(msg, "about_a6")})
  .addFields({name: await ougi.text(msg, "about_q7"), value: await ougi.text(msg, "about_a7")})
  .addFields({name: await ougi.text(msg, "about_q8"), value: feedbackValueTemplate.replace(/{creator}/g, creator)});

  msg.channel.send({embeds: [embed]}).catch(console.error);
}
