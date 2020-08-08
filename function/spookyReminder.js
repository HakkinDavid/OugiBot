module.exports =

function (arguments, msg) {
  var thisMessage = arguments.join(" ");

  if (msg.content.includes("@everyone") || msg.content.includes("@here")) {
    msg.channel.send("Ora ora ora ora! Remove that massive ping.");
    return
  }

  var breakChocolate = thisMessage.split("//");

  if (breakChocolate.length !== 3){
    msg.channel.send("Do you want to teach me something? Looks like you're doing it wrong. Use the following command for some help.\n> ougi help learn");
    return
  }

  var remindMe = breakChocolate[0].toString();
  var every = breakChocolate[1].toString();
  var isEmbed = breakChocolate[2].toString();

  while (remindMe.endsWith(" ")){
    remindMe = remindMe.substring(0, remindMe.length-1)
  }

  while (every.endsWith(" ")){
    every = every.substring(0, every.length-1)
  }

  while (isEmbed.endsWith(" ")){
    isEmbed = isEmbed.substring(0, isEmbed.length-1)
  }

  while (remindMe.startsWith(" ")){
    remindMe = remindMe.substring(1, remindMe.length)
  }

  while (every.startsWith(" ")){
    every = every.substring(1, every.length)
  }

  while (isEmbed.startsWith(" ")){
    isEmbed = isEmbed.substring(1, isEmbed.length)
  }

  if (every.endsWith('min')) {
    every = every.replace('min', '');
    if (isNaN(every) || every <= 30) {
      msg.channel.send('The interval must be greater than 30 minutes.');
      return
    }
    every = every * 60000;
  }

  else if (every.endsWith('h')) {
    every = every.replace('h', '');
    every = every * 3600000;
  }

  else if (every.endsWith('d')) {
    every = every.replace('d', '');
    every = every * 86400000;
  }

  else if (every.endsWith('w')) {
    every = every.replace('w', '');
    every = every * 604800000;
  }

  else if (every.endsWith('mo')) {
    every = every.replace('mo', '');
    every = every * 2628000000;
  }

  else {
    msg.channel.send('Please provide a valid interval, ending in `min`, `h`, `d`, `w` or `mo`.');
    return
  }

  if (isNaN(every)) {
    msg.channel.send('Please provide a valid interval, ending in `min`, `h`, `d`, `w` or `mo`.');
    return
  }

  if (isEmbed !== 'yes' && isEmbed !== 'no') {
    msg.channel.send("You must specify if the reminder will be an embed: `yes` or `no`.")
    return
  }

  var whereTho = msg.channel;
  var whenWas = msg.createdAt;
  var nextTime = whenWas + every;

  var pseudoArray = JSON.parse(fs.readFileSync('./reminders.txt', 'utf-8', console.error));
  var myReminder = "./reminders.txt";

  var existent = pseudoArray[nextTime];
  existent.push(whereTho[remindMe[isEmbed]]);

  msg.channel.send("I set a reminder for this channel: " + remindMe).then().catch(console.error);
  client.channels.get(consoleLogging).send("Reminder to be added: `" + remindMe + "` with nextTime `" + nextTime + "` for channel `" + whereTho + "` and isEmbed `" + isEmbed);
  pseudoArray[nextTime] = existent;
  var proArray = JSON.stringify(pseudoArray);
  fs.writeFile('./reminders.txt', proArray, console.error);

  ougi.backup(myReminder, remindersChannel);
  return
}
