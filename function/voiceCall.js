module.exports =
async function voiceCall(arguments, msg) {
  if(!msg.guild) { //prevent anything unintended
    msg.channel.send("Huh?! This is not a Discord server. Take me into one!");
    return
  }
  if(msg.member.voiceChannel) {
    const connection = await msg.member.voiceChannel.join();
    msg.channel.send("Alright, I've joined.")
  }
  else {
    msg.channel.send("Looks like you're not in a voice channel, please join one.")
    return
  }
}
