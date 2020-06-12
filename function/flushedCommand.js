module.exports =

function flushedCommand(arguments, msg) {
  var options = [":flushed:", "<:clownflushed:720798062892810320>", "<:coolflushed:720799728157065310>", "<:cowboyflushed:720800641768751104>", "<:eggflushed:720800906479927378>"];
  var response = options[Math.floor(Math.random()*options.length)];
  msg.channel.send(response).then().catch(console.error);
}
