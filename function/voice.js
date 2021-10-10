module.exports =

async function (msg) {
  /*-----------------------------------*/
  while (msg.content.includes('  ')) {
    msg.content = msg.content.replace('  ', ' ')
  }
  while (msg.content.includes('\n\n')) {
    msg.content = msg.content.replace('\n\n', '\n')
  }
  while (msg.content.includes('\n')) {
    msg.content = msg.content.replace('\n', ' ')
  }
  let spookyCake = msg.content;
  let spookySlices = spookyCake.split(" ");
  let arguments = spookySlices.slice(2);
  /*-----------------------------------*/
  if (!msg.guild) {
    msg.channel.send("Huh?! This is not a Discord server. Take me into one!").catch(console.error);
    return
  }

  if (typeof vc[msg.guild.id] !== 'undefined') {
    msg.channel.send("Currently playing music.");
    return
  }

  let vcChannel = msg.member.voice.channel;

  if (vcChannel == null) {
    msg.channel.send("Looks like you're not in a voice channel I can join, please get into one.").catch(console.error);
    return
  }
  
  let langCode = undefined;
  if (settingsOBJ.lang.hasOwnProperty(msg.guild.id)) {
    langCode = settingsOBJ.lang[msg.guild.id]
  }

  if (arguments.length > 1 && arguments[0].startsWith("::") && ougi.langCodes.hasOwnProperty(arguments[0].replace(/::/, ""))) {
    langCode = arguments[0].replace(/mx/gi, "es").replace(/default|auto/gi, "en").replace(/::/gi, "");
    arguments = arguments.slice(1);
  }

  if (langCode == undefined) {
    langCode = "en";
  }

  let readOutLoud = arguments.join(" ").replace(/[\+\*\?\^\$\(\)\[\]\{\}\|\\\&\/\@]/gi, "");

  if (readOutLoud.replace(/ /gi, "").length < 1) {
    msg.channel.send("I don't know how to read emptiness. Please specify a sentence for me to read out loud.")
    return
  }

  if (readOutLoud.length > 200) {
    msg.channel.send("This text is too long. I'll only read the first 200 characters.");
  }
  let cacheSpeak = './cachedvoice/' + langCode + (new Date).getTime() + '.mp3';

  if (!fs.existsSync(cacheSpeak)) {
    await ougi.tts({
      text: readOutLoud.slice(0, 201),
      file: cacheSpeak,
      lang: langCode
    });
  }

  await vcChannel.join().then(async (connection) => {
    await connection.play(cacheSpeak, { volume: false }).on('finish', () => {
      fs.unlink(cacheSpeak, console.error);
      connection.disconnect();
    })
  });
}
