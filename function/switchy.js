module.exports =

async function (arguments, msg) {
  if (arguments == instanceID) {
    if (global.TEASEABLE) {
      const TEASEABLE = false;
      const exclusiveTemplate = await ougi.text(msg, "switchy_exclusive");
      msg.channel.send(exclusiveTemplate.replace(/{instanceID}/g, instanceID)).catch(console.error);
    }
    else {
      const TEASEABLE = true;
      const allTemplate = await ougi.text(msg, "switchy_all");
      msg.channel.send(allTemplate.replace(/{instanceID}/g, instanceID)).catch(console.error);
    }
  }
}
