const { EmbedBuilder } = require('discord.js');

module.exports = async function newsCommand(arguments, msg) {
  try {
    if (!arguments || arguments.length < 1) {
      await msg.channel.send(await ougi.text(msg, "keywordRequired"));
      return;
    }

    const langsAllowed = ['ar','de','en','es','fr','he','it','nl','no','pt','ru','se','ud','zh'];
    let langCode = null;
    let actualLangCode = null;

    if (settingsOBJ.lang?.[msg.author.id]) {
      actualLangCode = settingsOBJ.lang[msg.author.id]
        .replace(/mx/gi, "es")
        .replace(/default|auto/gi, "en")
        .replace(/zh\-CN|zh\-TW/gi, "zh");
      langCode = actualLangCode;
    }

    if (!langCode && msg.channel.type === 0 && settingsOBJ.lang?.[msg.guildId]) {
      actualLangCode = settingsOBJ.lang[msg.guildId]
        .replace(/mx/gi, "es")
        .replace(/default|auto/gi, "en")
        .replace(/zh\-CN|zh\-TW/gi, "zh");
      langCode = actualLangCode;
    }

    if (!langsAllowed.includes(langCode) || !langCode) {
      langCode = "en";
    }

    const oldestAllowed = new Date(Date.now() - 1210000000).toISOString().slice(0, -5);
    const newspaperNow = await newsapi.v2.everything({
      q: arguments.join(" "),
      language: langCode,
      from: oldestAllowed
    });

    if (!newspaperNow.articles.length) {
      await msg.channel.send(await ougi.text(msg, "noNews"));
      return;
    }

    let article = newspaperNow.articles[Math.floor(Math.random() * newspaperNow.articles.length)];

    if (langCode !== actualLangCode) {
      const localizedProperties = ["title", "description", "content"];
      for (let i = 0; i < localizedProperties.length; i++) {
        article[localizedProperties[i]] = await ougi.text(msg, article[localizedProperties[i]], true);
      }
    }

    if (!article.urlToImage?.length) {
      article.urlToImage = "https://github.com/HakkinDavid/OugiBot/images/world.png?raw=true";
    }

    const embed = new EmbedBuilder()
      .setFooter({ text: "newsArticleEmbed by Ougi", iconURL: client.user.avatarURL({ dynamic: true, size: 4096 }) })
      .setColor(["#34EB43", "#34EBE1", "#EB3434", "#E2EB83"][Math.floor(Math.random() * 4)])
      .setURL(article.url)
      .setImage(article.urlToImage)
      .setTimestamp()
      .setAuthor({ name: article.source.name })
      .setTitle(article.title)
      .setDescription(
        article.description.slice(0, 1500) +
        "\n\n[" +
        (await ougi.text(msg, "readFullNews")).replace(/{n}/gi, article.source.name) +
        "](" + article.url + ")"
      );

    await msg.channel.send({ embeds: [embed] });

  } catch (error) {
    console.error("Error en newsCommand:", error);
    await msg.channel.send(await ougi.text(msg, "newsCommandError"));
  }
};
