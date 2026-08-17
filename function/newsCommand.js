const { EmbedBuilder } = require('discord.js');

module.exports = async function newsCommand(arguments, msg) {
  try {
    if (!arguments || arguments.length < 1) {
      await msg.channel.send(await ougi.text({ msg, stringID: "keywordRequired" }));
      return;
    }

    const langsAllowed = ['ar','de','en','es','fr','he','it','nl','no','pt','ru','se','ud','zh'];
    let langCode = null;
    let actualLangCode = null;

    const userLang = ougi.db().getLang(msg.author.id);
    if (userLang) {
      actualLangCode = userLang
        .replace(/mx/gi, "es")
        .replace(/default|auto/gi, "en")
        .replace(/zh\-CN|zh\-TW/gi, "zh");
      langCode = actualLangCode;
    }

    const guildLang = msg.guildId ? ougi.db().getLang(msg.guildId) : null;
    if (!langCode && guildLang) {
      actualLangCode = guildLang
        .replace(/mx/gi, "es")
        .replace(/default|auto/gi, "en")
        .replace(/zh\-CN|zh\-TW/gi, "zh");
      langCode = actualLangCode;
    }

    if (!langsAllowed.includes(langCode) || !langCode) {
      langCode = "en";
    }

    const oldestAllowed = new Date(Date.now() - 1210000000).toISOString().slice(0, -5);
    const newspaperNow = await global.newsapi.v2.everything({
      q: arguments.join(" "),
      language: langCode,
      from: oldestAllowed
    });

    if (!newspaperNow.articles || !newspaperNow.articles.length) {
      await msg.channel.send(await ougi.text({ msg, stringID: "noNews" }));
      return;
    }

    let article = newspaperNow.articles[Math.floor(Math.random() * newspaperNow.articles.length)];

    if (langCode !== actualLangCode) {
      const localizedProperties = ["title", "description", "content"];
      for (let i = 0; i < localizedProperties.length; i++) {
        const prop = localizedProperties[i];
        if (article[prop] && typeof article[prop] === 'string') {
          article[prop] = await ougi.text({ msg, stringID: article[prop], dynamic: true });
        }
      }
    }

    if (!article.urlToImage?.length) {
      article.urlToImage = "https://github.com/HakkinDavid/OugiBot/blob/master/images/world.png?raw=true";
    }

    const sourceName = article.source?.name || "News";
    const descText = article.description ? article.description.slice(0, 1500) : "";
    const readMore = await ougi.text({ msg, stringID: "readFullNews", values: { n: sourceName } }) || "Read full article";

    const embed = new EmbedBuilder()
      .setFooter({ text: "newsArticleEmbed by Ougi", iconURL: client.user.displayAvatarURL({ dynamic: true, size: 4096 }) })
      .setColor(["#34EB43", "#34EBE1", "#EB3434", "#E2EB83"][Math.floor(Math.random() * 4)])
      .setURL(article.url || null)
      .setImage(article.urlToImage)
      .setTimestamp()
      .setAuthor({ name: sourceName })
      .setTitle((article.title || "News").slice(0, 256))
      .setDescription(
        `${descText}\n\n[${readMore}](${article.url || ""})`
      );

    await msg.channel.send({ embeds: [embed] });

  } catch (error) {
    console.error("Error in newsCommand:", error);
    await msg.channel.send(await ougi.text({ msg, stringID: "newsCommandError" })).catch(() => {});
  }
};
