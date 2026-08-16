module.exports =

async function (arguments, msg) {
  if (arguments == instanceID) {
    if (global.TEASEABLE) {
      const TEASEABLE = false;
      msg.channel.send(await ougi.text({
        msg,
        stringID: "switchy_exclusive",
        values: { instanceID }
      })).catch(console.error);
    }
    else {
      const TEASEABLE = true;
      msg.channel.send(await ougi.text({
        msg,
        stringID: "switchy_all",
        values: { instanceID }
      })).catch(console.error);
    }
  }
}
