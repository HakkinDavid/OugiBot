module.exports =

async function (msg, replied_to_ougi) {
  while (msg.content.includes('  ')) {
    msg.content = msg.content.replace('  ', ' ')
  }
  while (msg.content.includes('\n\n')) {
    msg.content = msg.content.replace('\n\n', '\n')
  }
  while (msg.content.includes('\n')) {
    msg.content = msg.content.replace('\n', ' ')
  }

  msg.content = msg.content.replace('<@629837958123356172>', 'ougi').replace('扇', 'ougi').replace('<@!629837958123356172>', 'ougi');

  let previous_messages = [];
  let context = "";

  if (replied_to_ougi) {
    previous_messages = [{role: 'assistant', content: (await msg.channel.messages.fetch(msg.reference.messageId)).content}];
  } else if (msg.channel.type === Discord.ChannelType.DM) {
    previous_messages = (await msg.channel.messages.fetch({ limit: 2 })).map((x) => {
      return {
        role: (x.author.id === client.user.id ? 'assistant' : 'user'),
        content: x.content
      };
    });
  }

  if (msg.channel.type === Discord.ChannelType.GuildText) {
    context = (await ougi.text(msg, "contextTextChannel")).replace(/{guildName}/, msg.guild.toString()).replace(/{channelName}/, msg.channel.name);
  }
  else {
    context = (await ougi.text(msg, "contextDM"));
  }

  let user_context = settingsOBJ.AI.description[msg.author.id];

  let spookyReply = null;

try {
  spookyReply = await ougi.genAIText(
    [
      { role: 'system', content: (await ougi.text(msg, "whoAmI")) },
      { role: 'system', content: (await ougi.text(msg, "instructions")) },
      { role: 'system', content: (await ougi.text(msg, "userIsNamed")).replace(/{userName}/, msg.author.username) + (user_context ? "\n" + user_context : "") },
      { role: 'system', content: context },
      ... previous_messages,
      { role: 'user', content: msg.content }
    ]
  );
}
catch (e) {
  spookyReply = null;
  console.error(e);
}

  if (typeof spookyReply !== "string" || spookyReply.includes("OpenAI")) { ougi.mimicAbility(msg); return; }
  
  let embed = new Discord.EmbedBuilder()
  .setTitle("Input for judgementAbility (" + msg.channel.type + " type channel)")
  .setAuthor({name: msg.author.username, icon: msg.author.avatarURL({dynamic: true, size: 4096})})
  .setColor("#FF008C")
  .setFooter({text: "globalLogEmbed by Ougi", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .addFields({name: "Content", value: msg.content.slice(0, 1024)})
  .addFields({name: "Reply", value: spookyReply});
  
  if (replied_to_ougi) { msg.reply(spookyReply).catch(console.error); }
  else { msg.channel.send(spookyReply).catch(console.error); }
  client.channels.cache.get(consoleLogging).send({embeds: [embed]});

try {
  let updated_user_context = user_context + "\n" + (await ougi.genAIText(
    [
      { role: 'system', content: (await ougi.text(msg, "whoAmI")) },
      { role: 'system', content: (await ougi.text(msg, "userIsNamed")).replace(/{userName}/, msg.author.username) + (user_context ? "\n" + user_context : "") },
      ... previous_messages,
      { role: 'user', content: msg.content },
      { role: 'system', content: (await ougi.text(msg, "userDescription")) }
    ]
  ));

  settingsOBJ.AI.description[msg.author.id] = updated_user_context;
  await ougi.writeFile(database.settings.file, JSON.stringify(settingsOBJ, null, 4), console.error);
  await ougi.backup(database.settings.file, settingsChannel);
}
catch (e) {
console.error(e);
}
}
