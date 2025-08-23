const fs = require('fs');
const path = require('path');
const prism = require('prism-media');
const { 
  joinVoiceChannel, 
  createAudioPlayer, 
  createAudioResource, 
  AudioPlayerStatus, 
  getVoiceConnection, 
  entersState, 
  VoiceConnectionStatus 
} = require('@discordjs/voice');
const ougi = require('./ougi.tts');

module.exports = async function(msg) {
  if (!msg.guild) {
    return msg.channel.send("Huh?! This is not a Discord server. Take me into one!");
  }

  const memberVC = msg.member.voice.channel;
  if (!memberVC) {
    return msg.channel.send("Looks like you're not in a voice channel I can join, please get into one.");
  }

  // Normalize message content
  const cleanedContent = msg.content.replace(/\s+/g, ' ').trim();
  let args = cleanedContent.split(" ").slice(2);

  // Determine language
  let langCode = (settingsOBJ.lang[msg.guild.id]) ?? 'en';
  if (args.length > 1 && args[0].startsWith("::")) {
    const code = args[0].replace(/::/, "").toLowerCase();
    if (ougi.langCodes[code]) {
      langCode = code.replace(/mx/i, "es").replace(/default|auto/i, "en");
      args = args.slice(1);
    }
  }

  let textToSpeak = args.join(" ").replace(/[\+\*\?\^\$\(\)\[\]\{\}\|\\\&\/\@]/g, "").trim();
  if (!textToSpeak) {
    return msg.channel.send("I don't know how to read emptiness. Please specify a sentence for me to read out loud.");
  }

  // Rate limit
  settingsOBJ.ratelimit[msg.author.id] = Date.now() + (5 * textToSpeak.length);

  // Join VC
  const connection = getVoiceConnection(msg.guild.id) || joinVoiceChannel({
    channelId: memberVC.id,
    guildId: memberVC.guild.id,
    adapterCreator: memberVC.guild.voiceAdapterCreator,
  });
  await entersState(connection, VoiceConnectionStatus.Ready, 10_000);

  const player = createAudioPlayer();
  connection.subscribe(player);

  msg.react('🔊');
  msg.react('<:ougi:730355760864952401>');

  // Split text into ~200 char chunks
  const chunks = [];
  while (textToSpeak.length > 0) {
    let slice = textToSpeak.slice(0, 200);
    const lastSpace = slice.lastIndexOf(' ');
    if (lastSpace > 0 && textToSpeak.length > 200) {
      slice = slice.slice(0, lastSpace);
    }
    chunks.push(slice.trim());
    textToSpeak = textToSpeak.slice(slice.length).trim();
  }

  // Sequentially play chunks
  for (const chunk of chunks) {
    const cacheDir = path.join(__dirname, '..', 'cachedvoice');
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

    const cachePath = path.join(cacheDir, `${langCode}-${Date.now()}.mp3`);
    await ougi({ text: chunk, file: cachePath, lang: langCode });

    const resource = createAudioResource(
      new prism.FFmpeg({ args: ['-i', cachePath, '-f', 'opus', '-ar', '48000', '-ac', '2'] }),
      { inputType: 'opus' }
    );

    player.play(resource);

    await new Promise(resolve => {
      player.once(AudioPlayerStatus.Idle, () => {
        fs.access(cachePath, fs.constants.F_OK, err => {
          if (!err) fs.unlink(cachePath, console.error);
        });
        resolve();
      });
    });
  }
};