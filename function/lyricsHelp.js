module.exports =

async function (msg) {
  let videos = ["angels on my side", "every one of us", "never gonna give you up", "sodio", "dark cherry mistery"];
  let lyrics = ["...\nEverything will be alright\n'Cause I got angels on my side\nOh, yeah\nCan you see them?\nCan you see them?\n...",
    "...\nThere's a fire (there's a fire)\nAnd it burns so bright (burns so bright)\nIn every one of us, every one of us\nThere's a flame (there's a flame)\nIt's our guiding light (guiding light)\nIn every one of us, every one of us\nEvery one of us\n...",
    "We're no strangers to love\nYou know the rules and so do I\nA full commitment's what I'm thinking of\nYou wouldn't get this from any other guy\n...",
    "...\nSal\nSal conmigo a bailar\nSi nos gusta lo mismo\nAy niño\nYa es de noche vamos a brillar\nSal\nEste amor sabe a sal\nTanto sodio me sabe a odio\nPero te quiero y eso es obvio\n...",
    "本当は初めから\n全て分かっていたと\n全てが終わってから\nやっと分かるいつも\n謎を解き明かす鍵は\n今もその手の中\n..."
  ];
  let thatIndex = Math.floor(Math.random()*videos.length);
  var embed = new Discord.EmbedBuilder()
  .setTitle("Ougi's `lyrics` command")
  .setAuthor({name: "Ougi [BOT]", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setColor("#230347")
  .setDescription("Use this command to get a specified song's lyrics. You may as well not specify any song at all to get lyrics for the currently playing song from your music queue.")
  .setFooter({text: "helpEmbed by Ougi", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true")
  .addFields({name: await ougi.text(msg, "example"), value: "`ougi lyrics " + videos[thatIndex] + "`"})
  .addFields({name: await ougi.text(msg, "output"), value: lyrics[thatIndex]});
  msg.channel.send({embeds: [embed]}).catch(console.error);
}
