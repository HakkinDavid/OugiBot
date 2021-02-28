module.exports =

async function (msg) {
  let langSettings = JSON.parse(fs.readFileSync('./settings.txt')).lang;
  let langCode = null;
  let actualLangCode = null;
  let langsAllowed = ['ar','de','en','es','fr','he','it','nl','no','pt','ru','se','ud','zh'];
  if (langSettings.hasOwnProperty(msg.author.id)) {
    actualLangCode = langSettings[msg.author.id].replace(/mx/gi, "es").replace(/default|auto/gi, "en").replace(/zh\-CN|zh\-TW/gi, "zh");
    langCode = actualLangCode;
  }
  if (msg.channel == "text" && langSettings.hasOwnProperty(msg.guild.id)) {
    actualLangCode = langSettings[msg.guild.id].replace(/mx/gi, "es").replace(/default|auto/gi, "en").replace(/zh\-CN|zh\-TW/gi, "zh");
    langCode = actualLangCode;
  }
  if (!langsAllowed.includes(langCode) || langCode == null) {
    langCode = "en";
  }
  let newspaperNow = await newsapi.v2.everything({
    q: 'covid-19',
    language: langCode,
    pageSize: 10
  });
  if (newspaperNow.articles.length < 1) {
    msg.channel.send("No recent news found.");
    return
  }
  let article = newspaperNow.articles[Math.floor(Math.random()*newspaperNow.articles.length)];
  if (langCode != actualLangCode) {
    let localizedProperties = ["title", "description", "content"];
    for (i=0; i < localizedProperties.length; i++) {
      await translate(article[localizedProperties[i]], {to: langCode}).then(res => {
          article[localizedProperties[i]] = res.text;
      }).catch(err => {
          console.error(err);
      });
    }
  }
  if (article.urlToImage.length < 1) {
    article.urlToImage = "https://github.com/HakkinDavid/OugiBot/images/covid/" + ["covid", "covid2", "covid3", "covidspread"][Math.floor(Math.random()*4)] + ".jpg?raw=true"
  }
  let embed = new Discord.MessageEmbed()
  .setFooter(await ougi.text(msg, "COVIDNEWS"), client.user.avatarURL())
  .setColor(["#34EB43", "#34EBE1", "#EB3434", "#E2EB83"][Math.floor(Math.random()*4)])
  .setURL(article.url)
  .setImage(article.urlToImage)
  .setTimestamp()
  .setAuthor(article.source.name)
  .setTitle(article.title)
  .setDescription(article.description.slice(0,2048))
  .addField("\u200b", article.content.slice(0,1024));
  msg.channel.send(embed);
}
