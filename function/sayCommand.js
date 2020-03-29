module.exports =

function sayCommand(arguments, msg) {
    const sayMessage = arguments.join(" ");
    var checkPings = sayMessage.toString();
    var finalMessage = checkPings.replace("@everyone", "everyone").replace("@here", "here");
    msg.delete().catch(O_o=>{});
    msg.channel.send(finalMessage);
}
