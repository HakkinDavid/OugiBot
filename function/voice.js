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
  let spookyCommand = spookySlices[1];
  let arguments = spookySlices.slice(2);
  /*-----------------------------------*/
  if (!msg.guild) {
    msg.channel.send("Huh?! This is not a Discord server. Take me into one!").catch(console.error);
    return
  }

  let vcChannel = msg.member.voice.channel;

  if (vcChannel == null) {
    msg.channel.send("Looks like you're not in a voice channel I can join, please get into one.").catch(console.error);
    return
  }

  let langSettings = JSON.parse(fs.readFileSync('./settings.txt')).lang;
  let langCode = undefined;
  if (langSettings.hasOwnProperty(msg.author.id)) {
    langCode = langSettings[msg.author.id]
  }

  if (arguments.length < 1) {
    msg.channel.send("I don't know how to read emptiness. Please specify a sentence for me to read out loud.")
    return
  }

  if (arguments.length > 1 && ougi.langCodes.hasOwnProperty(arguments[0])) {
    langCode = arguments[0].replace("mx", "es").replace("default", "en");
    arguments = arguments.slice(-1);
  }

  if (langCode == undefined) {
    langCode = "en";
  }

  let readOutLoud = arguments.join(" ");

  let cacheSpeak = './cachedvoice/' + langCode + readOutLoud + '.mp3';

  if (!fs.existsSync(cacheSpeak)) {
    await ougi.tts({
      text: readOutLoud,
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
