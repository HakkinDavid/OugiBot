module.exports =

function talkLearn(arguments, msg) {
  var thisMessage = arguments.join(" ");

  if (msg.content.includes("@everyone") || msg.content.includes("@here")) {
    msg.channel.send("Ora ora ora ora! Remove that massive ping.");
    return
  }

  if (thisMessage.includes("<@") || thisMessage.includes(">")) {
    msg.channel.send("Avoid mentions please. I don't want to learn something that could potentially ping someone. What? Isn't that a mention? Well, then don't include '\<\@' and '>' in a same message.");
    return
  }

  var breakChocolate = thisMessage.split("//");
  var niceCharacterAmount = 3;
  var maxCharacterAmount = 164;

  if (msg.author.id == "310462974114529283" || msg.author.id == "265257341967007758") {
    var niceCharacterAmount = 1;
    var maxCharacterAmount = 2000;
  }

  if (breakChocolate.length !== 2){
    msg.channel.send("Do you want to teach me something? Looks like you're doing it wrong. Use the following command for some help.\n> ougi help learn");
    return
  }

  var trigger = breakChocolate[0].toString();
  var response = breakChocolate[1].toString();

  while (trigger.startsWith("ougi")){
    trigger = trigger.substring(4, trigger.length)
  }

  while (trigger.startsWith("#ougi")){
    trigger = trigger.substring(5, trigger.length)
  }

  while (trigger.startsWith("@ougi")){
    trigger = trigger.substring(5, trigger.length)
  }

  while (trigger.endsWith(" ")){
    trigger = trigger.substring(0, trigger.length-1)
  }

  while (response.endsWith(" ")){
    response = response.substring(0, response.length-1)
  }

  while (trigger.startsWith(" ")){
    trigger = trigger.substring(1, trigger.length)
  }

  while (response.startsWith(" ")){
    response = response.substring(1, response.length)
  }

  if (trigger.length < niceCharacterAmount){
    msg.channel.send("Please provide a trigger phrase of at least " + niceCharacterAmount.toString() + " characters long.")
    return
  }

  if (response.length < niceCharacterAmount){
    msg.channel.send("Please provide a response phrase of at least " + niceCharacterAmount.toString() + " characters long.")
    return
  }

  if (trigger.length > maxCharacterAmount){
    msg.channel.send("Please provide a trigger phrase of " + maxCharacterAmount.toString() + " or less characters long.")
    return
  }

  if (response.length > maxCharacterAmount){
    msg.channel.send("Please provide a response phrase of " + maxCharacterAmount.toString() + " or less characters long.")
    return
  }

  var pseudoArray = JSON.parse(fs.readFileSync('./responses', 'utf-8', console.error));

  var afterOptions = [
    "I'll start replying `" + response + "` when anyone says `" + trigger + "`",
    "Of course I already knew I should say `" + response + "` when anyone says `" + trigger + "`, I was just making sure you knew too-",
  ];
  var answer = afterOptions[Math.floor(Math.random()*afterOptions.length)];
  var myResponse = "./responses";

  if (pseudoArray.hasOwnProperty(trigger)){
    var existent = pseudoArray[trigger];
    for(var i = 0; i < existent.length; i++) {
      if(existent[i].toLowerCase() === response) {
        msg.channel.send("Sorry but that response for this trigger already exists.");
        return
      }
    }
    existent.push(response);
    msg.channel.send(answer).then().catch(console.error);
    console.log("Response to be added: `" + response + "` with trigger `" + trigger + "`");
    pseudoArray[trigger] = existent;
    var proArray = JSON.stringify(pseudoArray);
    fs.writeFile('./responses', proArray, console.error);

    ougi.backup(myResponse);
    return
  }

  msg.channel.send(answer).then().catch(console.error);
  console.log("Response to be added: `" + response + "` with trigger `" + trigger + "`");

  pseudoArray[trigger] = [];
  var arrayMaker = pseudoArray[trigger];
  arrayMaker.push(response);
  pseudoArray[trigger] = arrayMaker;
  var proArray = JSON.stringify(pseudoArray);
  fs.writeFile('./responses', proArray, console.error);

  ougi.backup(myResponse, backupChannel);
}
