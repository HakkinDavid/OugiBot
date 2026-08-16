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
  var embed = await ougi.helpPreset(msg, "lyrics");
  embed.setDescription(await ougi.text(msg, "lyricsHelpDesc"))
  .addFields({name: await ougi.text(msg, "example"), value: "`ougi lyrics " + videos[thatIndex] + "`"})
  .addFields({name: await ougi.text(msg, "output"), value: lyrics[thatIndex]});
  msg.channel.send({embeds: [embed]}).catch(console.error);
}
