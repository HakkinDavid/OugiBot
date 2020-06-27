module.exports =

function vibeCheckReallyHard(arguments, msg) {
  var strength = arguments;
  if (strength == "onee-san") {
    var bai = "Hasta la vista, baby~"
    msg.channel.send(bai).then().catch(console.error);
    client.destroy();
    process.exit();
  }
  else if (strength == "ougi-chan") {
    msg.channel.send("**I ' l l   b e   b a c k**").then().catch(console.error);
    client.destroy();
    client.login(process.env.TOKEN);
    var options = ["hi", "ohayou", "baka", "hey there!", "ola bb", "Ougi joins the battle!", "Creeper. \nAw man"];
    var response = options[Math.floor(Math.random()*options.length)];
    var doing = ["Minecraft", "Fortnite", "Destiny 2", "Portal", "Portal 2", "Project 64", "osu!", "Geometry Dash", "Slime Rancher", "Left 4 Dead 2", "Transformice", "Grand Theft Auto V", "Team Fortress 2", "Overwatch", "Undertale", "Dolphin", "Ultimate Custom Night", "Minecraft Windows 10 Edition", "Terraria", "Roblox", "Paladins", "Tom Clancy's Rainbow Six Siege"]
    var something = doing[Math.floor(Math.random()*doing.length)];
    client.user.setActivity(something)
    console.log(response + "\nI'm playing " + something);
    console.log("\n");
  }
  else if (strength == "knockout") {
    var bai = "Hasta la vista, baby~"
    msg.channel.send(bai).then().catch(console.error);
    client.destroy();
  }
  else {
    msg.channel.send("Ara ara. If you're gonna vibe check me, vibe check me hard enough, with the strength of either an `onee-san` or an `ougi-chan` or `knockout`").then().catch(console.error);
  }
}
