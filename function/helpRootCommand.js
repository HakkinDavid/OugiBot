module.exports =

async function (arguments, msg) {
  msg.channel.send(await ougi.text({
    lang: 'en',
    stringID: "root_helpList",
    values: {
      commands: "`#ougi help`, `#ougi status`, `#ougi log`, `#ougi inspect`, `#ougi ban`, `#ougi patron`, `#ougi haunt`, `#ougi newsletter`, `#ougi survey`, `#ougi notifysurvey`, `#ougi switch`, `#ougi shutdown`, `#ougi raffle-license`"
    }
  })).catch(console.error);
}
