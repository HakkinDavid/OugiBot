module.exports =

async function (msg) {
  /*-----------------------------------*/
  while (msg.content.includes('  ')) {
    msg.content = msg.content.replace('  ', ' ')
  }
  while (msg.content.includes('\n\n')) {
    msg.content = msg.content.replace('\n\n', '\n')
  }
  let spookyCake = msg.content;
  let spookySlices = spookyCake.split(" ");
  let spookyCommand = spookySlices[1];
  let arguments = spookySlices.slice(2);
  /*-----------------------------------*/
  let thisMessage = arguments.join(" ");
  let breakChocolate = thisMessage.split("::").slice(1);
  let questionDesc, surveyQuestion, questionID, surveyURL, surveyColor = "9E32A8";
  if (breakChocolate.length < 3) {
    msg.channel.send("You must include a question, question ID, a description and optionally a featured survey URL and a color.")
    return
  }
  for (i=0; breakChocolate.length > i; i++) {
    let material = breakChocolate[i];
    if (material.toLowerCase().endsWith(" ")) {
      material = material.slice(0, material.length-1)
    }
    if (material.toLowerCase().startsWith("question ")) {
      material = material.slice(9);
      surveyQuestion = material;
    }
    else if (material.toLowerCase().startsWith("description ")) {
      material = material.slice(12);
      questionDesc = material;
    }
    else if (material.toLowerCase().startsWith("id ")) {
      material = material.slice(3);
      questionID = material;
    }
    else if (material.toLowerCase().startsWith("url ")) {
      material = material.slice(4);
      surveyURL = material;
    }
    else if (material.toLowerCase().startsWith("color ")) {
      let pseudoColor = "";
      material = material.substring(6);
      if (!material.startsWith("#")) {
        pseudoColor = "#" + material;
      }
      else {
        pseudoColor = material;
      }
      if (isHexcolor(pseudoColor)) {
        surveyColor = pseudoColor;
      }
      else {
        while (material.includes(" ")) {
          material = material.replace(" ", ",");
        }
        while (material.includes(",,")) {
          material = material.replace(",,", ",");
        }
        let rgbArray = material.split(",");
        if (rgbArray.length <= 3 && !isNaN(rgbArray[0]) && !isNaN(rgbArray[1]) && !isNaN(rgbArray[2])) {
          if (rgbArray[0] > 255 || rgbArray[1] > 255 || rgbArray[2] > 255) {
            msg.channel.send("Please provide a valid hexadecimal color, RGB color (separated by commas) or a supported color name.");
            return
          }
          surveyColor = material;
        }
        else {
          material = material.toUpperCase().replace("YELLOW", "GOLD");
          while (material.includes(",")) {
            material = material.replace(",", "_");
          }
          let coolColors = ["DEFAULT","WHITE","AQUA","GREEN","BLUE","PURPLE","LUMINOUS_VIVID_PINK","GOLD","ORANGE","RED","GREY","DARKER_GREY","NAVY","DARK_AQUA","DARK_GREEN","DARK_BLUE","DARK_PURPLE","DARK_VIVID_PINK","DARK_GOLD","DARK_ORANGE","DARK_RED","DARK_GREY","LIGHT_GREY","DARK_NAVY","BLACK","RANDOM"];
          if(coolColors.includes(material)) {
            surveyColor = material;
          }
          else {
            msg.channel.send("Please provide a valid hexadecimal color, RGB color (separated by commas) or a supported color name.");
            return
          }
        }
      }
    }
    else {
      msg.channel.send("Wrong syntax.");
      return
    }
  }
  if (surveyQuestion == null || questionDesc == null || questionID == null) {
    msg.channel.send("You must include a question, question ID, a description and optionally a featured survey URL and a color.")
    return
  }
  let startDate = new Date().getTime();
  settingsOBJ.surveysAvailable[questionID] = {
    q:surveyQuestion,
    d:questionDesc,
    url:surveyURL,
    poppedUp:0,
    yes:[],
    no:[],
    color:surveyColor,
    started:startDate,
    ended:null
  }
  await ougi.writeFile('./settings.txt', JSON.stringify(settingsOBJ, null, 4), console.error);
  await ougi.backup('./settings.txt', settingsChannel);

  let embed = new Discord.EmbedBuilder()
  .setTitle("Enjoying Ougi so far?")
  .setDescription("If so, that's really heartwarming. Mind taking a second to answer the following question?\nUse the reactions I put below.")
  .addFields({name: settingsOBJ.surveysAvailable[questionID].q, value: settingsOBJ.surveysAvailable[questionID].d})
  .setColor(settingsOBJ.surveysAvailable[questionID].color)
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/news.png?raw=true");
  if (settingsOBJ.surveysAvailable[questionID].url != null) {
    embed.addFields({name: "\u200b", value: "Feeling generous enough to spend a couple extra minutes? I'd be so glad to hear your thoughts in [this survey](" + settingsOBJ.surveysAvailable[questionID].url + ")."});
  }
  msg.channel.send("This is what users will get:", {embeds: [embed]}).then(async (sentMSG) => {
      await sentMSG.react(client.emojis.cache.get('818120409219334144'))
      .catch(console.error);
      await sentMSG.react(client.emojis.cache.get('818120425757999144'))
      .catch(console.error);
    }
  );
}
