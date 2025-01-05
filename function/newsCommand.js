module.exports =

async function (arguments, msg) {
  if (arguments.length < 1) {
    msg.channel.send("Please provide some keywords to search!");
    return;
  }
  let langCode = null;
  let actualLangCode = null;
  let oldestAllowed = new Date(new Date().getTime() - 1210000000).toISOString().slice(0, -5);
  let langsAllowed = ['ar','de','en','es','fr','he','it','nl','no','pt','ru','se','ud','zh'];
  if (settingsOBJ.lang.hasOwnProperty(msg.author.id)) {
    actualLangCode = settingsOBJ.lang[msg.author.id].replace(/mx/gi, "es").replace(/default|auto/gi, "en").replace(/zh\-CN|zh\-TW/gi, "zh");
    langCode = actualLangCode;
  }
  if (msg.channel == "text" && langCode == null && settingsOBJ.lang.hasOwnProperty(msg.guild.id)) {
    actualLangCode = settingsOBJ.lang[msg.guild.id].replace(/mx/gi, "es").replace(/default|auto/gi, "en").replace(/zh\-CN|zh\-TW/gi, "zh");
    langCode = actualLangCode;
  }
  if (!langsAllowed.includes(langCode) || langCode == null) {
    langCode = "en";
  }
  let newspaperNow = await newsapi.v2.everything({
    q: arguments.join(" "),
    language: langCode,
    from: oldestAllowed
  });
  if (newspaperNow.articles.length < 1) {
    msg.channel.send(await ougi.text(msg, "noNews"));
    return
  }
  let article = newspaperNow.articles[Math.floor(Math.random()*newspaperNow.articles.length)];
  if (langCode != actualLangCode) {
    let localizedProperties = ["title", "description", "content"];
    for (i=0; i < localizedProperties.length; i++) {
      article[localizedProperties[i]] = await ougi.text(msg, article[localizedProperties[i]], true);
    }
  }
  if (!article.urlToImage?.length) {
    article.urlToImage = "https://github.com/HakkinDavid/OugiBot/images/world.png?raw=true"
  }
  let embed = new Discord.MessageEmbed()
  .setFooter("newsArticleEmbed by Ougi", client.user.avatarURL({dynamic: true, size: 4096}))
  .setColor(["#34EB43", "#34EBE1", "#EB3434", "#E2EB83"][Math.floor(Math.random()*4)])
  .setURL(article.url)
  .setImage(article.urlToImage)
  .setTimestamp()
  .setAuthor(article.source.name)
  .setTitle(article.title)
  .setDescription(article.description.slice(0,1500) + "\n\n[" + (await ougi.text(msg, "readFullNews")).replace(/{n}/gi, article.source.name) + "](" + article.url + ")");
  msg.channel.send(embed);
}
