module.exports =

function flushedCommand(arguments, msg) {
  var options = [":flushed:", "<:clownflushed:630142296293376060>", "<:coolflushed:638924603107967007>", "<:cowboyflushed:638925102238400512>", "<:eggflushed:638924893907451946>"];
  var response = options[Math.floor(Math.random()*options.length)];
  msg.channel.send(response).then().catch(console.error);
}
