module.exports =
async function voiceCall(arguments, msg) {

  if (!msg.guild) { //prevent anything unintended
    msg.channel.send("Huh?! This is not a Discord server. Take me into one!");
    return
  }

  var vcChannel = msg.member.voiceChannel;

  if (arguments[0] == "leave") {
    const connection = await vcChannel.join();
    const leave = await vcChannel.leave();
    var options = [":pensive:", "oke, bye", "aight imma head out"]
    var response = options[Math.floor(Math.random()*options.length)];
    msg.channel.send(response).then().catch(console.error);
    return
  }

  if (vcChannel.full) {
    msg.channel.send("That voice channel is full, so I can't join.");
    return
  }

  if (vcChannel.joinable) {
    const leave = await vcChannel.leave();
    const connection = await vcChannel.join();
    msg.channel.send("Alright, I've joined your voice channel.");
  }

  else {
    msg.channel.send("Looks like you're not in a voice channel I can join, please get into one.")
    return
  }
}
