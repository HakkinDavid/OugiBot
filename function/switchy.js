module.exports =

function (arguments, msg) {
  if (arguments == instanceID) {
    if (global.TEASEABLE) {
      global.TEASEABLE = false;
      msg.channel.send("Instance `" + instanceID + "` listening exclusively to `" + instanceID + "::Ougi` prefix until it's terminated or switched back.").catch(console.error);
    }
    else {
      global.TEASEABLE = true;
      msg.channel.send("Instance `" + instanceID + "` listening to all input.").catch(console.error);
    }
  }
}
