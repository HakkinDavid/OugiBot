const fs = require('fs');
const path = require('path');
const { 
  joinVoiceChannel, 
  createAudioPlayer, 
  createAudioResource, 
  AudioPlayerStatus, 
  getVoiceConnection 
} = require('@discordjs/voice');

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

  const connection = getVoiceConnection(msg.guild.id) || joinVoiceChannel({
    channelId: memberVC.id,
    guildId: memberVC.guild.id,
    adapterCreator: memberVC.guild.voiceAdapterCreator,
  });

  const player = createAudioPlayer();
  connection.subscribe(player);

  msg.react('🔊');
  msg.react('<:ougi:730355760864952401>');

  // Split text into chunks of ~200 chars
  const chunks = [];
  while (textToSpeak.length > 0) {
    let slice = textToSpeak.slice(0, 200);
    // Ensure we cut at a space if possible
    const lastSpace = slice.lastIndexOf(' ');
    if (lastSpace > 0 && textToSpeak.length > 200) {
      slice = slice.slice(0, lastSpace);
    }
    chunks.push(slice.trim());
    textToSpeak = textToSpeak.slice(slice.length).trim();
  }

  for (const chunk of chunks) {
    const cachePath = path.join(__dirname, 'cachedvoice', `${langCode}-${Date.now()}.mp3`);
    await ougi.tts({ text: chunk, file: cachePath, lang: langCode });
    const resource = createAudioResource(cachePath);
    player.play(resource);

    // Wait for current chunk to finish
    await new Promise(resolve => {
      player.once(AudioPlayerStatus.Idle, () => {
        fs.unlink(cachePath, console.error);
        resolve();
      });
    });
  }
};