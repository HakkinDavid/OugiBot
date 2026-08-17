module.exports = async function (arguments, msg) {
  if (arguments[0] === instanceID || arguments.join(" ") === instanceID) {
    if (global.TEASEABLE) {
      global.TEASEABLE = false;
      msg.channel.send(await ougi.text({
        msg,
        stringID: "switchy_exclusive",
        values: {
          instanceID,
          prefix: "`" + instanceID + "::Ougi`"
        }
      })).catch(console.error);
    } else {
      global.TEASEABLE = true;
      msg.channel.send(await ougi.text({
        msg,
        stringID: "switchy_all",
        values: { instanceID }
      })).catch(console.error);
    }
  }
};
